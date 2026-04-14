import { useState, useRef, useEffect } from 'react'
import { COMPETITION_NAME } from '../config'
import { debugLevels, debugCodeFiles } from '../data/debugTrack'
import { cliLevels, cliCodeFiles } from '../data/cliTrack'
import { isPhaseVisible } from '../config'
import type { TrackLevel, CodeFile } from '../types/competition'

/* ── 类型 ── */

interface ScoreItem {
  item: string
  maxScore: number
  score: number
  comment: string
}

interface ScoringResult {
  scores: ScoreItem[]
  totalScore: number
  maxTotalScore: number
  summary: string
}

/* ── 轨道/级别选项 ── */

type TrackOption = 'PRO-DBG' | 'PRO-CLI'

function getVisibleLevels(track: TrackOption): TrackLevel[] {
  const levels = track === 'PRO-DBG' ? debugLevels : cliLevels
  return levels.filter((l) => isPhaseVisible(l.phase))
}

function getCodeFiles(track: TrackOption, levelId: string): CodeFile[] {
  const files = track === 'PRO-DBG' ? debugCodeFiles : cliCodeFiles
  return files[levelId] ?? []
}

function getMainCodeFile(track: TrackOption, levelId: string): CodeFile | undefined {
  return getCodeFiles(track, levelId).find((f) => f.type === 'code')
}

/* ── Prompt 构造 ── */

function buildPrompt(
  track: TrackOption,
  level: TrackLevel,
  originalCode: string,
  studentCode: string,
): string {
  const trackName = track === 'PRO-DBG' ? 'AI纠错赛项' : 'CLI部署赛项'
  const criteriaText = level.criteria
    .map((c) => `- ${c.name}：${c.detail}`)
    .join('\n')

  if (track === 'PRO-DBG') {
    return `你是${COMPETITION_NAME}的自动评分系统。

赛项：${trackName} ${level.id}
题目描述：${level.description}

## 评分维度
${criteriaText}

## 原始含 Bug 代码
\`\`\`
${originalCode}
\`\`\`

## 选手提交的修复后代码
\`\`\`
${studentCode}
\`\`\`

## 评分要求
请对选手提交的代码进行评分。根据以下标准逐项打分：
1. 对比原始代码和修复后代码，识别选手修复了哪些 Bug
2. 检查修复是否正确、是否引入了新 Bug
3. 检查代码质量（注释、格式、异常处理）

请严格按照以下 JSON 格式返回评分结果（不要包含其他内容）：
{
  "scores": [
    {"item": "评分项名称", "maxScore": 满分值, "score": 得分, "comment": "评价说明"}
  ],
  "totalScore": 总分,
  "maxTotalScore": 满分,
  "summary": "总体评价（2-3句话）"
}

满分为 ${level.score} 分。`
  } else {
    return `你是${COMPETITION_NAME}的自动评分系统。

赛项：${trackName} ${level.id}
题目描述：${level.description}

## 评分维度
${criteriaText}

## 起始模板代码
\`\`\`
${originalCode}
\`\`\`

## 选手提交的完成后代码
\`\`\`
${studentCode}
\`\`\`

## 评分要求
请对选手提交的代码进行评分。根据以下标准逐项打分：
1. 检查选手是否正确完成了所有 TODO 项
2. 检查功能实现的正确性和完整性
3. 检查代码质量（注释、格式、异常处理）

请严格按照以下 JSON 格式返回评分结果（不要包含其他内容）：
{
  "scores": [
    {"item": "评分项名称", "maxScore": 满分值, "score": 得分, "comment": "评价说明"}
  ],
  "totalScore": 总分,
  "maxTotalScore": 满分,
  "summary": "总体评价（2-3句话）"
}

满分为 ${level.score} 分。`
  }
}

/* ── API 调用（流式） ── */

async function callMiniMaxAPI(
  prompt: string,
  onProgress: (text: string) => void,
): Promise<ScoringResult> {
  const apiKey = import.meta.env.VITE_MINIMAX_API_KEY
  const model = import.meta.env.VITE_MINIMAX_MODEL || 'MiniMax-M2.7'

  if (!apiKey) {
    throw new Error('未配置 VITE_MINIMAX_API_KEY 环境变量')
  }

  const resp = await fetch('https://api.minimaxi.com/v1/text/chatcompletion_v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        {
          role: 'system',
          content: '你是一个严格、专业的编程竞赛评分系统。你只输出 JSON 格式的评分结果，不输出其他任何内容。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_completion_tokens: 2048,
    }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`API 请求失败 (${resp.status}): ${text}`)
  }

  // 流式读取
  const reader = resp.body?.getReader()
  if (!reader) throw new Error('无法获取响应流')

  const decoder = new TextDecoder()
  let fullContent = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    // SSE 格式：每行以 data: 开头
    const lines = chunk.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data:')) continue
      const jsonStr = trimmed.slice(5).trim()
      if (jsonStr === '[DONE]') continue
      try {
        const parsed = JSON.parse(jsonStr)
        const delta = parsed.choices?.[0]?.delta?.content ?? ''
        if (delta) {
          fullContent += delta
          onProgress(fullContent)
        }
        // 也处理非流式的完整消息
        const msg = parsed.choices?.[0]?.message?.content
        if (msg && !fullContent) {
          fullContent = msg
          onProgress(fullContent)
        }
      } catch {
        // 忽略解析失败的行
      }
    }
  }

  // 提取 JSON
  const jsonMatch = fullContent.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('AI 返回的内容无法解析为 JSON')
  }

  return JSON.parse(jsonMatch[0]) as ScoringResult
}

