#!/bin/bash

# YYC³ 文件标头批量添加脚本
# 
# @fileoverview 批量为 TypeScript/JavaScript 文件添加 YYC³ 标准化标头
# @author YYC³
# @version 1.0.0
# @created 2025-12-09
# @copyright Copyright (c) 2025 YYC³
# @license MIT

echo "======================================"
echo "YYC³ 文件标头批量添加工具"
echo "======================================"
echo ""

# 获取当前日期
TODAY=$(date +%Y-%m-%d)

# 定义文件描述映射
declare -A DESCRIPTIONS=(
  # Components
  ["ai-assistant.tsx"]="AI智能助手组件|提供多模型AI对话、业务分析、智能洞察等功能"
  ["dashboard-content.tsx"]="仪表板内容组件|展示业务数据、KPI指标和实时统计信息"
  ["sidebar.tsx"]="侧边栏导航组件|应用主导航菜单，支持多级菜单和主题切换"
  ["header.tsx"]="页面头部组件|包含搜索、通知、用户信息等功能"
  ["customer-management.tsx"]="客户管理组件|客户信息管理、生命周期跟踪等功能"
  ["task-management.tsx"]="任务管理组件|任务创建、分配、进度跟踪等功能"
  ["finance-module.tsx"]="财务管理组件|收支管理、报表生成、预算控制等功能"
  ["okr-management.tsx"]="OKR管理组件|目标设定、关键结果跟踪、绩效评估等功能"
  
  # Lib
  ["ai-service.ts"]="AI服务接口|统一的AI模型调用接口，支持多种AI模型"
  ["ai-models.ts"]="AI模型配置|定义支持的AI模型列表和配置信息"
  ["api.ts"]="API客户端|封装API请求，提供统一的接口调用方式"
  ["utils.ts"]="工具函数库|提供常用的工具函数和辅助方法"
  ["config.ts"]="应用配置|应用全局配置信息"
  ["theme-colors.ts"]="主题颜色配置|定义应用主题颜色方案"
)

# 统计变量
total_files=0
processed_files=0
skipped_files=0
error_files=0

# 处理单个文件
process_file() {
  local filepath=$1
  local filename=$(basename "$filepath")
  
  total_files=$((total_files + 1))
  
  # 检查文件是否已有标头
  if grep -q "@fileoverview" "$filepath"; then
    echo "⏭️  跳过: $filename (已有标头)"
    skipped_files=$((skipped_files + 1))
    return
  fi
  
  # 获取文件描述
  local desc="${DESCRIPTIONS[$filename]}"
  if [ -z "$desc" ]; then
    desc="$filename|自动生成的组件或模块"
  fi
  
  local title=$(echo "$desc" | cut -d'|' -f1)
  local description=$(echo "$desc" | cut -d'|' -f2)
  
  # 生成标头
  local header="/**
 * @fileoverview $title
 * @description $description
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified $TODAY
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

"
  
  # 创建临时文件
  local tempfile="${filepath}.tmp"
  
  # 添加标头
  echo "$header" > "$tempfile"
  cat "$filepath" >> "$tempfile"
  
  # 替换原文件
  if mv "$tempfile" "$filepath"; then
    echo "✅ 已处理: $filename"
    processed_files=$((processed_files + 1))
  else
    echo "❌ 失败: $filename"
    error_files=$((error_files + 1))
    rm -f "$tempfile"
  fi
}

# 主函数
main() {
  echo "开始处理文件..."
  echo ""
  
  # 处理 components 目录
  if [ -d "./components" ]; then
    echo "📂 处理 components 目录..."
    while IFS= read -r -d '' file; do
      process_file "$file"
    done < <(find ./components -maxdepth 1 -name "*.tsx" -o -name "*.ts" -print0)
  fi
  
  # 处理 lib 目录
  if [ -d "./lib" ]; then
    echo ""
    echo "📂 处理 lib 目录..."
    while IFS= read -r -d '' file; do
      process_file "$file"
    done < <(find ./lib -maxdepth 1 -name "*.ts" -print0)
  fi
  
  # 处理 app 目录
  if [ -d "./app" ]; then
    echo ""
    echo "📂 处理 app 目录..."
    while IFS= read -r -d '' file; do
      process_file "$file"
    done < <(find ./app -maxdepth 1 -name "*.tsx" -o -name "*.ts" -print0)
  fi
  
  # 显示统计信息
  echo ""
  echo "======================================"
  echo "处理完成！"
  echo "======================================"
  echo "总文件数: $total_files"
  echo "已处理: $processed_files"
  echo "已跳过: $skipped_files"
  echo "失败: $error_files"
  echo "======================================"
}

# 执行主函数
main
