"use client"

import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FloatingNavButtons } from "@/components/ui/floating-nav-buttons"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Wand2,
  Send,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Video,
  Globe,
  Settings,
  BookOpen,
  PhoneIcon as Wechat,
  MessageSquare,
  Smartphone,
  Instagram,
  FileText,
  LayoutGrid,
  Sparkles,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PageContainer } from "@/components/layout/page-container"

export default function AIContentCreatorPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [keywords, setKeywords] = useState("")
  const [platforms, setPlatforms] = useState(["wechat", "workwechat", "feishu", "dingtalk", "redbook"])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState<Record<string, { status: string; views?: number }>>({})
  const [history, setHistory] = useState([
    { id: 1, title: "夏季防晒指南", date: "2023-11-15", platforms: ["wechat", "redbook"], views: 2450 },
    { id: 2, title: "智能家居选购攻略", date: "2023-11-12", platforms: ["workwechat", "dingtalk"], views: 1870 },
    { id: 3, title: "冬季养生食谱", date: "2023-11-08", platforms: ["wechat", "redbook", "feishu"], views: 3120 },
  ])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = () => {
    if (!title.trim()) {
      toast({
        title: "提示",
        description: "请输入创作主题",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // 模拟AI生成内容
    setTimeout(() => {
      const sampleContent = `# ${title}

## 核心要点
- ${keywords
        .split(",")
        .filter((k) => k.trim())
        .join("\n- ")}

### 详细内容
随着科技的不断发展，${title}已成为现代生活的重要组成部分。本文将从多个角度深入探讨${title}的关键要素：

1. **基础概念**
   ${title}的基本原理和应用场景

2. **实用技巧**
   如何高效地应用${title}解决实际问题

3. **行业趋势**
   ${title}在未来5年的发展方向预测

> **专家观点**：知名行业专家表示，${title}将在未来改变人们的生活方式。

### 总结
${title}不仅改变了我们的日常生活，也正在重塑整个行业生态。掌握${title}的核心知识，将帮助您在数字化时代保持竞争力。

---
*本文由AI智能生成，内容仅供参考*`

      setContent(sampleContent)
      setIsGenerating(false)
      toast({
        title: "生成成功",
        description: "AI内容已生成完成！",
      })
    }, 2000)
  }

  const handlePublish = () => {
    if (!content.trim()) {
      toast({
        title: "提示",
        description: "请先生成内容",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    setPublishStatus({})

    // 模拟发布过程
    interface PublishStatus {
      [platform: string]: { status: "processing" | "published" | "failed"; url?: string; views?: number }
    }
    const statusUpdates: PublishStatus = {}
    const platformNames = {
      wechat: "微信公众号",
      workwechat: "企业微信",
      feishu: "飞书",
      dingtalk: "钉钉",
      redbook: "小红书",
      douyin: "抖音",
    }

    platforms.forEach((platform, index) => {
      setTimeout(() => {
        statusUpdates[platform] = { status: "processing" }
        setPublishStatus({ ...statusUpdates })
      }, index * 800)

      setTimeout(
        () => {
          statusUpdates[platform] = {
            status: "published",
            url: `https://${platform}.com/content/${title.replace(/\s+/g, "-")}`,
            views: Math.floor(Math.random() * 1000) + 500,
          }
          setPublishStatus({ ...statusUpdates })

          // 如果是最后一个平台
          if (index === platforms.length - 1) {
            setIsPublishing(false)

            // 添加到历史记录
            const newHistory = [
              {
                id: history.length + 1,
                title,
                date: new Date().toISOString().split("T")[0],
                platforms: [...platforms],
                views: Object.values(statusUpdates).reduce((sum, item) => sum + (item.views || 0), 0),
              },
              ...history,
            ]
            setHistory(newHistory.slice(0, 5))

            toast({
              title: "发布成功",
              description: `内容已成功发布到${platforms.length}个平台！`,
            })
          }
        },
        index * 800 + 2000,
      )
    })
  }

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform))
    } else {
      setPlatforms([...platforms, platform])
    }
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const PlatformIcon = ({ platform, size = 20, className = "" }: { platform: string; size?: number; className?: string }) => (
    <Image src={`/platforms/${platform}.png`} alt={platform} width={size} height={size} className={className || `w-${size/4} h-${size/4}`} />
  )

  const PlatformBadge = ({ platform }: { platform: string }) => {
    const name =
      platform === "wechat"
        ? "公众号"
        : platform === "workwechat"
          ? "企业微信"
          : platform === "feishu"
            ? "飞书"
            : platform === "dingtalk"
              ? "钉钉"
              : platform === "redbook"
                ? "小红书"
                : platform === "douyin"
                  ? "抖音"
                  : platform

    const selected = platforms.includes(platform)

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={selected ? "default" : "outline"}
              className={`group cursor-pointer transition-colors flex items-center gap-1 ${selected ? "hover:bg-primary/80" : "hover:bg-indigo-50"}`}
              onClick={() => togglePlatform(platform)}
            >
              <PlatformIcon platform={platform} />
              <span className={`${selected ? "ml-1" : "sr-only group-hover:not-sr-only ml-1"}`}>{name}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <PageContainer title="AI创作助手" description="一键生成高质量内容，并同步推送到微信公众号、企业微信、飞书、小红书等平台">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              内容创作
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              内容预览
            </TabsTrigger>
            <TabsTrigger value="publish" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              发布设置
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              创作历史
            </TabsTrigger>
          </TabsList>

          {/* 内容创作标签页 */}
          <TabsContent value="create">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="w-6 h-6 mr-2 text-indigo-600" />
                  内容创作
                </CardTitle>
                <CardDescription>输入主题和关键词，AI将为您生成高质量内容</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">创作主题 *</Label>
                      <Input
                        id="title"
                        placeholder="例如：智能家居选购指南"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="keywords">关键词</Label>
                      <Input
                        id="keywords"
                        placeholder="用逗号分隔，例如：智能音箱,智能灯泡,安全性"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                      />
                    </div>

                    <div>
                    <Label>内容类型</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                        科普文章
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                        产品评测
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                        使用指南
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                        行业分析
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                        新闻资讯
                      </Badge>
                    </div>
                  </div>

                    <div>
                      <Label>添加素材</Label>
                      <div className="flex gap-4 mt-2">
                        <Button
                          variant="outline"
                          className="py-3 px-4 border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200"
                          aria-label="添加图片"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          添加图片
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                          aria-hidden="true"
                          aria-label="选择图片"
                          title="选择图片"
                          tabIndex={-1}
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              toast({
                                title: "图片上传",
                                description: "图片上传功能开发中...",
                              })
                            }
                          }}
                        />
                        <Button variant="outline" className="py-3 px-4 border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200">
                          <Video className="w-4 h-4 mr-2" />
                          添加视频
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>内容风格</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                          专业严谨
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                          轻松活泼
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                          简洁明了
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-indigo-50 transition-colors">
                          情感丰富
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label>目标平台</Label>
                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                        {["wechat", "workwechat", "feishu", "dingtalk", "redbook", "douyin"].map((platform) => (
                          <PlatformBadge key={platform} platform={platform} />
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          内容生成中...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          一键生成内容
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 min-h-[500px] bg-gray-50">
                      <h3 className="font-semibold mb-4 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                        AI生成预览
                      </h3>
                      {content ? (
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">{content}</pre>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-64 text-gray-500">
                          <div className="text-center">
                            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p>AI生成的内容将显示在这里</p>
                            <p className="text-sm mt-2">请填写创作主题后点击生成</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 内容预览标签页 */}
          <TabsContent value="preview">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-indigo-600" />
                  内容预览
                </CardTitle>
                <CardDescription>预览AI生成的内容，并进行编辑优化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">标题</Label>
                      <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                      <Label htmlFor="edit-content">内容</Label>
                      <Textarea
                        id="edit-content"
                        rows={20}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="AI生成的内容将显示在这里..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 min-h-[400px]">
                      <h2 className="text-2xl font-bold mb-4">{title}</h2>
                      <div
                        className="prose prose-lg max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: content
                            ? content.replace(/\n/g, "<br>").replace(/# (.+?)\n/g, "<h3>$1</h3>")
                            : '<p class="text-gray-500">暂无内容，请先生成内容</p>',
                        }}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1 py-3 px-4 border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200">
                        <Download className="w-4 h-4 mr-2" /> 导出为Markdown
                      </Button>
                      <Button variant="outline" className="flex-1 py-3 px-4 border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200">
                        <Download className="w-4 h-4 mr-2" /> 导出为PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={() => setActiveTab("publish")}
                  className="py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  下一步：发布设置 <Send className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 发布设置标签页 */}
          <TabsContent value="publish">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-6 h-6 mr-2 text-indigo-600" />
                  发布设置
                </CardTitle>
                <CardDescription>配置发布平台和发布时间</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label>目标平台</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {["wechat", "workwechat", "feishu", "dingtalk", "redbook", "douyin"].map((platform) => (
                          <div
                          key={platform}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            platforms.includes(platform)
                              ? "border-indigo-300 bg-indigo-50"
                              : "border-gray-200 hover:bg-indigo-50"
                          }`}
                          onClick={() => togglePlatform(platform)}
                        >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-full ${
                                  platforms.includes(platform)
                                    ? "bg-indigo-100 text-indigo-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <PlatformIcon platform={platform} />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {platform === "wechat" && "微信公众号"}
                                  {platform === "workwechat" && "企业微信"}
                                  {platform === "feishu" && "飞书"}
                                  {platform === "dingtalk" && "钉钉"}
                                  {platform === "redbook" && "小红书"}
                                  {platform === "douyin" && "抖音"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {platforms.includes(platform) ? "已选择" : "未选择"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>发布设置</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">立即发布</p>
                            <p className="text-sm text-gray-600">内容生成后立即发布到所有平台</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">定时发布</p>
                            <p className="text-sm text-gray-600">设置具体发布时间</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">内容审核</p>
                            <p className="text-sm text-gray-600">发布前自动进行内容安全审核</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border rounded-lg p-5">
                      <h3 className="font-semibold text-lg mb-4">发布状态</h3>

                      {platforms.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">请至少选择一个发布平台</div>
                      ) : (
                        <div className="space-y-4">
                          {platforms.map((platform) => {
                            const status = publishStatus[platform]?.status || "pending"
                            const isProcessing = status === "processing"
                            const isPublished = status === "published"

                            return (
                              <div key={platform} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`p-2 rounded-full ${
                                      isPublished
                                        ? "bg-green-100 text-green-600"
                                        : isProcessing
                                          ? "bg-blue-100 text-blue-600"
                                          : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    <PlatformIcon platform={platform} size={20} />
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {platform === "wechat" && "微信公众号"}
                                      {platform === "workwechat" && "企业微信"}
                                      {platform === "feishu" && "飞书"}
                                      {platform === "dingtalk" && "钉钉"}
                                      {platform === "redbook" && "小红书"}
                                      {platform === "douyin" && "抖音"}
                                    </p>
                                    <p
                                      className={`text-sm ${
                                        isPublished
                                          ? "text-green-600"
                                          : isProcessing
                                            ? "text-blue-600"
                                            : "text-gray-500"
                                      }`}
                                    >
                                      {isPublished && `已发布 · ${publishStatus[platform]?.views || 0}次浏览`}
                                      {isProcessing && "发布中..."}
                                      {status === "pending" && "等待发布"}
                                    </p>
                                  </div>
                                </div>

                                {isPublished && (
                                  <Button variant="outline" size="sm" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200">
                                    查看
                                  </Button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="mt-6">
                        <Button
                          onClick={handlePublish}
                          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          disabled={isPublishing || platforms.length === 0}
                        >
                          {isPublishing ? (
                            <>
                              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                              内容发布中...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              一键发布到{platforms.length}个平台
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        平台适配建议
                      </h4>
                      <ul className="mt-2 space-y-2 text-sm text-blue-700">
                        <li>• 微信公众号：建议添加封面图和摘要</li>
                        <li>• 小红书：建议添加多个图片和话题标签</li>
                        <li>• 抖音：建议生成竖版视频内容</li>
                        <li>• 企业微信：适合发布内部通知类内容</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 创作历史标签页 */}
          <TabsContent value="history">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LayoutGrid className="w-6 h-6 mr-2 text-purple-600" />
                  创作历史
                </CardTitle>
                <CardDescription>最近创作的内容和发布效果</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-4">暂无创作历史</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription className="flex justify-between">
                            <span>{item.date}</span>
                            <span>{item.views}次浏览</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {item.platforms.map((platform) => (
                              <Badge key={platform} variant="outline" className="flex items-center">
                                <PlatformIcon platform={platform} size={16} className="mr-1" />
                                <span>
                                  {platform === "wechat" && "公众号"}
                                  {platform === "workwechat" && "企业微信"}
                                  {platform === "feishu" && "飞书"}
                                  {platform === "dingtalk" && "钉钉"}
                                  {platform === "redbook" && "小红书"}
                                </span>
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" size="sm" className="py-2 px-3 border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-medium transition-all duration-200">
                            查看详情
                          </Button>
                          <Button size="sm" className="py-2 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all duration-200">
                            再次发布
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                开始你的创作之旅
              </h3>
              <p className="text-gray-600 mt-2">一键生成专业内容，多平台同步发布，提升你的内容影响力</p>
            </div>
            <Button
              className="mt-4 md:mt-0 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setActiveTab("create")}
            >
              <Wand2 className="w-4 h-4 mr-2" /> 立即开始创作
            </Button>
          </div>
        </div>
      <FloatingNavButtons />
    </PageContainer>
  )
}
