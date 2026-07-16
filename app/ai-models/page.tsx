"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { PageLoadingSkeleton } from "@/components/ui/loading-skeleton"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Plus, Trash2, Pencil, Zap, Cpu, Wifi, WifiOff, Loader2,
  CheckCircle, XCircle, Clock, Search, Sparkles,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ModelConfig {
  id?: number
  name: string
  provider: string
  model_id: string
  base_url?: string
  api_key?: string
  max_tokens: number
  temperature: number
  system_prompt?: string
  is_active: boolean
  is_default: boolean
}

interface OllamaModel {
  name: string
  size: string
  parameter_size: string
  quantization: string
  source_url?: string
}

interface TestResult {
  success: boolean
  model: string
  provider: string
  response: string
  latency_ms: number
  tokens_used: number
  error: string | null
}

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', defaultModel: 'gpt-4o-mini', defaultUrl: 'https://api.openai.com/v1' },
  { value: 'zhipu', label: '智谱 GLM', defaultModel: 'glm-4-flash', defaultUrl: 'https://open.bigmodel.cn/api/paas/v4' },
  { value: 'deepseek', label: 'DeepSeek', defaultModel: 'deepseek-chat', defaultUrl: 'https://api.deepseek.com/v1' },
  { value: 'moonshot', label: 'Moonshot Kimi', defaultModel: 'moonshot-v1-8k', defaultUrl: 'https://api.moonshot.cn/v1' },
  { value: 'ollama', label: 'Ollama (本地)', defaultModel: 'llama3.2', defaultUrl: 'http://localhost:11434' },
  { value: 'custom', label: '自定义 (OpenAI兼容)', defaultModel: '', defaultUrl: '' },
]

