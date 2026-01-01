const CACHE_NAME = "jinlan-ems-v2.0.0"
const OFFLINE_URL = "/offline"

// 需要缓存的静态资源
const STATIC_CACHE_URLS = [
  "/",
  "/offline",
  "/yyc3-logo-blue.png",
  "/yyc3-pwa-icon.png",
  "/manifest.json",
  "/ai-assistant",
  "/customers",
  "/tasks",
  "/analytics",
]

// 需要缓存的API路径模式
const API_CACHE_PATTERNS = [/^\/api\/dashboard/, /^\/api\/customers/, /^\/api\/tasks/, /^\/api\/approval/, /^\/api\/ai/]

// AI模型相关的缓存策略
const AI_MODEL_CACHE_PATTERNS = [/^\/api\/ai\/models/, /^\/api\/ai\/chat/, /^\/api\/ai\/completions/]

// 安装事件 - 预缓存静态资源
self.addEventListener("install", (event) => {
  console.log("Service Worker 安装中...")

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("预缓存静态资源")
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        // 强制激活新的 Service Worker
        return self.skipWaiting()
      }),
  )
})

// 激活事件 - 清理旧缓存
self.addEventListener("activate", (event) => {
  console.log("Service Worker 激活中...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("删除旧缓存:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        // 立即控制所有客户端
        return self.clients.claim()
      }),
  )
})

// 拦截网络请求
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return
  }

  // HTML 页面请求 - 网络优先策略
  if (request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 缓存成功的响应
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
        .catch(() => {
          // 网络失败时从缓存获取
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(OFFLINE_URL)
          })
        }),
    )
    return
  }

  // AI模型API请求 - 特殊处理
  if (AI_MODEL_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 只缓存成功的GET请求和模型列表
          if (request.method === "GET" && response.ok && url.pathname.includes("/models")) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // AI服务失败时返回离线提示
          if (request.method === "GET") {
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // 返回AI服务离线响应
              return new Response(
                JSON.stringify({
                  success: false,
                  error: "AI服务当前离线",
                  offline: true,
                  message: "AI助手暂时不可用，请检查网络连接或稍后重试",
                }),
                {
                  status: 503,
                  headers: { "Content-Type": "application/json" },
                },
              )
            })
          }
        }),
    )
    return
  }

  // 普通API请求 - 网络优先，缓存备用
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 只缓存成功的 GET 请求
          if (request.method === "GET" && response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // 网络失败时从缓存获取
          if (request.method === "GET") {
            return caches.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }
              // 返回离线数据
              return new Response(
                JSON.stringify({
                  error: "网络连接失败",
                  offline: true,
                  message: "当前处于离线状态，显示的是缓存数据",
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                },
              )
            })
          }
        }),
    )
    return
  }

  // 静态资源 - 缓存优先策略
  if (request.destination === "image" || request.destination === "script" || request.destination === "style") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
      }),
    )
    return
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
    icon: "/yyc3-pwa-icon.png",
    badge: "/yyc3-pwa-icon.png",
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
        icon: "/yyc3-pwa-icon.png",
      },
      {
        action: "close",
        title: "关闭",
        icon: "/yyc3-pwa-icon.png",
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
