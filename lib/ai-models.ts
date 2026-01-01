/**
 * @fileoverview AI模型配置
 * @description 定义支持的AI模型列表和配置信息
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-12-08
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// AI模型统一配置和管理
export interface AIModel {
  id: string
  name: string
  provider: string
  type: "local" | "cloud"
  endpoint: string
  apiKey?: string
  maxTokens: number
  temperature: number
  description: string
  capabilities: string[]
}

export const AI_MODELS: AIModel[] = [
  // 本地模型
  {
    id: "local-llama2",
    name: "Llama 2 本地版",
    provider: "Local",
    type: "local",
    endpoint: "http://localhost:11434/api/generate",
    maxTokens: 4096,
    temperature: 0.7,
    description: "本地部署的Llama 2模型，数据安全性高",
    capabilities: ["文本生成", "对话", "代码生成"],
  },
  {
    id: "local-chatglm",
    name: "ChatGLM 本地版",
    provider: "Local",
    type: "local",
    endpoint: "http://localhost:8000/api/chat",
    maxTokens: 2048,
    temperature: 0.8,
    description: "本地部署的ChatGLM模型，中文理解能力强",
    capabilities: ["中文对话", "文本生成", "翻译"],
  },
  // 国内云端模型
  {
    id: "baidu-ernie",
    name: "百度文心一言",
    provider: "Baidu",
    type: "cloud",
    endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
    apiKey: process.env.BAIDU_API_KEY,
    maxTokens: 2000,
    temperature: 0.7,
    description: "百度文心一言大模型，中文能力优秀",
    capabilities: ["中文对话", "文本生成", "知识问答", "创意写作"],
  },
  {
    id: "alibaba-qwen",
    name: "阿里通义千问",
    provider: "Alibaba",
    type: "cloud",
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    apiKey: process.env.ALIBABA_API_KEY,
    maxTokens: 2000,
    temperature: 0.7,
    description: "阿里巴巴通义千问大模型，多模态能力强",
    capabilities: ["多模态对话", "文本生成", "代码生成", "数据分析"],
  },
  {
    id: "tencent-hunyuan",
    name: "腾讯混元",
    provider: "Tencent",
    type: "cloud",
    endpoint: "https://hunyuan.tencentcloudapi.com/v1/chat/completions",
    apiKey: process.env.TENCENT_API_KEY,
    maxTokens: 4000,
    temperature: 0.7,
    description: "腾讯混元大模型，企业级应用优化",
    capabilities: ["企业对话", "文档处理", "业务分析", "智能客服"],
  },
  {
    id: "zhipu-glm",
    name: "智谱GLM-4",
    provider: "Zhipu",
    type: "cloud",
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    apiKey: process.env.ZHIPU_API_KEY,
    maxTokens: 8000,
    temperature: 0.7,
    description: "智谱AI GLM-4模型，长文本处理能力强",
    capabilities: ["长文本理解", "代码生成", "数学推理", "多语言翻译"],
  },
  {
    id: "moonshot-kimi",
    name: "Moonshot Kimi",
    provider: "Moonshot",
    type: "cloud",
    endpoint: "https://api.moonshot.cn/v1/chat/completions",
    apiKey: process.env.MOONSHOT_API_KEY,
    maxTokens: 16000,
    temperature: 0.7,
    description: "Moonshot Kimi模型，超长上下文理解",
    capabilities: ["超长文本", "文档分析", "学术研究", "专业问答"],
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    type: "cloud",
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    apiKey: process.env.DEEPSEEK_API_KEY,
    maxTokens: 4000,
    temperature: 0.7,
    description: "DeepSeek Chat模型，代码能力突出",
    capabilities: ["代码生成", "技术问答", "算法设计", "系统架构"],
  },
]

export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find((model) => model.id === id)
}

export function getModelsByType(type: "local" | "cloud"): AIModel[] {
  return AI_MODELS.filter((model) => model.type === type)
}

export function getModelsByProvider(provider: string): AIModel[] {
  return AI_MODELS.filter((model) => model.provider === provider)
}
