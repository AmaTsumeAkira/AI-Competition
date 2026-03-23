#!/usr/bin/env python3
"""
CLI L1 测试用例
检查爬虫脚本输出
"""
import os
import csv
import sys

CSV_FILE = os.path.join(os.path.dirname(__file__), "quotes.csv")

def test_file_exists():
    """CSV 文件存在"""
    return os.path.exists(CSV_FILE)

def test_file_not_empty():
    """CSV 文件非空"""
    if not os.path.exists(CSV_FILE):
        return False
    return os.path.getsize(CSV_FILE) > 100

def test_csv_format():
    """CSV 格式正确"""
    if not os.path.exists(CSV_FILE):
        return False
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader)
            return len(header) >= 2  # 至少有2列
    except:
        return False

def test_data_count():
    """数据条数 ≥ 30（约3页）"""
    if not os.path.exists(CSV_FILE):
        return False
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # 跳过表头
            count = sum(1 for _ in reader)
            return count >= 30
    except:
        return False

def test_utf8_encoding():
    """UTF-8 编码"""
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            f.read()
        return True
    except:
        return False

# 运行测试
print("=" * 40)
print("CLI L1 测试套件")
print("=" * 40)

tests = [
    ("文件存在", test_file_exists),
    ("文件非空", test_file_not_empty),
    ("CSV格式", test_csv_format),
    ("数据条数≥30", test_data_count),
    ("UTF-8编码", test_utf8_encoding),
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
