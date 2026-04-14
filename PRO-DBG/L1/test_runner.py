"""
库存检查工具 - 自动测试脚本
验证修复后的代码是否正确
"""

import sys
import os
import io

# 确保当前目录的 inventory_checker 可以被导入
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_load_inventory():
    """测试数据加载（含类型验证）"""
    from inventory_checker import load_inventory

    try:
        inventory = load_inventory('test_data.csv')
        if len(inventory) == 0:
            print("✗ 测试失败：未能加载数据")
            return False

        # 验证数据类型——current 应该是 int 而非 str
        first = inventory[0]
        if not isinstance(first['current'], int):
            print(f"✗ 测试失败：current 字段类型应为 int，实际为 {type(first['current']).__name__}")
            return False
        if not isinstance(first['threshold'], int):
            print(f"✗ 测试失败：threshold 字段类型应为 int，实际为 {type(first['threshold']).__name__}")
            return False

        print(f"✓ 测试通过：成功加载 {len(inventory)} 条库存记录，数据类型正确")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_check_low_stock():
    """测试低库存检查逻辑"""
    test_inventory = [
        {'name': '商品A', 'current': 50, 'threshold': 100},   # 需要补货（50 < 100）
        {'name': '商品B', 'current': 100, 'threshold': 100},  # 刚好等于阈值，不需要补货
        {'name': '商品C', 'current': 200, 'threshold': 100},  # 超过阈值，不需要补货
        {'name': '商品D', 'current': 30, 'threshold': 50},    # 需要补货（30 < 50）
        {'name': '商品E', 'current': 0, 'threshold': 10},     # 零库存，需要补货
    ]

    from inventory_checker import check_low_stock
    result = check_low_stock(test_inventory)

    # 应该只有 A、D、E 需要补货（current < threshold）
    expected_names = {'商品A', '商品D', '商品E'}
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


