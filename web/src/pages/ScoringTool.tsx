import { useState, useRef, useEffect, useCallback } from 'react'
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

/* ── Canvas 绘制评分图片 ── */

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const ch of text) {
    const test = line + ch
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function renderResultToImage(
  result: ScoringResult,
  track: TrackOption,
  levelId: string,
  studentName: string,
  studentId: string,
): string {
  const W = 700
  const PAD = 32
  const contentW = W - PAD * 2

  // 预计算高度
  const headerH = 90
  const titleH = 48
  let detailH = titleH
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')!
  tempCtx.font = '13px system-ui, sans-serif'
  for (const s of result.scores) {
    const commentLines = wrapText(tempCtx, s.comment, contentW - 100)
    detailH += 24 + commentLines.length * 18 + 16
  }
  tempCtx.font = '14px system-ui, sans-serif'
  const summaryLines = wrapText(tempCtx, result.summary, contentW - 16)
  const summaryH = 40 + summaryLines.length * 20 + 16
  const studentInfoH = (studentName || studentId) ? 36 : 0
  const watermarkH = 36

  const H = PAD + headerH + studentInfoH + detailH + summaryH + watermarkH + PAD

  const canvas = document.createElement('canvas')
  const dpr = 2
  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  // 背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  let y = PAD

  // ── 头部渐变 ──
  const grad = ctx.createLinearGradient(PAD, y, W - PAD, y)
  grad.addColorStop(0, '#2563eb')
  grad.addColorStop(1, '#4f46e5')
  const rr = 12
  ctx.beginPath()
  ctx.moveTo(PAD + rr, y)
  ctx.lineTo(W - PAD - rr, y)
  ctx.arcTo(W - PAD, y, W - PAD, y + rr, rr)
  ctx.lineTo(W - PAD, y + headerH)
  ctx.lineTo(PAD, y + headerH)
  ctx.arcTo(PAD, y, PAD + rr, y, rr)
  ctx.closePath()
  ctx.fillStyle = grad
  ctx.fill()

  // 总分文字
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '13px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('推荐总分', PAD + 20, y + 28)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 36px system-ui, sans-serif'
  ctx.fillText(`${result.totalScore}`, PAD + 20, y + 68)
  const scoreW = ctx.measureText(`${result.totalScore}`).width
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillText(` / ${result.maxTotalScore}`, PAD + 20 + scoreW, y + 68)

  // 右侧赛项
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.font = '13px system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(
    `${track === 'PRO-DBG' ? 'AI纠错赛项' : 'CLI部署赛项'} · ${levelId}`,
    W - PAD - 20, y + 52,
  )

  y += headerH

  // ── 选手信息 ──
  if (studentName || studentId) {
    ctx.fillStyle = '#eef2ff'
    ctx.fillRect(PAD, y, contentW, studentInfoH)
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.strokeRect(PAD, y, contentW, studentInfoH)
    ctx.fillStyle = '#374151'
    ctx.font = '13px system-ui, sans-serif'
    ctx.textAlign = 'left'
    const infoParts: string[] = []
    if (studentName) infoParts.push(`姓名：${studentName}`)
    if (studentId) infoParts.push(`学号：${studentId}`)
    ctx.fillText(infoParts.join('    '), PAD + 16, y + 22)
    y += studentInfoH
  }

  // ── 详细评分 ──
  ctx.fillStyle = '#f9fafb'
  ctx.fillRect(PAD, y, contentW, detailH)
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.strokeRect(PAD, y, contentW, detailH)

  ctx.textAlign = 'left'
  ctx.fillStyle = '#1f2937'
  ctx.font = 'bold 15px system-ui, sans-serif'
  y += 28
  ctx.fillText('详细评分', PAD + 16, y)
  y += 24

  for (let i = 0; i < result.scores.length; i++) {
    const s = result.scores[i]
    // 分数
    const color = s.score >= s.maxScore * 0.8 ? '#16a34a' : s.score >= s.maxScore * 0.5 ? '#ca8a04' : '#dc2626'
    ctx.font = 'bold 16px system-ui, sans-serif'
    ctx.fillStyle = color
    ctx.textAlign = 'right'
    ctx.fillText(`${s.score}`, PAD + 80, y)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '13px system-ui, sans-serif'
    ctx.fillText(` / ${s.maxScore}`, PAD + 80 + ctx.measureText(` / ${s.maxScore}`).width + 10, y)
    ctx.textAlign = 'right'
    ctx.fillText(`/ ${s.maxScore}`, PAD + 110, y)

    // 项目名
    ctx.textAlign = 'left'
    ctx.fillStyle = '#1f2937'
    ctx.font = '500 14px system-ui, sans-serif'
    ctx.fillText(s.item, PAD + 120, y)
    y += 20

    // 评语
    ctx.font = '13px system-ui, sans-serif'
    ctx.fillStyle = '#6b7280'
    const cLines = wrapText(ctx, s.comment, contentW - 120 - 16)
    for (const ln of cLines) {
      ctx.fillText(ln, PAD + 120, y)
      y += 18
    }

    // 分隔线
    if (i < result.scores.length - 1) {
      ctx.strokeStyle = '#f3f4f6'
      ctx.beginPath()
      ctx.moveTo(PAD + 16, y + 4)
      ctx.lineTo(W - PAD - 16, y + 4)
      ctx.stroke()
    }
    y += 12
  }

  // ── AI 评语 ──
  const summaryY = y
  ctx.fillStyle = '#f9fafb'
  ctx.fillRect(PAD, summaryY, contentW, summaryH)
  ctx.strokeStyle = '#e5e7eb'
  ctx.strokeRect(PAD, summaryY, contentW, summaryH)

  y = summaryY + 24
  ctx.fillStyle = '#4b5563'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('AI 评语', PAD + 16, y)
  y += 20

  ctx.fillStyle = '#374151'
  ctx.font = '14px system-ui, sans-serif'
  for (const ln of summaryLines) {
    ctx.fillText(ln, PAD + 16, y)
    y += 20
  }

  // ── 水印 ──
  y += 8
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  ctx.font = '11px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${COMPETITION_NAME} · AI 自动评分 · ${new Date().toLocaleString('zh-CN')}`,
    W / 2, y + 12,
  )

  return canvas.toDataURL('image/png')
}

