# CLI部署 Level 1：Python 网页数据采集

## 任务说明

编写一个 Python 脚本，从指定网页抓取数据并保存为 CSV 文件。

**考核目标：** 使用 AI 命令行工具（如 Claude Code、Codex CLI）完成编码任务。

## 安装依赖

```bash
# Windows PowerShell
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ requests beautifulsoup4 pandas

# Mac/Linux
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ requests beautifulsoup4 pandas
```

## 任务要求

### 基础任务（15分）
1. 从 `https://quotes.toscrape.com/` 抓取名言数据
2. 提取：名言内容、作者、标签
3. 保存为 `quotes.csv`，UTF-8 编码
4. 至少抓取 3 页数据

### 进阶任务（5分）
5. 添加命令行参数支持：`python scraper.py --pages 5`
6. 添加错误处理（网络超时、页面不存在）

## 文件清单

| 文件 | 说明 |
|------|------|
| `README.md` | 本文件 |
| `scraper.py` | 起始模板（含 TODO 标记，请补充完善） |
| `quotes.csv` | 抓取结果（选手生成） |
| `test_runner.py` | 测试脚本（选手勿改） |

## 评分标准

| 项目 | 分值 | 标准 |
|------|------|------|
| 数据完整性 | 8 分 | 抓取 ≥3 页，字段齐全 |
| 文件格式 | 4 分 | CSV 格式正确，UTF-8 编码 |
| 代码质量 | 3 分 | 有注释，异常处理 |
| 进阶功能 | 5 分 | 命令行参数 + 错误处理 |
| **满分** | **20 分** | |

## 限时：30 分钟

## 提交物
1. `scraper.py` 源代码
2. `quotes.csv` 数据文件
3. 终端操作录屏（展示 AI 工具使用过程）

## 提示
- 网站 `quotes.toscrape.com` 是专门用于练习爬虫的网站
- 不需要登录，不需要反爬处理
- 注意翻页机制（URL 中的 page 参数）
