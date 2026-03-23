# AI-Competition Web 技术改进方案 - CodeGuard 补充分析
> 基于竞赛秩序册（2026-03-23版）+ 第1轮会议结论

---

## 一、数据结构设计：TypeScript 接口扩展

### 1.1 现有接口 vs 需扩展字段

当前 `Rules.tsx` 是纯展示型组件，所有数据硬编码在 JSX 中。需要从零构建 `src/types/competition.ts`：

```
现有字段（无） → 新增 20+ 类型/接口
```

### 1.2 完整接口定义清单

| 接口名 | 用途 | 关键字段 |
|--------|------|----------|
| `TrackId` | 赛项类型枚举 | `'PRO-DBG' \| 'PRO-CLI'` |
| `StageId` | 比赛阶段枚举 | `'prelim' \| 'semifinal' \| 'final'` |
| `Track` | 赛项完整信息 | `id, name, levels[], allowedToolCategories[], prohibitedToolCategories[]` |
| `Level` | 关卡信息 | `id, name, description, fileCount, languages[]` |
| `ScoreDimension` | 评分维度 | `id, label, description, track, stageApplicable[]` |
| `ScoringRule` | 评分权重规则 | `dimension, weights[], prelimWeight, semifinalWeight, finalWeight` |
| `Tool` | 工具白名单项 | `id, name, category, website, description, verificationCommand?, applicableTrack` |
| `ToolWhitelist` | 赛项工具限制 | `track, allowedToolIds[], prohibitedToolCategories[]` |
| `ViolationRule` | 违规处罚 | `level, situation, penalty` |
| `GeekBonus` | 极客加分项 | `category, displayName, totalScore, color, gradientClass, spirit, items[]` |
| `GeekBonusItem` | 加分子项 | `id, category, title, score, standard, evidence` |
| `APIPlatform` | API平台 | `id, name, website, apiDocUrl, keyManagementUrl, notes?` |
| `OllamaRef` | Ollama参考 | `installUrl, modelLibraryUrl, quickVerifyCommand, models[]` |
| `OllamaModel` | Ollama模型 | `id, name, size, recommendedFor[], command` |
| `OpenClawRef` | OpenClaw参考 | `installUrl, docUrl, verificationSteps[], capabilities[]` |
| `VenueRule` | 赛场纪律 | `id, text` |

### 1.3 评分维度映射逻辑

两个赛项共用一套 `ScoreDimension`，但权重不同：

```
SCORE_DIMENSIONS (7个维度定义)
    ├── functionality      → PRO-DBG[50/40/30%]  PRO-CLI[40/20/10%]
    ├── completeness      → PRO-DBG[20/20/15%]   PRO-CLI[25/30/30%]
    ├── codeQuality       → PRO-DBG[10/15/20%]   PRO-CLI[10/15/20%]
    ├── aiToolUsage       → PRO-DBG[10/15/15%]   PRO-CLI[15/20/15%]
    ├── efficiency        → PRO-DBG[10/10/5%]    PRO-CLI[10/5/5%]
    ├── presentation      → PRO-DBG[—/—/15%]     PRO-CLI[—/—/15%]
    └── automation        → PRO-DBG[N/A]          PRO-CLI[—/10%/5%]
```

---

## 二、/rules 页面技术实现

### 2.1 当前问题

- 6大块内容全部内联在单个组件中（约 400行 JSX）
- 评分权重用 `[[维度, 初赛%, 复赛%, 决赛%, 说明], ...]` 二维数组渲染
- 极客加分用 `[[子项, 分值, 认定标准], ...]` 二维数组渲染
- 无法复用数据、无类型检查、无搜索/筛选能力

### 2.2 重构方案

```
Rules.tsx (重)  ←  从 src/data/scoring.ts 读取所有数据
    ├── RuleOverview     ←  评分体系总览（复用 ScoringRule 数据）
    ├── ScoringTable     ←  通用评分权重表组件（PRO-DBG/PRO-CLI 共用）
    ├── GeekBonusCard    ←  极客加分卡（3类，各自展开）
    ├── ToolWhitelist    ←  工具白名单展示
    ├── ViolationTable   ←  违规处罚表
    └── VenueRules       ←  赛场纪律列表
```

