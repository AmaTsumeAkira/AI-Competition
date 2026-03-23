import { Link } from 'react-router-dom'
import ScoreBadge from '../components/ScoreBadge'

const schedule = [
  { date: '2026-03-24', event: '赛事启动 & 赛题发布', status: '进行中' },
  { date: '2026-03-31', event: 'AI纠错（PRO-DBG）竞赛日', status: '即将开始' },
  { date: '2026-04-07', event: 'CLI部署（PRO-CLI）竞赛日', status: '即将开始' },
  { date: '2026-04-14', event: '成绩公示 & 极客加分审核', status: '未开始' },
  { date: '2026-04-21', event: '颁奖典礼', status: '未开始' },
]

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-blue-900 sm:text-4xl">AI素养大赛 · 专业赛道</h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 leading-relaxed">
          面向计算机专业学生的 AI 实战能力竞赛，涵盖 AI纠错 与 CLI部署开发 两大赛项。
          通过真实场景考察参赛者的代码调试、工具链部署与工程化能力。
        </p>
      </section>

      {/* 赛程表 */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-bold text-blue-900">📅 赛程安排</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-50 text-blue-900">
              <tr>
                <th className="px-4 py-3 font-semibold">日期</th>
                <th className="px-4 py-3 font-semibold">事项</th>
                <th className="px-4 py-3 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedule.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{row.date}</td>
                  <td className="px-4 py-3 text-gray-700">{row.event}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        row.status === '进行中'
                          ? 'bg-green-100 text-green-800'
                          : row.status === '即将开始'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 赛道入口 */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-blue-900">🏁 赛道入口</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* AI纠错 */}
          <Link
            to="/debug"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg hover:border-blue-300"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-600">🔍 AI纠错</h3>
              <span className="text-sm text-gray-500">PRO-DBG</span>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              修复含 Bug 的代码程序，涵盖 Python、SQLite 和 C 语言三个难度等级。
            </p>
            <div className="flex flex-wrap gap-2">
              <ScoreBadge level="L1" score={20} />
              <ScoreBadge level="L2" score={35} />
              <ScoreBadge level="L3" score={45} />
            </div>
          </Link>

          {/* CLI部署 */}
          <Link
            to="/cli"
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-all hover:shadow-lg hover:border-blue-300"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-600">⚡ CLI部署开发</h3>
              <span className="text-sm text-gray-500">PRO-CLI</span>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              使用 CLI 工具完成数据爬取、数据库分析和 Flask Web 应用开发。
            </p>
            <div className="flex flex-wrap gap-2">
              <ScoreBadge level="L1" score={20} />
              <ScoreBadge level="L2" score={35} />
              <ScoreBadge level="L3" score={45} />
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
