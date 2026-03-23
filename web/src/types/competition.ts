// ============================================================
// AI-Competition Web - TypeScript 类型定义
// 覆盖秩序册完整信息：赛项结构、评分维度、工具白名单、极客加分
// ============================================================

// ---------- 赛项与阶段 ----------

export type TrackId = 'PRO-DBG' | 'PRO-CLI'
export type StageId = 'prelim' | 'semifinal' | 'final'
export type ToolCategory = 'VSCode插件' | 'CLI工具'

export interface Level {
  id: string          // e.g. "L1", "L2", "L3"
  name: string        // e.g. "基础调试", "进阶调试", "综合调试"
  description: string
  fileCount: string   // e.g. "2-3个独立文件", "5-15个多文件"
  languages: string[]  // e.g. ["Python", "JavaScript"]
}

export interface Track {
  id: TrackId
  name: string
  levels: Level[]
  allowedToolCategories: ToolCategory[]
  prohibitedToolCategories: ToolCategory[]
}

// ---------- 评分维度 ----------

export type ScoreDimensionId =
  | 'functionality'     // 功能正确性/部署成功性
  | 'completeness'      // 修复完整性/项目功能完整性
  | 'codeQuality'       // 代码质量/工程化规范
  | 'aiToolUsage'       // AI工具运用/AI CLI运用
  | 'efficiency'        // 完成效率
  | 'presentation'      // 答辩（仅决赛）
  | 'automation'        // 自动化与闭环（仅CLI半决赛/决赛）

export interface ScoreDimension {
  id: ScoreDimensionId
  label: string
  description: string
  track: TrackId | 'COMMON'
  stageApplicable: StageId[]
}

export interface StageWeight {
  stage: StageId
  weight: number  // 0.0 - 1.0，表示百分比
}

export interface ScoringRule {
  dimension: ScoreDimension
  weights: StageWeight[]
  // 前端渲染用
  prelimWeight: string
  semifinalWeight: string
  finalWeight: string
}

// ---------- 工具白名单 ----------

export type ToolId =
  | 'vscode-1' | 'vscode-2' | 'vscode-3' | 'vscode-4' | 'vscode-5' | 'vscode-6' | 'vscode-7'
  | 'cli-1' | 'cli-2' | 'cli-3' | 'cli-4'

export interface Tool {
  id: ToolId
  name: string
  category: ToolCategory
  website: string
  description: string
  // GeekBonus 认定时需要
  verificationCommand?: string
  applicableTrack: TrackId | 'COMMON'
}

export interface ToolWhitelist {
  track: TrackId
  allowedToolIds: ToolId[]
  prohibitedToolCategories: ToolCategory[]
}

// ---------- 违规处罚 ----------

export type ViolationLevel = '一般违规' | '严重违规' | '特别严重违规'

export interface ViolationRule {
  level: ViolationLevel
  situation: string
  penalty: string
}

// ---------- 极客加分 ----------

export type GeekBonusCategory = 'api' | 'ollama' | 'openclaw'

export interface GeekBonusItem {
  id: string
  category: GeekBonusCategory
  title: string
  score: number       // 原始分值，如 4, 5, 3
  standard: string    // 认定标准描述
  evidence: string    // 认定方式/所需佐证
}

export interface GeekBonus {
  category: GeekBonusCategory
  displayName: string
  totalScore: number    // 该分类总分
  color: string          // Tailwind 配色类
  gradientClass: string
  spirit: string         // 精神内涵一句话
  items: GeekBonusItem[]
}

// ---------- API 平台（极客加分项一数据源） ----------

export interface APIPlatform {
  id: string
  name: string
  website: string
  apiDocUrl: string
  keyManagementUrl: string
  logo?: string
  notes?: string
}

// ---------- Ollama 参考数据（极客加分项二） ----------

export interface OllamaModel {
  id: string
  name: string
  size: string
  recommendedFor: string[]
  command: string
}

export interface OllamaRef {
  installUrl: string
  modelLibraryUrl: string
  quickVerifyCommand: string
  models: OllamaModel[]
}

// ---------- OpenClaw 参考数据（极客加分项三） ----------

export interface OpenClawRef {
  installUrl: string
  docUrl: string
  verificationSteps: string[]
  capabilities: string[]
}

// ---------- 完整秩序册数据结构 ----------

export interface ContestRulebook {
  tracks: Track[]
  scoreDimensions: ScoreDimension[]
  scoringRules: Record<TrackId, ScoringRule[]>
  toolWhitelists: Record<TrackId, ToolWhitelist>
  tools: Tool[]
  violations: ViolationRule[]
  geekBonuses: GeekBonus[]
  apiPlatforms: APIPlatform[]
  ollamaRef: OllamaRef
  openclawRef: OpenClawRef
  venueRules: VenueRule[]
}

export interface VenueRule {
  id: string
  text: string
}

// ---------- 代码文件预览（CodePreview组件用） ----------

export interface CodeFile {
  filename: string
  language: string
  label: string
  type: 'code' | 'data' | 'test'
  content: string
  bugs?: BugMarker[]
}

export interface BugMarker {
  line: number
  severity: 'error' | 'warning' | 'info'
  description: string
}

// ---------- 赛道级别（数据驱动的TrackLevel） ----------

export interface EvaluationCriterion {
  id: string
  name: string
  detail: string
}

export interface TrackLevel {
  id: string
  title: string
  difficulty: number // 1-5
  score: number
  phase: 'prelim' | 'semi' | 'final'
  description: string
  criteria: EvaluationCriterion[]
  standards: string[]
  deliverables?: string[]
  files: { filename: string; label: string; type: string; language: string }[]
  hint?: string
}
