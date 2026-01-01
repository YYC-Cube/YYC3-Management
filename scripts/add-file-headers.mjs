/**
 * @fileoverview 文件标头批量添加工具
 * @description 为TypeScript/JavaScript文件批量添加YYC³标准化标头
 * @author YYC³
 * @version 1.0.0
 * @created 2025-12-09
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件描述映射
const DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  // Components
  'ai-assistant.tsx': {
    title: 'AI智能助手组件',
    description: '提供多模型AI对话、业务分析、智能洞察等功能'
  },
  'dashboard-content.tsx': {
    title: '仪表板内容组件',
    description: '展示业务数据、KPI指标和实时统计信息'
  },
  'sidebar.tsx': {
    title: '侧边栏导航组件',
    description: '应用主导航菜单，支持多级菜单和主题切换'
  },
  'header.tsx': {
    title: '页面头部组件',
    description: '包含搜索、通知、用户信息等功能'
  },
  // Lib
  'ai-service.ts': {
    title: 'AI服务接口',
    description: '统一的AI模型调用接口，支持多种AI模型'
  },
  'ai-models.ts': {
    title: 'AI模型配置',
    description: '定义支持的AI模型列表和配置信息'
  },
  'api.ts': {
    title: 'API客户端',
    description: '封装API请求，提供统一的接口调用方式'
  },
  'utils.ts': {
    title: '工具函数库',
    description: '提供常用的工具函数和辅助方法'
  }
};

// 生成文件标头
function generateHeader(filename: string): string {
  const today = new Date().toISOString().split('T')[0];
  const desc = DESCRIPTIONS[filename] || {
    title: filename,
    description: '自动生成的组件或模块'
  };
  
  return `/**
 * @fileoverview ${desc.title}
 * @description ${desc.description}
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified ${today}
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

`;
}

// 处理单个文件
function processFile(filePath: string): { success: boolean; skipped: boolean; error?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否已有标头
    if (content.includes('@fileoverview')) {
      console.log(`⏭️  跳过: ${path.basename(filePath)} (已有标头)`);
      return { success: true, skipped: true };
    }
    
    const filename = path.basename(filePath);
    const header = generateHeader(filename);
    const newContent = header + content;
    
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ 已处理: ${filename}`);
    return { success: true, skipped: false };
  } catch (error) {
    console.error(`❌ 失败: ${path.basename(filePath)} - ${error}`);
    return { success: false, skipped: false, error: String(error) };
  }
}

// 主函数
async function main() {
  console.log('======================================');
  console.log('YYC³ 文件标头批量添加工具');
  console.log('======================================\n');
  
  const stats = {
    total: 0,
    processed: 0,
    skipped: 0,
    errors: 0
  };
  
  const projectRoot = path.resolve(__dirname, '..');
  const dirs = ['components', 'lib', 'app'];
  
  for (const dir of dirs) {
    const dirPath = path.join(projectRoot, dir);
    
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  目录不存在: ${dir}\n`);
      continue;
    }
    
    console.log(`📂 处理 ${dir} 目录...`);
    
    try {
      const files = fs.readdirSync(dirPath);
      const tsFiles = files.filter(file => 
        (file.endsWith('.ts') || file.endsWith('.tsx')) && 
        !file.endsWith('.d.ts')
      );
      
      for (const file of tsFiles) {
        const filePath = path.join(dirPath, file);
        stats.total++;
        
        const result = processFile(filePath);
        if (result.skipped) {
          stats.skipped++;
        } else if (result.success) {
          stats.processed++;
        } else {
          stats.errors++;
        }
      }
      
      console.log('');
    } catch (error) {
      console.error(`❌ 处理目录失败: ${dir} - ${error}\n`);
    }
  }
  
  console.log('======================================');
  console.log('处理完成！');
  console.log('======================================');
  console.log(`总文件数: ${stats.total}`);
  console.log(`已处理: ${stats.processed}`);
  console.log(`已跳过: ${stats.skipped}`);
  console.log(`失败: ${stats.errors}`);
  console.log('======================================');
}

main().catch(console.error);
