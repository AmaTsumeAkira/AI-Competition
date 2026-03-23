# AI纠错 Level 1：单文件·语法急救

## 任务说明

你收到了一个 Python 库存预警脚本 `inventory_checker.py`，该脚本读取 CSV 库存数据并生成预警报告。但脚本中存在若干 Bug，导致运行时崩溃或输出错误。

**你的任务：** 使用 AI 工具（允许使用 VSCode 插件和 CLI 工具）定位并修复所有 Bug，使脚本能够正常运行。

## 文件清单

| 文件 | 说明 |
|------|------|
| `inventory_checker.py` | 待修复的脚本（~180 行） |
| `test_data_normal.csv` | 正常测试数据 |
| `test_runner.py` | 自动化测试用例（选手勿改） |

## 运行方式

```bash
# 运行脚本
python3 inventory_checker.py test_data_normal.csv

# 运行测试
python3 test_runner.py
```

## 评分标准

- **测试通过率**：80%（5 个测试用例，通过 ≥3 个满分）
- **工具使用合理性**：20%（根据终端录屏评估）
- **满分**：20 分
- **限时**：30 分钟

## 提交物

1. 修复后的 `inventory_checker.py`
2. 终端操作录屏（展示 AI 工具使用过程）

## 提示

- Bug 隐藏在代码逻辑中，不是语法错误
- 仔细阅读每个函数的文档字符串
- 注意边界条件（空数据、特殊字符）
- 使用 `test_runner.py` 验证修复结果