### 2.3 核心组件设计

#### ScoringTable（通用评分权重表）

```tsx
// 接收结构化 ScoringRule[]，按 stage 动态渲染列
interface Props {
  rules: ScoringRule[]
  trackId: TrackId
  stageLabels?: Record<StageId, string>
}

// 权重条可视化：weight → 百分比宽度色块
const WeightBar = ({ weight }: { weight: number }) => (
  <div className="w-full bg-gray-100 rounded h-2">
    <div className="bg-blue-600 h-2 rounded" style={{ width: `${weight * 100}%` }} />
  </div>
)
```

#### GeekBonusCard（极客加分展开卡）

```tsx
// 每个 GeekBonus 渲染为一个可展开卡片
// 内部用 Accordion 组件（已有）展开子项列表
// 顶部色带由 gradientClass 字段驱动
// 每个子项显示：title + score badge + standard + evidence
```

#### ToolWhitelist（工具白名单）

```tsx
// 左右分栏：PRO-DBG（7插件+4CLI）| PRO-CLI（仅4CLI）
// 工具卡片显示：name + category badge + website链接 + verificationCommand（如有）
```

---

## 三、极客加分指引页面（/bonus）

### 3.1 页面定位

独立路由 `/bonus`，从 `src/data/scoring.ts` 读取 `GEEK_BONUSES`、`API_PLATFORMS`、`OLLAMA_REF`、`OPENCLAW_REF`。

### 3.2 三区块设计

```
/bonus
  ├── Tab: API接入 (+10分)
  │     └── API_PLATFORMS[12] 卡片网格
  │           每张卡：平台名 + 官网链接 + API文档链接 + 密钥管理链接 + notes
  │
  ├── Tab: Ollama本地部署 (+12分)
  │     ├── 安装指引（installUrl + 快速验证命令高亮）
  │     ├── 模型库（OLLAMA_REF.models[]）
  │     │     每模型：name + size + 推荐场景 + pull/run 命令
  │     └── 认定标准（GEEK_BONUSES[1].items[]）
  │
  └── Tab: OpenClaw (+8分)
        ├── 安装步骤（OPENCLAW_REF.verificationSteps[]）
        ├── 能力列表（OPENCLAW_REF.capabilities[]）
        └── 认定标准（GEEK_BONUSES[2].items[]）
```

### 3.3 数据源设计

所有数据集中存于 `src/data/scoring.ts`，按类型分区注释：

```ts
// ---------- 极客加分数据 ----------
export const GEEK_BONUSES: GeekBonus[] = [...]

// ---------- 12个推荐API平台 ----------
export const API_PLATFORMS: APIPlatform[] = [...]

// ---------- Ollama 参考数据 ----------
export const OLLAMA_REF: OllamaRef = {...}

// ---------- OpenClaw 参考数据 ----------
export const OPENCLAW_REF: OpenClawRef = {...}
```

---

## 四、文件清单（完整）

### 4.1 新建文件

```
web/src/
├── types/
│   └── competition.ts              # 所有 TypeScript 接口定义（新建）
├── data/
│   ├── scoring.ts                  # 秩序册核心数据（新建，~17000字节）
│   └── levels.ts                   # 关卡原始数据：文件路径/描述（新建）
├── components/
│   ├── ScoringTable.tsx            # 评分权重表组件（新建）
│   ├── GeekBonusCard.tsx           # 极客加分卡组件（新建）
│   ├── ToolWhitelist.tsx           # 工具白名单展示组件（新建）
│   ├── ViolationTable.tsx          # 违规处罚表组件（新建）
│   ├── APIPlatformCard.tsx         # API平台卡片（新建）
│   ├── OllamaModelCard.tsx         # Ollama模型卡片（新建）
│   └── Accordion.tsx               # 已有，验证通过
├── pages/
│   ├── Bonus.tsx                   # /bonus 极客加分指引页（新建）
│   ├── Guide.tsx                   # /guide 操作指引页（新建）
│   ├── Environment.tsx             # /environment 环境搭建页（新建）
│   └── Rules.tsx                   # 重构，从 data/ 读取（修改）
└── utils/
    └── scoring.ts                  # 评分相关工具函数：权重计算、百分化（新建）
```

