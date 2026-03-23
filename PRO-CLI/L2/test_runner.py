#!/usr/bin/env python3
"""
CLI L2 测试用例
检查数据分析脚本输出
"""
import os
import sys

REPORT_FILE = os.path.join(os.path.dirname(__file__), "report.txt")

def test_report_exists():
    """报告文件存在"""
    return os.path.exists(REPORT_FILE)

def test_report_has_content():
    """报告非空"""
    if not os.path.exists(REPORT_FILE):
        return False
    return os.path.getsize(REPORT_FILE) > 200

def test_contains_average():
    """包含平均分"""
    if not os.path.exists(REPORT_FILE):
        return False
    with open(REPORT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    return '平均' in content or 'avg' in content.lower() or 'mean' in content.lower()

def test_contains_failing():
    """包含不及格信息"""
    if not os.path.exists(REPORT_FILE):
        return False
    with open(REPORT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    return '不及格' in content or '60' in content or 'fail' in content.lower()

def test_contains_distribution():
    """包含分数段分布"""
    if not os.path.exists(REPORT_FILE):
        return False
    with open(REPORT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    return ('90' in content and '80' in content) or '分数段' in content

# 运行测试
print("=" * 40)
print("CLI L2 测试套件")
print("=" * 40)

tests = [
    ("报告文件存在", test_report_exists),
    ("报告非空", test_report_has_content),
    ("包含平均分", test_contains_average),
    ("包含不及格", test_contains_failing),
    ("包含分数段分布", test_contains_distribution),
]

passed = 0
for name, func in tests:
    result = func()
    status = "✅" if result else "❌"
    print(f"{status} {name}")
    if result:
        passed += 1

print(f"\n结果: {passed}/5 通过")
if passed >= 3:
    print("✅ 满足基本要求")
