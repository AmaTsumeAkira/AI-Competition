#!/bin/bash
# 蓝绿部署脚本
# 使用方法: bash deploy.sh <version>

set -e

VERSION=${1:-"latest"}
APP_NAME="myapp"
BLUE_PORT=8080
GREEN_PORT=8081

echo "=== 蓝绿部署 v${VERSION} ==="

# 确定当前活跃环境
if curl -s "http://localhost:${BLUE_PORT}/health" &>/dev/null; then
    ACTIVE="blue"
    STANDBY_PORT=$GREEN_PORT
else
    ACTIVE="green"
    STANDBY_PORT=$BLUE_PORT
fi

echo "当前活跃: ${ACTIVE}, 部署到端口: ${STANDBY_PORT}"

# 构建新版本
make build

# 部署到备用环境
./bin/${APP_NAME} --port ${STANDBY_PORT} &
NEW_PID=$!
sleep 2

# 健康检查
if curl -s "http://localhost:${STANDBY_PORT}/health" &>/dev/null; then
    echo "✅ 新版本健康检查通过"
    # 切换流量（这里简化为记录）
    echo "${NEW_PID}" > ./${APP_NAME}.pid
    echo "✅ 部署完成 v${VERSION}"
else
    echo "❌ 健康检查失败，回滚"
    kill ${NEW_PID} 2>/dev/null
    bash rollback.sh
    exit 1
fi
