import Accordion from '../components/Accordion'

const BASE = 'https://github.com/AmaTsumeAkira/AI-Competition/blob/main'

export default function CliTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CLI部署开发赛项（PRO-CLI）</h1>
        <p className="text-gray-600 mb-8">使用 AI 命令行工具完成编程项目</p>

        {/* 赛项概述 */}
        <Accordion title="📋 赛项概述" defaultOpen={true}>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              选手<strong>必须</strong>使用AI命令行代码助手，<strong>全程在终端（Terminal）环境下</strong>完成任务。
              核心考核目标为：成功部署2个指定的CLI工具，并基于这两个工具各创建一个功能完整的应用项目。
              本赛道旨在评估选手的终端操作熟练度、AI CLI工具驾驭能力及工程化项目构建能力。
            </p>
            <p className="text-blue-600 font-medium">赛事采用初赛 → 复赛 → 决赛三级赛制，难度呈阶梯式上升。</p>
          </div>
        </Accordion>

        {/* 允许使用的工具 */}
        <Accordion title="🔧 允许使用的工具">
          <div className="text-sm text-gray-700 space-y-4">
            <p>本赛道选手<strong>仅限</strong>使用以下AI命令行代码助手（任选一种或多种）：</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-3 py-2 text-left border-b border-gray-200">序号</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">工具名称</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1', '通义灵码 CLI', '阿里云终端AI编码助手'],
                    ['2', 'CodeGeeX CLI', '智谱终端AI编码助手'],
                    ['3', 'Claude Code', 'Anthropic终端AI编码助手'],
                    ['4', 'CodeLlama CLI', 'Meta终端AI编码助手'],
                  ].map(([n, name, desc], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-100">{n}</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium">{name}</td>
                      <td className="px-3 py-2 border-b border-gray-100">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-red-700 bg-red-50 rounded-lg p-2 text-xs">⛔ 严格限制：本赛道不允许使用任何VSCode插件类AI工具辅助完成任务。所有编码、调试、运行操作必须在终端环境中通过CLI工具完成。</p>
          </div>
        </Accordion>

        {/* 初赛 */}
        <Accordion title="Level 1：初赛 — 基础CLI工具配置与入门项目搭建 ★★☆☆☆（20分）">
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900">难度定位：★★☆☆☆（基础级）</p>
            </div>

            <p><strong>任务形态：</strong>组委会提供标准化部署文档，选手需根据文档完成 <strong>2个指定CLI工具的安装与基础配置</strong>，并使用这两个工具分别创建一个 <strong>HelloWorld级别的应用项目</strong>。</p>

            <p className="font-semibold text-gray-800">考核要点：</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-3 py-2 text-left border-b border-gray-200">编号</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">考核维度</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">具体内容</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['C1-01', '环境搭建能力', '正确安装CLI工具、配置环境变量（PATH）、验证安装版本'],
                    ['C1-02', '基础配置能力', '完成工具初始化配置（API Key绑定、默认模型选择、代理设置等）'],
                    ['C1-03', '项目初始化', '使用CLI工具生成项目脚手架、创建基本文件结构'],
                    ['C1-04', '基本交互验证', '成功通过CLI工具进行代码生成、代码解释等基本交互操作'],
                    ['C1-05', '文档阅读能力', '对标准技术文档的理解和执行能力'],
                  ].map(([id, dim, detail], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-100 font-mono">{id}</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium">{dim}</td>
                      <td className="px-3 py-2 border-b border-gray-100">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-semibold text-gray-800">交付物要求：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>2个CLI工具的成功安装截图/录屏</li>
              <li>2个HelloWorld项目的源代码及运行结果截图</li>
              <li>简要部署报告（Markdown格式）</li>
            </ul>

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

        {/* 复赛 */}
        <Accordion title="Level 2：复赛 — 定制化CLI工具部署与复杂项目开发 ★★★★☆（35分）">
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900">难度定位：★★★★☆（进阶级）</p>
            </div>

            <p><strong>任务形态：</strong>选手需对CLI工具进行<strong>定制化配置与深度调优</strong>，并使用这两个工具分别构建一个包含<strong>复杂参数传递、数据流处理及外部依赖管理</strong>的功能性项目。</p>

            <p className="font-semibold text-gray-800">考核要点：</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-3 py-2 text-left border-b border-gray-200">编号</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">考核维度</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">具体内容</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['C2-01', '定制化配置', '自定义模型参数（temperature、top_p等）、配置文件定制、多profile管理'],
                    ['C2-02', '复杂参数传递', '命令行参数解析（positional/optional/flag）、环境变量注入、配置文件级联覆盖'],
                    ['C2-03', '数据流处理', '标准输入/输出管道（stdin/stdout pipeline）、文件I/O操作、JSON/CSV数据处理'],
                    ['C2-04', '外部依赖管理', '第三方库引入与版本锁定、依赖冲突解决、虚拟环境/容器隔离'],
                    ['C2-05', '错误处理与日志', '异常捕获与优雅退出、结构化日志输出、调试信息分级'],
                    ['C2-06', 'AI CLI深度运用', '利用AI CLI工具进行复杂代码生成、重构、测试用例编写等高级操作'],
                  ].map(([id, dim, detail], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-100 font-mono">{id}</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium">{dim}</td>
                      <td className="px-3 py-2 border-b border-gray-100">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-semibold text-gray-800">交付物要求：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>2个定制化配置后的CLI工具运行环境验证截图</li>
              <li>2个功能性项目的完整源代码及README文档</li>
              <li>项目运行演示（≤5分钟）</li>
            </ul>

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

        {/* 决赛 */}
        <Accordion title="Level 3：决赛 — 极客级CLI自动化工作流部署与业务闭环实现 ★★★★★（45分）">
          <div className="space-y-4 text-sm text-gray-700">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-900">难度定位：★★★★★（专家级）</p>
            </div>

            <p><strong>任务形态：</strong>选手需构建<strong>极客级CLI自动化工作流</strong>，要求两个项目分别实现<strong>完整的业务闭环</strong>，展现高水平的终端工程化能力与AI CLI编排能力。</p>

            <p className="font-semibold text-gray-800">考核要点：</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-3 py-2 text-left border-b border-gray-200">编号</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">考核维度</th>
                    <th className="px-3 py-2 text-left border-b border-gray-200">具体内容</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['C3-01', '自动化测试集成', '单元测试/集成测试自动化执行、测试覆盖率报告生成、测试结果自动分析'],
                    ['C3-02', 'CI/CD流程模拟', '构建→测试→打包→部署的完整Pipeline脚本编写与自动化执行'],
                    ['C3-03', '复杂文件批处理', '多格式文件批量转换/处理、正则匹配与文本处理、目录树递归操作'],
                    ['C3-04', 'Shell脚本编排', '多工具协同的Shell脚本编排、定时任务调度、进程管理与守护'],
                    ['C3-05', '业务闭环完整性', '项目具备完整的输入→处理→输出→反馈链路，可独立运行并产出有效业务成果'],
                    ['C3-06', '工程化规范', '代码文档完整性、Git版本管理规范、目录结构清晰度、可复现性'],
                    ['C3-07', '现场答辩', '向评委演示完整工作流、阐述AI CLI工具编排策略与技术决策逻辑'],
                  ].map(([id, dim, detail], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b border-gray-100 font-mono">{id}</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium">{dim}</td>
                      <td className="px-3 py-2 border-b border-gray-100">{detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-semibold text-gray-800">交付物要求：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>2个完整业务闭环项目的全部源代码（含自动化脚本）</li>
              <li>项目技术架构文档（Markdown格式）</li>
              <li>CI/CD Pipeline运行日志与截图</li>
              <li>现场答辩演示（≤15分钟，含Q&A）</li>
            </ul>

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
