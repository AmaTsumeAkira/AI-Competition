#!/usr/bin/env python3
"""
AI纠错 L1 测试用例
选手无需修改本文件

测试用例：
1. 正常数据 - 基本功能验证
2. 空文件 - 边界条件
3. 特殊字符 - 编码兼容性
4. 低阈值 - 阈值参数测试
5. 单商品 - 最小数据集
"""
import subprocess
import os
import sys

SCRIPT = os.path.join(os.path.dirname(__file__), "inventory_checker.py")
DATA_DIR = os.path.dirname(__file__)

def run_test(name, csv_file, args="", expected_exit=0):
    """运行单个测试用例"""
    csv_path = os.path.join(DATA_DIR, csv_file)
    cmd = f"python3 {SCRIPT} {csv_path} {args}"
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        passed = result.returncode == expected_exit
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} | {name}")
        if not passed:
            print(f"  期望退出码: {expected_exit}, 实际: {result.returncode}")
            if result.stderr:
                print(f"  错误: {result.stderr[:200]}")
        return passed
    except subprocess.TimeoutExpired:
        print(f"❌ FAIL | {name} (超时)")
        return False
    except Exception as e:
        print(f"❌ FAIL | {name} (异常: {e})")
        return False


# 创建测试数据文件
# 空CSV（只有表头）
with open(os.path.join(DATA_DIR, "test_empty.csv"), "w") as f:
    f.write("商品名,类别,数量,单价\n")

# 单商品
with open(os.path.join(DATA_DIR, "test_single.csv"), "w") as f:
    f.write("商品名,类别,数量,单价\n苹果,水果,5,3.5\n")

# 特殊字符
with open(os.path.join(DATA_DIR, "test_special.csv"), "w") as f:
    f.write("商品名,类别,数量,单价\n苹果（红富士）,水果,10,3.5\n可口可乐®,,饮品,20,3.0\n")

# 运行测试
print("=" * 50)
print("AI纠错 L1 测试套件")
print("=" * 50)

results = []
results.append(run_test("正常数据-基本功能", "test_data_normal.csv"))
results.append(run_test("空文件-边界条件", "test_empty.csv"))
results.append(run_test("特殊字符-编码兼容", "test_special.csv"))
results.append(run_test("低阈值-参数测试", "test_data_normal.csv", "--threshold 5"))
results.append(run_test("单商品-最小数据集", "test_single.csv"))

print("=" * 50)
passed = sum(results)
total = len(results)
print(f"结果：{passed}/{total} 通过")
if passed >= 3:
    print("✅ 满足晋级条件（≥3/5）")
else:
    print("❌ 未满足晋级条件（需≥3/5）")