export default function AIModelManagementPage() {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingModel, setEditingModel] = useState<ModelConfig | null>(null)
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([])
  const [scanning, setScanning] = useState(false)
  const [ollamaStatus, setOllamaStatus] = useState<'unknown' | 'online' | 'offline'>('unknown')
  const [testPrompt, setTestPrompt] = useState("你好，请用一句话介绍你自己。")
  const [testing, setTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [compareMode, setCompareMode] = useState(false)

  useEffect(() => {
    fetchModels()
    scanOllama()
  }, [])

  async function fetchModels() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/models')
      const data = await res.json()
      setModels(data.data || [])
    } catch {
      toast({ title: "获取模型列表失败", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function scanOllama() {
    setScanning(true)
    try {
      const res = await fetch('/api/ai/ollama/scan')
      const data = await res.json()
      if (data.success) {
        setOllamaModels(data.data.models || [])
        setOllamaStatus(data.data.found > 0 ? 'online' : 'offline')
      }
    } catch {
      setOllamaStatus('offline')
    } finally {
      setScanning(false)
    }
  }

  async function handleSave(model: ModelConfig) {
    try {
      if (editingModel?.id) {
        await fetch(`/api/ai/models/${editingModel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(model),
        })
        toast({ title: "模型已更新" })
      } else {
        await fetch('/api/ai/models', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(model),
        })
        toast({ title: "模型已添加" })
      }
      setShowAdd(false)
      setEditingModel(null)
      fetchModels()
    } catch {
      toast({ title: "操作失败", variant: "destructive" })
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('确定要删除此模型配置吗？')) return
    try {
      await fetch(`/api/ai/models/${id}`, { method: 'DELETE' })
      toast({ title: "模型已删除" })
      fetchModels()
    } catch {
      toast({ title: "删除失败", variant: "destructive" })
    }
  }

  async function handleTest() {
    setTesting(true)
    setTestResults([])
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          compare: compareMode,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTestResults(data.data.results)
        toast({ title: `测试完成: ${data.data.summary.success}/${data.data.summary.total} 成功` })
      } else {
        toast({ title: data.error || "测试失败", variant: "destructive" })
      }
    } catch {
      toast({ title: "测试请求失败", variant: "destructive" })
    } finally {
      setTesting(false)
    }
  }

  function importOllamaModel(ollamaModel: OllamaModel) {
    setEditingModel({
      name: ollamaModel.name,
      provider: 'ollama',
      model_id: ollamaModel.name,
      base_url: ollamaModel.source_url || 'http://localhost:11434',
      max_tokens: 4096,
      temperature: 0.7,
      is_active: true,
      is_default: false,
    })
    setShowAdd(true)
  }

  if (loading) return <PageLoadingSkeleton />

  return (
    <PageContainer title="AI模型管理" description="管理AI模型配置 · 扫描本地Ollama · 可视化模型测试">
      <Tabs defaultValue="models">
        <TabsList>
          <TabsTrigger value="models">模型配置</TabsTrigger>
          <TabsTrigger value="ollama">Ollama 扫描</TabsTrigger>
          <TabsTrigger value="test">模型测试</TabsTrigger>
        </TabsList>

        {/* ─── 模型配置 Tab ─── */}
        <TabsContent value="models" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => { setEditingModel(null); setShowAdd(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              添加模型
            </Button>
          </div>

          {models.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Cpu className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">暂无模型配置，点击右上角添加</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {models.map((model) => (
                <Card key={model.id || model.name}>
                  <CardContent className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{model.name}</p>
                          {model.is_default && <StatusBadge variant="primary">默认</StatusBadge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {model.provider} · {model.model_id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge variant={model.is_active ? 'success' : 'neutral'}>
                        {model.is_active ? '已启用' : '已禁用'}
                      </StatusBadge>
                      <Button variant="ghost" size="sm" onClick={() => { setEditingModel(model); setShowAdd(true) }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      {model.id && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(model.id!)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── Ollama 扫描 Tab ─── */}
        <TabsContent value="ollama" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {ollamaStatus === 'online' ? (
                      <Wifi className="w-5 h-5 text-success" />
                    ) : ollamaStatus === 'offline' ? (
                      <WifiOff className="w-5 h-5 text-destructive" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Ollama 本地扫描
                  </CardTitle>
                  <CardDescription>自动扫描 localhost:11434 等常见端口</CardDescription>
                </div>
                <Button variant="outline" onClick={scanOllama} disabled={scanning}>
                  {scanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                  重新扫描
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {ollamaStatus === 'online' ? (
                ollamaModels.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Ollama已连接，但未找到已安装的模型。请在终端运行 <code className="bg-muted px-1.5 py-0.5 rounded">ollama pull llama3.2</code>
                  </p>
                ) : (
                  <div className="space-y-2">
                    {ollamaModels.map((m) => (
                      <div key={m.name} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {m.parameter_size} · {m.quantization} · {m.size}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => importOllamaModel(m)}>
                          <Plus className="w-4 h-4 mr-1" />
                          导入
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              ) : ollamaStatus === 'offline' ? (
                <div className="text-center py-6">
                  <WifiOff className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">未检测到Ollama服务</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    安装: <code className="bg-muted px-1 rounded">curl -fsSL https://ollama.com/install.sh | sh</code>
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── 模型测试 Tab ─── */}
        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                可视化模型测试
              </CardTitle>
              <CardDescription>
                发送提示词到模型，查看响应、延迟和Token用量
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>测试提示词</Label>
                <Textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="输入测试提示词..."
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={compareMode} onCheckedChange={setCompareMode} />
                  对比模式 (测试所有活跃模型)
                </label>
                <Button onClick={handleTest} disabled={testing}>
                  {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  {testing ? '测试中...' : '开始测试'}
                </Button>
              </div>

              {/* 测试结果 */}
              {testResults.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-medium">测试结果</h3>
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`p-4 border rounded-lg ${result.success ? 'border-success/20 dark:border-success/20' : 'border-destructive/20 dark:border-destructive/20'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-destructive" />
                          )}
                          <span className="font-medium">{result.model}</span>
                          <Badge variant="outline" className="text-xs">{result.provider}</Badge>
                        </div>
                        {result.success && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {result.latency_ms}ms
                            </span>
                            {result.tokens_used > 0 && (
                              <span>{result.tokens_used} tokens</span>
                            )}
                          </div>
                        )}
                      </div>
                      {result.success ? (
                        <p className="text-sm text-foreground whitespace-pre-wrap">{result.response}</p>
                      ) : (
                        <p className="text-sm text-destructive">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── 添加/编辑模型弹窗 ─── */}
      <ModelEditDialog
        open={showAdd}
        onOpenChange={setShowAdd}
        model={editingModel}
        onSave={handleSave}
      />
    </PageContainer>
  )
}

// ─── 模型编辑弹窗组件 ─────────────────────────────

function ModelEditDialog({
  open, onOpenChange, model, onSave,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  model: ModelConfig | null
  onSave: (model: ModelConfig) => void
}) {
  const [formData, setFormData] = useState<ModelConfig>(
    model || {
      name: '', provider: 'openai', model_id: '', base_url: '',
      api_key: '', max_tokens: 4096, temperature: 0.7, system_prompt: '',
      is_active: true, is_default: false,
    }
  )

  useEffect(() => {
    if (model) setFormData(model)
    else setFormData({
      name: '', provider: 'openai', model_id: '', base_url: '',
      api_key: '', max_tokens: 4096, temperature: 0.7, system_prompt: '',
      is_active: true, is_default: false,
    })
  }, [model, open])

  function onProviderChange(provider: string) {
    const p = PROVIDERS.find((x) => x.value === provider)
    setFormData({
      ...formData,
      provider,
      model_id: formData.model_id || p?.defaultModel || '',
      base_url: formData.base_url || p?.defaultUrl || '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{model?.id ? '编辑模型' : '添加模型'}</DialogTitle>
          <DialogDescription>配置AI模型参数，API Key将加密存储</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label>显示名称 *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="如：GPT-4o"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>提供商 *</Label>
              <Select value={formData.provider} onValueChange={onProviderChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>模型ID *</Label>
              <Input
                value={formData.model_id}
                onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                placeholder="如：gpt-4o-mini"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>API Base URL</Label>
            <Input
              value={formData.base_url || ''}
              onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
              placeholder="https://api.openai.com/v1"
            />
          </div>
          {formData.provider !== 'ollama' && (
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={formData.api_key || ''}
                onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
                placeholder="sk-..."
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Tokens</Label>
              <Input
                type="number"
                value={formData.max_tokens}
                onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) || 4096 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) || 0.7 })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>System Prompt (可选)</Label>
            <Textarea
              value={formData.system_prompt || ''}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              placeholder="你是一个专业的企业助手..."
              rows={2}
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
              />
              启用
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={formData.is_default}
                onCheckedChange={(v) => setFormData({ ...formData, is_default: v })}
              />
              设为默认
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={() => onSave(formData)}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
