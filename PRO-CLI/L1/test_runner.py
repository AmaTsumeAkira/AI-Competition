#!/usr/bin/env python3
"""
CLI L1 测试用例
检查爬虫脚本输出
"""
import os
import csv
import sys
import json

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
    """CSV 格式正确（含表头）"""
    if not os.path.exists(CSV_FILE):
        return False
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fields = reader.fieldnames
            if not fields:
                return False
            # 检查是否包含关键列
            required = {'text', 'author'}
            if not required.issubset(set(f.lower() for f in fields)):
                return False
            # 至少能读出一行
            first = next(reader, None)
            return first is not None
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

def test_has_tags_column():
    """包含 tags 列"""
    if not os.path.exists(CSV_FILE):
        return False
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            fields = [f.lower() for f in (reader.fieldnames or [])]
            return 'tags' in fields
    except:
        return False

def test_top_authors():
    """get_top_authors 函数可用"""
    try:
        sys.path.insert(0, os.path.dirname(__file__))
        from scraper import get_top_authors
        test_data = [
            {'text': 'a', 'author': 'Alice', 'tags': []},
            {'text': 'b', 'author': 'Bob', 'tags': []},
            {'text': 'c', 'author': 'Alice', 'tags': []},
        ]
        result = get_top_authors(test_data, 2)
        if not result or len(result) == 0:
            return False
        # Alice should be first with count 2
        return result[0][0] == 'Alice' and result[0][1] == 2
    except:
        return False

def test_filter_by_tag():
    """filter_by_tag 函数可用"""
    try:
        sys.path.insert(0, os.path.dirname(__file__))
        from scraper import filter_by_tag
        test_data = [
            {'text': 'a', 'author': 'A', 'tags': ['life', 'love']},
            {'text': 'b', 'author': 'B', 'tags': ['humor']},
            {'text': 'c', 'author': 'C', 'tags': ['life']},
        ]
        result = filter_by_tag(test_data, 'life')
        return len(result) == 2
    except:
        return False

def test_system_info():
    """print_system_info 函数可用"""
    try:
        import io
        sys.path.insert(0, os.path.dirname(__file__))
        from scraper import print_system_info
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        print_system_info()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout
        # 检查输出包含关键信息
        has_python = 'python' in output.lower() or 'Python' in output
        has_os = 'os' in output.lower() or 'windows' in output.lower() or 'linux' in output.lower() or 'darwin' in output.lower()
        return has_python and has_os and len(output.strip()) > 20
    except:
        if hasattr(sys, '__stdout__'):
            sys.stdout = sys.__stdout__
        return False

# 运行测试
print("=" * 40)
print("第三届AIGC数字素养大赛 - PRO-CLI L1")
print("CLI L1 测试套件")
print("=" * 40)

tests = [
    ("CSV文件存在", test_file_exists),
    ("文件非空", test_file_not_empty),
    ("CSV格式正确", test_csv_format),
    ("数据条数≥30", test_data_count),
    ("UTF-8编码", test_utf8_encoding),
    ("包含Tags列", test_has_tags_column),
    ("作者统计函数", test_top_authors),
    ("标签过滤函数", test_filter_by_tag),
    ("系统状态信息", test_system_info),
]

passed = 0
for name, func in tests:
    result = func()
    status = "✅" if result else "❌"
    print(f"{status} {name}")
    if result:
        passed += 1

print(f"\n结果: {passed}/{len(tests)} 通过")
if passed >= 7:
    print("✅ 满足基本要求")
elif passed >= 5:
    print("⚠️ 部分通过，继续完善")
else:
    print("❌ 未达标，请继续努力")
