#!/bin/bash

# YYC³ — Next.js 16.2.x 预渲染 Bug 补丁
#
# 问题：Next.js 16.2.x 的 isPageStatic() 对 /_global-error 路由硬编码返回
#       appConfig: {}（空对象）。build/index.js 因 appConfig.revalidate !== 0
#       为真，将 /_global-error 加入 staticPaths 并尝试预渲染；此时该路由没有
#       根布局来初始化 React SSR 绑定，导致 React 解析为 null，抛出
#       "TypeError: Cannot read properties of null (reading 'use')"，
#       并级联使全部页面预渲染失败，静态导出 (output: 'export') 无法生成。
#
# 修复：将 appConfig: {} 改为 appConfig: { revalidate: 0 }，阻止该路由被加入
#       staticPaths，从而跳过对 /_global-error 的预渲染。
#
# 参考：https://github.com/vercel/next.js/issues/93024
#
# 该补丁在 node_modules 上执行（node_modules 不入库），因此作为 CI 预构建步骤
# 每次安装后、构建前运行。对未来已修复的 Next.js 版本幂等且安全：
# 若匹配不到目标代码则视为已修复，打印提示后正常退出（不阻断构建）。
#
# 仅作用于 node_modules/next/dist/build/utils.js 的 _global-error 早返回分支，
# 不影响 standalone (Docker) 构建行为。

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UTILS="$ROOT_DIR/node_modules/next/dist/build/utils.js"

if [ ! -f "$UTILS" ]; then
  echo "==> [patch-next] 跳过：未找到 $UTILS（依赖尚未安装？）"
  exit 0
fi

# 已打过补丁则直接退出
if grep -q "appConfig: { revalidate: 0 }" "$UTILS" 2>/dev/null; then
  echo "==> [patch-next] /_global-error 补丁已存在，跳过"
else
  # 目标：仅替换 _global-error 早返回分支内的 appConfig: {}
  # 用 perl 做多行精确匹配，避免误伤其他 appConfig 赋值
  if perl -0pi -e 's/(isNextImageImported: false,\s*\n\s*)appConfig: \{\}/$1appConfig: { revalidate: 0 }/' "$UTILS"; then
    if grep -q "appConfig: { revalidate: 0 }" "$UTILS"; then
      echo "==> [patch-next] 已修补 /_global-error 预渲染 Bug (appConfig: {} → { revalidate: 0 })"
    else
      echo "==> [patch-next] 未匹配到目标代码 —— 可能该 Next.js 版本已修复，跳过"
    fi
  else
    echo "==> [patch-next] perl 替换失败，跳过（不阻断构建）"
  fi
fi

# ==========================================
# 补丁 2：TypeScript 7.0 兼容性
# ==========================================
# Next.js 16.2.x 的 verify-typescript-setup.js 检查 typescript/lib/typescript.js
# 是否存在来判断 TypeScript 是否安装。但 TypeScript 7.0 是原生 Go 编译器，
# 不再有 lib/typescript.js 文件，导致 Next.js 在 CI 中误判 TypeScript 缺失并
# 调用 process.exit(1) 静默崩溃（CI 不允许自动安装依赖）。
#
# 修复：将检查路径从 typescript/lib/typescript.js 改为 typescript/package.json
#
VERIFY_TS="$ROOT_DIR/node_modules/next/dist/lib/verify-typescript-setup.js"

if [ -f "$VERIFY_TS" ]; then
  if grep -q "typescript/package.json" "$VERIFY_TS" 2>/dev/null && ! grep -q "typescript/lib/typescript.js" "$VERIFY_TS" 2>/dev/null; then
    echo "==> [patch-next] TS 7.0 兼容补丁已存在，跳过"
  elif grep -q "typescript/lib/typescript.js" "$VERIFY_TS" 2>/dev/null; then
    sed -i.bak "s|typescript/lib/typescript.js|typescript/package.json|g" "$VERIFY_TS" && rm -f "$VERIFY_TS.bak"
    if grep -q "typescript/package.json" "$VERIFY_TS" 2>/dev/null; then
      echo "==> [patch-next] 已修补 TypeScript 7.0 兼容性 (lib/typescript.js → package.json)"
    else
      echo "==> [patch-next] TS 7.0 补丁替换失败，跳过"
    fi
  fi
fi
