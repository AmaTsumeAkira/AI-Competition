import Accordion from '../components/Accordion'

function Debug() {
  return (
    <div className="container">
      <section className="section">
        <h2>🔧 赛项一：AI纠错 (PRO-DBG)</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-text-light)' }}>
          选手需要扮演"AI 调试助手"的角色，利用 AI 代码助手定位并修复源代码中的 Bug。
          考察的是：<strong>能否正确地向 AI 描述问题、解读 AI 的修复建议、验证修复结果</strong>——而非手写代码的能力。
        </p>

        <div className="info-box">
          <strong>💡 工具限制：</strong>VSCode 插件 + CLI 工具均可使用。选手需提交 AI 对话截图或文字记录作为评分依据。
        </div>

        {/* Level 1 */}
        <Accordion title="🟢 Level 1：库存检查工具 (Python) — 20分 · 30分钟">
          <div className="level-tag l1">⬤ 入门级</div>

          <h3>任务说明</h3>
          <p>
            某仓库管理员写了一个 <code>inventory_checker.py</code>，用于检查库存是否低于安全阈值，
            并提示需要补货的商品。代码逻辑看似简单，但运行时发现了几个问题。
          </p>
          <p style={{ marginTop: '0.5rem' }}>选手需要：</p>
          <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>运行脚本，观察输出</li>
            <li>识别代码中的 Bug（至少 2 处）</li>
            <li>使用 AI 助手获取修复建议</li>
            <li>应用修复，确保测试通过</li>
          </ol>

          <h3>Bug 提示</h3>
          <div className="info-box">
            代码涉及<strong>列表操作</strong>和<strong>条件判断</strong>的逻辑错误。运行时可能出现计算结果不正确或遗漏某些商品的情况。
            <br />💡 你不需要找到所有 Bug 才能开始修复——可以先从最明显的开始，用 AI 帮忙定位剩余的问题。
          </div>

          <h3>评分标准</h3>
          <table className="data-table">
            <thead>
              <tr><th>得分项</th><th>分值</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td>正确识别所有 Bug</td><td>40</td><td>每识别 1 个 Bug 得 20 分</td></tr>
              <tr><td>AI 使用过程记录</td><td>20</td><td>提交 AI 对话截图或文字记录</td></tr>
              <tr><td>代码修复正确</td><td>30</td><td>全部修复 30 分，部分按比例</td></tr>
              <tr><td>测试通过</td><td>10</td><td>test_runner.py 运行无报错</td></tr>
            </tbody>
          </table>

          <h3>环境要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Python 3.8+</li>
            <li>无需安装第三方库（标准库即可运行）</li>
          </ul>
        </Accordion>

        {/* Level 2 */}
        <Accordion title="🟡 Level 2：成绩查询系统 (Python+SQL) — 35分 · 60分钟">
          <div className="level-tag l2">⬤ 进阶级</div>

          <h3>任务说明</h3>
          <p>
            某教学管理系统需要查询学生成绩，管理员写了 <code>grade_query.py</code> 脚本，
            从 SQLite 数据库中读取成绩数据并输出报表。代码逻辑涉及多表查询，但运行后发现数据不对……
          </p>
          <p style={{ marginTop: '0.5rem' }}>选手需要：</p>
          <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>先运行 <code>init_db.py</code> 初始化数据库</li>
            <li>运行 <code>grade_query.py</code>，观察输出与预期是否一致</li>
            <li>识别所有 Bug（至少 3 处）</li>
            <li>使用 AI 助手获取修复建议</li>
            <li>验证测试通过</li>
          </ol>

          <h3>Bug 提示</h3>
          <div className="info-box">
            本赛题包含以下类型的 Bug（仅供参考，不要直接告诉 AI）：
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>SQL 语法错误（拼写/关键字）</li>
              <li>JOIN 条件错误（多表关联不正确）</li>
              <li>数据类型处理错误</li>
              <li>边界情况（某学生无成绩时报错）</li>
            </ul>
          </div>

          <h3>预期查询结果</h3>
          <table className="data-table">
            <thead><tr><th>学生</th><th>课程数</th><th>平均分</th></tr></thead>
            <tbody>
              <tr><td>李明</td><td>3</td><td>85.0</td></tr>
              <tr><td>王芳</td><td>2</td><td>82.5</td></tr>
              <tr><td>张伟</td><td>3</td><td>91.67</td></tr>
            </tbody>
          </table>

          <h3>评分标准</h3>
          <table className="data-table">
            <thead>
              <tr><th>得分项</th><th>分值</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td>正确识别所有 Bug</td><td>45</td><td>每个 Bug 15 分</td></tr>
              <tr><td>AI 使用过程记录</td><td>15</td><td>提交 AI 对话截图或文字记录</td></tr>
              <tr><td>代码修复正确</td><td>30</td><td>全部修复 30 分，部分按比例</td></tr>
              <tr><td>测试通过</td><td>10</td><td>test_runner.py 运行无报错</td></tr>
            </tbody>
          </table>

          <h3>环境要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>Python 3.8+</li>
            <li>SQLite3（Python 内置，无需额外安装）</li>
          </ul>
        </Accordion>

        {/* Level 3 */}
        <Accordion title="🔴 Level 3：学生管理系统 (C语言) — 45分 · 90分钟">
          <div className="level-tag l3">⬤ 高级</div>

          <h3>任务说明</h3>
          <p>
            一个简单的学生成绩管理系统，使用纯 C 语言编写，包含链表和文件读写。
            程序编译通过，但运行时出现了段错误（Segmentation Fault）或输出异常……
          </p>
          <p style={{ marginTop: '0.5rem' }}>选手需要：</p>
          <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            <li>编译 <code>student_mgr.c</code>（Windows 可用 MinGW-w64 或 WSL）</li>
            <li>运行程序，观察崩溃或异常输出</li>
            <li>识别至少 4 处 Bug（指针、内存、字符串相关）</li>
            <li>使用 AI 助手获取修复建议</li>
            <li>确保所有测试通过</li>
          </ol>

          <h3>Bug 提示</h3>
          <div className="info-box">
            本赛题包含以下类型的 Bug（仅供参考，不要直接告诉 AI）：
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li><strong>缓冲区溢出</strong>：字符串输入超长导致栈损坏</li>
              <li><strong>空指针解引用</strong>：链表操作时未检查 NULL</li>
              <li><strong>内存泄漏</strong>：malloc 后未 free</li>
              <li><strong>野指针</strong>：指针释放后继续使用</li>
              <li><strong>字符串操作错误</strong>：strcpy/strcmp 使用不当</li>
            </ul>
          </div>

          <h3>评分标准</h3>
          <table className="data-table">
            <thead>
              <tr><th>得分项</th><th>分值</th><th>说明</th></tr>
            </thead>
            <tbody>
              <tr><td>正确识别所有 Bug</td><td>50</td><td>每个 Bug 约 12.5 分</td></tr>
              <tr><td>AI 使用过程记录</td><td>15</td><td>提交 AI 对话截图或文字记录</td></tr>
              <tr><td>代码修复正确</td><td>25</td><td>全部修复 25 分，部分按比例</td></tr>
              <tr><td>测试通过</td><td>10</td><td>test_runner.py 运行无报错</td></tr>
            </tbody>
          </table>

          <h3>环境要求</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>GCC 编译器（Windows 可用 MinGW-w64 或 WSL）</li>
            <li>Python 3.8+（用于运行测试脚本）</li>
            <li>推荐使用 WSL 获得原生 GCC 体验</li>
          </ul>
        </Accordion>
      </section>
    </div>
  )
}

export default Debug
