"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PageContainer } from "@/components/layout/page-container"
import {
  BarChart3,
  Users,
  DollarSign,
  Calendar,
  CheckSquare,
  MessageSquare,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <PageContainer title="仪表板" description="欢迎回到企业管理系统">
      {/* 页面操作按钮 */}
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          今天
        </Button>
        <Button size="sm">
          <BarChart3 className="mr-2 h-4 w-4" />
          查看报告
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总客户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>
              较上月增长
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">月度收入</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥45,231</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              较上月增长
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃任务</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -3.1%
              </span>
              较上周减少
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成率</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +2.4%
              </span>
              较上周提升
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧：图表和数据 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 收入趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>收入趋势</CardTitle>
              <CardDescription>过去12个月的收入变化</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">图表数据加载中...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 项目进度 */}
          <Card>
            <CardHeader>
              <CardTitle>项目进度</CardTitle>
              <CardDescription>当前进行中的项目状态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">客户管理系统升级</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">移动应用开发</span>
                  <span className="text-sm text-muted-foreground">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">数据分析平台</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：活动和通知 */}
        <div className="space-y-6">
          {/* 最近活动 */}
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>系统中的最新动态</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">新客户注册</p>
                  <p className="text-xs text-muted-foreground">张三刚刚注册了账户</p>
                  <p className="text-xs text-muted-foreground">2分钟前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">任务完成</p>
                  <p className="text-xs text-muted-foreground">李四完成了客户跟进任务</p>
                  <p className="text-xs text-muted-foreground">15分钟前</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">系统更新</p>
                  <p className="text-xs text-muted-foreground">系统已更新到最新版本</p>
                  <p className="text-xs text-muted-foreground">1小时前</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 待办事项 */}
          <Card>
            <CardHeader>
              <CardTitle>待办事项</CardTitle>
              <CardDescription>需要您关注的任务</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">审核客户申请</p>
                  <p className="text-xs text-muted-foreground">3个待审核</p>
                </div>
                <Badge variant="secondary">紧急</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">回复客户消息</p>
                  <p className="text-xs text-muted-foreground">5条未读消息</p>
                </div>
                <Badge variant="outline">普通</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">系统维护通知</p>
                  <p className="text-xs text-muted-foreground">今晚22:00-24:00</p>
                </div>
                <Badge variant="outline">提醒</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用功能快捷入口</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="mr-2 h-4 w-4" />
                添加新客户
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CheckSquare className="mr-2 h-4 w-4" />
                创建任务
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="mr-2 h-4 w-4" />
                生成报告
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
