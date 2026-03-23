import Accordion from '../components/Accordion'

const BASE = 'https://github.com/AmaTsumeAkira/AI-Competition/blob/main'

export default function DebugTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">AI纠错赛项（PRO-DBG）</h1>
        <p className="text-gray-600 mb-8">使用 AI 工具修复含有 Bug 的代码项目</p>

        <Accordion title="Level 1：Python 库存检查 ★★☆☆☆（20分，30分钟）" defaultOpen={true}>
          <div className="space-y-3 text-sm text-gray-700">
            <p>修复 CSV 库存检查脚本中的逻辑错误和边界错误。</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-2">📎 代码文件</p>
              <ul className="space-y-1">
                <li>📄 <a href={`${BASE}/PRO-DBG/L1/inventory_checker.py`} className="text-blue-600 underline" target="_blank">inventory_checker.py</a>（含 Bug 的脚本）</li>
                <li>📊 <a href={`${BASE}/PRO-DBG/L1/test_data.csv`} className="text-blue-600 underline" target="_blank">test_data.csv</a>（测试数据）</li>
                <li>🧪 <a href={`${BASE}/PRO-DBG/L1/test_runner.py`} className="text-blue-600 underline" target="_blank">test_runner.py</a>（测试用例）</li>
              </ul>
            </div>
            <p className="text-blue-600">💡 提示：注意变量名拼写和空数据处理</p>
          </div>
        </Accordion>

        <Accordion title="Level 2：SQLite 成绩查询 ★★★☆☆（35分，60分钟）">
          <div className="space-y-3 text-sm text-gray-700">
            <p>修复 SQLite 成绩查询脚本中的 SQL 错误和数据处理问题。</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-2">📎 代码文件</p>
              <ul className="space-y-1">
                <li>📄 <a href={`${BASE}/PRO-DBG/L2/grade_query.py`} className="text-blue-600 underline" target="_blank">grade_query.py</a>（含 Bug 的脚本）</li>
                <li>🗄️ <a href={`${BASE}/PRO-DBG/L2/init_db.py`} className="text-blue-600 underline" target="_blank">init_db.py</a>（数据库初始化）</li>
                <li>🧪 <a href={`${BASE}/PRO-DBG/L2/test_runner.py`} className="text-blue-600 underline" target="_blank">test_runner.py</a>（测试用例）</li>
              </ul>
            </div>
            <p className="text-blue-600">💡 提示：注意 SQL 拼写、JOIN 条件、NULL 值处理</p>
          </div>
        </Accordion>

        <Accordion title="Level 3：C 语言学生管理 ★★★★☆（45分，90分钟）">
          <div className="space-y-3 text-sm text-gray-700">
            <p>修复学生管理系统的指针、内存和文件操作 Bug。</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-2">📎 代码文件</p>
              <ul className="space-y-1">
                <li>📄 <a href={`${BASE}/PRO-DBG/L3/student_mgr.c`} className="text-blue-600 underline" target="_blank">student_mgr.c</a>（含 Bug 的 C 代码）</li>
                <li>📊 <a href={`${BASE}/PRO-DBG/L3/test_data.txt`} className="text-blue-600 underline" target="_blank">test_data.txt</a>（测试数据）</li>
                <li>🧪 <a href={`${BASE}/PRO-DBG/L3/test_runner.py`} className="text-blue-600 underline" target="_blank">test_runner.py</a>（测试用例）</li>
              </ul>
            </div>
            <p className="text-blue-600">💡 提示：注意缓冲区大小、指针有效性、文件关闭</p>
          </div>
        </Accordion>
      </div>
    </div>
  )
}
