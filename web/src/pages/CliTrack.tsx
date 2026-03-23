import Accordion from '../components/Accordion'
import ScoreBadge from '../components/ScoreBadge'

export default function CliTrack() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-blue-900">⚡ CLI部署开发赛道 (PRO-CLI)</h1>
      <p className="mb-8 text-gray-600">
        仅限 CLI 工具，禁用 VSCode 插件。考验命令行工程化能力。
      </p>

      <div className="space-y-4">
        <Accordion
          title="Level 1 — 网页数据爬虫"
          badge={<ScoreBadge level="L1" score={20} />}
        >
          <div className="space-y-3">
            <p><strong>语言：</strong>Python</p>
            <p><strong>测试用例：</strong>5 组</p>
            <p><strong>限时：</strong>30 分钟</p>
            <p><strong>说明：</strong>编写 CLI 爬虫工具，从给定网页抓取指定数据并输出结构化结果（JSON/CSV）。</p>
            <p><strong>涉及知识点：</strong></p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>requests / httpx 请求库</li>
              <li>BeautifulSoup / lxml 解析</li>
              <li>argparse CLI 参数解析</li>
            </ul>
            <pre className="mt-2 rounded-lg bg-gray-100 p-3 text-xs overflow-x-auto">
{`# 示例用法
python crawler.py --url https://example.com --output data.json`}
            </pre>
          </div>
        </Accordion>

        <Accordion
          title="Level 2 — 数据库分析"
          badge={<ScoreBadge level="L2" score={35} />}
        >
          <div className="space-y-3">
            <p><strong>语言：</strong>Python + SQL</p>
            <p><strong>测试用例：</strong>5 组</p>
            <p><strong>限时：</strong>60 分钟</p>
            <p><strong>说明：</strong>给定一个 SQLite 数据库，编写 CLI 工具完成数据查询、统计分析和报表生成。</p>
            <p><strong>涉及知识点：</strong></p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>sqlite3 模块高级用法</li>
              <li>聚合函数 (COUNT/SUM/AVG/GROUP BY)</li>
              <li>数据可视化 (matplotlib/终端表格)</li>
              <li>CLI 子命令设计 (subparsers)</li>
            </ul>
          </div>
        </Accordion>

        <Accordion
          title="Level 3 — Flask Web 应用"
          badge={<ScoreBadge level="L3" score={45} />}
        >
          <div className="space-y-3">
            <p><strong>语言：</strong>Python</p>
            <p><strong>测试用例：</strong>10 组</p>
            <p><strong>限时：</strong>90 分钟</p>
            <p><strong>说明：</strong>使用 Flask 框架开发一个完整的 Web 应用，包含路由、模板渲染、数据库交互等，
              并通过 CLI 工具完成项目初始化和部署。</p>
            <p><strong>涉及知识点：</strong></p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Flask 路由与模板 (Jinja2)</li>
              <li>SQLAlchemy ORM</li>
              <li>RESTful API 设计</li>
              <li>虚拟环境与依赖管理 (venv/pip)</li>
              <li>Gunicorn 生产部署</li>
            </ul>
            <pre className="mt-2 rounded-lg bg-gray-100 p-3 text-xs overflow-x-auto">
{`# 项目结构
flask-app/
├── app.py          # 主应用
├── models.py       # 数据模型
├── templates/      # Jinja2 模板
├── requirements.txt
└── wsgi.py         # Gunicorn 入口`}
            </pre>
          </div>
        </Accordion>
      </div>
    </div>
  )
}
