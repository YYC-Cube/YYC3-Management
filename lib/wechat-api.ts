/**
 * @fileoverview wechat-api.ts
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 3.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 微信公众号API服务类
interface WeChatConfig {
  appId: string
  appSecret: string
  accessToken?: string
  tokenExpireTime?: number
}

interface WeChatMenuItem {
  type?:
    | "click"
    | "view"
    | "miniprogram"
    | "scancode_push"
    | "scancode_waitmsg"
    | "pic_sysphoto"
    | "pic_photo_or_album"
    | "pic_weixin"
    | "location_select"
  name: string
  key?: string
  url?: string
  media_id?: string
  appid?: string
  pagepath?: string
  sub_button?: WeChatMenuItem[]
}

interface WeChatMenu {
  button: WeChatMenuItem[]
}

class WeChatApiService {
  private config: WeChatConfig
  private baseUrl = process.env.WECHAT_API_BASE_URL || "https://api.weixin.qq.com/cgi-bin"

  constructor(config: WeChatConfig) {
    this.config = config
  }

  // 获取访问令牌
  async getAccessToken(): Promise<string> {
    // 检查token是否过期
    if (this.config.accessToken && this.config.tokenExpireTime && Date.now() < this.config.tokenExpireTime) {
      return this.config.accessToken
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/token?grant_type=client_credential&appid=${this.config.appId}&secret=${this.config.appSecret}`,
      )
      const data = await response.json()

      if (data.errcode) {
        throw new Error(`获取访问令牌失败: ${data.errmsg}`)
      }

      // 保存token和过期时间（提前5分钟过期）
      this.config.accessToken = data.access_token
      this.config.tokenExpireTime = Date.now() + (data.expires_in - 300) * 1000

      return data.access_token
    } catch (error) {
      console.error("获取微信访问令牌失败:", error)
      throw error
    }
  }

  // 创建菜单
  async createMenu(menu: WeChatMenu): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`${this.baseUrl}/menu/create?access_token=${accessToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(menu),
      })

      const data = await response.json()

      if (data.errcode && data.errcode !== 0) {
        throw new Error(`创建菜单失败: ${data.errmsg}`)
      }

      // console.log("微信菜单创建成功")
      return true
    } catch (error) {
      console.error("创建微信菜单失败:", error)
      throw error
    }
  }

  // 查询菜单
  async getMenu(): Promise<WeChatMenu | null> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`${this.baseUrl}/menu/get?access_token=${accessToken}`)
      const data = await response.json()

      if (data.errcode && data.errcode !== 0) {
        if (data.errcode === 46003) {
          // 菜单不存在
          return null
        }
        throw new Error(`查询菜单失败: ${data.errmsg}`)
      }

      return data.menu
    } catch (error) {
      console.error("查询微信菜单失败:", error)
      throw error
    }
  }

  // 删除菜单
  async deleteMenu(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()
      const response = await fetch(`${this.baseUrl}/menu/delete?access_token=${accessToken}`, {
        method: "POST",
      })

      const data = await response.json()

      if (data.errcode && data.errcode !== 0) {
        throw new Error(`删除菜单失败: ${data.errmsg}`)
      }

      // console.log("微信菜单删除成功")
      return true
    } catch (error) {
      console.error("删除微信菜单失败:", error)
      throw error
    }
  }

  // 将系统菜单转换为微信菜单格式
  convertToWeChatMenu(systemMenuItems: Record<string, unknown>[]): WeChatMenu {
    const convertMenuItem = (item: Record<string, unknown>): WeChatMenuItem => {
      const children = (item.children as Record<string, unknown>[]) || []
      const itemUrl = (item.url as string) || ''
      const wechatItem: WeChatMenuItem = {
        name: (item.title as string).substring(0, children.length > 0 ? 4 : 8),
        type: (item.isExternal as boolean) || itemUrl.startsWith("http") ? "view" : "click",
      }

      if (wechatItem.type === "view") {
        wechatItem.url = itemUrl
      } else {
        wechatItem.key = (item.id as string) || `menu_${Date.now()}`
      }

      if (children.length > 0) {
        wechatItem.sub_button = children
          .filter((child: Record<string, unknown>) => child.isActive)
          .slice(0, 5)
          .map((child: Record<string, unknown>) => convertMenuItem(child))
        delete wechatItem.type
        delete wechatItem.key
        delete wechatItem.url
      }

      return wechatItem
    }

    const buttons = systemMenuItems
      .filter((item: Record<string, unknown>) => item.isActive && !item.parentId)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.sort as number) - (b.sort as number))
      .slice(0, 3)
      .map((item: Record<string, unknown>) => convertMenuItem(item))

    return { button: buttons }
  }

  // 同步系统菜单到微信
  async syncMenuToWeChat(systemMenuItems: Record<string, unknown>[]): Promise<boolean> {
    try {
      const wechatMenu = this.convertToWeChatMenu(systemMenuItems)

      // 先删除现有菜单
      try {
        await this.deleteMenu()
      } catch (error) {
        // 如果菜单不存在，忽略错误
        // console.log("删除菜单时出现错误，可能菜单不存在:", error)
      }

      // 创建新菜单
      await this.createMenu(wechatMenu)

      // console.log("菜单同步到微信公众号成功")
      return true
    } catch (error) {
      console.error("同步菜单到微信失败:", error)
      throw error
    }
  }

  // 验证菜单格式
  validateMenu(menu: WeChatMenu): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!menu.button || menu.button.length === 0) {
      errors.push("菜单不能为空")
      return { isValid: false, errors }
    }

    if (menu.button.length > 3) {
      errors.push("一级菜单最多3个")
    }

    menu.button.forEach((button) => {
      // 检查菜单名称长度
      if (button.sub_button && button.sub_button.length > 0) {
        if (button.name.length > 4) {
          errors.push(`一级菜单"${button.name}"名称不能超过4个字符`)
        }
        if (button.sub_button.length > 5) {
          errors.push(`一级菜单"${button.name}"的子菜单不能超过5个`)
        }
        button.sub_button.forEach((subButton) => {
          if (subButton.name.length > 8) {
            errors.push(`子菜单"${subButton.name}"名称不能超过8个字符`)
          }
        })
      } else {
        if (button.name.length > 8) {
          errors.push(`菜单"${button.name}"名称不能超过8个字符`)
        }
      }

      // 检查URL格式
      if (button.type === "view" && button.url) {
        if (!button.url.startsWith("http://") && !button.url.startsWith("https://")) {
          errors.push(`菜单"${button.name}"的URL必须以http://或https://开头`)
        }
      }
    })

    return { isValid: errors.length === 0, errors }
  }
}

// 导出微信API服务实例
export const wechatApiService = new WeChatApiService({
  appId: process.env.NEXT_PUBLIC_WECHAT_APPID || "",
  appSecret: process.env.WECHAT_APP_SECRET || "",
})

export type { WeChatMenuItem, WeChatMenu, WeChatConfig }
