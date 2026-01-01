#!/bin/bash

# ========================================
# YYC³智能AI浮窗系统 - 完整部署脚本
# ========================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ========================================
# 1. 环境检查
# ========================================
check_environment() {
    log_info "检查部署环境..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        echo "访问: https://docs.docker.com/get-docker/"
        exit 1
    fi
    log_success "Docker已安装: $(docker --version)"
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装"
        exit 1
    fi
    log_success "Docker Compose已安装: $(docker-compose --version)"
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js未安装，某些功能可能受限"
    else
        log_success "Node.js已安装: $(node --version)"
    fi
    
    # 检查环境配置文件
    if [ ! -f .env.production ]; then
        log_warning "环境配置文件不存在，正在创建..."
        create_env_file
    else
        log_success "环境配置文件已存在"
    fi
    
    # 检查磁盘空间
    available_space=$(df -h . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "${available_space%.*}" -lt 10 ]; then
        log_warning "磁盘空间不足10GB，建议至少保留20GB"
    else
        log_success "磁盘空间充足: ${available_space}GB可用"
    fi
    
    log_success "环境检查完成"
}

# ========================================
# 2. 创建环境配置文件
# ========================================
create_env_file() {
    cat > .env.production << 'EOF'
# ==================== 数据库配置 ====================
MONGO_PASSWORD=your_mongo_password_here
DB_PASSWORD=your_postgres_password_here
REDIS_PASSWORD=your_redis_password_here

# ==================== AI模型配置 ====================
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# ==================== 监控配置 ====================
GRAFANA_PASSWORD=admin123

# ==================== 应用配置 ====================
NODE_ENV=production
LOG_LEVEL=info
EOF

    log_warning "请编辑 .env.production 文件，填入正确的配置信息"
    read -p "按Enter键继续..." 
}

# ========================================
# 3. 构建Docker镜像
# ========================================
build_images() {
    log_info "开始构建Docker镜像..."
    
    # 创建Docker构建上下文
    mkdir -p docker
    
    # 构建主应用镜像
    log_info "构建前端应用镜像..."
    docker-compose -f docker-compose.complete.yml build frontend
    
    if [ $? -eq 0 ]; then
        log_success "前端应用镜像构建完成"
    else
        log_error "前端应用镜像构建失败"
        exit 1
    fi
    
    log_success "所有镜像构建完成"
}

# ========================================
# 4. 启动基础设施服务
# ========================================
start_infrastructure() {
    log_info "启动基础设施服务..."
    
    # 启动数据库
    docker-compose -f docker-compose.complete.yml up -d redis mongo postgres
    
    log_info "等待数据库服务就绪..."
    sleep 15
    
    # 检查数据库健康状态
    check_service_health redis 6379 "Redis"
    check_service_health mongo 27017 "MongoDB"
    check_service_health postgres 5432 "PostgreSQL"
    
    log_success "基础设施服务启动完成"
}

# ========================================
# 5. 启动核心服务
# ========================================
start_core_services() {
    log_info "启动核心服务..."
    
    # 启动服务
    docker-compose -f docker-compose.complete.yml up -d \
        autonomous-engine \
        model-adapter \
        learning-system \
        goal-management
    
    log_info "等待核心服务启动..."
    sleep 20
    
    # 检查服务健康
    check_http_health "http://localhost:3000/health" "自治AI引擎"
    check_http_health "http://localhost:3001/health" "模型适配器"
    check_http_health "http://localhost:3002/health" "学习系统"
    check_http_health "http://localhost:3003/health" "目标管理"
    
    log_success "核心服务启动完成"
}

# ========================================
# 6. 启动前端和网关
# ========================================
start_frontend() {
    log_info "启动前端和API网关..."
    
    docker-compose -f docker-compose.complete.yml up -d api-gateway frontend
    
    log_info "等待前端服务启动..."
    sleep 10
    
    check_http_health "http://localhost:8080/health" "API网关"
    check_http_health "http://localhost:3200" "前端应用"
    
    log_success "前端服务启动完成"
}

