# CLI部署 Level 2：Python + SQLite 数据分析

## 任务说明

使用 Python 分析 SQLite 数据库中的学生成绩数据，生成统计报表。

**考核目标：** 使用 AI 命令行工具完成数据库操作和数据分析。

## 安装依赖

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ pandas
```

Python 自带 sqlite3 模块，无需额外安装。

## 任务要求

### 基础任务（20分）
1. 运行 `python init_db.py` 创建示例数据库
2. 编写 `analysis.py` 完成以下分析：
   - 查询每个学生的总分和平均分
   - 查询每门课的最高分、最低分、平均分
   - 查询不及格学生名单（任意一科 < 60）
   - 查询各分数段人数分布（90+、80-89、70-79、60-69、<60）
3. 将分析结果保存为 `report.txt`

### 进阶任务（15分）
4. 使用 SQL 的 JOIN/GROUP BY/HAVING 完成查询
5. 支持命令行参数：`python analysis.py --subject 数学`
6. 输出格式美观（表格对齐、分隔线）

## 文件清单

| 文件 | 说明 |
|------|------|
| `init_db.py` | 数据库初始化脚本（已提供） |
| `analysis.py` | 选手编写的数据分析脚本 |
| `report.txt` | 分析结果 |
| `test_runner.py` | 测试脚本（选手勿改） |

## 评分标准

| 项目 | 分值 | 标准 |
|------|------|------|
| 基础查询 | 12 分 | 4 项查询全部正确 |
| SQL 质量 | 4 分 | 使用 JOIN/GROUP BY |
| 输出格式 | 4 分 | 格式美观、对齐 |
| 进阶功能 | 15 分 | 命令行参数 + 按科目查询 + 输出美观 |
| **满分** | **35 分** | |

## 限时：60 分钟

## 提交物
1. `analysis.py` 源代码
2. `report.txt` 分析报告
3. 终端操作录屏
