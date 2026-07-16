#!/bin/bash

# YYC³ — 静态导出(GitHub Pages)预构建准备脚本
#
# 背景：项目同时支持两种构建产物
#   1. output: 'standalone' (Docker) —— 拥有完整的 REST API 后端 (app/api/**)
#   2. output: 'export'      (GitHub Pages) —— 纯静态前端，无后端
#
# Next.js 的 output: 'export' 不支持 API 路由 (route handlers) 与 middleware/proxy，
# 动态路由 (/api/.../[id]) 与流式路由 (/api/events/stream) 会导致构建报错：
#   "Page ... is missing generateStaticParams() so it cannot be used with output: export"
#
# Pages 部署本就不运行后端 (见 AGENTS.md)，因此在导出构建前移除后端代码，
# 既能让 Pages 构建通过，又完全不影响 Docker (standalone) 构建。
#
# 用法：仅在 deploy-pages.yml 的导出构建步骤前调用一次。

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> 准备静态导出构建 (GitHub Pages)"

# 1. 移除 API 路由目录 (与 output: 'export' 不兼容)
if [ -d "app/api" ]; then
  echo "    移除 app/api (静态导出不支持 API 路由)"
  rm -rf app/api
fi

# 2. 移除 middleware / proxy (与 output: 'export' 不兼容)
for f in middleware.ts middleware.js proxy.ts proxy.js; do
  if [ -f "$f" ]; then
    echo "    移除 $f (静态导出不支持 middleware/proxy)"
    rm -f "$f"
  fi
done

echo "==> 静态导出准备完成"
