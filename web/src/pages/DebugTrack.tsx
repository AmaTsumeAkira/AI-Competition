import Accordion from '../components/Accordion'

export default function DebugTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">AI纠错赛项</h1>
        <p className="text-gray-600 mb-8">使用 AI 工具修复含有 Bug 的代码项目</p>

        <Accordion title="Level 1：Python 库存检查 ★★☆☆☆" defaultOpen={true}>
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>语言：</b>Python</p>
            <p><b>Bug 数量：</b>2 个</p>
            <p><b>分值：</b>20 分</p>
            <p><b>限时：</b>30 分钟</p>
            <p><b>说明：</b>修复 CSV 库存检查脚本中的逻辑错误和边界错误</p>
            <p className="text-blue-600">提示：注意变量名拼写和空数据处理</p>
          </div>
        </Accordion>

        <Accordion title="Level 2：SQLite 成绩查询 ★★★☆☆">
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>语言：</b>Python + SQL</p>
            <p><b>Bug 数量：</b>3 个</p>
            <p><b>分值：</b>35 分</p>
            <p><b>限时：</b>60 分钟</p>
            <p><b>说明：</b>修复 SQLite 成绩查询脚本中的 SQL 错误和数据处理问题</p>
            <p className="text-blue-600">提示：注意 SQL 拼写、JOIN 条件、NULL 值处理</p>
          </div>
        </Accordion>

        <Accordion title="Level 3：C 语言学生管理 ★★★★☆">
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>语言：</b>C</p>
            <p><b>Bug 数量：</b>4 个</p>
            <p><b>分值：</b>45 分</p>
            <p><b>限时：</b>90 分钟</p>
            <p><b>说明：</b>修复学生管理系统的指针、内存和文件操作 Bug</p>
            <p className="text-blue-600">提示：注意缓冲区大小、指针有效性、文件关闭</p>
          </div>
        </Accordion>
      </div>
    </div>
  )
}
