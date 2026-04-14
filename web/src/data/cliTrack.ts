import type { TrackLevel } from '../types/competition'

// Vite raw imports — 将代码文件打包进前端产物
// @ts-ignore
import l1_scraper from '../../../PRO-CLI/L1/scraper.py?raw'
// @ts-ignore
import l1_testRunner from '../../../PRO-CLI/L1/test_runner.py?raw'
// @ts-ignore
import l2_initDb from '../../../PRO-CLI/L2/init_db.py?raw'
// @ts-ignore
import l2_testRunner from '../../../PRO-CLI/L2/test_runner.py?raw'
// @ts-ignore
import l3_app from '../../../PRO-CLI/L3/app.py?raw'
// @ts-ignore
import l3_initApp from '../../../PRO-CLI/L3/init_app.py?raw'
// @ts-ignore
import l3_testRunner from '../../../PRO-CLI/L3/test_runner.py?raw'
// @ts-ignore
import l3_deployBat from '../../../PRO-CLI/L3/deploy.bat?raw'

import type { CodeFile } from '../types/competition'

export const cliLevels: TrackLevel[] = [
  {
    id: 'L1',
    title: 'Level 1：初赛 — 基础CLI工具配置与入门项目搭建',
    difficulty: 2,
    score: 20,
    phase: 'prelim',
    description: '组委会提供一个 Python 爬虫模板（含 5 处 TODO），选手需使用 AI CLI 工具完成系统状态检查、网页数据抓取、CSV 保存、作者统计排名和标签筛选功能，并实现命令行参数与统计摘要输出。',
    criteria: [
      { id: 'C1-01', name: '系统状态检查', detail: '打印 Python 版本、操作系统、工作目录、库版本等环境信息' },
      { id: 'C1-02', name: '数据抓取能力', detail: '正确抓取多页数据，提取 text/author/tags 字段' },
      { id: 'C1-03', name: 'CSV 文件处理', detail: '正确保存为 CSV 格式，含表头，UTF-8 编码' },
      { id: 'C1-04', name: '数据统计与筛选', detail: '实现 get_top_authors 和 filter_by_tag 函数' },
      { id: 'C1-05', name: '命令行参数与摘要', detail: '支持 --output 和 --tag 参数，打印统计摘要' },
    ],
    standards: [
      '爬虫正确抓取 ≥30 条数据并保存为 CSV',
      '统计和筛选函数逻辑正确',
      '命令行参数可用，统计摘要正确输出',
    ],
    deliverables: [
      'scraper.py 完整源代码',
      'quotes.csv 数据文件',
      '终端操作录屏（展示 AI 工具使用过程）',
    ],
    files: [
      { filename: 'scraper.py', label: '起始模板', type: 'code', language: 'python' },
      { filename: 'test_runner.py', label: '测试用例', type: 'test', language: 'python' },
    ],
    hint: '模板中有 5 处 TODO，包含系统信息打印；使用 AI CLI 工具逐一完成',
  },
  {
    id: 'L2',
    title: 'Level 2：复赛 — 定制化CLI工具部署与复杂项目开发',
    difficulty: 4,
    score: 35,
    phase: 'semi',
    description: '选手需对 CLI 工具进行定制化配置与深度调优，并使用这两个工具分别构建一个包含复杂参数传递、数据流处理及外部依赖管理的功能性项目。',
    criteria: [
      { id: 'C2-01', name: '定制化配置', detail: '自定义模型参数（temperature、top_p等）、配置文件定制、多profile管理' },
      { id: 'C2-02', name: '复杂参数传递', detail: '命令行参数解析（positional/optional/flag）、环境变量注入、配置文件级联覆盖' },
      { id: 'C2-03', name: '数据流处理', detail: '标准输入/输出管道（stdin/stdout pipeline）、文件I/O操作、JSON/CSV数据处理' },
      { id: 'C2-04', name: '外部依赖管理', detail: '第三方库引入与版本锁定、依赖冲突解决、虚拟环境/容器隔离' },
      { id: 'C2-05', name: '错误处理与日志', detail: '异常捕获与优雅退出、结构化日志输出、调试信息分级' },
      { id: 'C2-06', name: 'AI CLI深度运用', detail: '利用AI CLI工具进行复杂代码生成、重构、测试用例编写等高级操作' },
    ],
    standards: [
      '定制化配置正确且可验证',
      '功能性项目运行稳定，逻辑正确',
      '代码工程化规范，文档完整',
    ],
    deliverables: [
      '2个定制化配置后的CLI工具运行环境验证截图',
      '2个功能性项目的完整源代码及README文档',
      '项目运行演示（≤5分钟）',
    ],
    files: [
      { filename: 'init_db.py', label: '数据库初始化', type: 'code', language: 'python' },
      { filename: 'test_runner.py', label: '测试用例', type: 'test', language: 'python' },
    ],
    hint: '使用 SQL 的 JOIN、GROUP BY、HAVING',
  },
  {
    id: 'L3',
    title: 'Level 3：决赛 — 极客级CLI自动化工作流部署与业务闭环实现',
    difficulty: 5,
    score: 45,
    phase: 'final',
    description: '选手需构建极客级 CLI 自动化工作流，要求两个项目分别实现完整的业务闭环，展现高水平的终端工程化能力与 AI CLI 编排能力。',
    criteria: [
      { id: 'C3-01', name: '自动化测试集成', detail: '单元测试/集成测试自动化执行、测试覆盖率报告生成、测试结果自动分析' },
      { id: 'C3-02', name: 'CI/CD流程模拟', detail: '构建→测试→打包→部署的完整Pipeline脚本编写与自动化执行' },
      { id: 'C3-03', name: '复杂文件批处理', detail: '多格式文件批量转换/处理、正则匹配与文本处理、目录树递归操作' },
      { id: 'C3-04', name: 'Shell脚本编排', detail: '多工具协同的Shell脚本编排、定时任务调度、进程管理与守护' },
      { id: 'C3-05', name: '业务闭环完整性', detail: '项目具备完整的输入→处理→输出→反馈链路，可独立运行并产出有效业务成果' },
      { id: 'C3-06', name: '工程化规范', detail: '代码文档完整性、Git版本管理规范、目录结构清晰度、可复现性' },
      { id: 'C3-07', name: '现场答辩', detail: '向评委演示完整工作流、阐述AI CLI工具编排策略与技术决策逻辑' },
    ],
    standards: [
      '自动化工作流完整可执行',
      '业务闭环独立运行且产出有效结果',
      'CI/CD Pipeline脚本质量',
      '工程化规范达标',
      '现场答辩表现',
    ],
    deliverables: [
      '2个完整业务闭环项目的全部源代码（含自动化脚本）',
      '项目技术架构文档（Markdown格式）',
      'CI/CD Pipeline运行日志与截图',
      '现场答辩演示（≤15分钟，含Q&A）',
    ],
    files: [
      { filename: 'app.py', label: '含 Bug 的 Flask 应用', type: 'code', language: 'python' },
      { filename: 'init_app.py', label: '项目初始化', type: 'code', language: 'python' },
      { filename: 'test_runner.py', label: '测试用例', type: 'test', language: 'python' },
      { filename: 'deploy.bat', label: 'Windows 启动脚本', type: 'code', language: 'batch' },
    ],
    hint: '注意端口配置、数据库路径、CORS',
  },
]