### 4.2 修改文件

| 文件 | 修改内容 |
|------|----------|
| `src/App.tsx` | 新增 `/bonus`、`/guide`、`/environment` 三个路由 |
| `src/components/Header.tsx` | 导航栏新增三项链接 |
| `src/pages/Rules.tsx` | 重构为数据驱动，删除所有硬编码，引用 `ScoringTable`/`GeekBonusCard` 等组件 |
| `tsconfig.json` | 确认 `src/types/` 被纳入 `typeRoots`（通常无需修改） |
| `package.json` | 确认依赖：React Router v7（已安装）、Tailwind CSS v4（已安装） |

### 4.3 文件依赖关系图

```
App.tsx (路由)
    │
    ├── Header.tsx (导航)
    │
    ├── Rules.tsx
    │     ├── data/scoring.ts  (TRACKS, PRO_DBG_SCORING_RULES, PRO_CLI_SCORING_RULES,
    │     │                     GEEK_BONUSES, VIOLATION_RULES, VENUE_RULES, TOOLS)
    │     ├── types/competition.ts
    │     ├── ScoringTable.tsx
    │     ├── GeekBonusCard.tsx
    │     ├── ToolWhitelist.tsx
    │     ├── ViolationTable.tsx
    │     └── Accordion.tsx (已有)
    │
    ├── Bonus.tsx
    │     ├── data/scoring.ts  (GEEK_BONUSES, API_PLATFORMS, OLLAMA_REF, OPENCLAW_REF)
    │     ├── types/competition.ts
    │     ├── APIPlatformCard.tsx
    │     ├── OllamaModelCard.tsx
    │     └── GeekBonusCard.tsx
    │
    ├── Guide.tsx                 (操作指引：工具安装/使用/切换)
    │     └── data/scoring.ts  (TOOLS, TOOL_WHITELISTS)
    │
    └── Environment.tsx           (环境搭建：Python/Node/VSCode/Ollama/Git)
          └── data/levels.ts     (LEVELS 原始数据)
```

---

## 五、技术债务清理（第1轮结论执行情况）

| 任务 | 状态 | 说明 |
|------|------|------|
| 数据外移 `src/data/` | ✅ 已创建 | `scoring.ts` 含所有秩序册数据 |
| 类型定义 `src/types/` | ✅ 已创建 | `competition.ts` 含 20+ 接口 |
| CodePreview 组件 | ⏳ 待实现 | 需新增组件目录 |
| GitHub API 缓存 | ⏳ 待实现 | 需新增 `utils/githubCache.ts` |
| `/guide` 页面 | ⏳ 待实现 | 操作指引 |
| `/environment` 页面 | ⏳ 待实现 | 环境搭建 |

---

## 六、实现优先级建议

```
P0（必须，首页相关）
  1. types/competition.ts        → 类型安全基线
  2. data/scoring.ts             → 单一数据源
  3. Rules.tsx 重构              → 页面正确性

P1（加分项核心）
  4. Bonus.tsx + APIPlatformCard → /bonus 页面
  5. OllamaModelCard             → Ollama 区块

P2（工具链完整）
  6. Guide.tsx + ToolWhitelist   → /guide 页面
  7. Environment.tsx             → /environment 页面

P3（代码质量）
  8. ScoringTable 组件           → 可复用
  9. GeekBonusCard 组件         → 可复用
  10. utils/scoring.ts          → 权重计算工具
  11. GitHub API 缓存            → 代码预览性能
  12. CodePreview 组件          → 语法高亮+Bug标记
```
