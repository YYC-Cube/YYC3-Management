const CACHE_NAME = "yyc3-ems-v3.0.0"
const STATIC_CACHE = "yyc3-static-v3.0.0"
const RUNTIME_CACHE = "yyc3-runtime-v3.0.0"
const API_CACHE = "yyc3-api-v3.0.0"
const OFFLINE_URL = "/offline"

// 需要预缓存的静态资源（核心外壳）
const STATIC_CACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",
  "/browserconfig.xml",
  // Favicon 系列（PC 浏览器标签页）
  "/yyc3-icons/favicon/favicon.ico",
  "/yyc3-icons/favicon/favicon-16x16.png",
  "/yyc3-icons/favicon/favicon-32x32.png",
  "/yyc3-icons/favicon/favicon-96x96.png",
  // PWA 图标（安装到桌面 / 启动画面）
  "/yyc3-icons/pwa/icon-192x192.png",
  "/yyc3-icons/pwa/icon-512x512.png",
  "/yyc3-icons/pwa/icon-96x96.png",
  // WebP 现代格式（支持浏览器优先加载，节省带宽）
  "/yyc3-icons/webp/icon-192x192.webp",
  "/yyc3-icons/webp/icon-512x512.webp",
]

// 需要运行时缓存的核心路由（首屏可用性）
const ROUTE_CACHE_URLS = [
  "/dashboard",
  "/customers",
  "/tasks",
  "/analytics",
  "/ai-assistant",
]

// 需要缓存的API路径模式（NetworkFirst 策略）
const API_CACHE_PATTERNS = [
  /^\/api\/dashboard/,
  /^\/api\/customers/,
  /^\/api\/tasks/,
  /^\/api\/approval/,
  /^\/api\/finance/,
  /^\/api\/notifications/,
  /^\/api\/search/,
]

// AI模型相关的缓存策略（特殊：仅 GET /models 缓存）
const AI_MODEL_CACHE_PATTERNS = [/^\/api\/ai\/models/, /^\/api\/ai\/chat/, /^\/api\/ai\/completions/]

// 缓存上限（防止存储膨胀）
const MAX_RUNTIME_ENTRIES = 100
const MAX_API_ENTRIES = 200

// 安装事件 - 预缓存静态资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => caches.open(RUNTIME_CACHE))
      .then((cache) => cache.addAll(ROUTE_CACHE_URLS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  )
})

// 激活事件 - 清理旧缓存 + 启用导航预加载
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, RUNTIME_CACHE, API_CACHE, CACHE_NAME].includes(cacheName)) {
              return caches.delete(cacheName)
            }
            return undefined
          }),
        ),
      )
      .then(() => {
        if (self.registration.navigationPreload) {
          return self.registration.navigationPreload.enable()
        }
      })
      .then(() => self.clients.claim()),
  )
})

// 清理运行时缓存超过上限的条目
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  if (keys.length > maxEntries) {
    const toRemove = keys.slice(0, keys.length - maxEntries)
    await Promise.all(toRemove.map((key) => cache.delete(key)))
  }
}

// 拦截网络请求
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin !== location.origin) {
    return
  }

  // HTML 页面请求 - 网络优先策略 + 导航预加载
  if (request.destination === "document") {
    event.respondWith(
      (async () => {
        const preloadResponse = await event.preloadResponse
        if (preloadResponse) {
          const responseClone = preloadResponse.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone))
          return preloadResponse
        }
        try {
          const response = await fetch(request)
          const responseClone = response.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone))
          return response
        } catch {
          const cachedResponse = await caches.match(request)
          return cachedResponse || caches.match(OFFLINE_URL)
        }
      })(),
    )
    return
  }

  // AI模型API请求 - 特殊处理
  if (AI_MODEL_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (request.method === "GET" && response.ok && url.pathname.includes("/models")) {
            const responseClone = response.clone()
            caches.open(API_CACHE).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
        .catch(() => {
          if (request.method === "GET") {
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) return cachedResponse
              return new Response(
                JSON.stringify({
                  success: false,
                  error: "AI服务当前离线",
                  offline: true,
                  message: "AI助手暂时不可用，请检查网络连接或稍后重试",
                }),
                { status: 503, headers: { "Content-Type": "application/json" } },
              )
            })
          }
        }),
    )
    return
  }

  // 普通API请求 - 网络优先（StaleWhileRevalidate for GET）
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE)
        const cachedResponse = await cache.match(request)
        const networkFetch = fetch(request)
          .then((response) => {
            if (request.method === "GET" && response.ok) {
              const responseClone = response.clone()
              cache.put(request, responseClone)
            }
            return response
          })
          .catch(() => {
            if (cachedResponse) return cachedResponse
            return new Response(
              JSON.stringify({
                error: "网络连接失败",
                offline: true,
                message: "当前处于离线状态，显示的是缓存数据",
              }),
              { status: 200, headers: { "Content-Type": "application/json" } },
            )
          })
        if (cachedResponse && request.method === "GET") {
          return cachedResponse
        }
        return networkFetch
      })(),
    )
    return
  }

  // 静态资源 - 缓存优先策略
  if (request.destination === "image" || request.destination === "script" || request.destination === "style" || request.destination === "font") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone))
          }
          return response
        })
      }),
    )
    return
  }
})

