"use client"

import { useState } from "react"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign, TrendingUp, TrendingDown, Plus, Loader2, Receipt,
} from "lucide-react"
import { useFinance, useFinanceSummary } from "@/hooks/use-finance"
import { toast } from "@/hooks/use-toast"

export default function FinancePage() {
  const { records, loading, createRecord } = useFinance({ limit: 10 })
  const { summary, loading: summaryLoading } = useFinanceSummary()
  const [showCreate, setShowCreate] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    description: '',
  })

  const handleCreate = async () => {
    if (!formData.category || !formData.amount) {
      toast({ title: "请填写必填字段", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      await createRecord({
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
      })
      toast({ title: "记录创建成功" })
      setShowCreate(false)
      setFormData({ type: 'expense', category: '', amount: '', description: '' })
    } catch {
      toast({ title: "创建失败", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(amount)

  if (loading && records.length === 0) {
    return <PageLoadingSkeleton />
  }

  return (
    <PageContainer title="财务管理" description="管理企业财务收支和预算">
      <div className="space-y-6">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline">
            <Receipt className="w-4 h-4 mr-2" />
            生成报表
          </Button>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新增记录
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总收入</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summaryLoading ? "—" : formatCurrency(summary?.totalIncome ?? 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总支出</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summaryLoading ? "—" : formatCurrency(summary?.totalExpense ?? 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">净利润</p>
                  <p className={`text-2xl font-bold ${(summary?.netProfit ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {summaryLoading ? "—" : formatCurrency(summary?.netProfit ?? 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">利润率</p>
                  <p className="text-2xl font-bold text-foreground">
                    {summaryLoading || !summary?.totalIncome ? "—" :
                      `${((summary.netProfit / summary.totalIncome) * 100).toFixed(1)}%`}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 收支分类汇总 */}
        {summary && (summary.incomeByCategory.length > 0 || summary.expenseByCategory.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base">收入分类</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {summary.incomeByCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    <span className="font-medium text-green-600">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">支出分类</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {summary.expenseByCategory.map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.category}</span>
                    <span className="font-medium text-red-600">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* 最近记录 */}
        <Card>
          <CardHeader>
            <CardTitle>最近收支记录</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">暂无收支记录</p>
            ) : (
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        record.type === 'income'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {record.type === 'income'
                          ? <TrendingUp className="w-4 h-4 text-green-600" />
                          : <TrendingDown className="w-4 h-4 text-red-600" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {record.description || record.category}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                      </p>
                      <StatusBadge variant="neutral">{record.category}</StatusBadge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 新增记录弹窗 */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增收支记录</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>类型 *</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as 'income' | 'expense' })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类 *</Label>
              <Input
                id="category"
                placeholder="如：销售收入、人力成本"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">金额 *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">备注</Label>
              <Input
                id="description"
                placeholder="可选描述"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>取消</Button>
            <Button onClick={handleCreate} disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
