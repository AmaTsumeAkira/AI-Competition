function About() {
  return (
    <div className="container">
      <section className="section">
        <h2>ℹ️ 关于大赛</h2>

        <div className="about-card">
          <h3>🎯 大赛背景</h3>
          <p>
            随着 AI 技术在软件开发领域的深入应用，"与 AI 协作"已成为程序员的核心能力之一。
            传统的编程竞赛侧重于算法和编码能力，而<strong>AI素养大赛</strong>聚焦于：
          </p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
            <li><strong>问题描述能力</strong> — 能否清晰、准确地向 AI 描述技术问题</li>
            <li><strong>结果验证能力</strong> — 能否判断 AI 给出的修复方案是否正确</li>
            <li><strong>工具驾驭能力</strong> — 能否高效使用 AI CLI 工具完成工程任务</li>
            <li><strong>工程部署能力</strong> — 能否将 AI 辅助产出的代码正确部署运行</li>
          </ul>
          <p style={{ marginTop: '0.75rem' }}>
            本赛事面向计算机相关专业学生，旨在考察参赛选手在真实开发场景下的 AI 工具使用素养。
          </p>
        </div>

        <div className="about-card">
          <h3>👤 组织者信息</h3>
          <table className="data-table">
            <tbody>
              <tr><td style={{ width: '120px', fontWeight: 600 }}>主办方</td><td>AmaTsume Akira</td></tr>
              <tr><td style={{ fontWeight: 600 }}>赛事定位</td><td>校级 / 院级编程素养竞赛</td></tr>
              <tr><td style={{ fontWeight: 600 }}>适用对象</td><td>计算机相关专业大一至大三学生</td></tr>
              <tr><td style={{ fontWeight: 600 }}>首次发布</td><td>2026 年 3 月</td></tr>
            </tbody>
          </table>
        </div>

        <div className="about-card">
          <h3>📬 联系方式</h3>
          <table className="data-table">
            <tbody>
              <tr>
                <td style={{ width: '120px', fontWeight: 600 }}>GitHub</td>
                <td>
                  <a href="https://github.com/AmaTsumeAkira/AI-Competition" target="_blank" rel="noopener noreferrer">
                    github.com/AmaTsumeAkira/AI-Competition
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 600 }}>Issues</td>
                <td>
                  如有赛题疑问或发现问题，请在 GitHub 仓库提交 Issue
                </td>
              </tr>
            </tbody>
          </table>

          <div className="info-box" style={{ marginTop: '1rem' }}>
            <strong>💡 提示：</strong>赛题相关的疑问、Bug 反馈、环境配置问题等，
            均可通过 GitHub Issues 提交，组织者会及时回复。
          </div>
        </div>

        <div className="about-card">
          <h3>📁 仓库目录结构</h3>
          <pre style={{
            background: 'var(--color-accent)',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            overflow: 'auto',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}>{`AI-Competition/
├── PRO-DBG/               # AI纠错赛项
│   ├── L1/                # Python 库存检查
│   ├── L2/                # SQLite 成绩查询
│   └── L3/                # C语言 学生管理
├── PRO-CLI/               # CLI部署赛项
│   ├── L1/                # Python 网页爬虫
│   ├── L2/                # SQLite 数据分析
│   └── L3/                # Flask Web 应用
├── web/                   # 官方网站源码
└── README.md`}</pre>
        </div>
      </section>
    </div>
  )
}

export default About
