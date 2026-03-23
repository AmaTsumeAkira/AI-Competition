"""
网页数据爬虫 - 起始模板
⚠️ 此文件包含基础框架，请补充完善使其能正常运行

使用 AI 命令行工具帮助你完成此任务！
"""

import requests
from bs4 import BeautifulSoup
import csv
import argparse


def scrape_page(page_num):
    """
    抓取指定页码的名言数据
    返回: [{'text': '...', 'author': '...', 'tags': '...'}, ...]
    
    提示：
    - URL 格式: https://quotes.toscrape.com/page/{页码}/
    - 使用 BeautifulSoup 解析 HTML
    - 名言在 <span class="text"> 中
    - 作者在 <small class="author"> 中
    - 标签在 <a class="tag"> 中
    """
    # TODO: 请补充此函数的实现
    url = f"https://quotes.toscrape.com/page/{page_num}/"
    
    quotes = []
    # 提示：用 requests.get 获取页面
    # 提示：用 BeautifulSoup 解析
    # 提示：遍历所有名言，提取 text, author, tags
    
    return quotes


def save_to_csv(quotes, filename="quotes.csv"):
    """
    将名言数据保存为 CSV 文件
    
    CSV 格式: 名言内容,作者,标签（逗号分隔）
    编码: UTF-8
    """
    # TODO: 请补充此函数的实现
    # 提示：使用 csv.writer 或 pandas.DataFrame.to_csv
    pass


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="网页名言爬虫")
    parser.add_argument("--pages", type=int, default=3, help="抓取页数（默认3页）")
    args = parser.parse_args()

    all_quotes = []
    for page in range(1, args.pages + 1):
        print(f"正在抓取第 {page} 页...")
        quotes = scrape_page(page)
        all_quotes.extend(quotes)
        print(f"  获取 {len(quotes)} 条名言")

    save_to_csv(all_quotes)
    print(f"\n完成！共抓取 {len(all_quotes)} 条名言，已保存到 quotes.csv")


if __name__ == "__main__":
    main()