/* ── 组件 ── */

export default function ScoringTool() {
  const [track, setTrack] = useState<TrackOption>('PRO-DBG')
  const [levelId, setLevelId] = useState('L1')
  const [studentCode, setStudentCode] = useState('')
  const [fileName, setFileName] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [progressStep, setProgressStep] = useState(0)
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [resultImageUrl, setResultImageUrl] = useState('')
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

  // 结果变化时，用 Canvas 绘制评分图片
  useEffect(() => {
    if (!result) { setResultImageUrl(''); return }
    const url = renderResultToImage(result, track, levelId, studentName, studentId)
    setResultImageUrl(url)
  }, [result, track, levelId, studentName, studentId])

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
    setResultImageUrl('')
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
        setProgressStep(3)
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

  const handleDownloadImage = useCallback(() => {
    if (!resultImageUrl) return
    const link = document.createElement('a')
    link.download = `评分结果_${track}_${levelId}_${Date.now()}.png`
    link.href = resultImageUrl
    link.click()
  }, [resultImageUrl, track, levelId])

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">AI 自动评分工具</h1>
          <p className="mt-2 text-gray-500">上传修改后的代码文件，AI 将自动分析并给出推荐评分</p>
        </div>

        {/* 左右 3:7 布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* ── 左侧面板：选择 + 上传 ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* 选手信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">选手信息</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">姓名</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">学号</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="请输入学号"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 选择赛项和级别 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">选择赛项</h2>
              <div className="space-y-3 mb-4">
                <button
                  onClick={() => { setTrack('PRO-DBG'); setLevelId('L1'); setResult(null); setStudentCode(''); setFileName('') }}
                  className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-colors text-sm ${
                    track === 'PRO-DBG'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  AI纠错赛项 (PRO-DBG)
                </button>
                <button
                  onClick={() => { setTrack('PRO-CLI'); setLevelId('L1'); setResult(null); setStudentCode(''); setFileName('') }}
                  className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition-colors text-sm ${
                    track === 'PRO-CLI'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  CLI部署赛项 (PRO-CLI)
                </button>
              </div>

              <div className="flex gap-2">
                {visibleLevels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLevelId(l.id); setResult(null); setStudentCode(''); setFileName('') }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                <p className="mt-3 text-xs text-gray-500">{selectedLevel.description}</p>
              )}
            </div>

            {/* 上传文件 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">上传代码</h2>
              {mainFile && (
                <p className="text-xs text-gray-500 mb-3">
                  请上传 <code className="px-1 py-0.5 bg-gray-100 rounded text-gray-700">{mainFile.filename}</code>
                </p>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
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
                    <div className="text-blue-600 font-medium text-sm">{fileName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {studentCode.split('\n').length} 行 · 点击重新选择
                    </div>
                  </div>
                ) : (
                  <div>
                    <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 font-medium text-sm">点击选择文件</p>
                    <p className="text-xs text-gray-400 mt-1">.py .c .js .ts .java</p>
                  </div>
                )}
              </div>
            </div>

            {/* 评分按钮 */}
            <button
              onClick={handleScore}
              disabled={loading || !studentCode.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${
                loading || !studentCode.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {loading ? '评分中...' : '开始评分'}
            </button>
          </div>

          {/* ── 右侧面板：结果 ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* 进度面板 */}
            {loading && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
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
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* 评分结果 - 仅显示图片 */}
            {resultImageUrl && (
              <div>
                <img
                  src={resultImageUrl}
                  alt="评分结果"
                  className="w-full rounded-xl border border-gray-200 shadow-sm"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
                <button
                  onClick={handleDownloadImage}
                  className="mt-4 w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  保存评分截图
                </button>
              </div>
            )}

            {/* 图片生成中（结果已返回但图片还没渲染好） */}
            {result && !resultImageUrl && !loading && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <svg className="animate-spin mx-auto h-6 w-6 text-blue-500 mb-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-gray-500 text-sm">正在生成评分图片...</p>
              </div>
            )}

            {/* 空状态提示 */}
            {!loading && !result && !error && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-medium">评分结果将在此处显示</p>
                <p className="text-sm mt-1">请先在左侧选择赛项并上传代码文件</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
