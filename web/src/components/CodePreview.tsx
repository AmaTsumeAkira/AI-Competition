import { useState, useCallback, useEffect } from 'react'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CodeFile } from '../types/competition'

interface CodePreviewProps {
  file: CodeFile
}

function getLineBackground(file: CodeFile, lineNumber: number): string | undefined {
  if (!file.bugs) return undefined
  const bug = file.bugs.find(b => b.line === lineNumber)
  if (!bug) return undefined
  switch (bug.severity) {
    case 'error': return 'rgba(239, 68, 68, 0.15)'
    case 'warning': return 'rgba(245, 158, 11, 0.15)'
    case 'info': return 'rgba(59, 130, 246, 0.15)'
  }
}

const langMap: Record<string, string> = {
  py: 'python', js: 'javascript', ts: 'typescript', c: 'c', cpp: 'cpp',
  sh: 'bash', bat: 'batch', sql: 'sql', json: 'json', yaml: 'yaml',
  md: 'markdown', html: 'html', css: 'css', csv: 'plaintext', txt: 'plaintext',
}

function getLang(filename: string, language?: string): string {
  if (language) return language
  const ext = filename.split('.').pop() || ''
  return langMap[ext] || ext
}

// 文件类型图标
function FileIcon({ type }: { type: string }) {
  const color = type === 'test' ? 'text-green-400' : type === 'data' ? 'text-amber-400' : 'text-blue-400'
  return (
    <svg className={`w-4 h-4 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
}

export default function CodePreview({ file }: CodePreviewProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const lineCount = file.content.split('\n').length
  const highlightLang = getLang(file.filename, file.language)
  const bugCount = file.bugs?.length || 0

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [file.content])

  // ESC 关闭
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // 打开时禁止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-all group"
      >
        <FileIcon type={file.type} />
        <span className="font-mono text-xs">{file.filename}</span>
        {bugCount > 0 && (
          <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
            🐛 {bugCount}
          </span>
        )}
        <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      {/* 模态框 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          {/* 遮罩 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* 内容 */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden animate-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#252526] border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon type={file.type} />
                <span className="text-gray-200 font-mono text-sm truncate">{file.filename}</span>
                <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{highlightLang}</span>
                <span className="text-xs text-gray-500">{lineCount} 行</span>
                {bugCount > 0 && (
                  <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded flex items-center gap-1">
                    🐛 {bugCount} bug{bugCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1.5"
                >
                  {copied ? '✓ 已复制' : '📋 复制代码'}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Code area (scrollable) */}
            <div className="flex-1 overflow-auto">
              <SyntaxHighlighter
                language={highlightLang}
                style={vscDarkPlus}
                showLineNumbers
                wrapLines
                lineProps={(lineNumber: number) => {
                  const bg = getLineBackground(file, lineNumber)
                  const bug = file.bugs?.find(b => b.line === lineNumber)
                  return {
                    style: bg ? { backgroundColor: bg, display: 'block' } : { display: 'block' },
                    title: bug ? `[${bug.severity.toUpperCase()}] ${bug.description}` : undefined,
                  }
                }}
                customStyle={{
                  margin: 0,
                  padding: '16px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  background: '#1e1e1e',
                  minHeight: '100%',
                }}
              >
                {file.content}
              </SyntaxHighlighter>
            </div>

            {/* Footer */}
            <div className="px-5 py-2 bg-[#252526] border-t border-gray-700 shrink-0 flex items-center justify-between text-xs text-gray-500">
              <span>按 ESC 关闭</span>
              <span>{file.label}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
