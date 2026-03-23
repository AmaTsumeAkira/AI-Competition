// ============================================================
// 秩序册核心数据 - 评分体系 + 工具白名单 + 违规处罚
// ============================================================

import type {
  Track,
  TrackId,
  ScoreDimension,
  ScoringRule,
  ScoreDimensionId,
  Tool,
  ToolId,
  ToolWhitelist,
  ViolationRule,
  GeekBonus,
  APIPlatform,
  OllamaRef,
  OpenClawRef,
  VenueRule,
} from '../types/competition'

// ---------- 赛项结构 ----------

export const TRACKS: Track[] = [
  {
    id: 'PRO-DBG',
    name: 'AI纠错赛项',
    allowedToolCategories: ['VSCode插件', 'CLI工具'],
    prohibitedToolCategories: [],
    levels: [
      {
        id: 'L1',
        name: '独立文件调试',
        description: '2-3个独立文件，涵盖2-3种编程语言',
        fileCount: '2-3个',
        languages: ['Python', 'JavaScript', 'TypeScript'],
      },
      {
        id: 'L2',
        name: '多文件项目调试',
        description: '5-15个文件组成的完整项目',
        fileCount: '5-15个',
        languages: ['Python', 'JavaScript', 'SQL'],
      },
      {
        id: 'L3',
        name: '大型工程调试',
        description: '20个以上文件的复杂工程',
        fileCount: '20+',
        languages: ['C', 'Python', 'Go', 'Java'],
      },
    ],
  },
  {
    id: 'PRO-CLI',
    name: 'CLI部署开发赛项',
    allowedToolCategories: ['CLI工具'],
    prohibitedToolCategories: ['VSCode插件'],
    levels: [
      {
        id: 'L1',
        name: 'CLI工具安装与HelloWorld',
        description: '安装CLI工具并完成基础项目初始化',
        fileCount: '1-2个',
        languages: ['Shell', 'Python', 'Node.js'],
      },
      {
        id: 'L2',
        name: '定制配置与复杂项目',
        description: '深度定制配置，完成中等复杂度CLI项目',
        fileCount: '5-15个',
        languages: ['Shell', 'Python', 'YAML'],
      },
      {
        id: 'L3',
        name: '自动化工作流',
        description: '构建完整的自动化部署工作流',
        fileCount: '20+',
        languages: ['Shell', 'Python', 'Dockerfile', 'Makefile'],
      },
    ],
  },
]

// ---------- 评分维度定义 ----------

export const SCORE_DIMENSIONS: ScoreDimension[] = [
  {
    id: 'functionality',
    label: '功能正确性 / 部署成功性',
    description: 'Bug修复正确率（PRO-DBG）/ CLI工具是否正确安装并可正常运行（PRO-CLI）',
    track: 'COMMON',
    stageApplicable: ['prelim', 'semifinal', 'final'],
  },
  {
    id: 'completeness',
    label: '修复完整性 / 项目功能完整性',
    description: '全部Bug的发现率与修复覆盖率 / 应用项目的功能覆盖度与业务逻辑正确性',
    track: 'COMMON',
    stageApplicable: ['prelim', 'semifinal', 'final'],
  },
  {
    id: 'codeQuality',
    label: '代码质量 / 工程化规范',
    description: '修复方案的工程规范性、可读性、无副作用引入 / 代码结构、文档完整性、版本管理',
    track: 'COMMON',
    stageApplicable: ['prelim', 'semifinal', 'final'],
  },
  {
    id: 'aiToolUsage',
    label: 'AI工具运用 / AI CLI运用',
    description: 'AI工具使用的策略性、Prompt质量、工具链组合能力 / 终端下AI工具的使用深度与效率',
    track: 'COMMON',
    stageApplicable: ['prelim', 'semifinal', 'final'],
  },
  {
    id: 'efficiency',
    label: '完成效率',
    description: '同等正确率/质量下，用时更短者得分更高',
    track: 'COMMON',
    stageApplicable: ['prelim', 'semifinal', 'final'],
  },
  {
    id: 'presentation',
    label: '现场答辩',
    description: '解题思路、技术决策合理性、表达清晰度',
    track: 'COMMON',
    stageApplicable: ['final'],
  },
  {
    id: 'automation',
    label: '自动化与闭环（仅PRO-CLI）',
    description: '自动化脚本质量与业务闭环程度',
    track: 'PRO-CLI',
    stageApplicable: ['semifinal', 'final'],
  },
]

