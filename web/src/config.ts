// ============================================================
// 赛程阶段控制变量
// 修改此变量即可控制网站显示的赛程内容范围
// ============================================================

// 'prelim'  = 仅显示初赛内容
// 'semi'    = 显示初赛 + 复赛内容
// 'final'   = 显示所有内容（初赛 + 复赛 + 决赛）
export const CURRENT_PHASE: 'prelim' | 'semi' | 'final' = 'prelim'

// 阶段顺序映射，用于比较
const PHASE_ORDER = { prelim: 1, semi: 2, final: 3 } as const

// 判断某个阶段是否在当前阶段范围内可显示
export function isPhaseVisible(phase: 'prelim' | 'semi' | 'final'): boolean {
  return PHASE_ORDER[phase] <= PHASE_ORDER[CURRENT_PHASE]
}

// 判断某个 stage（评分数据用的 key）是否可显示
export function isStageVisible(stage: 'prelim' | 'semifinal' | 'final'): boolean {
  const stageToPhase: Record<string, 'prelim' | 'semi' | 'final'> = {
    prelim: 'prelim',
    semifinal: 'semi',
    final: 'final',
  }
  return isPhaseVisible(stageToPhase[stage] ?? 'final')
}

// 比赛全称
export const COMPETITION_NAME = '第三届AIGC数字素养大赛'
export const COMPETITION_SHORT = 'AIGC数字素养大赛'