/* ── 组件 ── */

export default function ScoringTool() {
  const [track, setTrack] = useState<TrackOption>('PRO-DBG')
  const [levelId, setLevelId] = useState('L1')
  const [studentCode, setStudentCode] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [progressStep, setProgressStep] = useState(0)
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progressSteps = [
    '正在读取代码...',
    '正在分析代码结构...',
    'AI 正在逐项评分...',
    '生成评分报告...',
  ]

  // 清理 timer
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current)
    }
  }, [])

  const visibleLevels = getVisibleLevels(track)
  const selectedLevel = visibleLevels.find((l) => l.id === levelId)
  const mainFile = getMainCodeFile(track, levelId)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setStudentCode(ev.target?.result as string)
    }
    reader.readAsText(file, 'utf-8')
  }

  const handleScore = async () => {
    if (!studentCode.trim()) {
      setError('请先上传代码文件')
      return
    }
    if (!selectedLevel || !mainFile) {
      setError('无法获取题目信息')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setStreamText('')
    setProgressStep(0)

    // 进度步骤动画
    let step = 0
    progressTimerRef.current = setInterval(() => {
      step = Math.min(step + 1, 3)
      setProgressStep(step)
    }, 3000)

    try {
      const prompt = buildPrompt(track, selectedLevel, mainFile.content, studentCode)
      const res = await callMiniMaxAPI(prompt, (text) => {
        setStreamText(text)
        setProgressStep(3) // 收到流式数据后跳到最后一步
      })
      setResult(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '评分失败，请稍后重试')
    } finally {
      setLoading(false)
      setStreamText('')
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">AI 自动评分工具</h1>
          <p className="mt-2 text-gray-500">上传修改后的代码文件，AI 将自动分析并给出推荐评分</p>
        </div>

        {/* 选择赛项和级别 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">选择赛项</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => { setTrack('PRO-DBG'); setLevelId('L1'); setResult(null); setStudentCode(''); setFileName('') }}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                track === 'PRO-DBG'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              AI纠错赛项 (PRO-DBG)
            </button>
            <button
              onClick={() => { setTrack('PRO-CLI'); setLevelId('L1'); setResult(null); setStudentCode(''); setFileName('') }}
              className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors ${
                track === 'PRO-CLI'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              CLI部署赛项 (PRO-CLI)
            </button>
          </div>

          <div className="flex gap-3">
            {visibleLevels.map((l) => (
              <button
                key={l.id}
                onClick={() => { setLevelId(l.id); setResult(null); setStudentCode(''); setFileName('') }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  levelId === l.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {l.id}
              </button>
            ))}
          </div>

          {selectedLevel && (
            <p className="mt-3 text-sm text-gray-500">{selectedLevel.description}</p>
          )}
        </div>

        {/* 上传文件 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">上传代码文件</h2>
          {mainFile && (
            <p className="text-sm text-gray-500 mb-3">
              请上传修改后的 <code className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700">{mainFile.filename}</code>
            </p>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".py,.c,.js,.ts,.java"
              onChange={handleFileUpload}
              className="hidden"
            />
            {fileName ? (
              <div>
                <div className="text-blue-600 font-medium">{fileName}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {studentCode.split('\n').length} 行代码 · 点击重新选择
                </div>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 font-medium">点击选择文件</p>
                <p className="text-sm text-gray-400 mt-1">支持 .py, .c, .js, .ts, .java</p>
              </div>
            )}
          </div>
        </div>

        {/* 评分按钮 */}
        <button
          onClick={handleScore}
          disabled={loading || !studentCode.trim()}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-colors mb-6 ${
            loading || !studentCode.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {loading ? '评分进行中...' : '开始评分'}
        </button>

        {/* 进度面板 */}
        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-blue-700 font-medium">{progressSteps[progressStep]}</span>
            </div>

            {/* 步骤指示器 */}
            <div className="flex items-center gap-2 mb-4">
              {progressSteps.map((_, i) => (
                <div key={i} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-colors duration-500 ${
                    i <= progressStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                </div>
              ))}
            </div>

            {/* 流式文本预览 */}
            {streamText && (
              <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-auto">
                <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono">{streamText.slice(-200)}</pre>
              </div>
            )}
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 评分结果 */}
        {result && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            {/* 总分 */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm opacity-80">推荐总分</div>
                  <div className="text-4xl font-bold mt-1">
                    {result.totalScore} <span className="text-lg opacity-70">/ {result.maxTotalScore}</span>
                  </div>
                </div>
                <div className="text-right text-sm opacity-80">
                  {track === 'PRO-DBG' ? 'AI纠错赛项' : 'CLI部署赛项'} · {levelId}
                </div>
              </div>
            </div>

            {/* 详细评分 */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">详细评分</h3>
              <div className="space-y-3">
                {result.scores.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex-shrink-0 w-20 text-right">
                      <span className={`text-lg font-bold ${s.score >= s.maxScore * 0.8 ? 'text-green-600' : s.score >= s.maxScore * 0.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {s.score}
                      </span>
                      <span className="text-gray-400 text-sm"> / {s.maxScore}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{s.item}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{s.comment}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 总结 */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">AI 评语</h3>
              <p className="text-gray-700">{result.summary}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
