/**
 * @fileoverview AI 数据常量 — 提示词预设、模型列表、默认数据
 */

import type { PromptPreset, ModelOption } from "./types"

/** 提示词预设 */
export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: "p1",
    name: "运维诊断专家",
    prompt:
      "你是 YYC³ 矩阵系统的运维诊断专家。请分析系统当前状态，识别潜在问题，给出优化建议。使用中文回答，简洁专业。",
    category: "运维",
  },
  {
    id: "p2",
    name: "模型调优顾问",
    prompt:
      "你是大模型推理调优专家。请根据当前模型部署情况，分析推理性能瓶颈，建议最优的 batch size、并行策略和内存配置。",
    category: "模型",
  },
  {
    id: "p3",
    name: "数据分析师",
    prompt:
      "你是数据分析专家。请解读系统监控数据，识别趋势和异常，生成可视化报告建议。关注 QPS、延迟、GPU 利用率等关键指标。",
    category: "数据",
  },
  {
    id: "p4",
    name: "安全审计员",
    prompt:
      "你是信息安全审计专家。请审查系统安全日志，识别异常访问模式、潜在入侵行为，并建议安全加固措施。",
    category: "安全",
  },
  {
    id: "p5",
    name: "智能运维助手",
    prompt:
      "你是 AI 运维助手。帮助用户快速执行运维操作、查询系统状态、部署模型、分析日志。一切以中文交互，保持简洁友好。",
    category: "通用",
  },
]

/** 默认模型列表 */
export const DEFAULT_MODELS: ModelOption[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", isLocal: false },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", isLocal: false },
  { id: "deepseek-chat", name: "DeepSeek Chat", provider: "DeepSeek", isLocal: false },
  { id: "glm-4-flash", name: "GLM-4-Flash", provider: "Z.ai", isLocal: false },
  { id: "qwen-turbo", name: "Qwen Turbo", provider: "Alibaba", isLocal: false },
]

let messageIdCounter = 0
export const generateMessageId = (suffix = ""): string => {
  messageIdCounter += 1
  return `msg-${messageIdCounter}${suffix}`
}

export const getCurrentTimestamp = (): number => Date.now()

export const INITIAL_TIMESTAMP = Date.now()
