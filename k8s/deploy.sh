#!/bin/bash

# YYC3 Kubernetes部署脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 配置
NAMESPACE="yyc3"
K8S_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/k8s"

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

# 函数：检查kubectl是否安装
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_error "kubectl未安装，请先安装kubectl"
        exit 1
    fi
    print_success "kubectl已安装"
}

# 函数：检查集群连接
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        print_error "无法连接到Kubernetes集群"
        exit 1
    fi
    print_success "已连接到Kubernetes集群"
}

# 函数：创建命名空间
create_namespace() {
    kubectl apply -f "$K8S_DIR/namespace.yaml"
    print_success "命名空间创建完成"
}

# 函数：创建配置和密钥
create_config() {
    kubectl apply -f "$K8S_DIR/config.yaml"
    print_success "配置和密钥创建完成"
}

# 函数：部署Redis
deploy_redis() {
    kubectl apply -f "$K8S_DIR/redis.yaml"
    print_success "Redis部署完成"
}

# 函数：部署PostgreSQL
deploy_postgres() {
    kubectl apply -f "$K8S_DIR/postgres.yaml"
    print_success "PostgreSQL部署完成"
}

# 函数：部署应用
deploy_app() {
    kubectl apply -f "$K8S_DIR/app.yaml"
    print_success "应用部署完成"
}

# 函数：部署Ingress
deploy_ingress() {
    kubectl apply -f "$K8S_DIR/ingress.yaml"
    print_success "Ingress部署完成"
}

# 函数：部署安全配置
deploy_security() {
    kubectl apply -f "$K8S_DIR/security.yaml"
    print_success "安全配置部署完成"
}

# 函数：等待部署就绪
wait_for_deployment() {
    print_warning "等待部署就绪..."
    kubectl wait --for=condition=available --timeout=300s \
        deployment/redis -n "$NAMESPACE" || true
    kubectl wait --for=condition=available --timeout=300s \
        deployment/postgres -n "$NAMESPACE" || true
    kubectl wait --for=condition=available --timeout=300s \
        deployment/yyc3-app -n "$NAMESPACE" || true
    print_success "所有部署已就绪"
}

# 函数：查看部署状态
check_status() {
    echo ""
    echo "================================"
    echo "  部署状态"
    echo "================================"
    kubectl get all -n "$NAMESPACE"
}

# 函数：查看日志
view_logs() {
    local pod_name=${1:-yyc3-app}
    kubectl logs -f -n "$NAMESPACE" -l app="$pod_name" --tail=100
}

# 函数：删除部署
delete_deployment() {
    print_warning "删除部署..."
    kubectl delete namespace "$NAMESPACE"
    print_success "部署已删除"
}

# 函数：扩缩容应用
scale_app() {
    local replicas=${1:-3}
    kubectl scale deployment yyc3-app -n "$NAMESPACE" --replicas="$replicas"
    print_success "应用已扩缩容至 $replicas 个副本"
}

# 主函数
main() {
    echo "================================"
    echo "  YYC3 Kubernetes部署脚本"
    echo "================================"
    echo ""

    check_kubectl
    check_cluster

    case "${1:-deploy}" in
        deploy)
            create_namespace
            create_config
            deploy_redis
            deploy_postgres
            deploy_security
            deploy_app
            deploy_ingress
            wait_for_deployment
            check_status
            echo ""
            print_success "部署完成！"
            echo "访问地址: https://yyc3.com"
            ;;
        delete)
            delete_deployment
            ;;
        status)
            check_status
            ;;
        logs)
            view_logs "${2:-yyc3-app}"
            ;;
        scale)
            scale_app "${2:-3}"
            ;;
        *)
            echo "用法: $0 {deploy|delete|status|logs|scale}"
            echo ""
            echo "示例:"
            echo "  $0 deploy              # 部署应用"
            echo "  $0 delete              # 删除部署"
            echo "  $0 status              # 查看状态"
            echo "  $0 logs                # 查看应用日志"
            echo "  $0 logs redis          # 查看Redis日志"
            echo "  $0 scale 5             # 扩容至5个副本"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