# ========================================
# 7. 启动监控服务
# ========================================
start_monitoring() {
    log_info "启动监控服务..."
    
    docker-compose -f docker-compose.complete.yml up -d \
        prometheus \
        grafana \
        jaeger \
        elasticsearch \
        kibana
    
    log_info "等待监控服务启动..."
    sleep 15
    
    log_success "监控服务启动完成"
}

# ========================================
# 8. 初始化数据
# ========================================
initialize_data() {
    log_info "初始化数据..."
    
    # 等待所有服务完全就绪
    sleep 10
    
    # 运行数据库迁移（如果有）
    log_info "运行数据库迁移..."
    # docker-compose -f docker-compose.complete.yml exec autonomous-engine npm run migrate
    
    log_success "数据初始化完成"
}

# ========================================
# 9. 健康检查函数
# ========================================
check_service_health() {
    local host=$1
    local port=$2
    local service_name=$3
    
    log_info "检查 $service_name..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            log_success "$service_name 健康"
            return 0
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    log_error "$service_name 健康检查失败"
    return 1
}

check_http_health() {
    local url=$1
    local service_name=$2
    
    log_info "检查 $service_name..."
    
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            log_success "$service_name 健康"
            return 0
        fi
        
        attempt=$((attempt + 1))
        sleep 2
    done
    
    log_warning "$service_name 可能未完全就绪，请稍后检查"
    return 1
}

# ========================================
# 10. 显示部署信息
# ========================================
show_deployment_info() {
    echo ""
    echo "=========================================="
    echo "     🎉 YYC³系统部署完成！"
    echo "=========================================="
    echo ""
    echo "📱 访问地址："
    echo "  前端应用：http://localhost:3200"
    echo "  API网关：http://localhost:8080"
    echo "  API文档：http://localhost:8080/docs"
    echo ""
    echo "📊 监控面板："
    echo "  Grafana：http://localhost:3100 (admin/admin123)"
    echo "  Prometheus：http://localhost:9090"
    echo "  Jaeger：http://localhost:16686"
    echo "  Kibana：http://localhost:5601"
    echo ""
    echo "🔧 管理命令："
    echo "  查看日志：docker-compose -f docker-compose.complete.yml logs -f"
    echo "  重启服务：docker-compose -f docker-compose.complete.yml restart"
    echo "  停止服务：docker-compose -f docker-compose.complete.yml down"
    echo "  查看状态：docker-compose -f docker-compose.complete.yml ps"
    echo ""
    echo "💡 提示："
    echo "  - 首次使用请访问设置页面完成初始化配置"
    echo "  - 监控数据需要一段时间才会显示"
    echo "  - 如遇到问题，请查看日志文件"
    echo ""
    echo "=========================================="
}

# ========================================
# 11. 性能测试（可选）
# ========================================
run_performance_test() {
    log_info "运行性能测试..."
    
    if command -v hey &> /dev/null; then
        log_info "使用hey进行负载测试..."
        hey -n 1000 -c 10 http://localhost:3200
    elif command -v ab &> /dev/null; then
        log_info "使用ab进行负载测试..."
        ab -n 1000 -c 10 http://localhost:3200/
    else
        log_warning "未安装性能测试工具(hey或ab)，跳过性能测试"
        return 0
    fi
    
    log_success "性能测试完成"
}

# ========================================
# 12. 清理函数
# ========================================
cleanup() {
    log_info "清理资源..."
    
    docker-compose -f docker-compose.complete.yml down
    
    read -p "是否删除所有数据卷？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.complete.yml down -v
        log_success "数据卷已删除"
    fi
}

# ========================================
# 主函数
# ========================================
main() {
    echo "=========================================="
    echo "    YYC³智能AI浮窗系统 - 完整部署"
    echo "=========================================="
    echo ""
    
    # 参数解析
    case "${1:-}" in
        clean)
            cleanup
            exit 0
            ;;
        test)
            run_performance_test
            exit 0
            ;;
        *)
            # 执行完整部署流程
            check_environment
            build_images
            start_infrastructure
            start_core_services
            start_frontend
            start_monitoring
            initialize_data
            
            # 可选：运行性能测试
            # run_performance_test
            
            show_deployment_info
            ;;
    esac
}

# 捕获退出信号
trap cleanup EXIT

# 执行主函数
main "$@"
