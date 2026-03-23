import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <h1>AI素养大赛 · 专业赛道</h1>
        <p className="subtitle">
          考察 AI 工具使用能力、代码调试能力和工程部署能力
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/debug" className="card-link">赛项一：AI纠错</Link>
          <Link to="/cli" className="card-link" style={{ background: 'rgba(255,255,255,0.2)' }}>
            赛项二：CLI部署
          </Link>
        </div>
      </section>

      {/* 赛程时间表 */}
      <section className="section">
        <h2>📅 赛程时间表</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="date">第一阶段：AI纠错</div>
            <p>选手使用 AI 工具定位并修复代码中的 Bug，限时 30 / 60 / 90 分钟</p>
          </div>
          <div className="timeline-item">
            <div className="date">第二阶段：CLI部署</div>
            <p>选手使用 CLI 工具完成数据采集、分析与应用部署，限时 30 / 60 / 90 分钟</p>
          </div>
          <div className="timeline-item">
            <div className="date">极客加分环节</div>
            <p>自主接入 API / 部署 Ollama / 使用 OpenClaw 可获额外加分（最高 +30）</p>
          </div>
          <div className="timeline-item">
            <div className="date">评分与排名</div>
            <p>基础分 100 + 极客加分 30，总分最高 130 分</p>
          </div>
        </div>
      </section>

      {/* 赛道快速入口 */}
      <section className="section">
        <h2>🏁 赛道快速入口</h2>
        <div className="card-grid">
          <div className="card">
            <h3>🔧 赛项一：AI纠错 (PRO-DBG)</h3>
            <p>
              扮演"AI 调试助手"，利用 AI 代码助手定位并修复源代码中的 Bug。
              覆盖 Python、SQLite、C 语言三个难度级别。
            </p>
            <table className="data-table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr><th>级别</th><th>项目</th><th>分值</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="badge badge-green">L1</span></td><td>库存检查工具 (Python)</td><td>20</td></tr>
                <tr><td><span className="badge badge-orange">L2</span></td><td>SQLite 成绩查询</td><td>35</td></tr>
                <tr><td><span className="badge badge-red">L3</span></td><td>学生管理系统 (C语言)</td><td>45</td></tr>
              </tbody>
            </table>
            <Link to="/debug" className="card-link">查看详情 →</Link>
          </div>

          <div className="card">
            <h3>⚡ 赛项二：CLI部署 (PRO-CLI)</h3>
            <p>
              使用 AI 命令行工具完成数据采集、数据库分析与 Web 应用部署。
              仅允许使用 CLI 工具，禁用 VSCode 插件。
            </p>
            <table className="data-table" style={{ marginTop: '0.75rem' }}>
              <thead>
                <tr><th>级别</th><th>项目</th><th>分值</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="badge badge-green">L1</span></td><td>Python 网页爬虫</td><td>20</td></tr>
                <tr><td><span className="badge badge-orange">L2</span></td><td>数据库分析 (Python+SQL)</td><td>35</td></tr>
                <tr><td><span className="badge badge-red">L3</span></td><td>Flask Web 应用</td><td>45</td></tr>
              </tbody>
            </table>
            <Link to="/cli" className="card-link">查看详情 →</Link>
          </div>
        </div>
      </section>

      {/* 最新公告 */}
      <section className="section">
        <h2>📢 最新公告</h2>
        <ul className="notice-list">
          <li>
            🏁 大赛赛题仓库已正式发布，所有题目与测试脚本均可下载
            <span>2026-03-23</span>
          </li>
          <li>
            📋 请所有参赛选手提前配置好 Python 3.8+ 环境及 AI 代码助手
            <span>2026-03-23</span>
          </li>
          <li>
            ⚠️ CLI部署赛项仅允许使用 CLI 工具，禁止使用 VSCode 插件
            <span>2026-03-23</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

export default Home