// 导入的代码文件内容
export const cliCodeFiles: Record<string, CodeFile[]> = {
  L1: [
    {
      filename: 'scraper.py',
      language: 'python',
      label: '起始模板',
      type: 'code',
      content: l1_scraper,
    },
    {
      filename: 'test_runner.py',
      language: 'python',
      label: '测试用例',
      type: 'test',
      content: l1_testRunner,
    },
  ],
  L2: [
    {
      filename: 'init_db.py',
      language: 'python',
      label: '数据库初始化',
      type: 'code',
      content: l2_initDb,
    },
    {
      filename: 'test_runner.py',
      language: 'python',
      label: '测试用例',
      type: 'test',
      content: l2_testRunner,
    },
  ],
  L3: [
    {
      filename: 'app.py',
      language: 'python',
      label: '含 Bug 的 Flask 应用',
      type: 'code',
      content: l3_app,
    },
    {
      filename: 'init_app.py',
      language: 'python',
      label: '项目初始化',
      type: 'code',
      content: l3_initApp,
    },
    {
      filename: 'test_runner.py',
      language: 'python',
      label: '测试用例',
      type: 'test',
      content: l3_testRunner,
    },
    {
      filename: 'deploy.bat',
      language: 'batch',
      label: 'Windows 启动脚本',
      type: 'code',
      content: l3_deployBat,
    },
  ],
}
