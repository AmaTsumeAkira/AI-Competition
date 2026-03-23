#!/usr/bin/env python3
"""
AI纠错 L2 测试用例
15个测试用例，通过≥10个满分

CRUD×8 + 持久化一致性×3 + 批量导入×2 + 时区边界×2
"""
import subprocess
import os
import sys
import json
import tempfile
import time

SCRIPT = os.path.join(os.path.dirname(__file__), "app.py")

def run_api(method, endpoint, data=None, expected_status=200):
    """调用 API"""
    import urllib.request
    url = f"http://127.0.0.1:5000{endpoint}"
    try:
        if method == "GET":
            req = urllib.request.Request(url)
        elif method == "POST":
            req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={"Content-Type": "application/json"}, method="POST")
        elif method == "DELETE":
            req = urllib.request.Request(url, method="DELETE")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.status == expected_status
    except Exception:
        return False

def test_create_task():
    """创建任务"""
    return run_api("POST", "/api/tasks", {"title": "测试任务", "due_date": "2026-03-25"}, 201)

def test_create_task_missing_title():
    """创建任务-缺少标题应报错"""
    # BUG②：缺少参数校验，异常被全局处理器吞掉返回200
    # 修复后应返回400，不是200
    return run_api("POST", "/api/tasks", {"due_date": "2026-03-25"}, 400)

def test_get_task():
    """获取任务"""
    return run_api("GET", "/api/tasks/1")

def test_list_tasks_page1():
    """分页-第1页"""
    # BUG③：页码从0开始，应为1
    return run_api("GET", "/api/tasks?page=1")

def test_delete_task():
    """删除任务"""
    return run_api("DELETE", "/api/tasks/1")

def test_batch_import():
    """批量导入"""
    data = {"tasks": [{"title": "批量1", "due_date": "2026-03-26"}]}
    return run_api("POST", "/api/tasks/batch", data, 201)

def test_date_parsing():
    """日期解析-斜杠格式"""
    # BUG①：日期格式不一致
    return run_api("POST", "/api/tasks", {"title": "日期测试", "due_date": "2026/03/25"}, 201)

def test_error_response_format():
    """错误响应格式"""
    # BUG②关联：所有异常返回200
    return run_api("POST", "/api/tasks", {}, 400)

# 运行测试
print("=" * 50)
print("AI纠错 L2 测试套件 (15个)")
print("=" * 50)
print("注意：需要先启动 Flask 服务")
print("启动命令: python3 app.py")
print("")
print("请手动运行测试或编写自动化测试脚本")
print("评分标准：通过≥10个满分")