// ---------- PRO-DBG 评分权重表 ----------

export const PRO_DBG_SCORING_RULES: ScoringRule[] = [
  {
    dimension: SCORE_DIMENSIONS[0], // functionality
    weights: [
      { stage: 'prelim', weight: 0.50 },
      { stage: 'semifinal', weight: 0.40 },
      { stage: 'final', weight: 0.30 },
    ],
    prelimWeight: '50%',
    semifinalWeight: '40%',
    finalWeight: '30%',
  },
  {
    dimension: SCORE_DIMENSIONS[1], // completeness
    weights: [
      { stage: 'prelim', weight: 0.20 },
      { stage: 'semifinal', weight: 0.20 },
      { stage: 'final', weight: 0.15 },
    ],
    prelimWeight: '20%',
    semifinalWeight: '20%',
    finalWeight: '15%',
  },
  {
    dimension: SCORE_DIMENSIONS[2], // codeQuality
    weights: [
      { stage: 'prelim', weight: 0.10 },
      { stage: 'semifinal', weight: 0.15 },
      { stage: 'final', weight: 0.20 },
    ],
    prelimWeight: '10%',
    semifinalWeight: '15%',
    finalWeight: '20%',
  },
  {
    dimension: SCORE_DIMENSIONS[3], // aiToolUsage
    weights: [
      { stage: 'prelim', weight: 0.10 },
      { stage: 'semifinal', weight: 0.15 },
      { stage: 'final', weight: 0.15 },
    ],
    prelimWeight: '10%',
    semifinalWeight: '15%',
    finalWeight: '15%',
  },
  {
    dimension: SCORE_DIMENSIONS[4], // efficiency
    weights: [
      { stage: 'prelim', weight: 0.10 },
      { stage: 'semifinal', weight: 0.10 },
      { stage: 'final', weight: 0.05 },
    ],
    prelimWeight: '10%',
    semifinalWeight: '10%',
    finalWeight: '5%',
  },
  {
    dimension: SCORE_DIMENSIONS[5], // presentation
    weights: [
      { stage: 'prelim', weight: 0.0 },
      { stage: 'semifinal', weight: 0.0 },
      { stage: 'final', weight: 0.15 },
    ],
    prelimWeight: '—',
    semifinalWeight: '—',
    finalWeight: '15%',
  },
]

// ---------- PRO-CLI 评分权重表 ----------

