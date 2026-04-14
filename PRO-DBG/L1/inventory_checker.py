"""
库存检查工具
功能：读取库存数据，找出低于安全库存的商品并生成补货报告
支持：低库存检测、补货建议、分类统计、紧急度排序、报告导出
"""

import csv
import os
from datetime import datetime


def load_inventory(filename):
    """
    从 CSV 文件加载库存数据
    CSV 格式：商品名称,当前库存,安全库存阈值
    返回：列表，每项为 {'name': str, 'current': int, 'threshold': int}
    """
    inventory = []
    if not os.path.exists(filename):
        print(f"错误：文件 {filename} 不存在")
        return inventory

    with open(filename, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)  # 跳过表头
        for row in reader:
            if len(row) == 3:
                name = row[0].strip()
                # Bug 1（类型转换缺失）：CSV 读出来的是字符串，需要转 int，但这里忘了转
                current = row[1].strip()
                threshold = int(row[2].strip())
                inventory.append({
                    'name': name,
                    'current': current,
                    'threshold': threshold
                })
    return inventory


def check_low_stock(inventory):
    """
    检查库存是否低于安全阈值
    当 current < threshold 时认为需要补货
    返回需要补货的商品列表
    """
    low_stock_items = []
    for item in inventory:
        # Bug 2（比较方向反了）：应该是 current < threshold 才需要补货
        # 这里写成了 current >= threshold，逻辑完全反了
        if item['current'] >= item['threshold']:
            low_stock_items.append(item)
    return low_stock_items


def calculate_urgency(item):
    """
    计算补货紧急度（0~100）
    紧急度 = (1 - current/threshold) * 100
    current 越接近 0，紧急度越高
    """
    if item['threshold'] == 0:
        return 0
    # Bug 3（整数除法精度问题）：Python 3 中 / 是浮点除法没问题，
    # 但这里用了 //（整数除法），当 current < threshold 时结果都是 0
    ratio = item['current'] // item['threshold']
    urgency = (1 - ratio) * 100
    return round(urgency, 1)


def suggest_reorder(low_stock_items):
    """
    生成补货建议
    建议补货数量 = 安全阈值 * 2 - 当前库存
    """
    suggestions = []
    for item in low_stock_items:
        # Bug 4（KeyError）：变量名拼写错误 threshod → threshold
        qty = item['threshod'] * 2 - item['current']
        suggestions.append({
            'name': item['name'],
            'suggested_qty': qty,
            'urgency': calculate_urgency(item)
        })
    return suggestions


def sort_by_urgency(suggestions):
    """
    按紧急度从高到低排序
    """
    # Bug 5（排序方向错误）：reverse=False 是升序，应该 reverse=True 才是降序（高紧急度排前面）
    return sorted(suggestions, key=lambda x: x['urgency'], reverse=False)


def calculate_reorder_cost(suggestions, unit_cost=10):
    """
    计算总补货成本
    每件商品补货成本 = 建议补货量 × 单价
    返回总成本
    """
    total = 0
    for sug in suggestions:
        # Bug 8（累加写成赋值）：total = 而非 total +=，每次循环都覆盖前一次的值
        total = sug['suggested_qty'] * unit_cost
    return total


def categorize_inventory(inventory):
    """
    将商品按库存状态分类
    返回：{'充足': [...], '偏低': [...], '紧急': [...]}
    充足：current >= threshold * 1.5
    偏低：threshold <= current < threshold * 1.5
    紧急：current < threshold
    """
    categories = {'充足': [], '偏低': [], '紧急': []}
    for item in inventory:
        if item['current'] >= item['threshold'] * 1.5:
            categories['充足'].append(item)
        elif item['current'] >= item['threshold']:
            categories['偏低'].append(item)
        else:
            # Bug 6（字典键拼写错误）：'紧急' 写成了 '紧急!'，导致紧急商品放进了错误的键
            categories['紧急!'].append(item)
    return categories


def generate_summary(inventory, low_stock_items):
    """
    生成统计摘要
    """
    total_items = len(inventory)
    low_count = len(low_stock_items)
    # Bug 7（ZeroDivisionError）：当 total_items 为 0 时会除零
    low_ratio = low_count / total_items * 100

    # Bug 9（max/min 用反）：应该找库存最少的商品，但用了 max
    most_critical = None
    if inventory:
        most_critical = max(inventory, key=lambda x: x['current'])['name']

    summary = {
        'total_items': total_items,
        'low_stock_count': low_count,
        'low_stock_ratio': round(low_ratio, 1),
        'most_critical': most_critical,
        'check_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    }
    return summary


def print_report(low_stock_items, suggestions, summary):
    """打印补货报告"""
    print("=" * 60)
    print(f"  库存检查报告 — {summary['check_time']}")
    print("=" * 60)
    print(f"\n总商品数：{summary['total_items']}")
    print(f"需补货数：{summary['low_stock_count']}（占比 {summary['low_stock_ratio']}%）\n")

    if len(low_stock_items) == 0:
        print("✓ 库存充足，无需补货")
        return

    print(f"{'商品名称':<12} {'当前库存':<10} {'阈值':<10} {'建议补货量':<12} {'紧急度':<8}")
    print("-" * 60)

    sorted_suggestions = sort_by_urgency(suggestions)
    for sug in sorted_suggestions:
        item = next(i for i in low_stock_items if i['name'] == sug['name'])
        print(f"{item['name']:<12} {item['current']:<10} {item['threshold']:<10} {sug['suggested_qty']:<12} {sug['urgency']:<8}")

    print("-" * 60)


def main():
    """主函数"""
    filename = 'test_data.csv'

    # 加载库存数据
    inventory = load_inventory(filename)

    # 检查低库存商品
    low_stock_items = check_low_stock(inventory)

    # 生成补货建议
    suggestions = suggest_reorder(low_stock_items)

    # 计算补货成本
    total_cost = calculate_reorder_cost(suggestions)
    print(f"预计总补货成本：¥{total_cost}")

    # 生成统计摘要
    summary = generate_summary(inventory, low_stock_items)
    if summary['most_critical']:
        print(f"最紧急商品：{summary['most_critical']}")

    # 打印报告
    print_report(low_stock_items, suggestions, summary)


if __name__ == '__main__':
    main()
