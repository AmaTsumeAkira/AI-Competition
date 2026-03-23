#!/usr/bin/env python3
"""
库存预警检查脚本
功能：读取 CSV 库存数据，检查低库存商品并生成预警报告

⚠️ 本脚本包含若干 Bug，选手需使用 AI 工具定位并修复。

使用方法：
    python3 inventory_checker.py data.csv [--threshold 10]

参数：
    data.csv       库存数据文件路径
    --threshold    低库存预警阈值（默认 10）

输出：
    预警报告打印到标准输出
"""
import csv
import sys
import argparse
from collections import defaultdict


def load_inventory(csv_path):
    """
    从 CSV 文件加载库存数据
    
    CSV 格式：商品名,类别,数量,单价
    返回：商品字典列表
    """
    inventory = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            item = {
                "name": row["商品名"],
                "category": row["类别"],
                "quantity": int(row["数量"]),
                "price": float(row["单价"]),
                "value": int(row["数量"]) * float(row["单价"])
            }
            inventory.append(item)
    return inventory


def check_low_stock(inventory, threshold):
    """
    检查低库存商品
    
    返回：低于阈值的商品列表，按数量升序排列
    """
    low_stock = []
    for item in inventory:
        if item["quantitiy"] < threshold:  # BUG①：键名拼写错误，应为 "quantity"
            low_stock.append(item)
    
    # 按数量升序排列
    low_stock_sorted = sorted(low_stock, key=lambda x: x["quantity"])
    return low_stock_sorted


def get_most_valuable(inventory):
    """
    获取库存总价值最高的商品
    
    返回：价值最高的商品
    """
    sorted_by_value = sorted(inventory, key=lambda x: x["value"], reverse=True)
    return sorted_by_value[-1]  # BUG②：空列表时索引越界，应为 [0]


def generate_report(inventory, low_stock, top_item):
    """
    生成库存预警报告
    """
    report = []
    report.append("=" * 50)
    report.append("库存预警报告")
    report.append("=" * 50)
    report.append(f"商品总数：{len(inventory)}")
    report.append(f"低库存预警：{len(low_stock)} 件")
    report.append("")
    
    if low_stock:
        report.append("【低库存商品】")
        for item in low_stock:
            report.append(f"  - {item['name']}：剩余 {item['quantity']} 件（价值 ¥{item['value']:.2f}）")
        report.append("")
    
    report.append(f"【库存价值最高】")
    report.append(f"  {top_item['name']}：{top_item['quantity']} 件 × ¥{top_item['price']:.2f} = ¥{top_item['value']:.2f}")
    report.append("")
    
    # 按类别统计
    categories = defaultdict(lambda: {"count": 0, "total_value": 0})
    for item in inventory:
        cat = item["category"]
        categories[cat]["count"] += 1
        categories[cat]["total_value"] += item["value"]
    
    report.append("【分类统计】")
    for cat, stats in sorted(categories.items()):
        report.append(f"  {cat}：{stats['count']} 种商品，总价值 ¥{stats['total_value']:.2f}")
    
    return "\n".join(report)


def main():
    parser = argparse.ArgumentParser(description="库存预警检查")
    parser.add_argument("csv_file", help="CSV 库存数据文件路径")
    parser.add_argument("--threshold", type=int, default=10, help="低库存预警阈值")
    args = parser.parse_args()
    
    try:
        inventory = load_inventory(args.csv_file)
    except FileNotFoundError:
        print(f"错误：文件 {args.csv_file} 不存在")
        sys.exit(1)
    except Exception as e:
        print(f"错误：读取文件失败 - {e}")
        sys.exit(1)
    
    if not inventory:
        print("提示：库存数据为空")
        sys.exit(0)
    
    low_stock = check_low_stock(inventory, args.threshold)
    top_item = get_most_valuable(inventory)
    report = generate_report(inventory, low_stock, top_item)
    print(report)


if __name__ == "__main__":
    main()