export const PRO_CLI_SCORING_RULES: ScoringRule[] = [
  {
    dimension: SCORE_DIMENSIONS[0], // functionality (部署成功性)
    weights: [
      { stage: 'prelim', weight: 0.40 },
      { stage: 'semifinal', weight: 0.20 },
      { stage: 'final', weight: 0.10 },
    ],
    prelimWeight: '40%',
    semifinalWeight: '20%',
    finalWeight: '10%',
  },
  {
    dimension: SCORE_DIMENSIONS[1], // completeness (项目功能完整性)
    weights: [
      { stage: 'prelim', weight: 0.25 },
      { stage: 'semifinal', weight: 0.30 },
      { stage: 'final', weight: 0.30 },
    ],
    prelimWeight: '25%',
    semifinalWeight: '30%',
    finalWeight: '30%',
  },
  {
    dimension: SCORE_DIMENSIONS[2], // codeQuality (工程化规范)
    weights: [
      { stage: 'prelim', weight: 0.10 },
      { stage: 'semifinal', weight: 0.15 },
      { stage: 'final', weight: 0.20 },
    ],
    prelimWeight: '10%',
    semifinalWeight: '15%',
    finalWeight: '20%',
  },
  {
    dimension: SCORE_DIMENSIONS[3], // aiToolUsage (AI CLI运用)
    weights: [
      { stage: 'prelim', weight: 0.15 },
      { stage: 'semifinal', weight: 0.20 },
      { stage: 'final', weight: 0.15 },
    ],
    prelimWeight: '15%',
    semifinalWeight: '20%',
    finalWeight: '15%',
  },
  {
    dimension: SCORE_DIMENSIONS[4], // efficiency
    weights: [
      { stage: 'prelim', weight: 0.10 },
      { stage: 'semifinal', weight: 0.05 },
      { stage: 'final', weight: 0.05 },
    ],
    prelimWeight: '10%',
    semifinalWeight: '5%',
    finalWeight: '5%',
  },
  {
    dimension: SCORE_DIMENSIONS[6], // automation
    weights: [
      { stage: 'prelim', weight: 0.0 },
      { stage: 'semifinal', weight: 0.10 },
      { stage: 'final', weight: 0.05 },
    ],
    prelimWeight: '—',
    semifinalWeight: '10%',
    finalWeight: '5%',
  },
  {
    dimension: SCORE_DIMENSIONS[5], // presentation
    weights: [
      { stage: 'prelim', weight: 0.0 },
      { stage: 'semifinal', weight: 0.0 },
      { stage: 'final', weight: 0.15 },
    ],
    prelimWeight: '—',
    semifinalWeight: '—',
    finalWeight: '15%',
  },
]

// ---------- 工具白名单 ----------

