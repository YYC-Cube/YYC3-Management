/**
 * @fileoverview wechat-menu-sync.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FolderSyncIcon as Sync,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Plus,
  Trash,
  Edit,
} from "lucide-react"
import { wechatApiService, type WeChatMenu } from "@/lib/wechat-api"
import { useToast } from "@/hooks/use-toast"

interface WeChatMenuConfig {
  id: string
  name: string
  url: string
  type: "click" | "view" | "miniprogram" | "scancode_push" | "scancode_waitmsg" | "pic_sysphoto" | "pic_photo_or_album" | "pic_weixin" | "location_select"
  parentId?: string
  sort: number
  isActive: boolean
  children?: WeChatMenuConfig[]
}

export function WeChatMenuSync() {
  const { toast } = useToast()
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle")
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [autoSync, setAutoSync] = useState(false)
  const [wechatConfig, setWechatConfig] = useState({
    appId: "",
    appSecret: "",
    isConfigured: false,
  })

  // 微信菜单配置
  const [wechatMenus, setWechatMenus] = useState<WeChatMenuConfig[]>([
    {
      id: "1",
      name: "产品中心",
      url: "https://jinlan.com/products",
      type: "view",
      sort: 1,
      isActive: true,
      children: [
        {
          id: "1-1",
          name: "热门产品",
          url: "https://jinlan.com/products/hot",
          type: "view",
          parentId: "1",
          sort: 1,
          isActive: true,
        },
        {
          id: "1-2",
          name: "新品推荐",
          url: "https://jinlan.com/products/new",
          type: "view",
          parentId: "1",
          sort: 2,
          isActive: true,
        },
      ],
    },
    {
      id: "2",
      name: "服务支持",
      url: "https://jinlan.com/support",
      type: "view",
      sort: 2,
      isActive: true,
    },
    {
      id: "3",
      name: "联系我们",
      url: "https://jinlan.com/contact",
      type: "view",
      sort: 3,
      isActive: true,
    },
  ])

  const [newMenuItem, setNewMenuItem] = useState<Partial<WeChatMenuConfig>>({
    name: "",
    url: "",
    type: "view",
    sort: 1,
    isActive: true,
  })

  // 同步菜单到微信
  const handleSyncToWeChat = async () => {
    if (!wechatConfig.isConfigured) {
      toast({
        title: "配置错误",
        description: "请先配置微信公众号信息",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)
    setSyncStatus("idle")

    try {
      // 转换菜单格式
      const activeMenus = wechatMenus.filter((menu) => menu.isActive && !menu.parentId)

      // 验证菜单
      const wechatMenu = wechatApiService.convertToWeChatMenu(activeMenus)
      const validation = wechatApiService.validateMenu(wechatMenu)

      if (!validation.isValid) {
        throw new Error(`菜单格式错误: ${validation.errors.join(", ")}`)
      }

      // 同步到微信
      await wechatApiService.syncMenuToWeChat(activeMenus)

      setSyncStatus("success")
      setLastSyncTime(new Date())

      toast({
        title: "同步成功",
        description: "菜单已成功同步到微信公众号",
      })
    } catch (error) {
      setSyncStatus("error")
      toast({
        title: "同步失败",
        description: error instanceof Error ? error.message : "同步过程中发生错误",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  // 从微信获取当前菜单
  const handleFetchFromWeChat = async () => {
    if (!wechatConfig.isConfigured) {
      toast({
        title: "配置错误",
        description: "请先配置微信公众号信息",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const wechatMenu = await wechatApiService.getMenu()

      if (wechatMenu) {
        // 转换微信菜单格式为系统格式
        const convertedMenus = convertWeChatMenuToSystem(wechatMenu)
        setWechatMenus(convertedMenus)

        toast({
          title: "获取成功",
          description: "已从微信公众号获取当前菜单配置",
        })
      } else {
        toast({
          title: "提示",
          description: "微信公众号暂无菜单配置",
        })
      }
    } catch (error) {
      toast({
        title: "获取失败",
        description: error instanceof Error ? error.message : "获取菜单时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 转换微信菜单为系统格式
  const convertWeChatMenuToSystem = (wechatMenu: WeChatMenu): WeChatMenuConfig[] => {
    const convertedMenus: WeChatMenuConfig[] = []

    wechatMenu.button.forEach((button, index) => {
      const menuItem: WeChatMenuConfig = {
        id: `wechat_${index + 1}`,
        name: button.name,
        url: button.url || "",
        type: button.type || "view",
        sort: index + 1,
        isActive: true,
      }

      if (button.sub_button && button.sub_button.length > 0) {
        menuItem.children = button.sub_button.map((subButton, subIndex) => ({
          id: `wechat_${index + 1}_${subIndex + 1}`,
          name: subButton.name,
          url: subButton.url || "",
          type: subButton.type || "view",
          parentId: menuItem.id,
          sort: subIndex + 1,
          isActive: true,
        }))
      }

      convertedMenus.push(menuItem)
    })

    return convertedMenus
  }

  // 添加新菜单项
  const handleAddMenuItem = () => {
    const newItem: WeChatMenuConfig = {
      id: Date.now().toString(),
      name: newMenuItem.name || "",
      url: newMenuItem.url || "",
      type: newMenuItem.type || "view",
      sort: newMenuItem.sort || 1,
      isActive: newMenuItem.isActive || true,
    }

    setWechatMenus([...wechatMenus, newItem])
    setNewMenuItem({
      name: "",
      url: "",
      type: "view",
      sort: 1,
      isActive: true,
    })

    toast({
      title: "添加成功",
      description: "新菜单项已添加",
    })
  }

  // 删除菜单项
  const handleDeleteMenuItem = (id: string) => {
    setWechatMenus(wechatMenus.filter((menu) => menu.id !== id))
    toast({
      title: "删除成功",
      description: "菜单项已删除",
    })
  }

  // 微信菜单预览组件
  const WeChatMenuPreview = () => {
    const activeMenus = wechatMenus.filter((menu) => menu.isActive && !menu.parentId)

    return (
      <div className="max-w-sm mx-auto">
        <div className="bg-gradient-to-b from-green-400 to-green-500 p-4 rounded-t-lg">
          <div className="flex items-center justify-center text-white">
            <MessageSquare className="w-6 h-6 mr-2" />
            <span className="font-medium">微信公众号</span>
          </div>
        </div>
        <div className="bg-white border-x border-gray-200">
          <div className="p-4 text-center text-gray-500 text-sm">这里是公众号内容区域</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-b-lg">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            {activeMenus.slice(0, 3).map((menu, index) => (
              <div key={menu.id} className="relative group">
                <button className="w-full p-3 text-center hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-medium text-gray-700 truncate">{menu.name}</div>
                </button>
                {menu.children && menu.children.length > 0 && (
                  <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-200 rounded-t-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {menu.children.slice(0, 5).map((child) => (
                      <button
                        key={child.id}
                        className="w-full p-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm text-gray-700 truncate flex items-center justify-between">
                          {child.name}
                          {child.type === "view" && <ExternalLink className="w-3 h-3" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // 菜单配置编辑表单
  const [editMenuId, setEditMenuId] = useState<string | null>(null)
  const [editedMenu, setEditedMenu] = useState<Partial<WeChatMenuConfig>>({})

  // 开始编辑菜单项
  const handleEditMenuItem = (id: string) => {
    const menuToEdit = wechatMenus.find((menu) => menu.id === id) || {}
    setEditMenuId(id)
    setEditedMenu({ ...menuToEdit })
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMenuId(null)
    setEditedMenu({})
  }

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editMenuId || !editedMenu.name || !editedMenu.url) return

    setWechatMenus((prevMenus) =>
      prevMenus.map((menu) => {
        if (menu.id === editMenuId) {
          return { ...menu, ...editedMenu }
        }
        return menu
      })
    )

    setEditMenuId(null)
    setEditedMenu({})
    toast({
      title: "更新成功",
      description: "菜单项已更新",
    })
  }

  // 编辑表单输入变化
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditedMenu((prev) => ({ ...prev, [name]: value }))
  }

  // 切换菜单状态
  const handleToggleMenuStatus = (id: string) => {
    setWechatMenus((prevMenus) =>
      prevMenus.map((menu) => {
        if (menu.id === id) {
          return { ...menu, isActive: !menu.isActive }
        }
        return menu
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">微信公众号菜单同步</h2>
            <p className="text-sm text-slate-600">管理和同步微信公众号自定义菜单</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hover:shadow-md transition-all duration-300 bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                配置
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>微信公众号配置</DialogTitle>
                <DialogDescription>配置微信公众号的AppID和AppSecret以启用菜单同步功能</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="wechat-appid">AppID</Label>
                  <Input
                    id="wechat-appid"
                    placeholder="输入微信公众号AppID"
                    value={wechatConfig.appId}
                    onChange={(e) => setWechatConfig({ ...wechatConfig, appId: e.target.value })}
                    className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                  />
                </div>
                <div>
                  <Label htmlFor="wechat-secret">AppSecret</Label>
                  <Input
                    id="wechat-secret"
                    type="password"
                    placeholder="输入微信公众号AppSecret"
                    value={wechatConfig.appSecret}
                    onChange={(e) => setWechatConfig({ ...wechatConfig, appSecret: e.target.value })}
                    className="border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
                  <Label htmlFor="auto-sync">启用自动同步</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                    取消
                  </Button>
                  <Button
                    onClick={() => {
                      setWechatConfig({ ...wechatConfig, isConfigured: true })
                      setIsConfigDialogOpen(false)
                      toast({
                        title: "配置成功",
                        description: "微信公众号配置已保存",
                      })
                    }}
                    className="hover:shadow-md transition-all duration-300"
                  >
                    保存配置
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 同步状态卡片 */}
      <Card className="p-6 border-r-[5px] border-r-green-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sync className="w-5 h-5 text-green-600" />
              <span className="font-medium">同步状态</span>
            </div>
            {syncStatus === "success" && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                同步成功
              </Badge>
            )}
            {syncStatus === "error" && (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                同步失败
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleFetchFromWeChat}
              disabled={isLoading || !wechatConfig.isConfigured}
              className="hover:shadow-md transition-all duration-300 bg-transparent"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              从微信获取
            </Button>
            <Button
              onClick={handleSyncToWeChat}
              disabled={isSyncing || !wechatConfig.isConfigured}
              className="bg-green-600 hover:bg-green-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sync className="w-4 h-4 mr-2" />}
              同步到微信
            </Button>
          </div>
        </div>

        {!wechatConfig.isConfigured && (
          <Alert className="border-r-[5px] border-r-orange-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>请先配置微信公众号信息才能使用同步功能</AlertDescription>
          </Alert>
        )}

        {lastSyncTime && <div className="text-sm text-slate-600">最后同步时间: {lastSyncTime.toLocaleString()}</div>}
      </Card>

      <Tabs defaultValue="menu-config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menu-config">菜单配置</TabsTrigger>
          <TabsTrigger value="preview">预览效果</TabsTrigger>
        </TabsList>

        <TabsContent value="menu-config" className="space-y-6">
          {/* 添加新菜单项 */}
          <Card className="p-6 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-semibold mb-4">添加菜单项</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="new-menu-name">菜单名称</Label>
                <Input
                  id="new-menu-name"
                  placeholder="最多4个字符（一级菜单）"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value.substring(0, 4) })}
                  className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                />
                <p className="text-xs text-slate-500 mt-1">仅支持中英文和数字，字数不超过4个</p>
              </div>
              <div>
                <Label htmlFor="new-menu-url">跳转地址</Label>
                <Input
                  id="new-menu-url"
                  placeholder="请带上http头"
                  value={newMenuItem.url}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, url: e.target.value })}
                  className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleAddMenuItem}
                disabled={!newMenuItem.name || !newMenuItem.url}
                className="hover:shadow-md transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加菜单项
              </Button>
            </div>
          </Card>

          {/* 菜单列表 */}
          <Card className="p-6 border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-semibold mb-4">当前菜单配置</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      菜单名称
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      跳转URL
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wechatMenus
                    .filter((menu) => !menu.parentId)
                    .sort((a, b) => a.sort - b.sort)
                    .map((menu) => (
                      <React.Fragment key={menu.id}>
                        {editMenuId === menu.id ? (
                          // 编辑模式
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Input
                                name="name"
                                value={editedMenu.name || ""}
                                onChange={handleEditChange}
                                className="w-full border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <select
                                name="type"
                                value={editedMenu.type || "view"}
                                onChange={handleEditChange}
                                className="w-full border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                              >
                                <option value="view">链接</option>
                                <option value="click">点击</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Input
                                name="url"
                                value={editedMenu.url || ""}
                                onChange={handleEditChange}
                                className="w-full border-r-[5px] border-r-purple-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Switch
                                checked={!!editedMenu.isActive}
                                onCheckedChange={(value) => setEditedMenu((prev) => ({ ...prev, isActive: value }))}
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <Button onClick={handleSaveEdit} className="text-green-600 hover:text-green-900 mr-2">
                                保存
                              </Button>
                              <Button onClick={handleCancelEdit} className="text-red-600 hover:text-red-900">
                                取消
                              </Button>
                            </td>
                          </tr>
                        ) : (
                          // 显示模式
                          <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{menu.type === "view" ? "链接" : "点击"}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900 truncate max-w-xs">
                                {menu.url}
                                {menu.type === "view" && <ExternalLink className="w-3 h-3 ml-1" />}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Switch checked={menu.isActive} onCheckedChange={() => handleToggleMenuStatus(menu.id)} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              <Button onClick={() => handleEditMenuItem(menu.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                                <Edit className="w-3 h-3 mr-1" />
                                编辑
                              </Button>
                              <Button onClick={() => handleDeleteMenuItem(menu.id)} className="text-red-600 hover:text-red-900">
                                <Trash className="w-3 h-3 mr-1" />
                                删除
                              </Button>
                            </td>
                          </tr>
                        )}
                        {menu.children &&
                          menu.children
                            .sort((a, b) => a.sort - b.sort)
                            .map((child) => (
                              <tr key={child.id} className="hover:bg-gray-50 bg-gray-50/50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-4 h-px bg-gray-400 mr-2" />
                                    <div className="text-sm font-medium text-gray-900">{child.name}</div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{child.type === "view" ? "链接" : "点击"}</div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 truncate max-w-xs">
                                    {child.url}
                                    {child.type === "view" && <ExternalLink className="w-3 h-3 ml-1" />}
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <Switch checked={child.isActive} onCheckedChange={() => handleToggleMenuStatus(child.id)} />
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                  <Button onClick={() => handleEditMenuItem(child.id)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                                    <Edit className="w-3 h-3 mr-1" />
                                    编辑
                                  </Button>
                                  <Button onClick={() => handleDeleteMenuItem(child.id)} className="text-red-600 hover:text-red-900">
                                    <Trash className="w-3 h-3 mr-1" />
                                    删除
                                  </Button>
                                </td>
                              </tr>
                            ))}
                      </React.Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="p-6 border-r-[5px] border-r-amber-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
            <h3 className="text-lg font-semibold mb-4">微信菜单预览</h3>
            <WeChatMenuPreview />
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>注：此为模拟预览效果，实际显示效果以微信客户端为准</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
