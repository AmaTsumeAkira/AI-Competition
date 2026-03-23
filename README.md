# AI素养大赛·专业赛道 — 赛题仓库

> 组织者：Boss
> AI 助手：Akira
> 最后更新：2026-03-23

## 目录结构

```
AI素养大赛/
├── PRO-DBG/                    # 赛项一：AI纠错
│   ├── L1/                     # Level 1：单文件·语法急救
│   │   ├── inventory_checker.py
│   │   ├── test_data_normal.csv
│   │   ├── test_runner.py
│   │   └── README.md
│   ├── L2/                     # Level 2：多文件·接口陷阱
│   │   ├── app.py
│   │   ├── models.py
│   │   ├── utils.py
│   │   └── README.md
│   └── L3/                     # Level 3：系统级·连锁危机
│       └── README.md
├── PRO-CLI/                    # 赛项二：CLI部署开发
│   ├── L1/                     # Level 1：基础配置
│   │   └── README.md
│   ├── L2/                     # Level 2：定制化·需求澄清
│   │   └── README.md
│   └── L3/                     # Level 3：自动化工作流·抗破坏
│       └── README.md
├── contest-cli/                # 裁判工具
├── tests/                      # 公共测试用例
└── README.md                   # 本文件
```

## 赛项概览

### 赛项一：AI纠错 (PRO-DBG)

| 级别 | 项目 | Bug数 | 测试用例 | 分值 | 限时 |
|------|------|-------|---------|------|------|
| L1 | 库存预警脚本 | 2 | 5 | 20 | 30min |
| L2 | Flask 微服务 | 4（含连锁） | 15 | 35 | 60min |
| L3 | 异步调度系统 | 8（含3组连锁） | 35 | 45 | 90min |

### 赛项二：CLI部署开发 (PRO-CLI)

| 级别 | 项目 | 测试用例 | 分值 | 限时 |
|------|------|---------|------|------|
| L1 | Nginx 反向代理 | 5 | 20 | 30min |
| L2 | Docker Compose 全栈部署 | 15 | 35 | 60min |
| L3 | Go 项目 CI/CD 工作流 | 3 故障注入 | 45 | 90min |

### 极客加分（适用两个赛项）

| 加分项 | 分值 |
|--------|------|
| 自主接入 API | +10 |
| 本地部署 Ollama | +12 |
| 使用 Openclaw | +8 |

## 评分总分

基础分上限 100 + 加分上限 30 = **理论最高 130 分**

## 工具限制

- **AI纠错**：VSCode 插件 + CLI 均可使用
- **CLI部署**：仅限 CLI 工具，禁止 VSCode 插件
