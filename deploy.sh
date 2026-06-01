#!/bin/bash
# ==================== 博客项目一键部署脚本 ====================
# 用法: ./deploy.sh [dev|prod|monitor|logs|stop|restart|status]
#   dev     - 仅启动核心服务（mysql、redis、blog-api）
#   prod    - 启动全套服务（核心 + nginx）
#   monitor - 启动监控栈（prometheus、loki、grafana、node-exporter）
#   logs    - 查看所有容器日志
#   stop    - 停止所有服务
#   restart - 重启所有服务
#   status  - 查看容器运行状态

set -e

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="my-blog"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC}   $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ==================== 辅助函数 ====================

check_docker() {
  if ! command -v docker &> /dev/null; then
    log_error "Docker 未安装，请先安装 Docker"
    exit 1
  fi
  if ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose 未安装"
    exit 1
  fi
}

check_env() {
  if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "docker-compose.yml 不存在，请确认工作目录"
    exit 1
  fi
}

pull_images() {
  log_info "拉取最新镜像..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" pull
}

# ==================== 启动函数 ====================

start_core() {
  log_info "启动核心服务（MySQL、Redis、Blog-API）..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d mysql redis blog-api
  log_ok "核心服务已启动"
  show_urls
}

start_prod() {
  log_info "启动全套服务（核心 + Nginx）..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d
  log_ok "全套服务已启动"
  show_urls
}

start_monitor() {
  log_info "启动监控栈（Prometheus、Loki、Grafana、node-exporter）..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d prometheus loki promtail grafana node-exporter
  log_ok "监控栈已启动"
  show_monitor_urls
}

# ==================== 状态与日志 ====================

show_status() {
  echo ""
  echo "========== 容器状态 =========="
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
  echo ""
}

show_urls() {
  echo ""
  echo "========== 访问地址 =========="
  echo "  博客前台:  http://localhost"
  echo "  后端 API:  http://localhost:8080"
  echo "  健康检查:  http://localhost:8080/actuator/health"
  echo "  Prometheus: http://localhost:9090"
  echo "  Grafana:   http://localhost:3000/grafana"
  echo "  (admin/admin)"
  echo ""
}

show_monitor_urls() {
  echo ""
  echo "========== 监控栈地址 =========="
  echo "  Prometheus:  http://localhost:9090"
  echo "  Grafana:     http://localhost:3000/grafana"
  echo "  Loki:        http://localhost:3100"
  echo "  node-exporter: http://localhost:9100"
  echo "  (admin / admin)"
  echo ""
}

show_logs() {
  log_info "查看日志（Ctrl+C 退出）..."
  docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f
}

# ==================== 主流程 ====================

main() {
  check_docker
  check_env

  COMMAND=${1:-help}

  case "$COMMAND" in
    dev)
      start_core
      ;;
    prod)
      pull_images
      start_prod
      ;;
    monitor)
      start_monitor
      ;;
    logs)
      show_logs
      ;;
    stop)
      log_info "停止所有服务..."
      docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down
      log_ok "所有服务已停止"
      ;;
    restart)
      log_info "重启所有服务..."
      docker compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" restart
      log_ok "所有服务已重启"
      ;;
    status)
      show_status
      ;;
    *)
      echo "用法: $0 {dev|prod|monitor|logs|stop|restart|status}"
      echo ""
      echo "  dev     - 启动核心服务（MySQL、Redis、Blog-API）"
      echo "  prod    - 启动全套服务（核心 + Nginx 前台）"
      echo "  monitor - 启动监控栈（Prometheus、Loki、Grafana、node-exporter）"
      echo "  logs    - 查看所有容器日志"
      echo "  stop    - 停止所有服务"
      echo "  restart - 重启所有服务"
      echo "  status  - 查看容器运行状态"
      exit 0
      ;;
  esac
}

main "$@"
