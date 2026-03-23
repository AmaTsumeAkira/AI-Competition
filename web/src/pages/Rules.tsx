function Rules() {
  return (
    <div className="container">
      <section className="section">
        <h2>📊 评分规则</h2>

        {/* 基础分构成 */}
        <div className="rules-block">
          <h3>基础分构成（满分 100 分）</h3>
          <table className="data-table">
            <thead>
              <tr><th>赛项</th><th>Level</th><th>分值</th><th>限时</th></tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={3}>AI纠错 (PRO-DBG)</td>
                <td><span className="badge badge-green">L1</span> 库存检查工具</td>
                <td>20</td>
                <td>30 分钟</td>
              </tr>
              <tr>
                <td><span className="badge badge-orange">L2</span> 成绩查询系统</td>
                <td>35</td>
                <td>60 分钟</td>
              </tr>
              <tr>
                <td><span className="badge badge-red">L3</span> 学生管理系统</td>
                <td>45</td>
                <td>90 分钟</td>
              </tr>
              <tr>
                <td rowSpan={3}>CLI部署 (PRO-CLI)</td>
                <td><span className="badge badge-green">L1</span> 网页数据爬虫</td>
                <td>20</td>
                <td>30 分钟</td>
              </tr>
              <tr>
                <td><span className="badge badge-orange">L2</span> 数据库分析</td>
                <td>35</td>
                <td>60 分钟</td>
              </tr>
              <tr>
                <td><span className="badge badge-red">L3</span> Flask Web 应用</td>
                <td>45</td>
                <td>90 分钟</td>
              </tr>
            </tbody>
          </table>

          <div className="info-box" style={{ marginTop: '1rem' }}>
            <strong>注意：</strong>两个赛项独立评分，选手需分别完成 AI纠错 和 CLI部署 的所有任务。
          </div>
        </div>

        {/* 极客加分项 */}
        <div className="rules-block">
          <h3>极客加分项（最高 +30 分）</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1rem' }}>
            以下加分项鼓励选手展示更高级的 AI 工具使用能力和工程素养。
          </p>
          <table className="data-table">
            <thead>
              <tr><th>加分项</th><th>分值</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>自主接入 API</td>
                <td><span className="badge badge-blue">+10</span></td>
                <td>在任务中接入外部 API（如天气、翻译、OCR 等）并展示调用过程</td>
              </tr>
              <tr>
                <td>本地部署 Ollama</td>
                <td><span className="badge badge-blue">+12</span></td>
                <td>使用 Ollama 本地运行大语言模型，替代在线 AI 服务</td>
              </tr>
              <tr>
                <td>使用 OpenClaw</td>
                <td><span className="badge badge-blue">+8</span></td>
                <td>使用 OpenClaw 框架完成自动化任务调度或工具编排</td>
              </tr>
            </tbody>
          </table>

          <div className="info-box" style={{ marginTop: '1rem' }}>
            <strong>总分上限：</strong>基础 100 + 加分 30 = <strong>最高 130 分</strong>
          </div>
        </div>

        {/* 工具限制说明 */}
        <div className="rules-block">
          <h3>工具限制说明</h3>
          <table className="data-table">
            <thead>
              <tr><th>赛项</th><th>允许的工具</th><th>禁止的工具</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>AI纠错</strong></td>
                <td>VSCode 插件（Copilot、通义灵码等）+ CLI 工具</td>
                <td>无特殊限制</td>
              </tr>
              <tr>
                <td><strong>CLI部署</strong></td>
                <td>仅 CLI 工具（Claude Code、Codex CLI 等）</td>
                <td>❌ VSCode 插件</td>
              </tr>
            </tbody>
          </table>

          <div className="info-box" style={{ marginTop: '1rem' }}>
            <strong>⚠️ 重要：</strong>CLI部署赛项中使用 VSCode 插件将被视为违规，该赛项成绩记零分。
          </div>
        </div>

        {/* 提交要求 */}
        <div className="rules-block">
          <h3>提交要求</h3>

          <h3 style={{ fontSize: '1rem' }}>AI纠错赛项提交物</h3>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>修复后的源代码文件</li>
            <li>AI 对话截图或文字记录（展示使用 AI 调试的过程）</li>
            <li>测试脚本运行通过的截图</li>
          </ol>

          <h3 style={{ fontSize: '1rem' }}>CLI部署赛项提交物</h3>
          <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>完成后的源代码文件</li>
            <li>终端操作录屏（展示 AI CLI 工具使用过程）</li>
            <li>生成的数据文件或报告（如适用）</li>
          </ol>

          <h3 style={{ fontSize: '1rem' }}>通用要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>所有代码需能在指定环境下正常运行</li>
            <li>环境要求：Windows / Mac / Linux，Python 3.8+</li>
            <li>pip 镜像源：<code>pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/</code></li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default Rules
