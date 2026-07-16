#!/bin/sh

# YYC³ — Next.js 16.2.x 兼容性补丁 (POSIX sh 兼容，无需 bash/perl)
#
# 补丁 1: /_global-error 预渲染 Bug
#   Next.js 16.2.x isPageStatic() 对 /_global-error 硬编码 appConfig: {}
#   导致 React SSR 绑定为 null，全部页面预渲染失败。
#   修复: appConfig: {} → appConfig: { revalidate: 0 }
#   参考: https://github.com/vercel/next.js/issues/93024
#
# 补丁 2: TypeScript 7.0 原生编译器兼容性
#   Next.js verify-typescript-setup.js 检查 typescript/lib/typescript.js
#   是否存在来判断 TypeScript 是否安装。TS 7.0 是原生 Go 编译器，无此文件，
#   导致 CI 静默崩溃。
#   修复: 检查路径改为 typescript/package.json
#
# 该补丁幂等且安全：已打过则跳过，匹配不到则视为已修复。
# 兼容 macOS BSD sed、GNU sed 和 BusyBox sed (Alpine)。

set -eu

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 可移植的 sed 替换函数（不依赖 -i 行为，兼容 BSD/GNU/BusyBox）
# 用法: sed_replace <pattern> <replacement> <file>
sed_replace() {
  _pattern="$1"
  _replacement="$2"
  _file="$3"
  _tmp="${_file}.patch.tmp"
  if sed "s|${_pattern}|${_replacement}|g" "$_file" > "$_tmp" 2>/dev/null; then
    mv "$_tmp" "$_file"
    return 0
  fi
  rm -f "$_tmp"
  return 1
}

# ==========================================
# 补丁 1: /_global-error 预渲染 Bug
# ==========================================
UTILS="$ROOT_DIR/node_modules/next/dist/build/utils.js"

if [ ! -f "$UTILS" ]; then
  echo "==> [patch-next] 跳过：未找到 $UTILS（依赖尚未安装？）"
else
  if grep -q "appConfig: { revalidate: 0 }" "$UTILS" 2>/dev/null; then
    echo "==> [patch-next] /_global-error 补丁已存在，跳过"
  elif grep -q "appConfig: {}" "$UTILS" 2>/dev/null; then
    # appConfig: {} 仅在 _global-error 早返回分支出现（其他地方用的是 appConfig =）
    sed_replace "appConfig: {}" "appConfig: { revalidate: 0 }" "$UTILS"
    if grep -q "appConfig: { revalidate: 0 }" "$UTILS" 2>/dev/null; then
      echo "==> [patch-next] 已修补 /_global-error 预渲染 Bug (appConfig: {} -> { revalidate: 0 })"
    else
      echo "==> [patch-next] 未匹配到目标代码 — 可能该 Next.js 版本已修复，跳过"
    fi
  else
    echo "==> [patch-next] /_global-error 补丁无需应用（无 appConfig: {}）"
  fi
fi

# ==========================================
# 补丁 2: TypeScript 7.0 兼容性
# ==========================================
VERIFY_TS="$ROOT_DIR/node_modules/next/dist/lib/verify-typescript-setup.js"

if [ -f "$VERIFY_TS" ]; then
  if grep -q "typescript/package.json" "$VERIFY_TS" 2>/dev/null && ! grep -q "typescript/lib/typescript.js" "$VERIFY_TS" 2>/dev/null; then
    echo "==> [patch-next] TS 7.0 兼容补丁已存在，跳过"
  elif grep -q "typescript/lib/typescript.js" "$VERIFY_TS" 2>/dev/null; then
    sed_replace "typescript/lib/typescript.js" "typescript/package.json" "$VERIFY_TS"
    if grep -q "typescript/package.json" "$VERIFY_TS" 2>/dev/null; then
      echo "==> [patch-next] 已修补 TypeScript 7.0 兼容性 (lib/typescript.js -> package.json)"
    else
      echo "==> [patch-next] TS 7.0 补丁替换失败，跳过"
    fi
  fi
fi
