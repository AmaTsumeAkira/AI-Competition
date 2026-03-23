#!/bin/bash
# Nginx 路由测试脚本
# 5个测试用例

PASS=0
FAIL=0

test_route() {
    local name="$1" url="$2" expected="$3"
    result=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost${url}" 2>/dev/null)
    if [ "$result" = "$expected" ]; then
        echo "✅ $name"
        PASS=$((PASS + 1))
    else
        echo "❌ $name (期望 $expected, 实际 $result)"
        FAIL=$((FAIL + 1))
    fi
}

echo "=== Nginx 路由测试 ==="
test_route "用户服务路由" "/api/v1/users" "200"
test_route "订单服务路由" "/api/v2/orders" "200"
test_route "静态资源路由" "/static/images/logo.png" "200"
test_route "健康检查" "/health" "200"
test_route "用户健康检查" "/api/v1/health" "200"

echo ""
echo "结果: $PASS/5 通过"
if [ $PASS -ge 3 ]; then echo "✅ 满足晋级条件"; else echo "❌ 未满足"; fi
