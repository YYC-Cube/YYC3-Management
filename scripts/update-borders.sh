#!/bin/bash

# YYC³全局UI更新脚本 - 自动将左侧边框改为右侧边框
# 使用方法: ./scripts/update-borders.sh

echo "🚀 开始批量更新UI边框样式..."

# 定义颜色映射（根据功能模块）
declare -A color_map=(
  ["customers"]="green"
  ["tasks"]="orange"
  ["projects"]="orange"
  ["finance"]="emerald"
  ["analytics"]="cyan"
  ["communication"]="purple"
  ["system-settings"]="slate"
  ["user-management"]="slate"
  ["security"]="slate"
  ["dashboard"]="blue"
  ["ai-"]="indigo"
)

# 计数器
total_files=0
updated_files=0

# 查找所有包含 border-l-4 的tsx文件
echo "📝 扫描需要更新的文件..."
files=$(grep -rl "border-l-4 border-l-" app components --include="*.tsx")

for file in $files; do
  ((total_files++))
  echo "处理: $file"
  
  # 检测模块类型来决定颜色
  color="blue"  # 默认颜色
  for key in "${!color_map[@]}"; do
    if [[ $file == *"$key"* ]]; then
      color="${color_map[$key]}"
      break
    fi
  done
  
  # 备份原文件
  cp "$file" "$file.bak"
  
  # 使用sed批量替换（macOS兼容版本）
  # 1. 左边框改为右边框
  sed -i '' 's/border-l-4 border-l-\([a-z]*-[0-9]*\)/border-r-[5px] border-r-\1/g' "$file"
  
  # 2. 添加阴影效果（如果还没有）
  sed -i '' 's/border-r-\[5px\] border-r-\([a-z]*-[0-9]*\)"/border-r-[5px] border-r-\1 shadow-[4px_0_12px_rgba(0,0,0,0.1)]"/g' "$file"
  
  # 检查是否有变化
  if ! diff -q "$file" "$file.bak" > /dev/null; then
    ((updated_files++))
    echo "✅ 已更新: $file"
    rm "$file.bak"
  else
    echo "⏭️  跳过: $file (无需更新)"
    mv "$file.bak" "$file"
  fi
done

echo ""
echo "🎉 批量更新完成！"
echo "📊 统计信息:"
echo "   - 扫描文件: $total_files"
echo "   - 已更新文件: $updated_files"
echo ""
echo "💡 提示: 请运行 'npm run build' 验证更新无误"
