#!/bin/bash

# YYC³-MANA Security Scan Script
# 安全扫描脚本

set -e

echo "🔒 YYC³-MANA Security Scan"
echo "============================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：打印带颜色的消息
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. 运行 npm audit
echo "📋 1/3 Running npm audit..."
echo "----------------------------"
if bun audit; then
    print_success "No vulnerabilities found"
else
    print_warning "Vulnerabilities found. Run 'bun audit fix' to attempt auto-fix."
fi
echo ""

# 2. 运行 bun pm cache rm (清理缓存)
echo "🗑️  2/3 Cleaning package cache..."
echo "----------------------------"
bun pm cache rm
print_success "Package cache cleaned"
echo ""

# 3. 生成安全报告
echo "📊 3/3 Generating security report..."
echo "----------------------------"
REPORT_DIR="./security-reports"
REPORT_FILE="$REPORT_DIR/scan-$(date +%Y%m%d-%H%M%S).txt"

mkdir -p "$REPORT_DIR"

{
    echo "YYC³-MANA Security Scan Report"
    echo "================================"
    echo "Date: $(date)"
    echo "Node Version: $(node -v)"
    echo "Bun Version: $(bun -v)"
    echo ""
    echo "Dependencies:"
    bun pm ls
    echo ""
    echo "Vulnerabilities:"
    bun audit --json 2>/dev/null || echo "No vulnerabilities or audit failed"
} > "$REPORT_FILE"

print_success "Security report saved to: $REPORT_FILE"
echo ""

echo "🎉 Security scan completed!"
echo "============================"
echo "Next steps:"
echo "  - Review the security report"
echo "  - Run 'bun audit fix' to fix vulnerabilities"
echo "  - Update dependencies with 'bun update'"
echo ""