// 定期清理运行时缓存（每次激活时执行一次）
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRIM_CACHES") {
    event.waitUntil(Promise.all([trimCache(RUNTIME_CACHE, MAX_RUNTIME_ENTRIES), trimCache(API_CACHE, MAX_API_ENTRIES)]))
  }
})

// 后台同步
self.addEventListener("sync", (event) => {
  console.log("后台同步事件:", event.tag)

  if (event.tag === "background-sync") {
    event.waitUntil(syncData())
  }

  if (event.tag === "ai-model-sync") {
    event.waitUntil(syncAIModels())
  }
})

// 推送通知
self.addEventListener("push", (event) => {
  console.log("收到推送消息:", event)

  let notificationData = {
    title: "YYC³ 企业智能管理系统",
    body: "您有新的消息",
    icon: "/yyc3-icons/pwa/icon-192x192.png",
    badge: "/yyc3-icons/pwa/icon-72x72.png",
  }

  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: notificationData.url || "/",
    },
    actions: [
      {
        action: "explore",
        title: "查看详情",
        icon: "/yyc3-icons/pwa/icon-96x96.png",
      },
      {
        action: "close",
        title: "关闭",
        icon: "/yyc3-icons/pwa/icon-96x96.png",
      },
    ],
    requireInteraction: true,
    silent: false,
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, options))
})

// 通知点击事件
self.addEventListener("notificationclick", (event) => {
  console.log("通知被点击:", event)

  event.notification.close()

  if (event.action === "explore") {
    const urlToOpen = event.notification.data?.url || "/"
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        // 检查是否已有窗口打开
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus()
          }
        }
        // 打开新窗口
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      }),
    )
  }
})

// 同步数据函数
async function syncData() {
  try {
    console.log("执行后台数据同步...")

    // 同步待处理的离线操作
    const offlineActions = await getOfflineActions()

    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body,
        })

        // 同步成功，删除离线操作记录
        await removeOfflineAction(action.id)
      } catch (error) {
        console.error("同步操作失败:", error)
      }
    }

    console.log("后台数据同步完成")
  } catch (error) {
    console.error("后台同步失败:", error)
  }
}

// 同步AI模型函数
async function syncAIModels() {
  try {
    console.log("同步AI模型状态...")

    // 检查本地模型可用性
    const localModels = ["http://localhost:11434/api/tags", "http://localhost:8000/api/models"]

    for (const endpoint of localModels) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          timeout: 3000,
        })
        if (response.ok) {
          console.log(`本地模型服务可用: ${endpoint}`)
        }
      } catch (error) {
        console.log(`本地模型服务不可用: ${endpoint}`)
      }
    }

    console.log("AI模型状态同步完成")
  } catch (error) {
    console.error("AI模型同步失败:", error)
  }
}

// 获取离线操作记录
async function getOfflineActions() {
  // 这里应该从 IndexedDB 获取离线操作
  return []
}

// 删除离线操作记录
async function removeOfflineAction(actionId) {
  console.log("删除离线操作:", actionId)
}

// 消息处理
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }

  if (event.data && event.data.type === "SYNC_AI_MODELS") {
    event.waitUntil(syncAIModels())
  }
})
