import Accordion from '../components/Accordion'
import ScoreBadge from '../components/ScoreBadge'

export default function DebugTrack() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-blue-900">🔍 AI纠错赛道 (PRO-DBG)</h1>
      <p className="mb-8 text-gray-600">
        修复含 Bug 的代码程序。可用 VSCode 插件或 CLI 工具辅助调试。
      </p>

      <div className="space-y-4">
        <Accordion
          title="Level 1 — 库存检查工具"
          badge={<ScoreBadge level="L1" score={20} />}
        >
          <div className="space-y-3">
            <p><strong>语言：</strong>Python</p>
            <p><strong>Bug 数量：</strong>2 个</p>
            <p><strong>测试用例：</strong>5 组</p>
            <p><strong>限时：</strong>30 分钟</p>
            <p><strong>说明：</strong>给定一段 Python 库存检查脚本，内含 2 处逻辑 Bug。
              参赛者需定位并修复错误，使所有测试用例通过。</p>
            <p><strong>环境准备：</strong></p>
            <pre className="mt-1 rounded-lg bg-gray-100 p-3 text-xs overflow-x-auto">
{`pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/`}
            </pre>
          </div>
        </Accordion>

        <Accordion
          title="Level 2 — SQLite 成绩查询系统"
          badge={<ScoreBadge level="L2" score={35} />}
        >
          <div className="space-y-3">
            <p><strong>语言：</strong>Python + SQL</p>
            <p><strong>Bug 数量：</strong>3 个</p>
            <p><strong>测试用例：</strong>10 组</p>
            <p><strong>限时：</strong>60 分钟</p>
            <p><strong>说明：</strong>基于 SQLite 的成绩查询程序，包含 3 处 Bug（Python 逻辑 + SQL 查询）。
              需要同时检查代码逻辑和 SQL 语句的正确性。</p>
            <p><strong>涉及知识点：</strong></p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Python sqlite3 模块用法</li>
              <li>SQL SELECT/WHERE/JOIN 查询</li>
              <li>参数化查询防止注入</li>
            </ul>
          </div>
        </Accordion>

        <Accordion
          title="Level 3 — 学生管理系统"
          badge={<ScoreBadge level="L3" score={45} />}
        >
          <div className="space-y-3">
            <p><strong>语言：</strong>C 语言</p>
            <p><strong>Bug 数量：</strong>4 个</p>
            <p><strong>测试用例：</strong>15 组</p>
            <p><strong>限时：</strong>90 分钟</p>
            <p><strong>说明：</strong>C 语言实现的学生管理系统，包含 4 处 Bug（内存管理、指针操作、数据结构）。
              难度最高，考验底层调试能力。</p>
            <p><strong>涉及知识点：</strong></p>
            <ul className="list-disc pl-5 text-gray-600">
              <li>动态内存分配与释放 (malloc/free)</li>
              <li>链表操作与指针运算</li>
              <li>文件 I/O 读写</li>
              <li>数组越界与段错误排查</li>
            </ul>
          </div>
        </Accordion>
      </div>
    </div>
  )
}
