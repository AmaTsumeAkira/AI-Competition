import ScoreBadge from '../components/ScoreBadge'

export default function Rules() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-blue-900">📊 评分规则</h1>

      {/* 基础分 */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-blue-800">基础分（满分 100 分）</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-50 text-blue-900">
              <tr>
                <th className="px-4 py-3 font-semibold">赛道</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">分值</th>
                <th className="px-4 py-3 font-semibold">限时</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td rowSpan={3} className="px-4 py-3 font-medium text-blue-900">AI纠错 (PRO-DBG)</td>
                <td className="px-4 py-3">L1 — 库存检查</td>
                <td className="px-4 py-3"><ScoreBadge score={20} /></td>
                <td className="px-4 py-3">30 min</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">L2 — SQLite 成绩查询</td>
                <td className="px-4 py-3"><ScoreBadge score={35} /></td>
                <td className="px-4 py-3">60 min</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">L3 — 学生管理系统</td>
                <td className="px-4 py-3"><ScoreBadge score={45} /></td>
                <td className="px-4 py-3">90 min</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td rowSpan={3} className="px-4 py-3 font-medium text-blue-900">CLI部署 (PRO-CLI)</td>
                <td className="px-4 py-3">L1 — 网页爬虫</td>
                <td className="px-4 py-3"><ScoreBadge score={20} /></td>
                <td className="px-4 py-3">30 min</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">L2 — 数据库分析</td>
                <td className="px-4 py-3"><ScoreBadge score={35} /></td>
                <td className="px-4 py-3">60 min</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">L3 — Flask Web 应用</td>
                <td className="px-4 py-3"><ScoreBadge score={45} /></td>
                <td className="px-4 py-3">90 min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 极客加分 */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-blue-800">极客加分（最高 +30 分）</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: '自主接入 API', score: 10, desc: '在项目中调用外部 API（如天气、翻译、AI 接口）实现额外功能' },
            { title: '本地部署 Ollama', score: 12, desc: '使用 Ollama 在本地运行大语言模型，结合项目实现智能交互' },
            { title: '使用 OpenClaw', score: 8, desc: '利用 OpenClaw 框架的 Agent 技能提升开发效率或扩展功能' },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-blue-900">{item.title}</h3>
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                  +{item.score}
                </span>
              </div>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          <strong>总分：</strong>基础 100 + 极客加分 30 = <strong>最高 130 分</strong>
        </div>
      </section>

      {/* 工具限制 */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-blue-800">工具限制</h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
            <h3 className="mb-2 font-semibold text-blue-900">🔍 AI纠错 (PRO-DBG)</h3>
            <p className="text-sm text-gray-600">VSCode 插件 + CLI 工具均可使用</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
            <h3 className="mb-2 font-semibold text-blue-900">⚡ CLI部署 (PRO-CLI)</h3>
            <p className="text-sm text-gray-600">仅限 CLI 工具，<strong className="text-red-600">禁止使用 VSCode 插件</strong></p>
          </div>
        </div>
      </section>
    </div>
  )
}
