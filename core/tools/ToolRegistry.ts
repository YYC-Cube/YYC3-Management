// core/tools/ToolRegistry.ts
import { AITool, ToolResult, AIContext, ToolUsageRecord, ToolRelevanceScore } from './types';

export class ToolRegistry {
  private tools: Map<string, AITool> = new Map();
  private toolGroups: Map<string, string[]> = new Map();
  private usageHistory: ToolUsageRecord[] = [];

  registerTool(tool: AITool): void {
    this.tools.set(tool.name, tool);

    // 自动分组
    if (tool.category) {
      if (!this.toolGroups.has(tool.category)) {
        this.toolGroups.set(tool.category, []);
      }
      this.toolGroups.get(tool.category)!.push(tool.name);
    }
  }

  async executeTool(toolName: string, parameters: any): Promise<ToolResult> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    try {
      const startTime = Date.now();
      const result = await tool.execute(parameters);
      const executionTime = Date.now() - startTime;

      // 记录工具使用
      await this.recordToolUsage(toolName, parameters, result, executionTime);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Tool execution failed: ${errorMessage}`);
    }
  }

  private async recordToolUsage(toolName: string, parameters: any, result: ToolResult, executionTime: number): Promise<void> {
    const record: ToolUsageRecord = {
      toolName,
      timestamp: new Date(),
      parameters,
      result,
      executionTime
    };
    this.usageHistory.push(record);
    
    // 保持最近1000条记录
    if (this.usageHistory.length > 1000) {
      this.usageHistory = this.usageHistory.slice(-1000);
    }
  }

  getToolsByCategory(category: string): AITool[] {
    const toolNames = this.toolGroups.get(category) || [];
    return toolNames.map(name => this.tools.get(name)!);
  }

  async suggestTools(context: AIContext): Promise<AITool[]> {
    // 基于上下文推荐相关工具
    const relevantTools: AITool[] = [];

    for (const tool of this.tools.values()) {
      const relevance = await this.calculateToolRelevance(tool, context);
      if (relevance > 0.7) { // 阈值可配置
        relevantTools.push(tool);
      }
    }

    // 计算每个工具的相关性分数
    const toolsWithScores = await Promise.all(
      relevantTools.map(async (tool) => ({
        tool,
        score: await this.calculateToolRelevance(tool, context)
      }))
    );

    // 按分数排序并返回前5个
    return toolsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.tool);
  }

  private async calculateToolRelevance(tool: AITool, context: AIContext): Promise<number> {
    let score = 0;
    const reasons: string[] = [];

    // 基于查询文本匹配
    if (context.query && tool.description) {
      const queryLower = context.query.toLowerCase();
      const descLower = tool.description.toLowerCase();
      
      if (descLower.includes(queryLower)) {
        score += 0.5;
        reasons.push('描述匹配');
      }
    }

    // 基于意图匹配
    if (context.intent) {
      if (tool.category && tool.category.includes(context.intent)) {
        score += 0.3;
        reasons.push('意图匹配');
      }
    }

    // 基于历史使用
    const recentUsage = this.usageHistory.filter(
      record => record.toolName === tool.name && 
      Date.now() - record.timestamp.getTime() < 3600000 // 1小时内
    );
    if (recentUsage.length > 0) {
      score += 0.2 * Math.min(recentUsage.length, 3) / 3;
      reasons.push('历史使用');
    }

    return Math.min(score, 1.0);
  }
}

// core/tools/core-tools.ts
async function performWebSearch(query: string, maxResults?: number): Promise<any[]> {
  // 模拟网络搜索
  return [
    {
      title: `搜索结果: ${query}`,
      url: 'https://example.com',
      snippet: '这是一个模拟的搜索结果',
      timestamp: new Date().toISOString()
    }
  ];
}

async function analyzeData(data: any, analysisType: string): Promise<any> {
  // 模拟数据分析
  return {
    type: analysisType,
    summary: '数据分析完成',
    insights: [
      '数据点1',
      '数据点2',
      '数据点3'
    ],
    statistics: {
      count: Object.keys(data).length,
      timestamp: new Date().toISOString()
    }
  };
}

async function generateDocument(template: string, variables: any, format?: string): Promise<string> {
  // 模拟文档生成
  let content = template;
  
  for (const [key, value] of Object.entries(variables)) {
    content = content.replace(`{{${key}}}`, String(value));
  }
  
  return content;
}

export const CORE_TOOLS: AITool[] = [
  {
    name: 'web_search',
    description: '搜索最新网络信息',
    category: 'research',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: '搜索查询' },
        max_results: { type: 'number', description: '最大结果数', default: 5 }
      },
      required: ['query']
    },
    execute: async (params: { query: string; max_results?: number }) => {
      // 实现网络搜索逻辑
      const results = await performWebSearch(params.query, params.max_results);
      return { success: true, data: results };
    }
  },
  {
    name: 'data_analysis',
    description: '分析提供的数据',
    category: 'analysis',
    parameters: {
      type: 'object',
      properties: {
        data: { type: 'object', description: '要分析的数据' },
        analysis_type: {
          type: 'string',
          enum: ['statistical', 'trend', 'pattern', 'correlation'],
          description: '分析类型'
        }
      },
      required: ['data', 'analysis_type']
    },
    execute: async (params: { data: any; analysis_type: string }) => {
      const analysis = await analyzeData(params.data, params.analysis_type);
      return { success: true, insights: analysis };
    }
  },
  {
    name: 'document_generation',
    description: '生成文档内容',
    category: 'content',
    parameters: {
      type: 'object',
      properties: {
        template: { type: 'string', description: '文档模板' },
        variables: { type: 'object', description: '模板变量' },
        format: { type: 'string', description: '文档格式', enum: ['markdown', 'html', 'pdf'], default: 'markdown' }
      },
      required: ['template', 'variables']
    },
    execute: async (params: { template: string; variables: any; format?: string }) => {
      const document = await generateDocument(params.template, params.variables, params.format);
      return { success: true, document };
    }
  }
];