def test_calculate_urgency():
    """测试紧急度计算"""
    from inventory_checker import calculate_urgency

    try:
        # current=20, threshold=100 → urgency = (1 - 20/100) * 100 = 80.0
        item1 = {'name': 'T1', 'current': 20, 'threshold': 100}
        u1 = calculate_urgency(item1)
        if abs(u1 - 80.0) > 0.2:
            print(f"✗ 测试失败：紧急度计算错误（current=20, threshold=100）")
            print(f"  期望：80.0，实际：{u1}")
            return False

        # current=0, threshold=50 → urgency = (1 - 0/50) * 100 = 100.0
        item2 = {'name': 'T2', 'current': 0, 'threshold': 50}
        u2 = calculate_urgency(item2)
        if abs(u2 - 100.0) > 0.2:
            print(f"✗ 测试失败：紧急度计算错误（current=0, threshold=50）")
            print(f"  期望：100.0，实际：{u2}")
            return False

        # current=90, threshold=100 → urgency = (1 - 0.9) * 100 = 10.0
        item3 = {'name': 'T3', 'current': 90, 'threshold': 100}
        u3 = calculate_urgency(item3)
        if abs(u3 - 10.0) > 0.2:
            print(f"✗ 测试失败：紧急度计算错误（current=90, threshold=100）")
            print(f"  期望：10.0，实际：{u3}")
            return False

        print("✓ 测试通过：紧急度计算正确")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_sort_by_urgency():
    """测试按紧急度降序排序"""
    from inventory_checker import sort_by_urgency

    try:
        test_data = [
            {'name': 'A', 'suggested_qty': 100, 'urgency': 30.0},
            {'name': 'B', 'suggested_qty': 200, 'urgency': 90.0},
            {'name': 'C', 'suggested_qty': 50, 'urgency': 60.0},
        ]
        result = sort_by_urgency(test_data)
        urgencies = [r['urgency'] for r in result]

        if urgencies != [90.0, 60.0, 30.0]:
            print(f"✗ 测试失败：排序应为降序（高紧急度在前）")
            print(f"  期望：[90.0, 60.0, 30.0]")
            print(f"  实际：{urgencies}")
            return False

        print("✓ 测试通过：紧急度排序正确（降序）")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_categorize_inventory():
    """测试库存分类"""
    from inventory_checker import categorize_inventory

    try:
        test_data = [
            {'name': '充足品', 'current': 200, 'threshold': 100},  # 200 >= 150 → 充足
            {'name': '偏低品', 'current': 120, 'threshold': 100},  # 100 <= 120 < 150 → 偏低
            {'name': '紧急品', 'current': 30, 'threshold': 100},   # 30 < 100 → 紧急
        ]
        categories = categorize_inventory(test_data)

        # 验证 '紧急' 键存在
        if '紧急' not in categories:
            print(f"✗ 测试失败：分类结果中不存在 '紧急' 键")
            print(f"  实际键：{list(categories.keys())}")
            return False

        urgent_names = {i['name'] for i in categories['紧急']}
        if '紧急品' not in urgent_names:
            print(f"✗ 测试失败：'紧急品' 应在 '紧急' 分类中")
            return False

        print("✓ 测试通过：库存分类正确")
        return True
    except KeyError as e:
        print(f"✗ 测试失败：字典键错误（KeyError: {e}）")
        return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_generate_summary():
    """测试统计摘要（含空列表与最紧急商品）"""
    from inventory_checker import generate_summary

    try:
        # 正常情况
        inventory = [
            {'name': 'A', 'current': 10},
            {'name': 'B', 'current': 50},
            {'name': 'C', 'current': 200},
        ]
        low = [{'name': 'A'}]
        summary = generate_summary(inventory, low)

        if summary['total_items'] != 3:
            print(f"✗ 测试失败：total_items 应为 3，实际 {summary['total_items']}")
            return False
        if abs(summary['low_stock_ratio'] - 33.3) > 0.2:
            print(f"✗ 测试失败：low_stock_ratio 应约 33.3%，实际 {summary['low_stock_ratio']}%")
            return False

        # 验证最紧急商品应为库存最低的 A (current=10)
        if summary.get('most_critical') != 'A':
            print(f"✗ 测试失败：most_critical 应为 'A'（库存最低），实际为 '{summary.get('most_critical')}'")
            return False

        # 边界情况：空列表
        summary2 = generate_summary([], [])
        if summary2['total_items'] != 0:
            print(f"✗ 测试失败：空库存时 total_items 应为 0")
            return False

        print("✓ 测试通过：统计摘要正确（含最紧急商品判断与边界情况）")
        return True
    except ZeroDivisionError:
        print("✗ 测试失败：空库存时发生 ZeroDivisionError")
        return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_calculate_reorder_cost():
    """测试总补货成本计算"""
    from inventory_checker import calculate_reorder_cost

    try:
        test_suggestions = [
            {'name': 'A', 'suggested_qty': 100, 'urgency': 80.0},
            {'name': 'B', 'suggested_qty': 50, 'urgency': 90.0},
            {'name': 'C', 'suggested_qty': 200, 'urgency': 60.0},
        ]
        cost = calculate_reorder_cost(test_suggestions, unit_cost=10)
        # 应该是 (100 + 50 + 200) * 10 = 3500
        expected = 3500
        if cost != expected:
            print(f"✗ 测试失败：总补货成本应为 {expected}，实际为 {cost}")
            return False
        print("✓ 测试通过：总补货成本计算正确")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_main_output():
    """测试主程序完整运行"""
    from inventory_checker import main

    try:
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        main()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # 检查输出包含预期的低库存商品
        expected_items = ['螺丝M4', '螺母M4', '电工胶带', '电池AAA', 'LED灯珠', '电容10uF', '传感器模块', '继电器']
        found = [item for item in expected_items if item in output]

        if len(found) < 4:
            print(f"✗ 测试失败：主程序输出中低库存商品不足")
            print(f"  期望包含：{expected_items}")
            print(f"  实际找到：{found}")
            return False

        print(f"✓ 测试通过：主程序正常运行，输出包含 {len(found)} 种低库存商品")
        return True
    except Exception as e:
        if 'sys.stdout' in dir():
            sys.stdout = sys.__stdout__
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


if __name__ == '__main__':
    print("=" * 50)
    print("第三届AIGC数字素养大赛 - PRO-DBG L1")
    print("库存检查工具 - 自动测试")
    print("=" * 50)
    print()

    results = []
    results.append(("数据加载与类型检查", test_load_inventory()))
    results.append(("低库存判断逻辑", test_check_low_stock()))
    results.append(("补货建议计算", test_suggest_reorder()))
    results.append(("紧急度计算", test_calculate_urgency()))
    results.append(("紧急度排序", test_sort_by_urgency()))
    results.append(("库存分类", test_categorize_inventory()))
    results.append(("统计摘要与最紧急商品", test_generate_summary()))
    results.append(("补货成本计算", test_calculate_reorder_cost()))
    results.append(("主程序完整运行", test_main_output()))

    print()
    print("=" * 50)
    passed = sum(1 for _, r in results if r)
    total = len(results)
    print(f"测试结果：{passed}/{total} 通过")
    if passed == total:
        print("🎉 所有测试通过！")
    else:
        print(f"⚠  还有 {total - passed} 项测试失败，请继续修复")
        print("\n失败项目：")
        for name, r in results:
            if not r:
                print(f"  ✗ {name}")
    print("=" * 50)
