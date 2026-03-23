#!/bin/bash
# Docker Compose 一键部署脚本
# 使用方法: bash deploy.sh

set -e

echo "=== 全栈应用部署 ==="

# 检查依赖
if ! command -v docker &> /dev/null; then
    echo "错误：未安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "错误：未安装 Docker Compose"
    exit 1
fi

# 拉取镜像
echo "拉取镜像..."
docker compose pull 2>/dev/null || docker-compose pull

# 启动服务
echo "启动服务..."
docker compose up -d 2>/dev/null || docker-compose up -d

# 等待服务就绪
echo "等待服务就绪..."
sleep 5

# 运行健康检查
bash healthcheck.sh

echo "✅ 部署完成"
