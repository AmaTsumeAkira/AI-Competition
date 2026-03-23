import Accordion from '../components/Accordion'

const BASE = 'https://github.com/AmaTsumeAkira/AI-Competition/blob/main'

export default function CliTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CLI部署开发赛项（PRO-CLI）</h1>
        <p className="text-gray-600 mb-8">使用 AI 命令行工具完成编程项目</p>

        <Accordion title="Level 1：网页数据爬虫 ★★☆☆☆（20分，30分钟）" defaultOpen={true}>
          <div className="space-y-3 text-sm text-gray-700">
            <p>从网页抓取数据并保存为 CSV 文件。使用 Python + requests + BeautifulSoup。</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-2">📎 代码文件</p>
              <ul className="space-y-1">
                <li>📄 <a href={`${BASE}/PRO-CLI/L1/scraper.py`} className="text-blue-600 underline" target="_blank">scraper.py</a>（起始模板）</li>
                <li>🧪 <a href={`${BASE}/PRO-CLI/L1/test_runner.py`} className="text-blue-600 underline" target="_blank">test_runner.py</a>（测试用例）</li>
              </ul>
            </div>
            <p className="text-blue-600">💡 提示：pip 使用清华镜像：pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/</p>
          </div>
        </Accordion>

        <Accordion title="Level 2：数据库分析 ★★★☆☆（35分，60分钟）">
          <div className="space-y-3 text-sm text-gray-700">
            <p>分析 SQLite 数据库中的学生成绩数据，生成统计报表。</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-2">📎 代码文件</p>
              <ul className="space-y-1">
                <li>🗄️ <a href={`${BASE}/PRO-CLI/L2/init_db.py`} className="text-blue-600 underline" target="_blank">init_db.py</a>（数据库初始化）</li>
                <li>🧪 <a href={`${BASE}/PRO-CLI/L2/test_runner.py`} className="text-blue-600 underline" target="_blank">test_runner.py</a>（测试用例）</li>
              </ul>
            </div>
            <p className="text-blue-600">💡 提示：使用 SQL 的 JOIN、GROUP BY、HAVING</p>
          </div>
        </Accordion>

        <Accordion title="Level 3：Flask Web 应用 ★★★★☆（45分，90分钟）">
          <div className="space-y-3 text-sm text-gray-700">
            <p>修复 Flask 应用的配置错误并部署到本机运行。</p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900 mb-2">📎 代码文件</p>
              <ul className="space-y-1">
                <li>📄 <a href={`${BASE}/PRO-CLI/L3/app.py`} className="text-blue-600 underline" target="_blank">app.py</a>（含 Bug 的 Flask 应用）</li>
                <li>🚀 <a href={`${BASE}/PRO-CLI/L3/init_app.py`} className="text-blue-600 underline" target="_blank">init_app.py</a>（项目初始化）</li>
                <li>🧪 <a href={`${BASE}/PRO-CLI/L3/test_runner.py`} className="text-blue-600 underline" target="_blank">test_runner.py</a>（测试用例）</li>
                <li>🪟 <a href={`${BASE}/PRO-CLI/L3/deploy.bat`} className="text-blue-600 underline" target="_blank">deploy.bat</a>（Windows 启动脚本）</li>
              </ul>
            </div>
            <p className="text-blue-600">💡 提示：注意端口配置、数据库路径、CORS</p>
          </div>
        </Accordion>
      </div>
    </div>
  )
}
