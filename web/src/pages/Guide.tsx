import { Link } from 'react-router-dom'

interface StepProps {
  number: number
  title: string
  description: string
  command?: string
  tip?: string
}

function Step({ number, title, description, command, tip }: StepProps) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
          {number}
        </div>
        {number < 8 && <div className="w-0.5 flex-1 bg-blue-200 mt-2" />}
      </div>
      <div className="pb-10 flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>
        {command && (
          <div className="bg-gray-900 rounded-lg p-3 mb-3 relative group">
            <code className="text-green-400 text-sm block overflow-x-auto whitespace-pre-wrap">{command}</code>
            <button
              onClick={() => navigator.clipboard.writeText(command)}
              className="absolute top-2 right-2 text-xs text-gray-500 hover:text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              复制
            </button>
          </div>
        )}
        {tip && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
            💡 {tip}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Guide() {
  const steps: StepProps[] = [
    {
      number: 1,
      title: '选择赛道',
      description: '专业赛道下设两个子赛项，选手可单赛道报名或双赛道兼报。AI纠错赛项（PRO-DBG）侧重代码审查与Bug修复；CLI部署赛项（PRO-CLI）侧重终端操作与工具部署。',
      tip: '建议先查看两个赛道的详细说明再做选择',
    },
    {
      number: 2,
      title: '下载代码',
      description: '从 GitHub 仓库克隆赛题代码到本地。仓库包含两个赛道的所有赛题文件。',
      command: 'git clone https://github.com/AmaTsumeAkira/AI-Competition.git\ncd AI-Competition',
    },
    {
      number: 3,
      title: '安装 Python 环境',
      description: '确保本地已安装 Python 3.8 及以上版本。建议使用 pyenv 或 conda 管理多版本。',
      command: '# 检查 Python 版本\npython3 --version\n\n# 如未安装（Ubuntu/Debian）\nsudo apt install python3 python3-pip python3-venv\n\n# 使用清华镜像加速 pip\npip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ <package>',
      tip: '推荐使用虚拟环境隔离依赖：python3 -m venv venv && source venv/bin/activate',
    },
    {
      number: 4,
      title: '安装依赖',
      description: '根据赛题目录中的 requirements.txt 安装所需依赖。',
      command: '# 进入赛题目录（以 L1 为例）\ncd PRO-DBG/L1\n\n# 创建虚拟环境\npython3 -m venv venv\nsource venv/bin/activate  # Linux/macOS\n# venv\\Scripts\\activate   # Windows\n\n# 安装依赖\npip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ -r requirements.txt',
    },
    {
      number: 5,
      title: '运行测试用例',
      description: '每个赛题目录下都包含 test_runner.py 测试脚本。运行它可以看到当前代码的测试通过情况，帮助定位 Bug。',
      command: '# 运行测试（以 L1 为例）\ncd PRO-DBG/L1\npython3 test_runner.py\n\n# 查看测试报告\ncat test_report.json',
      tip: '首次运行可能全部失败——这正是你需要用 AI 工具修复的目标',
    },
    {
      number: 6,
      title: '用 AI 工具定位修复 Bug',
      description: '使用白名单中的 AI 工具（VSCode 插件或 CLI 工具）辅助定位和修复代码中的 Bug。将报错信息、代码片段提供给 AI，获取修复建议。',
      tip: 'Prompt 质量直接影响 AI 输出质量。建议：提供完整错误堆栈 + 相关代码上下文 + 期望行为描述',
    },
    {
      number: 7,
      title: '再次运行测试验证',
      description: '修复后重新运行测试用例，验证 Bug 是否已消除且未引入新 Bug。',
      command: '# 重新运行测试\ncd PRO-DBG/L1\npython3 test_runner.py\n\n# 对比修复前后的测试结果',
    },
    {
      number: 8,
      title: '提交修复后的代码',
      description: '将修复后的代码文件、测试报告、AI 使用记录等提交物按要求打包提交。',
      tip: '保留 AI 工具的使用日志和操作录屏，作为极客加分的佐证材料',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Guide</p>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">操作指引</h1>
          <p className="text-gray-500">从零开始参加比赛的完整操作流程</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8">
          {steps.map((step) => (
            <Step key={step.number} {...step} />
          ))}
        </div>

        {/* 底部快速入口 */}
        <div className="mt-8 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-bold mb-2">🎯 想要更高分数？</h3>
          <p className="text-sm text-white/80 mb-4">完成基础任务后，试试极客加分项，理论最高可加 30 分！</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/bonus" className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              查看极客加分 →
            </Link>
            <Link to="/environment" className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              环境搭建指南 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
