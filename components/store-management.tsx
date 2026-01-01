/**
 * @fileoverview store-management.tsx
 * @description 自动生成的组件或模块
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, MoreHorizontal, MapPin, Users, TrendingUp, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StoreType {
  id: string
  name: string
  address: string
  type: "flagship" | "standard" | "outlet"
  status: "active" | "inactive" | "maintenance"
  manager: string
  employees: number
  monthlyRevenue: number
  createdAt: Date
  lastActive: Date
  logo?: string
}

interface Employee {
  id: string
  name: string
  email: string
  role: "manager" | "supervisor" | "staff"
  storeId: string
  status: "active" | "inactive"
  joinDate: Date
}

export function StoreManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const stores: StoreType[] = [
    {
      id: "1",
      name: "锦澜家居旗舰店",
      address: "上海市浦东新区陆家嘴金融中心",
      type: "flagship",
      status: "active",
      manager: "张经理",
      employees: 25,
      monthlyRevenue: 850000,
      createdAt: new Date("2023-01-15"),
      lastActive: new Date(),
      logo: "/yyc3-logo-blue.png",
    },
    {
      id: "2",
      name: "锦澜家居徐汇店",
      address: "上海市徐汇区淮海中路商业街",
      type: "standard",
      status: "active",
      manager: "李主管",
      employees: 18,
      monthlyRevenue: 620000,
      createdAt: new Date("2023-03-20"),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "锦澜家居静安店",
      address: "上海市静安区南京西路购物中心",
      type: "standard",
      status: "active",
      manager: "王店长",
      employees: 22,
      monthlyRevenue: 720000,
      createdAt: new Date("2023-05-10"),
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "4",
      name: "锦澜家居奥特莱斯店",
      address: "上海市青浦区奥特莱斯购物村",
      type: "outlet",
      status: "maintenance",
      manager: "赵主管",
      employees: 12,
      monthlyRevenue: 380000,
      createdAt: new Date("2023-08-01"),
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ]

  const employees: Employee[] = [
    {
      id: "1",
      name: "张经理",
      email: "zhang@jinlan-flagship.com",
      role: "manager",
      storeId: "1",
      status: "active",
      joinDate: new Date("2023-01-15"),
    },
    {
      id: "2",
      name: "李主管",
      email: "li@jinlan-xuhui.com",
      role: "supervisor",
      storeId: "2",
      status: "active",
      joinDate: new Date("2023-03-20"),
    },
    {
      id: "3",
      name: "王店长",
      email: "wang@jinlan-jingan.com",
      role: "manager",
      storeId: "3",
      status: "active",
      joinDate: new Date("2023-05-10"),
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "flagship":
        return <DollarSign className="w-4 h-4" />
      case "standard":
        return <Users className="w-4 h-4" />
      case "outlet":
        return <MapPin className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "flagship":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "standard":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "outlet":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">多门店管理</h1>
          <p className="text-slate-600 mt-2">管理多个门店和员工信息</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              新建门店
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新门店</DialogTitle>
              <DialogDescription>添加新的门店到系统中</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="store-name">门店名称</Label>
                <Input id="store-name" placeholder="输入门店名称" className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]" />
              </div>
              <div>
                <Label htmlFor="store-address">门店地址</Label>
                <Input id="store-address" placeholder="输入门店地址" className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]" />
              </div>
              <div>
                <Label htmlFor="store-type">门店类型</Label>
                <Select>
                  <SelectTrigger className="border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]">
                    <SelectValue placeholder="选择门店类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flagship">旗舰店</SelectItem>
                    <SelectItem value="standard">标准店</SelectItem>
                    <SelectItem value="outlet">奥特莱斯店</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  取消
                </Button>
                <Button
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="hover:shadow-md transition-all duration-300"
                >
                  创建
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="stores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stores">门店管理</TabsTrigger>
          <TabsTrigger value="employees">员工管理</TabsTrigger>
          <TabsTrigger value="analytics">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索门店名称或地址..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-r-[5px] border-r-blue-500 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredStores.map((store) => (
              <Card
                key={store.id}
                className="p-4 border-r-[5px] border-r-green-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 group-hover:scale-110 transition-all duration-300">
                      {store.logo ? (
                        <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                      ) : (
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">
                          {getTypeIcon(store.type)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-all duration-300">
                        {store.name}
                      </h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {store.address}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(store.type)}>
                          {getTypeIcon(store.type)}
                          <span className="ml-1 capitalize">
                            {store.type === "flagship" ? "旗舰店" : store.type === "standard" ? "标准店" : "奥特莱斯店"}
                          </span>
                        </Badge>
                        <Badge className={getStatusColor(store.status)}>
                          {store.status === "active" ? "营业中" : store.status === "inactive" ? "暂停营业" : "维护中"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{store.employees}人</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-medium">¥{(store.monthlyRevenue / 10000).toFixed(1)}万</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">负责人: {store.manager}</p>
                      <p className="text-xs text-slate-500">最后活跃: {store.lastActive.toLocaleString()}</p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:shadow-md transition-all duration-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>编辑信息</DropdownMenuItem>
                        <DropdownMenuItem>员工管理</DropdownMenuItem>
                        <DropdownMenuItem>销售报表</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">暂停营业</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                className="p-4 border-r-[5px] border-r-orange-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="group-hover:scale-110 transition-all duration-300">
                      <AvatarFallback className="bg-blue-100 text-blue-600">{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:translate-x-1 transition-all duration-300">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-slate-600">{employee.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          {employee.role === "manager" ? "店长" : employee.role === "supervisor" ? "主管" : "员工"}
                        </Badge>
                        <Badge
                          className={
                            employee.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {employee.status === "active" ? "在职" : "离职"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-600">入职时间: {employee.joinDate.toLocaleDateString()}</p>
                    <p className="text-xs text-slate-500">
                      所属门店: {stores.find((s) => s.id === employee.storeId)?.name}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 border-r-[5px] border-r-green-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总门店数</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-all duration-300">
                    {stores.length}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="mt-4">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
            </Card>

            <Card className="p-6 border-r-[5px] border-r-blue-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总员工数</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-all duration-300">
                    {stores.reduce((sum, store) => sum + store.employees, 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="mt-4">
                <div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: "85%" }}
                />
              </div>
            </Card>

            <Card className="p-6 border-r-[5px] border-r-purple-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">月总营收</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-all duration-300">
                    ¥{(stores.reduce((sum, store) => sum + store.monthlyRevenue, 0) / 10000).toFixed(1)}万
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="mt-4">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: "92%" }}
                />
              </div>
            </Card>

            <Card className="p-6 border-r-[5px] border-r-orange-500 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">营业门店</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:translate-x-1 transition-all duration-300">
                    {stores.filter((store) => store.status === "active").length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-all duration-300" />
              </div>
              <div className="mt-4">
                <div
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: "75%" }}
                />
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
