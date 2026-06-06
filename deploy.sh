#!/bin/bash
set -e

# ==================== 配置 ====================
PROJECT_DIR="/data/my-blog"

# 服务名称（与 docker-compose.yml 中的 container_name 一致）
BACKEND_NAME="my-blog-demo"
FRONTEND_NAME="blog-frontend"
BACKSTAGE_NAME="blog-backstage"
MYSQL_NAME="blog-mysql"

# 端口
BACKEND_PORT=8080
FRONTEND_PORT=80
BACKSTAGE_PORT=5173
PROMETHEUS_PORT=9090
GRAFANA_PORT=3000

# 健康检查路径
HEALTH_URL="http://localhost:${BACKEND_PORT}/actuator/health"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ==================== 辅助函数 ====================
log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

wait_for_service() {
    local url=$1
    local name=$2
    local max_wait=60
    local count=0

    log_info "等待 ${name} 启动..."
    while [ $count -lt $max_wait ]; do
        if curl -sf "${url}" > /dev/null 2>&1; then
            log_info "${name} 已就绪"
            return 0
        fi
        count=$((count + 5))
        sleep 5
    done

    log_error "${name} 启动超时 (${max_wait}s)"
    return 1
}

check_service() {
    local url=$1
    local name=$2
    if curl -sf "${url}" > /dev/null 2>&1; then
        log_info "${name} [OK]"
        return 0
    else
        log_error "${name} [FAIL]"
        return 1
    fi
}

# ==================== 部署主流程 ====================
main() {
    echo ""
    echo "=========================================="
    echo "         博客项目自动化部署"
    echo "=========================================="
    echo ""

    # 1. 检查 docker-compose 是否存在
    if [ ! -f "${PROJECT_DIR}/docker-compose.yml" ]; then
        log_error "docker-compose.yml 不存在于 ${PROJECT_DIR}"
        exit 1
    fi

    # 2. 进入项目目录
    cd "${PROJECT_DIR}"
    log_info "当前目录: $(pwd)"

    # 3. 拉取最新代码
    log_info "正在拉取最新代码..."
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
    log_info "当前分支: ${CURRENT_BRANCH}"
    git pull origin "${CURRENT_BRANCH}"

    # 4. 停止旧容器（保留数据卷）
    log_info "停止旧容器..."
    docker compose down

    # 5. 构建新镜像
    log_info "构建 Docker 镜像..."
    docker compose build --no-cache

    # 6. 启动服务
    log_info "启动服务..."
    docker compose up -d

    # 7. 等待 MySQL 就绪
    log_info "等待 MySQL 初始化..."
    sleep 10

    # 8. 等待后端健康检查通过
    wait_for_service "${HEALTH_URL}" "后端 API"

    # 9. 健康检查
    echo ""
    log_info "========== 服务健康检查 =========="
    check_service "http://localhost:${BACKEND_PORT}/actuator/health"  "后端 API (Spring Boot)"
    check_service "http://localhost:${FRONTEND_PORT}"                  "博客前台 (Nginx)"
    check_service "http://localhost:${BACKSTAGE_PORT}"                  "管理后台 (Backstage)"
    check_service "http://localhost:${PROMETHEUS_PORT}"                 "Prometheus 监控"
    check_service "http://localhost:${GRAFANA_PORT}"                    "Grafana 可视化"

    # 10. 显示运行中的容器
    echo ""
    log_info "========== 运行中的容器 =========="
    docker compose ps

    # 11. 显示容器日志（最近 20 行）
    echo ""
    log_warn "最近日志 (后端):"
    docker compose logs --tail=20 ${BACKEND_NAME}

    echo ""
    echo "=========================================="
    log_info "部署完成!"
    echo "=========================================="
    echo ""
    echo "访问地址:"
    echo "  博客前台:  http://localhost:${FRONTEND_PORT}"
    echo "  管理后台:  http://localhost:${BACKSTAGE_PORT}"
    echo "  Prometheus: http://localhost:${PROMETHEUS_PORT}"
    echo "  Grafana:    http://localhost:${GRAFANA_PORT}"
    echo ""
}

main "$@"
