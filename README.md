# AI素养大赛·专业赛道 — 赛题仓库

> 组织者：Boss
> 最后更新：2026-03-23

## 赛项概览

### 赛项一：AI纠错 (PRO-DBG)

| 级别 | 项目 | 语言 | Bug数 | 测试用例 | 分值 | 限时 |
|------|------|------|-------|---------|------|------|
| L1 | 库存检查工具 | Python | 2 | 5 | 20 | 30min |
| L2 | SQLite 成绩查询 | Python+SQL | 3 | 10 | 35 | 60min |
| L3 | 学生管理系统 | C语言 | 4 | 15 | 45 | 90min |

### 赛项二：CLI部署开发 (PRO-CLI)

| 级别 | 项目 | 语言 | 测试用例 | 分值 | 限时 |
|------|------|------|---------|------|------|
| L1 | 网页数据爬虫 | Python | 5 | 20 | 30min |
| L2 | 数据库分析 | Python+SQL | 5 | 35 | 60min |
| L3 | Flask Web 应用 | Python | 10 | 45 | 90min |

### 极客加分

| 加分项 | 分值 |
|--------|------|
| 自主接入 API | +10 |
| 本地部署 Ollama | +12 |
| 使用 OpenClaw | +8 |

**总分：基础 100 + 加分 30 = 最高 130 分**

## 环境要求

- Windows / Mac / Linux 均可
- Python 3.8+
- pip 镜像：`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/`

## 目录结构

```
AI-Competition/
├── PRO-DBG/               # AI纠错赛项
│   ├── L1/                # Python 库存检查
│   ├── L2/                # SQLite 成绩查询
│   └── L3/                # C语言 学生管理
├── PRO-CLI/               # CLI部署赛项
│   ├── L1/                # Python 网页爬虫
│   ├── L2/                # SQLite 数据分析
│   └── L3/                # Flask Web 应用
└── README.md
```

## 工具限制

- **AI纠错**：VSCode 插件 + CLI 工具均可
- **CLI部署**：仅 CLI 工具，禁 VSCode 插件
