import { useState, useCallback } from 'react'
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { CodeFile, BugMarker } from '../types/competition'

interface CodePreviewProps {
  file: CodeFile
  defaultExpanded?: boolean
}

function getLineBackground(bugs: BugMarker[] | undefined, lineNumber: number): string | undefined {
  if (!bugs) return undefined
  const bug = bugs.find(b => b.line === lineNumber)
  if (!bug) return undefined
  switch (bug.severity) {
    case 'error': return 'rgba(239, 68, 68, 0.15)'
    case 'warning': return 'rgba(245, 158, 11, 0.15)'
    case 'info': return 'rgba(59, 130, 246, 0.15)'
  }
}

function BugBadge({ bugs }: { bugs?: BugMarker[] }) {
  if (!bugs || bugs.length === 0) return null
  const errors = bugs.filter(b => b.severity === 'error').length
  const warnings = bugs.filter(b => b.severity === 'warning').length
  const infos = bugs.filter(b => b.severity === 'info').length
  return (
    <span className="flex items-center gap-1.5 text-xs">
      {errors > 0 && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">🔴 {errors}</span>}
      {warnings > 0 && <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">🟡 {warnings}</span>}
      {infos > 0 && <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">🔵 {infos}</span>}
    </span>
  )
}

export default function CodePreview({ file, defaultExpanded }: CodePreviewProps) {
  const lineCount = file.content.split('\n').length
  const shouldAutoCollapse = lineCount > 200
  const [expanded, setExpanded] = useState(defaultExpanded ?? !shouldAutoCollapse)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(file.content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [file.content])

  const langMap: Record<string, string> = {
    py: 'python', js: 'javascript', ts: 'typescript', c: 'c', cpp: 'cpp',
    sh: 'bash', bat: 'batch', sql: 'sql', json: 'json', yaml: 'yaml',
    md: 'markdown', html: 'html', css: 'css', csv: 'plaintext', txt: 'plaintext',
  }
  const ext = file.filename.split('.').pop() || ''
  const highlightLang = file.language || langMap[ext] || ext

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-[#1e1e1e]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-gray-700">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-gray-300 font-mono text-sm truncate">{file.filename}</span>
          <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{highlightLang}</span>
          <span className="text-xs text-gray-500">{lineCount} 行</span>
          <BugBadge bugs={file.bugs} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {shouldAutoCollapse && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
            >
              {expanded ? '收起' : `展开 (${lineCount}行)`}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
          >
            {copied ? '✓ 已复制' : '📋 复制'}
          </button>
        </div>
      </div>

      {/* Code area */}
      {expanded && (
        <div className="relative">
          <SyntaxHighlighter
            language={highlightLang}
            style={vscDarkPlus}
            showLineNumbers
            wrapLines
            lineProps={(lineNumber: number) => {
              const bg = getLineBackground(file.bugs, lineNumber)
              const bug = file.bugs?.find(b => b.line === lineNumber)
              return {
                style: bg ? { backgroundColor: bg, display: 'block' } : { display: 'block' },
                title: bug ? `[${bug.severity.toUpperCase()}] ${bug.description}` : undefined,
              }
            }}
            customStyle={{
              margin: 0,
              padding: '12px',
              fontSize: '13px',
              lineHeight: '1.6',
              background: '#1e1e1e',
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        </div>
      )}

      {!expanded && (
        <div className="px-4 py-3 text-center text-gray-500 text-sm">
          文件已折叠 — 共 {lineCount} 行，点击展开查看
        </div>
      )}
    </div>
  )
}
