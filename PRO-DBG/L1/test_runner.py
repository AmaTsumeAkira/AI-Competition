"""
库存检查工具 - 自动测试脚本
验证修复后的代码是否正确
"""

import sys
import os

# 确保当前目录的 inventory_checker 可以被导入
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_check_low_stock():
    """测试低库存检查逻辑"""
    # 模拟测试数据
    test_inventory = [
        {'name': '商品A', 'current': 50, 'threshold': 100},   # 需要补货
        {'name': '商品B', 'current': 100, 'threshold': 100},  # 刚好等于阈值，不需要补货
        {'name': '商品C', 'current': 200, 'threshold': 100},  # 超过阈值，不需要补货
        {'name': '商品D', 'current': 30, 'threshold': 50},   # 需要补货
    ]

    from inventory_checker import check_low_stock
    result = check_low_stock(test_inventory)

    # 商品A和商品D应该需要补货（当前库存 < 阈值）
    expected_names = {'商品A', '商品D'}
    actual_names = {item['name'] for item in result}

    if actual_names != expected_names:
        print(f"✗ 测试失败：低库存判断错误")
        print(f"  期望：{expected_names}")
        print(f"  实际：{actual_names}")
        return False

    print("✓ 测试通过：低库存判断逻辑正确")
    return True


def test_suggest_reorder():
    """测试补货建议生成"""
    test_low_stock = [
        {'name': '商品X', 'current': 30, 'threshold': 100},
        {'name': '商品Y', 'current': 0, 'threshold': 50},
    ]

    from inventory_checker import suggest_reorder

    try:
        suggestions = suggest_reorder(test_low_stock)

        # 商品X: 建议补货量 = 100*2 - 30 = 170
        # 商品Y: 建议补货量 = 50*2 - 0 = 100
        expected = {170, 100}
        actual = {s['suggested_qty'] for s in suggestions}

        if actual != expected:
            print(f"✗ 测试失败：补货建议计算错误")
            print(f"  期望：{expected}")
            print(f"  实际：{actual}")
            return False

        print("✓ 测试通过：补货建议计算正确")
        return True

    except KeyError as e:
        print(f"✗ 测试失败：变量名错误（KeyError: {e}）")
        return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_load_inventory():
    """测试数据加载"""
    from inventory_checker import load_inventory

    try:
        inventory = load_inventory('test_data.csv')
        if len(inventory) == 0:
            print("✗ 测试失败：未能加载数据")
            return False
        print(f"✓ 测试通过：成功加载 {len(inventory)} 条库存记录")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_main_output():
    """测试主程序输出（无异常退出）"""
    import io
    import sys
    from inventory_checker import main

    try:
        # 捕获标准输出
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        main()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # 检查输出是否包含预期内容（低库存商品）
        if '螺丝M4' in output or '电工胶带' in output or '电池AAA' in output or 'LED灯珠' in output or '电容10uF' in output or '传感器模块' in output or '继电器' in output:
            print("✓ 测试通过：主程序正常运行，输出合理")
            return True
        else:
            print("✗ 测试失败：主程序输出异常")
            return False
    except KeyError as e:
        sys.stdout = old_stdout
        print(f"✗ 测试失败：变量名错误（KeyError: {e}）")
        return False
    except Exception as e:
        sys.stdout = old_stdout
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


if __name__ == '__main__':
    print("=" * 50)
    print("库存检查工具 - 自动测试")
    print("=" * 50)
    print()

    results = []
    results.append(test_load_inventory())
    results.append(test_check_low_stock())
    results.append(test_suggest_reorder())
    results.append(test_main_output())

    print()
    print("=" * 50)
    passed = sum(results)
    total = len(results)
    print(f"测试结果：{passed}/{total} 通过")
    if passed == total:
        print("🎉 所有测试通过！")
    else:
        print(f"⚠  还有 {total - passed} 项测试失败，请继续修复")
    print("=" * 50)
