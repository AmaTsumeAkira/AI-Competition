"""
库存检查工具
功能：读取库存数据，找出低于安全库存的商品并提示补货
"""

def load_inventory(filename):
    """
    从 CSV 文件加载库存数据
    CSV 格式：商品名称,当前库存,安全库存阈值
    """
    inventory = []
    with open(filename, 'r', encoding='utf-8') as f:
        next(f)  # 跳过表头
        for line in f:
            parts = line.strip().split(',')
            if len(parts) == 3:
                name = parts[0]
                current = int(parts[1])
                threshold = int(parts[2])
                inventory.append({'name': name, 'current': current, 'threshold': threshold})
    return inventory


def check_low_stock(inventory):
    """
    检查库存是否低于安全阈值
    返回需要补货的商品列表
    """
    low_stock_items = []
    for item in inventory:
        # Bug 1（边界错误）：这里用了 >= 而不是 >，导致刚好等于阈值也算"需要补货"
        if item['current'] >= item['threshold']:
            low_stock_items.append(item)
    return low_stock_items


def suggest_reorder(low_stock_items):
    """
    生成补货建议
    建议补货数量 = 安全阈值 * 2 - 当前库存
    """
    suggestions = []
    for item in low_stock_items:
        # Bug 2（逻辑错误）：变量名写错了，把 threshold 拼成了 threshod
        qty = item['threshod'] * 2 - item['current']
        suggestions.append({
            'name': item['name'],
            'suggested_qty': qty
        })
    return suggestions


def print_report(low_stock_items, suggestions):
    """打印补货报告"""
    if len(low_stock_items) == 0:
        print("✓ 库存充足，无需补货")
        return

    print(f"⚠  共有 {len(low_stock_items)} 种商品需要补货：\n")
    print(f"{'商品名称':<15} {'当前库存':<10} {'阈值':<10} {'建议补货量':<10}")
    print("-" * 50)
    for i, item in enumerate(low_stock_items):
        sug = suggestions[i]['suggested_qty']
        print(f"{item['name']:<15} {item['current']:<10} {item['threshold']:<10} {sug:<10}")


def main():
    """主函数"""
    filename = 'test_data.csv'

    # 加载库存数据
    inventory = load_inventory(filename)

    # 检查低库存商品
    low_stock_items = check_low_stock(inventory)

    # 生成补货建议
    suggestions = suggest_reorder(low_stock_items)

    # 打印报告
    print_report(low_stock_items, suggestions)


if __name__ == '__main__':
    main()
