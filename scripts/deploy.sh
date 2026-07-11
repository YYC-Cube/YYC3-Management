#!/bin/bash

# YYC3 Docker部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：打印成功消息
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 函数：打印错误消息
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 函数：打印警告消息
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 函数：检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    print_success "Docker已安装"
}

# 函数：检查Docker Compose是否安装
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    print_success "Docker Compose已安装"
}

# 函数：创建必要的目录
create_directories() {
    mkdir -p ssl
    mkdir -p docker-data/redis
    mkdir -p docker-data/postgres
    print_success "创建必要的目录"
}

# 函数：生成自签名SSL证书
generate_ssl_cert() {
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        print_warning "生成自签名SSL证书..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout ssl/key.pem \
            -out ssl/cert.pem \
            -subj "/C=CN/ST=Beijing/L=Beijing/O=YYC3/OU=Development/CN=localhost"
        print_success "SSL证书生成完成"
    else
        print_success "SSL证书已存在"
    fi
}

# 函数：创建环境变量文件
create_env_file() {
    if [ ! -f .env.docker ]; then
        print_warning "创建.env.docker文件..."
        cp .env.docker.example .env.docker 2>/dev/null || cat > .env.docker << EOF
# Docker环境变量配置

# 应用配置
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# 数据库配置
DATABASE_URL=postgresql://yyc3user:yyc3password@postgres:5432/yyc3db

# Redis配置
REDIS_URL=redis://redis:6379

# Next.js配置
NEXT_PUBLIC_API_URL=https://api.yyc3.com
NEXT_PUBLIC_WS_URL=wss://api.yyc3.com

# AI服务配置
AI_MODEL_PROVIDER=openai
AI_API_KEY=your-api-key-here
AI_MODEL=gpt-4

# 安全配置
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# 监控配置
SENTRY_DSN=your-sentry-dsn-here
LOG_LEVEL=info

# 功能开关
ENABLE_ANALYTICS=true
ENABLE_AI_FEATURES=true
ENABLE_REALTIME=true
EOF
        print_success ".env.docker文件创建完成"
        print_warning "请编辑.env.docker文件，配置必要的环境变量"
    else
        print_success ".env.docker文件已存在"
    fi
}

# 函数：构建Docker镜像
build_images() {
    print_warning "构建Docker镜像..."
    docker-compose build
    print_success "Docker镜像构建完成"
}

# 函数：启动服务
start_services() {
    print_warning "启动服务..."
    docker-compose up -d
    print_success "服务启动完成"
}

# 函数：停止服务
stop_services() {
    print_warning "停止服务..."
    docker-compose down
    print_success "服务已停止"
}

# 函数：查看日志
view_logs() {
    docker-compose logs -f
}

# 函数：查看服务状态
check_status() {
    docker-compose ps
}

# 函数：清理
cleanup() {
    print_warning "清理Docker资源..."
    docker-compose down -v
    print_success "清理完成"
}

# 主函数
main() {
    echo "================================"
    echo "  YYC3 Docker部署脚本"
    echo "================================"
    echo ""

    check_docker
    check_docker_compose
    create_directories
    generate_ssl_cert
    create_env_file

    case "${1:-start}" in
        start)
            build_images
            start_services
            echo ""
            print_success "部署完成！"
            echo "应用地址: http://localhost"
            echo "健康检查: http://localhost/health"
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            start_services
            ;;
        logs)
            view_logs
            ;;
        status)
            check_status
            ;;
        cleanup)
            cleanup
            ;;
        *)
            echo "用法: $0 {start|stop|restart|logs|status|cleanup}"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
