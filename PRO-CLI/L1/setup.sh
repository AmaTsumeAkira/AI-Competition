#!/bin/bash
# Nginx 反向代理一键部署脚本
# 使用方法: bash setup.sh

set -e

echo "=== Nginx 反向代理部署 ==="

# 检查依赖
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    apt-get update && apt-get install -y nginx
fi

# 复制配置
cp nginx.conf /etc/nginx/nginx.conf

# 验证配置
nginx -t

# 启动服务
systemctl restart nginx
systemctl enable nginx

echo "✅ Nginx 已启动，监听端口 80"
echo "测试: bash test.sh"
