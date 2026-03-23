#!/bin/bash
# 健康检查脚本
# 检查所有服务是否正常运行

PASS=0
FAIL=0

check_service() {
    local name="$1" url="$2"
    if curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null | grep -q "200\|201\|301\|302"; then
        echo "✅ $name: 正常"
        PASS=$((PASS + 1))
    else
        echo "❌ $name: 异常"
        FAIL=$((FAIL + 1))
    fi
}

echo "=== 健康检查 ==="

# 检查容器状态
echo "【容器状态】"
docker ps --format "table {{.Names}}\t{{.Status}}" 2>/dev/null || echo "无法获取容器状态"

echo ""
echo "【服务检查】"
check_service "前端" "http://localhost:80"
check_service "后端API" "http://localhost:8000/health"
check_service "数据库" "http://localhost:5432"

echo ""
echo "结果: $PASS 通过, $FAIL 失败"
if [ $FAIL -eq 0 ]; then
    echo "✅ 所有服务正常"
else
    echo "⚠️ 部分服务异常，请检查"
fi