export const TOOLS: Tool[] = [
  // VSCode 插件（PRO-DBG 可用，PRO-CLI 禁用）
  { id: 'vscode-1', name: 'Cline', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev', description: 'AI编程辅助插件，支持多模型切换', applicableTrack: 'PRO-DBG' },
  { id: 'vscode-2', name: 'Roo Code', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=snippedоля.roo-code', description: 'AI代码生成与调试助手', applicableTrack: 'PRO-DBG' },
  { id: 'vscode-3', name: 'GitHub Copilot', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=GitHub.copilot', description: 'AI代码补全与建议', applicableTrack: 'PRO-DBG' },
  { id: 'vscode-4', name: 'Amazon Q Developer', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.amazon-q', description: 'AWS AI 开发助手', applicableTrack: 'PRO-DBG' },
  { id: 'vscode-5', name: 'Codeium', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=Codeium.codeium', description: '免费AI代码补全插件', applicableTrack: 'PRO-DBG' },
  { id: 'vscode-6', name: 'Tabnine', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode', description: 'AI代码补全与重构', applicableTrack: 'PRO-DBG' },
  { id: 'vscode-7', name: 'Mintlify Doc Writer', category: 'VSCode插件', website: 'https://marketplace.visualstudio.com/items?itemName=mintlify.document', description: 'AI文档自动生成', applicableTrack: 'PRO-DBG' },
  // CLI 工具（两个赛项都可用）
  { id: 'cli-1', name: 'OpenAI CLI (ollama)', category: 'CLI工具', website: 'https://ollama.com', description: '本地大模型运行工具（Ollama）', applicableTrack: 'COMMON', verificationCommand: 'ollama list' },
  { id: 'cli-2', name: 'Aider', category: 'CLI工具', website: 'https://aider.chat', description: '终端AI编程助手', applicableTrack: 'COMMON', verificationCommand: 'aider --version' },
  { id: 'cli-3', name: 'CodeShell', category: 'CLI工具', website: 'https://codeshell.com', description: '命令行代码分析工具', applicableTrack: 'COMMON', verificationCommand: 'codeshell --version' },
  { id: 'cli-4', name: 'GitHub CLI (gh)', category: 'CLI工具', website: 'https://cli.github.com', description: 'GitHub官方命令行工具', applicableTrack: 'COMMON', verificationCommand: 'gh --version' },
]

export const TOOL_WHITELISTS: Record<TrackId, ToolWhitelist> = {
  'PRO-DBG': {
    track: 'PRO-DBG',
    allowedToolIds: ['vscode-1', 'vscode-2', 'vscode-3', 'vscode-4', 'vscode-5', 'vscode-6', 'vscode-7', 'cli-1', 'cli-2', 'cli-3', 'cli-4'],
    prohibitedToolCategories: [],
  },
  'PRO-CLI': {
    track: 'PRO-CLI',
    allowedToolIds: ['cli-1', 'cli-2', 'cli-3', 'cli-4'],
    prohibitedToolCategories: ['VSCode插件'],
  },
}

// ---------- 违规处罚表 ----------

export const VIOLATION_RULES: ViolationRule[] = [
  {
    level: '一般违规',
    situation: '无意中启动了非白名单AI工具但未实质性使用',
    penalty: '口头警告一次，要求立即关闭',
  },
  {
    level: '严重违规',
    situation: '使用非白名单AI工具完成了部分比赛任务',
    penalty: '该阶段成绩扣减50%',
  },
  {
    level: '特别严重违规',
    situation: '蓄意使用非白名单工具、或使用他人代码/账号',
    penalty: '取消该赛项全部成绩，通报批评',
  },
]

// ---------- 赛场纪律 ----------

export const VENUE_RULES: VenueRule[] = [
  { id: 'R-01', text: '选手须使用组委会提供或认可的竞赛设备与账号，不得自行携带含有预设代码的存储介质' },
  { id: 'R-02', text: '比赛期间禁止与场外人员通过任何方式交流比赛内容' },
  { id: 'R-03', text: '选手不得在比赛前获取或窥探赛题内容' },
  { id: 'R-04', text: '比赛全程将进行屏幕录制与操作日志留存' },
  { id: 'R-05', text: '选手应服从裁判指令，遵守赛场秩序与时间安排' },
  { id: 'R-06', text: '选手对AI工具生成的代码承担最终审查责任' },
]

// ---------- 极客加分数据 ----------

export const GEEK_BONUSES: GeekBonus[] = [
  {
    category: 'api',
    displayName: '自主接入API',
    totalScore: 10,
    color: 'blue',
    gradientClass: 'from-blue-600 to-blue-700',
    spirit: '突破封装壁垒，理解AI工程化底层逻辑',
    items: [
      { id: 'api-1', category: 'api', title: '成功申请并配置大模型API密钥', score: 4, standard: '在比赛环境中展示有效的API Key配置，且为选手自行在API开放平台申请获取', evidence: 'API配置文件截图（敏感信息可脱敏）、API调用日志或终端操作录屏' },
      { id: 'api-2', category: 'api', title: 'API驱动AI工具完成核心任务', score: 4, standard: '使用自主接入的API（而非工具默认内置的商业化封装端）驱动AI编码工具完成比赛关键操作', evidence: 'API调用日志、工具配置截图、实际任务操作记录' },
      { id: 'api-3', category: 'api', title: '多模型API切换与对比运用', score: 2, standard: '接入2个及以上不同厂商的API，并展示针对不同任务场景进行模型选择与切换的策略', evidence: '多个API配置截图、不同模型调用日志对比' },
    ],
  },
  {
    category: 'ollama',
    displayName: '本地化部署 Ollama',
    totalScore: 12,
    color: 'indigo',
    gradientClass: 'from-indigo-600 to-indigo-700',
    spirit: '拥抱开源生态，实现技术自主可控',
    items: [
      { id: 'ollama-1', category: 'ollama', title: '成功安装并运行Ollama', score: 3, standard: '在本地电脑成功安装Ollama并拉取至少一个开源模型，展示ollama list与ollama run命令执行结果', evidence: 'Ollama安装验证截图、模型拉取列表截图' },
      { id: 'ollama-2', category: 'ollama', title: '使用Ollama驱动AI工具完成比赛任务', score: 5, standard: '将Ollama作为AI编程工具的模型后端，成功驱动工具（如Cline、RooCode等）完成比赛核心任务', evidence: 'AI工具连接Ollama的配置截图及实际调用记录' },
      { id: 'ollama-3', category: 'ollama', title: '模型选型与参数调优', score: 2, standard: '展示针对比赛任务场景的模型选型策略（如选择CodeQwen用于代码纠错），并进行推理参数调优', evidence: '模型选型分析文档、参数调优前后对比截图' },
      { id: 'ollama-4', category: 'ollama', title: '多模型本地编排', score: 2, standard: '本地部署2个及以上模型，并展示基于任务分工的多模型协同调度能力', evidence: '多模型列表截图、任务分工配置文件' },
    ],
  },
  {
    category: 'openclaw',
    displayName: '使用 OpenClaw',
    totalScore: 8,
    color: 'violet',
    gradientClass: 'from-violet-600 to-violet-700',
    spirit: '探索前沿工具，拓展AI辅助编程边界',
    items: [
      { id: 'openclaw-1', category: 'openclaw', title: '成功安装并配置OpenClaw', score: 2, standard: '在竞赛环境中成功安装OpenClaw工具并完成基础配置', evidence: 'OpenClaw安装验证截图、配置输出日志' },
      { id: 'openclaw-2', category: 'openclaw', title: '使用OpenClaw进行深度代码修改', score: 3, standard: '利用OpenClaw对比赛项目进行深度代码分析与修改操作，展示操作过程与结果', evidence: 'OpenClaw操作历史、代码修改diff截图' },
      { id: 'openclaw-3', category: 'openclaw', title: '使用OpenClaw实现自动化处理', score: 3, standard: '利用OpenClaw构建自动化代码处理流程（如批量重构、代码风格统一、自动化补丁生成等）', evidence: '自动化脚本配置文件、批量处理执行日志' },
    ],
  },
]

// ---------- 12个推荐API平台 ----------

export const API_PLATFORMS: APIPlatform[] = [
  { id: 'deepseek', name: 'DeepSeek（深度求索）', website: 'https://platform.deepseek.com', apiDocUrl: 'https://platform.deepseek.com/api-docs', keyManagementUrl: 'https://platform.deepseek.com/api_keys', notes: 'DeepSeek系列模型' },
  { id: 'siliconflow', name: '硅基流动（SiliconFlow）', website: 'https://cloud.siliconflow.cn', apiDocUrl: 'https://docs.siliconflow.cn', keyManagementUrl: 'https://cloud.siliconflow.cn/account/ak', notes: '开源模型推理平台' },
  { id: 'qianwen', name: '千问百炼（阿里云）', website: 'https://bailian.console.aliyun.com', apiDocUrl: 'https://help.aliyun.com/zh/model-studio/', keyManagementUrl: 'https://bailian.console.aliyun.com/#/api-key', notes: '通义千问系列模型' },
  { id: 'mimo', name: '小米MiMo', website: 'https://platform.xiaomimimo.com', apiDocUrl: 'https://platform.xiaomimimo.com/#/docs/welcome', keyManagementUrl: 'https://platform.xiaomimimo.com/#/console/balance', notes: '小米MiMo模型' },
  { id: 'baichuan', name: '百川智能', website: 'https://platform.baichuan-ai.com', apiDocUrl: 'https://platform.baichuan-ai.com/docs/api', keyManagementUrl: 'https://platform.baichuan-ai.com/console/apikey', notes: '百川系列模型' },
  { id: 'kimi', name: 'Kimi（月之暗面）', website: 'https://platform.moonshot.cn', apiDocUrl: 'https://platform.moonshot.cn/docs', keyManagementUrl: 'https://platform.moonshot.cn/console/api-keys', notes: 'Moonshot系列模型' },
  { id: 'zhipu', name: '智谱AI', website: 'https://open.bigmodel.cn', apiDocUrl: 'https://open.bigmodel.cn/dev/api', keyManagementUrl: 'https://open.bigmodel.cn/usercenter/apikeys', notes: 'GLM系列模型' },
  { id: 'wenxin', name: '百度文心（千帆）', website: 'https://cloud.baidu.com', apiDocUrl: 'https://cloud.baidu.com/doc/index.html', keyManagementUrl: 'https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application', notes: '文心大模型系列' },
  { id: 'doubao', name: '字节豆包（火山方舟）', website: 'https://www.volcengine.com', apiDocUrl: 'https://www.volcengine.com/docs/82379', keyManagementUrl: 'https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey', notes: '豆包系列模型' },
  { id: 'hunyuan', name: '腾讯混元', website: 'https://cloud.tencent.com', apiDocUrl: 'https://cloud.tencent.com/document/product/1729', keyManagementUrl: 'https://console.cloud.tencent.com/cam/capi', notes: '腾讯混元大模型' },
  { id: 'spark', name: '讯飞星火', website: 'https://www.xfyun.cn', apiDocUrl: 'https://www.xfyun.cn/doc/spark/Web.html', keyManagementUrl: 'https://console.xfyun.cn/services', notes: '星火认知大模型' },
  { id: 'openrouter', name: 'OpenRouter', website: 'https://openrouter.ai', apiDocUrl: 'https://openrouter.ai/docs', keyManagementUrl: 'https://openrouter.ai/keys', notes: '多模型聚合路由平台' },
]

// ---------- Ollama 参考数据 ----------

export const OLLAMA_REF: OllamaRef = {
  installUrl: 'https://ollama.com/download',
  modelLibraryUrl: 'https://ollama.com/library',
  quickVerifyCommand: 'ollama list && ollama run qwen2.5-coder:latest "echo test"',
  models: [
    { id: 'qwen2.5-coder', name: 'Qwen2.5-Coder', size: '~7B参数', recommendedFor: ['代码补全', 'Bug修复', '代码审查'], command: 'ollama run qwen2.5-coder:latest' },
    { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', size: '~16B参数', recommendedFor: ['复杂代码生成', '多文件项目', '代码解释'], command: 'ollama run deepseek-coder-v2:latest' },
    { id: 'codellama', name: 'Code Llama', size: '~7B参数', recommendedFor: ['代码补全', '代码翻译', '自然语言转代码'], command: 'ollama run codellama:latest' },
    { id: 'starcoder2', name: 'StarCoder2', size: '~7B参数', recommendedFor: ['代码补全', '代码搜索', '大规模代码库分析'], command: 'ollama run starcoder2:latest' },
  ],
}

// ---------- OpenClaw 参考数据 ----------

export const OPENCLAW_REF: OpenClawRef = {
  installUrl: 'https://github.com/OpenClaw/OpenClaw',
  docUrl: 'https://docs.openclaw.ai',
  verificationSteps: [
    '克隆仓库：git clone https://github.com/OpenClaw/OpenClaw.git',
    '安装依赖：cd OpenClaw && npm install',
    '配置 AI Provider：修改配置文件切换 API 路由与密钥',
    '验证安装：openclaw --version',
  ],
  capabilities: [
    '深度代码分析与修改',
    '批量代码重构',
    '自动化补丁生成',
    '多语言代码审查',
    'Git工作流集成',
  ],
}

// ---------- 统一导出 ----------

export const CONTEST_RULEBOOK = {
  tracks: TRACKS,
  scoreDimensions: SCORE_DIMENSIONS,
  scoringRules: {
    'PRO-DBG': PRO_DBG_SCORING_RULES,
    'PRO-CLI': PRO_CLI_SCORING_RULES,
  },
  toolWhitelists: TOOL_WHITELISTS,
  tools: TOOLS,
  violations: VIOLATION_RULES,
  geekBonuses: GEEK_BONUSES,
  apiPlatforms: API_PLATFORMS,
  ollamaRef: OLLAMA_REF,
  openclawRef: OPENCLAW_REF,
  venueRules: VENUE_RULES,
}
