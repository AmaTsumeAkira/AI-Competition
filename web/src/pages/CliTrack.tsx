import Accordion from '../components/Accordion'
import CodePreview from '../components/CodePreview'
import DifficultyStars from '../components/DifficultyStars'
import { cliLevels, cliCodeFiles } from '../data/cliTrack'
import { cliTools } from '../data/tools'
import { isPhaseVisible, CURRENT_PHASE } from '../config'

export default function CliTrack() {
  const visibleLevels = cliLevels.filter(l => isPhaseVisible(l.phase))

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CLI部署开发赛项（PRO-CLI）</h1>
        <p className="text-gray-600 mb-8">使用 AI 命令行工具完成编程项目</p>

        {/* 赛项概述 */}
        <Accordion title="📋 赛项概述" defaultOpen={true}>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              选手<strong>必须</strong>使用AI命令行代码助手，<strong>全程在终端（Terminal）环境下</strong>完成任务。
              核心考核目标为：成功部署2个指定的CLI工具，并基于这两个工具各创建一个功能完整的应用项目。
              本赛道旨在评估选手的终端操作熟练度、AI CLI工具驾驭能力及工程化项目构建能力。
            </p>
            <p className="text-blue-600 font-medium">
              {CURRENT_PHASE === 'final' ? '赛事采用初赛 → 复赛 → 决赛三级赛制，难度呈阶梯式上升。' :
               CURRENT_PHASE === 'semi' ? '当前为初赛和复赛阶段。' :
               '当前为初赛阶段。'}
            </p>
          </div>
        </Accordion>

        {/* 允许使用的工具 */}
        <Accordion title="🔧 允许使用的工具">
          <div className="text-sm text-gray-700 space-y-4">
            <p>本赛道选手<strong>仅限</strong>使用以下AI命令行代码助手（任选一种或多种）：</p>

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

            <p className="text-red-700 bg-red-50 rounded-lg p-2 text-xs">⛔ 严格限制：本赛道不允许使用任何VSCode插件类AI工具辅助完成任务。所有编码、调试、运行操作必须在终端环境中通过CLI工具完成。</p>
          </div>
        </Accordion>

        {/* 各Level */}
        {visibleLevels.map((level) => (
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
              {level.deliverables && (
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
              {level.standards && level.standards.length > 0 && (
                <>
                  <p className="font-semibold text-gray-800">评判标准：</p>
                  <ul className="list-disc list-inside space-y-1">
                    {level.standards.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}

              {/* 代码预览 */}
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-medium text-blue-900 mb-3">📎 代码文件预览</p>
                {cliCodeFiles[level.id]?.map((file) => (
                  <CodePreview key={file.filename} file={file} />
                ))}
              </div>

              {/* 下载赛题 */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-900">📦 下载本关赛题代码</p>
                  <p className="text-sm text-green-700 mt-1">PRO-CLI-{level.id}.zip</p>
                </div>
                <a
                  href={`./PRO-CLI-${level.id}.zip`}
                  download
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  下载
                </a>
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
