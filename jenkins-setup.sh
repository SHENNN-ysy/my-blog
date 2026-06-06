#!/bin/bash
#
# Jenkins 容器工具初始化脚本
# 用途：Jenkins 容器重建后，运行此脚本一次性安装所有必要工具
# 用法：docker exec -it -u root jenkins bash < jenkins-setup.sh
#

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

log() { echo -e "${GREEN}[Jenkins Setup]${NC} $1"; }
die()  { echo -e "${RED}[ERROR]${NC} $1" >&2; exit 1; }

log "===== 开始安装工具 ====="

log "创建工具目录..."
mkdir -p /opt/tools
mkdir -p /usr/local/lib/docker/cli-plugins

# ==================== 安装 Maven ====================
log "安装 Maven 3.9.6..."
if [ ! -d "/opt/tools/maven" ]; then
    curl -fsSL https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz \
        | tar -xz -C /opt/tools/
    mv /opt/tools/apache-maven-3.9.6 /opt/tools/maven
    ln -sf /opt/tools/maven/bin/mvn /usr/local/bin/mvn
    log "Maven 安装完成: $(mvn --version | head -1)"
else
    log "Maven 已存在，跳过"
fi

# ==================== 配置 Maven 阿里云镜像 ====================
log "配置 Maven 阿里云镜像..."
cat > /opt/tools/maven/conf/settings.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
  <mirrors>
    <mirror>
      <id>aliyunmaven</id>
      <mirrorOf>*</mirrorOf>
      <name>Aliyun Maven Mirror</name>
      <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
  </mirrors>
</settings>
EOF
log "Maven 镜像配置完成"

# ==================== 安装 Node.js ====================
log "安装 Node.js 22.14.0..."
if [ ! -d "/opt/tools/node" ]; then
    curl -fsSL https://nodejs.org/dist/v22.14.0/node-v22.14.0-linux-x64.tar.gz \
        | tar -xz -C /opt/tools/
    mv /opt/tools/node-v22.14.0-linux-x64 /opt/tools/node
    ln -sf /opt/tools/node/bin/node /usr/local/bin/node
    ln -sf /opt/tools/node/bin/npm  /usr/local/bin/npm
    ln -sf /opt/tools/node/bin/npx  /usr/local/bin/npx
    log "Node.js 安装完成: $(node --version)"
else
    log "Node.js 已存在，跳过"
fi

# ==================== 配置 npm 淘宝镜像 ====================
log "配置 npm 镜像..."
npm config set registry https://registry.npmmirror.com

# ==================== 安装 docker-compose ====================
log "安装 docker-compose v2.27.1..."
if [ ! -f "/usr/local/bin/docker-compose" ]; then
    curl -SL https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64 \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/local/lib/docker/cli-plugins/docker-compose
    log "docker-compose 安装完成: $(docker-compose --version)"
else
    log "docker-compose 已存在，跳过"
fi

# ==================== 配置 Docker 权限 ====================
log "配置 Docker 权限..."
DOCKER_GID=$(getent group docker | cut -d: -f3 2>/dev/null || echo "999")
log "宿主机 docker 组 GID: ${DOCKER_GID}"

groupadd -g "${DOCKER_GID}" docker 2>/dev/null || true
usermod -aG docker jenkins 2>/dev/null || true

# ==================== 验证 ====================
log "===== 验证安装 ====="
echo "  Maven:          $(mvn --version | head -1)"
echo "  Node.js:        $(node --version)"
echo "  npm:            $(npm --version)"
echo "  docker-compose: $(docker-compose --version)"

log "===== 安装完成 ====="
