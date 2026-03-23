#!/bin/bash
# 回滚脚本
# 使用方法: bash rollback.sh

set -e

APP_NAME="myapp"
PID_FILE="./${APP_NAME}.pid"

echo "=== 回滚到上一版本 ==="

# 停止当前进程
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    kill "$OLD_PID" 2>/dev/null && echo "已停止进程 $OLD_PID"
fi

# 查找备份版本
BACKUP=$(ls -t bin/${APP_NAME}.backup.* 2>/dev/null | head -1)
if [ -z "$BACKUP" ]; then
    echo "❌ 无备份版本可回滚"
    exit 1
fi

# 恢复备份
cp "$BACKUP" "bin/${APP_NAME}"
echo "✅ 已恢复: $BACKUP"

# 重新启动
./bin/${APP_NAME} &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"

sleep 2
if curl -s "http://localhost:8080/health" &>/dev/null; then
    echo "✅ 回滚成功，服务已恢复"
else
    echo "❌ 回滚后服务异常"
    exit 1
fi
