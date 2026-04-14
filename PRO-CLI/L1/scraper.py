"""
网页数据爬虫 - 起始模板
功能：从 quotes.toscrape.com 抓取名言数据并保存为 CSV
⚠️ 此文件包含基础框架和部分 TODO，请使用 AI 命令行工具帮助你完成！

要求：
1. 实现 scrape_page() —— 抓取指定页码的名言数据
2. 实现 save_to_csv() —— 将数据保存为 CSV 文件
3. 实现 get_top_authors() —— 统计出现次数最多的作者
4. 实现 filter_by_tag() —— 按标签过滤名言
5. 确保主程序正常运行并输出统计信息
"""

import requests
from bs4 import BeautifulSoup
import csv
import argparse
import sys
import platform
import os
from collections import Counter


def print_system_info():
    """
    打印系统状态信息（运行环境检查）
    需要打印以下信息：
    - Python 版本
    - 操作系统名称与版本
    - 当前工作目录
    - requests 库版本
    - BeautifulSoup 是否可用

    输出示例：
    === 系统状态 ===
    Python: 3.11.5
    OS: Windows 10
    CWD: C:\Users\...
    requests: 2.31.0
    BeautifulSoup: 可用
    ================
    """
    # TODO: 请补充此函数的实现
    # 提示：
    # - sys.version.split()[0] 获取 Python 版本
    # - platform.system() + platform.release() 获取 OS 信息
    # - os.getcwd() 获取当前工作目录
    # - requests.__version__ 获取 requests 版本
    # - 用 try/except 检查 BeautifulSoup 是否可导入
    pass


def scrape_page(page_num):
    """
    抓取指定页码的名言数据
    返回: [{'text': '...', 'author': '...', 'tags': ['tag1', 'tag2']}, ...]

    提示：
    - URL 格式: https://quotes.toscrape.com/page/{页码}/
    - 使用 BeautifulSoup 解析 HTML
    - 名言在 <span class="text"> 中
    - 作者在 <small class="author"> 中
    - 标签在 <a class="tag"> 中（每条名言可能有多个标签）
    """
    url = f"https://quotes.toscrape.com/page/{page_num}/"

    quotes = []
    # TODO: 请补充此函数的实现
    # 步骤1: 用 requests.get() 获取页面
    # 步骤2: 用 BeautifulSoup(html, 'html.parser') 解析
    # 步骤3: 用 soup.find_all('div', class_='quote') 遍历所有名言
    # 步骤4: 从每个名言中提取 text, author, tags

    return quotes


def save_to_csv(quotes, filename="quotes.csv"):
    """
    将名言数据保存为 CSV 文件

    CSV 格式（含表头）：
    text,author,tags
    "The world...",Albert Einstein,"inspirational,life"

    注意：
    - tags 列表应用逗号连接为一个字符串
    - 使用 UTF-8 编码
    - 包含 CSV 表头行
    """
    # TODO: 请补充此函数的实现
    # 提示：使用 csv.DictWriter
    pass


def get_top_authors(quotes, top_n=5):
    """
    统计出现次数最多的前 N 位作者
    返回: [('Author Name', count), ...]

    提示：可以使用 collections.Counter
    """
    # TODO: 请补充此函数的实现
    return []


def filter_by_tag(quotes, tag):
    """
    按标签过滤名言
    返回包含指定标签的名言列表

    参数：
    - quotes: 名言列表
    - tag: 要过滤的标签字符串
    """
    # TODO: 请补充此函数的实现
    return []


def print_statistics(quotes):
    """
    打印统计信息
    - 总名言数
    - 不同作者数
    - 最常见的 5 位作者
    - 包含 'life' 标签的名言数

    此函数已完成，无需修改
    """
    print(f"\n{'='*40}")
    print(f"  抓取统计报告")
    print(f"{'='*40}")
    print(f"总名言数：{len(quotes)}")

    authors = set(q['author'] for q in quotes)
    print(f"不同作者数：{len(authors)}")

    top = get_top_authors(quotes, 5)
    if top:
        print(f"\n最常见的作者：")
        for author, count in top:
            print(f"  {author}: {count} 条")

    life_quotes = filter_by_tag(quotes, 'life')
    print(f"\n含 'life' 标签的名言：{len(life_quotes)} 条")
    print(f"{'='*40}")


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="网页名言爬虫")
    parser.add_argument("--pages", type=int, default=3, help="抓取页数（默认3页）")
    parser.add_argument("--output", type=str, default="quotes.csv", help="输出文件名")
    parser.add_argument("--tag", type=str, default=None, help="按标签过滤")
    args = parser.parse_args()

    # 打印系统信息
    print_system_info()

    all_quotes = []
    for page in range(1, args.pages + 1):
        print(f"正在抓取第 {page} 页...")
        quotes = scrape_page(page)
        all_quotes.extend(quotes)
        print(f"  获取 {len(quotes)} 条名言")

    if args.tag:
        print(f"\n按标签 '{args.tag}' 过滤...")
        all_quotes = filter_by_tag(all_quotes, args.tag)
        print(f"过滤后剩余 {len(all_quotes)} 条")

    save_to_csv(all_quotes, args.output)
    print(f"\n已保存到 {args.output}")

    print_statistics(all_quotes)


if __name__ == "__main__":
    main()
