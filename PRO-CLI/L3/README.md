# CLI部署 Level 3：Python Web 应用

## 任务说明

将一个 Python Web 应用部署到本机运行，完成配置和测试。

**考核目标：** 使用 AI 命令行工具完成应用部署和故障排查。

## 安装依赖

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ flask
```

## 任务要求

### 基础任务（25分）
1. 运行 `python init_app.py` 创建初始项目
2. 修复 `app.py` 中的 3 个配置错误
3. 编写 `deploy.sh`（Windows 用 `deploy.bat`）一键启动脚本
4. 编写 `test_api.py` 接口测试脚本
5. 应用正常运行，所有接口返回正确数据

### 进阶任务（20分）
6. 添加数据持久化（SQLite）
7. 添加错误处理中间件
8. 编写 API 文档 `api_docs.md`

## 文件清单

| 文件 | 说明 |
|------|------|
| `init_app.py` | 项目初始化脚本（已提供） |
| `app.py` | Flask 应用（含 3 个 Bug） |
| `deploy.sh` | 选手编写的一键启动 |
| `test_api.py` | 选手编写的接口测试 |
| `api_docs.md` | 选手编写的 API 文档 |

## Bug 清单

| # | 文件 | 问题 |
|---|------|------|
| 1 | app.py | 端口配置错误（写了 8080 但实际监听 5000） |
| 2 | app.py | 数据库路径使用了绝对路径，换机器就报错 |
| 3 | app.py | 缺少 CORS 配置，前端无法调用 |

## 评分标准

| 项目 | 分值 | 标准 |
|------|------|------|
| Bug 修复 | 15 分 | 3 个 Bug 全部修复 |
| 部署脚本 | 5 分 | 一键启动正常 |
| 接口测试 | 5 分 | 测试脚本覆盖所有接口 |
| 进阶功能 | 20 分 | 数据持久化 + 错误处理 + API 文档 |
| **满分** | **45 分** | |

## 限时：90 分钟

## 提交物
1. 修复后的全部源代码
2. `deploy.sh` / `deploy.bat` 启动脚本
3. `test_api.py` 测试脚本
4. `api_docs.md` API 文档
5. 终端操作录屏
