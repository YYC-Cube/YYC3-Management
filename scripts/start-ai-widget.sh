#!/bin/bash

###############################################################################
# YYC³ AI智能浮窗系统 - 快速启动脚本
# 
# 描述: 自动配置环境并启动AI浮窗演示
# 作者: YYC³
# 版本: 1.0.0
# 创建时间: 2025-12-09
###############################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印标题
echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        YYC³ AI智能浮窗系统 - 快速启动脚本                   ║
║        Intelligent AI Floating Widget System                ║
║                                                              ║
║        版本: 1.0.0                                           ║
║        作者: YYC³ Team                                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# 1. 检查Node.js和pnpm
print_info "检查运行环境..."

if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装！请先安装Node.js: https://nodejs.org/"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm 未安装，正在安装..."
    npm install -g pnpm
fi

print_success "运行环境检查完成"
echo ""

# 2. 安装依赖
print_info "安装项目依赖..."
pnpm install
print_success "依赖安装完成"
echo ""

# 3. 检查环境变量
print_info "检查环境变量配置..."

if [ ! -f .env.local ]; then
    print_warning ".env.local 文件不存在，正在创建..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        print_success "已从 .env.example 创建 .env.local"
        print_warning "请编辑 .env.local 文件并填入您的API密钥"
        print_info "支持的模型提供商:"
        echo "  - 智谱AI (ZHIPU_API_KEY)"
        echo "  - 阿里云通义千问 (ALIBABA_API_KEY)"
        echo "  - 百度文心一言 (BAIDU_API_KEY, BAIDU_SECRET_KEY)"
        echo "  - Ollama本地 (OLLAMA_BASE_URL)"
        echo ""
        read -p "是否现在配置API密钥? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            ${EDITOR:-nano} .env.local
        else
            print_warning "请稍后手动编辑 .env.local 文件"
        fi
    else
        print_error ".env.example 文件不存在！"
        exit 1
    fi
else
    print_success "环境变量配置文件已存在"
fi
echo ""

# 4. 构建项目
print_info "检查TypeScript类型..."
pnpm type-check || print_warning "存在类型错误，但不影响运行"
echo ""

# 5. 启动开发服务器
print_info "启动开发服务器..."
echo ""
print_success "✨ AI智能浮窗系统正在启动..."
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📱 访问以下URL体验AI浮窗系统:${NC}"
echo -e "${BLUE}   主应用: http://localhost:3000${NC}"
echo -e "${BLUE}   演示页面: http://localhost:3000/ai-floating-demo${NC}"
echo ""
echo -e "${YELLOW}⚡ 快捷键:${NC}"
echo -e "${BLUE}   Ctrl/Cmd + K - 唤起/关闭AI助手${NC}"
echo ""
echo -e "${YELLOW}🔧 功能特性:${NC}"
echo "   ✓ 智能自治引擎 (AgenticCore)"
echo "   ✓ 可拖拽UI组件"
echo "   ✓ 多模型支持 (智谱/阿里/百度/Ollama)"
echo "   ✓ 全局快捷键"
echo "   ✓ 事件驱动架构"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
print_info "按 Ctrl+C 停止服务器"
echo ""

# 启动Next.js开发服务器
pnpm dev
