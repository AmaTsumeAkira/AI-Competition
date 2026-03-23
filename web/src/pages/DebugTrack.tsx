import Accordion from '../components/Accordion'
import CodePreview from '../components/CodePreview'
import DifficultyStars from '../components/DifficultyStars'
import { debugLevels, debugCodeFiles } from '../data/debugTrack'
import { vscodePlugins, cliTools } from '../data/tools'

export default function DebugTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">AI纠错赛项（PRO-DBG）</h1>
        <p className="text-gray-600 mb-8">使用 AI 工具修复含有 Bug 的代码项目</p>

        {/* 赛项概述 */}
        <Accordion title="📋 赛项概述" defaultOpen={true}>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              选手需利用组委会指定的AI辅助工具，对官方给出的<strong>含有Bug的代码项目</strong>进行缺陷定位、调试分析及修复。
              考核的核心不仅是"能否修好Bug"，更在于选手<strong>如何高效运用AI工具辅助完成Debug全流程</strong>。
            </p>
            <p className="text-blue-600 font-medium">赛事采用初赛 → 复赛 → 决赛三级赛制，难度呈阶梯式上升。</p>
          </div>
        </Accordion>

        {/* 允许使用的工具 */}
        <Accordion title="🔧 允许使用的工具">
          <div className="text-sm text-gray-700 space-y-4">
            <p>选手须<strong>且只能</strong>使用以下工具列表中的工具完成比赛任务（可任选一种或多种组合使用）：</p>

            <p className="font-semibold text-gray-800">▎ VSCode 插件类</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-3 py-2 text-left border-b border-gray-200">序号</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">工具名称</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {vscodePlugins.map((tool, i) => (
                    <tr key={tool.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-100">{i + 1}</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium">{tool.name}</td>
                      <td className="px-3 py-2 border-b border-gray-100">{tool.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-semibold text-gray-800">▎ AI 命令行代码助手（CLI）类</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-3 py-2 text-left border-b border-gray-200">序号</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">工具名称</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {cliTools.map((tool, i) => (
                    <tr key={tool.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-100">{i + 1}</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium">{tool.name}</td>
                      <td className="px-3 py-2 border-b border-gray-100">{tool.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-amber-700 bg-amber-50 rounded-lg p-2 text-xs">⚠️ 选手在比赛过程中可同时使用VSCode插件类与CLI类工具，二者不互斥。</p>
          </div>
        </Accordion>

        {/* 各Level */}
        {debugLevels.map((level) => (
          <Accordion key={level.id} title={`${level.title} ${'★'.repeat(level.difficulty)}${'☆'.repeat(5 - level.difficulty)}（${level.score}分）`}>
            <div className="space-y-4 text-sm text-gray-700">
              {/* 难度 */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-medium text-blue-900">难度定位：<DifficultyStars level={level.difficulty} /></p>
              </div>

              {/* 描述 */}
              <p>{level.description}</p>

              {/* 考核要点 */}
              <p className="font-semibold text-gray-800">考核要点：</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-3 py-2 text-left border-b border-gray-200">编号</th>
                      <th className="px-3 py-2 text-left border-b border-gray-200">考核维度</th>
                      <th className="px-3 py-2 text-left border-b border-gray-200">具体内容</th>
                    </tr>
                  </thead>
                  <tbody>
                    {level.criteria.map((c, i) => (
                      <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 border-b border-gray-100 font-mono">{c.id}</td>
                        <td className="px-3 py-2 border-b border-gray-100 font-medium">{c.name}</td>
                        <td className="px-3 py-2 border-b border-gray-100">{c.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 交付物要求 */}
              {level.deliverables && level.deliverables.length > 0 && (
                <>
                  <p className="font-semibold text-gray-800">交付物要求：</p>
                  <ul className="list-disc list-inside space-y-1">
                    {level.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* 评判标准 */}
              <p className="font-semibold text-gray-800">评判标准：</p>
              <ul className="list-disc list-inside space-y-1">
                {level.standards.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              {/* 现场答辩说明（决赛） */}
              {level.phase === 'final' && (
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                  <p className="font-medium text-indigo-900 mb-1">🎤 现场答辩</p>
                  <p className="text-sm text-indigo-800">约10分钟/人，由技术评审委员会就<strong>解题思路</strong>、<strong>AI工具使用策略</strong>、<strong>代码质量</strong>三个维度进行质询。</p>
                </div>
              )}

              {/* 代码预览 */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-medium text-blue-900 mb-3">📎 代码文件预览</p>
                {debugCodeFiles[level.id]?.map((file) => (
                  <CodePreview key={file.filename} file={file} />
                ))}
              </div>

              {/* 提示 */}
              {level.hint && (
                <p className="text-blue-600">💡 提示：{level.hint}</p>
              )}
            </div>
          </Accordion>
        ))}
      </div>
    </div>
  )
}
