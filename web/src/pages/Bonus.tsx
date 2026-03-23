import { useState } from 'react'
import {
  GEEK_BONUSES,
  API_PLATFORMS,
  OLLAMA_REF,
  OPENCLAW_REF,
} from '../data/scoring'
import type { GeekBonusCategory, APIPlatform } from '../types/competition'

// API平台卡片
function APIPlatformCard({ platform }: { platform: APIPlatform }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-base">{platform.name}</h3>
        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">API</span>
      </div>
      {platform.notes && (
        <p className="text-xs text-gray-500 mb-3">{platform.notes}</p>
      )}
      <div className="space-y-1.5">
        <a
          href={platform.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span className="text-gray-400 w-4">🌐</span>
          官网
        </a>
        <a
          href={platform.apiDocUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span className="text-gray-400 w-4">📄</span>
          API文档
        </a>
        <a
          href={platform.keyManagementUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <span className="text-gray-400 w-4">🔑</span>
          密钥管理
        </a>
      </div>
    </div>
  )
}

// Ollama 模型卡片
function OllamaModelCard({ model }: { model: typeof OLLAMA_REF.models[0] }) {
  return (
    <div className="bg-white rounded-xl border border-indigo-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-indigo-900">{model.name}</h3>
        <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded">{model.size}</span>
      </div>
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">推荐场景</p>
        <div className="flex flex-wrap gap-1">
          {model.recommendedFor.map((tag) => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">{tag}</span>
          ))}
        </div>
      </div>
      <code className="block w-full bg-gray-900 text-green-400 text-xs p-2.5 rounded-lg overflow-x-auto">
        {model.command}
      </code>
    </div>
  )
}

// 极客加分卡（带展开子项）
function GeekBonusSection({ bonus }: { bonus: typeof GEEK_BONUSES[0] }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
      {/* 头部色带 */}
      <div className={`bg-gradient-to-r ${bonus.gradientClass} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{bonus.displayName}</h3>
            <p className="text-white/80 text-sm mt-0.5">{bonus.spirit}</p>
          </div>
          <div className="text-right">
            <span className="bg-white/20 text-white text-2xl font-black">+{bonus.totalScore}</span>
            <p className="text-white/60 text-xs">满分 {bonus.totalScore} 分</p>
          </div>
        </div>
      </div>

      {/* 子项列表 */}
      <div className="p-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 mb-4 hover:text-gray-900"
        >
          <span>查看 {bonus.items.length} 个加分子项</span>
          <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {expanded && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">子项</th>
                  <th className="text-center py-2 px-3 font-semibold text-gray-700 border border-gray-200 w-16">分值</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">认定标准</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">佐证要求</th>
                </tr>
              </thead>
              <tbody>
                {bonus.items.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-2.5 px-3 border border-gray-200 font-medium">{item.title}</td>
                    <td className="py-2.5 px-3 border border-gray-200 text-center">
                      <span className={`font-bold ${
                        bonus.color === 'blue' ? 'text-blue-700' :
                        bonus.color === 'indigo' ? 'text-indigo-700' : 'text-violet-700'
                      }`}>+{item.score}分</span>
                    </td>
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-600">{item.standard}</td>
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-500 text-xs">{item.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

type TabId = 'api' | 'ollama' | 'openclaw'

export default function Bonus() {
  const [activeTab, setActiveTab] = useState<TabId>('api')

  const tabs: { id: TabId; label: string; score: number; color: string }[] = [
    { id: 'api', label: '自主接入API', score: 10, color: 'blue' },
    { id: 'ollama', label: 'Ollama 本地部署', score: 12, color: 'indigo' },
    { id: 'openclaw', label: 'OpenClaw', score: 8, color: 'violet' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* 页头 */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-2">Geek Bonus</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">极客加分指引</h1>
          <p className="text-gray-500">理论最高 +30 分，可与基础分叠加。两个赛项通用。</p>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? `border-${tab.color}-600 text-${tab.color}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? `bg-${tab.color}-100 text-${tab.color}-700` : 'bg-gray-100 text-gray-500'
              }`}>+{tab.score}</span>
            </button>
          ))}
        </div>

        {/* API 接入 */}
        {activeTab === 'api' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">自主接入 API（+10分）</h2>
              <p className="text-sm text-gray-500">以下12个平台为组委会推荐平台，选手也可自行选择其他平台。</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {API_PLATFORMS.map((p) => (
                <APIPlatformCard key={p.id} platform={p} />
              ))}
            </div>
            <div className="mt-8">
              <GeekBonusSection bonus={GEEK_BONUSES.find(b => b.category === 'api')!} />
            </div>
          </div>
        )}

        {/* Ollama */}
        {activeTab === 'ollama' && (
          <div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-indigo-900 mb-4">安装指引</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-indigo-800 mb-1">安装文档</p>
                  <a href={OLLAMA_REF.installUrl} target="_blank" rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline text-sm">{OLLAMA_REF.installUrl}</a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-indigo-800 mb-1">快速验证</p>
                  <code className="block bg-gray-900 text-green-400 text-xs p-3 rounded-lg overflow-x-auto">
                    {OLLAMA_REF.quickVerifyCommand}
                  </code>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-4">推荐模型库</h3>
            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              {OLLAMA_REF.models.map((m) => (
                <OllamaModelCard key={m.id} model={m} />
              ))}
            </div>

            <GeekBonusSection bonus={GEEK_BONUSES.find(b => b.category === 'ollama')!} />
          </div>
        )}

        {/* OpenClaw */}
        {activeTab === 'openclaw' && (
          <div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-violet-900 mb-4">安装与配置</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-violet-800 mb-1">安装地址</p>
                    <a href={OPENCLAW_REF.installUrl} target="_blank" rel="noopener noreferrer"
                      className="text-violet-600 hover:underline text-sm break-all">{OPENCLAW_REF.installUrl}</a>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-violet-800 mb-1">文档</p>
                    <a href={OPENCLAW_REF.docUrl} target="_blank" rel="noopener noreferrer"
                      className="text-violet-600 hover:underline text-sm break-all">{OPENCLAW_REF.docUrl}</a>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-violet-800 mb-2">验证步骤</p>
                  <ol className="space-y-1.5">
                    {OPENCLAW_REF.verificationSteps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-violet-600 font-bold shrink-0">{i + 1}.</span>
                        <code className="text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded text-xs">{step.split('：')[1] ?? step}</code>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-sm font-semibold text-violet-800 mb-2">核心能力</p>
                  <ul className="grid grid-cols-2 gap-1.5">
                    {OPENCLAW_REF.capabilities.map((cap) => (
                      <li key={cap} className="text-sm text-gray-700 flex items-center gap-1.5">
                        <span className="text-violet-500">✓</span>{cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <GeekBonusSection bonus={GEEK_BONUSES.find(b => b.category === 'openclaw')!} />
          </div>
        )}
      </div>
    </div>
  )
}
