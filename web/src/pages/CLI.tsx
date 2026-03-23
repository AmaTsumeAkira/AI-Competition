import Accordion from '../components/Accordion'

function CLI() {
  return (
    <div className="container">
      <section className="section">
        <h2>⚡ 赛项二：CLI部署开发 (PRO-CLI)</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
          使用 AI 命令行工具（如 Claude Code、Codex CLI）完成数据采集、数据库分析与应用部署任务。
        </p>

        <div className="info-box">
          <strong>⚠️ 工具限制：</strong>仅允许使用 CLI 工具，<strong>禁用 VSCode 插件</strong>。选手需提交终端操作录屏作为评分依据。
        </div>

        {/* Level 1 */}
        <Accordion title="🟢 Level 1：Python 网页数据采集 — 20分 · 30分钟">
          <div className="level-tag l1">⬤ 入门级</div>

          <h3>任务说明</h3>
          <p>编写一个 Python 脚本，从指定网页抓取数据并保存为 CSV 文件。</p>

          <h3>基础任务（15分）</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>从 <code>https://quotes.toscrape.com/</code> 抓取名言数据</li>
            <li>提取：名言内容、作者、标签</li>
            <li>保存为 <code>quotes.csv</code>，UTF-8 编码</li>
            <li>至少抓取 3 页数据</li>
          </ol>

          <h3>进阶任务（5分）</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>添加命令行参数支持：<code>python scraper.py --pages 5</code></li>
            <li>添加错误处理（网络超时、页面不存在）</li>
          </ol>

          <h3>评分标准</h3>
          <table className="data-table">
            <thead>
              <tr><th>项目</th><th>分值</th><th>标准</th></tr>
            </thead>
            <tbody>
              <tr><td>数据完整性</td><td>8</td><td>抓取 ≥3 页，字段齐全</td></tr>
              <tr><td>文件格式</td><td>4</td><td>CSV 格式正确，UTF-8 编码</td></tr>
              <tr><td>代码质量</td><td>3</td><td>有注释，异常处理</td></tr>
              <tr><td>进阶功能</td><td>5</td><td>命令行参数 + 错误处理</td></tr>
            </tbody>
          </table>

          <h3>环境要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Python 3.8+</li>
            <li>pip install requests beautifulsoup4 pandas</li>
          </ul>

          <h3>提交物</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li><code>scraper.py</code> 源代码</li>
            <li><code>quotes.csv</code> 数据文件</li>
            <li>终端操作录屏（展示 AI 工具使用过程）</li>
          </ol>
        </Accordion>

        {/* Level 2 */}
        <Accordion title="🟡 Level 2：Python + SQLite 数据分析 — 35分 · 60分钟">
          <div className="level-tag l2">⬤ 进阶级</div>

          <h3>任务说明</h3>
          <p>使用 Python 分析 SQLite 数据库中的学生成绩数据，生成统计报表。</p>

          <h3>基础任务（20分）</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>运行 <code>python init_db.py</code> 创建示例数据库</li>
            <li>编写 <code>analysis.py</code> 完成以下分析：
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
                <li>每个学生的总分和平均分</li>
                <li>每门课的最高分、最低分、平均分</li>
                <li>不及格学生名单（任意一科 &lt; 60）</li>
                <li>各分数段人数分布（90+、80-89、70-79、60-69、&lt;60）</li>
              </ul>
            </li>
            <li>将分析结果保存为 <code>report.txt</code></li>
          </ol>

          <h3>进阶任务（15分）</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>使用 SQL 的 JOIN/GROUP BY/HAVING 完成查询</li>
            <li>支持命令行参数：<code>python analysis.py --subject 数学</code></li>
            <li>输出格式美观（表格对齐、分隔线）</li>
          </ol>

          <h3>评分标准</h3>
          <table className="data-table">
            <thead>
              <tr><th>项目</th><th>分值</th><th>标准</th></tr>
            </thead>
            <tbody>
              <tr><td>基础查询</td><td>12</td><td>4 项查询全部正确</td></tr>
              <tr><td>SQL 质量</td><td>4</td><td>使用 JOIN/GROUP BY</td></tr>
              <tr><td>输出格式</td><td>4</td><td>格式美观、对齐</td></tr>
              <tr><td>进阶功能</td><td>15</td><td>命令行参数 + 按科目查询 + 输出美观</td></tr>
            </tbody>
          </table>

          <h3>环境要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Python 3.8+</li>
            <li>pip install pandas（sqlite3 为 Python 内置）</li>
          </ul>

          <h3>提交物</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li><code>analysis.py</code> 源代码</li>
            <li><code>report.txt</code> 分析报告</li>
            <li>终端操作录屏</li>
          </ol>
        </Accordion>

        {/* Level 3 */}
        <Accordion title="🔴 Level 3：Flask Web 应用部署 — 45分 · 90分钟">
          <div className="level-tag l3">⬤ 高级</div>

          <h3>任务说明</h3>
          <p>将一个 Python Web 应用部署到本机运行，完成配置和测试。</p>

          <h3>基础任务（25分）</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>运行 <code>python init_app.py</code> 创建初始项目</li>
            <li>修复 <code>app.py</code> 中的 3 个配置错误</li>
            <li>编写 <code>deploy.sh</code>（Linux/macOS）或 <code>deploy.bat</code>（Windows）一键启动脚本</li>
            <li>编写 <code>test_api.py</code> 接口测试脚本</li>
            <li>应用正常运行，所有接口返回正确数据</li>
          </ol>

          <h3>Bug 清单</h3>
          <table className="data-table">
            <thead><tr><th>#</th><th>问题</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>端口配置错误（写了 8080 但实际监听 5000）</td></tr>
              <tr><td>2</td><td>数据库路径使用了绝对路径，换机器就报错</td></tr>
              <tr><td>3</td><td>缺少 CORS 配置，前端无法调用</td></tr>
            </tbody>
          </table>

          <h3>进阶任务（20分）</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>添加数据持久化（SQLite）</li>
            <li>添加错误处理中间件</li>
            <li>编写 API 文档 <code>api_docs.md</code></li>
          </ol>

          <h3>评分标准</h3>
          <table className="data-table">
            <thead>
              <tr><th>项目</th><th>分值</th><th>标准</th></tr>
            </thead>
            <tbody>
              <tr><td>Bug 修复</td><td>15</td><td>3 个 Bug 全部修复</td></tr>
              <tr><td>部署脚本</td><td>5</td><td>一键启动正常</td></tr>
              <tr><td>接口测试</td><td>5</td><td>测试脚本覆盖所有接口</td></tr>
              <tr><td>进阶功能</td><td>20</td><td>数据持久化 + 错误处理 + API 文档</td></tr>
            </tbody>
          </table>

          <h3>环境要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Python 3.8+</li>
            <li>pip install flask</li>
          </ul>

          <h3>提交物</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li>修复后的全部源代码</li>
            <li><code>deploy.sh</code> / <code>deploy.bat</code> 启动脚本</li>
            <li><code>test_api.py</code> 测试脚本</li>
            <li><code>api_docs.md</code> API 文档</li>
            <li>终端操作录屏</li>
          </ol>
        </Accordion>
      </section>
    </div>
  )
}

export default CLI
