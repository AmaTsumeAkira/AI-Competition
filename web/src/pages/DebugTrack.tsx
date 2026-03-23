import Accordion from '../components/Accordion'

export default function DebugTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">PRO-DBG</p>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">AI纠错赛项</h1>
          <p className="text-gray-500">利用AI辅助工具对含有Bug的代码项目进行缺陷定位、调试分析及修复</p>
        </div>

        {/* 赛项概述 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">赛项概述</h2>
          <p className="text-gray-700 leading-relaxed">
            选手需利用组委会指定的AI辅助工具，对官方给出的<strong className="text-gray-900">含有Bug的代码项目</strong>进行缺陷定位、调试分析及修复。考核的核心不仅是"能否修好Bug"，更在于选手<strong className="text-gray-900">如何高效运用AI工具辅助完成Debug全流程</strong>。
          </p>
        </section>

        {/* 允许使用的工具 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">允许使用的工具</h2>
          <p className="text-gray-600 text-sm mb-4">选手须<strong>且只能</strong>使用以下工具列表中的工具完成比赛任务（可任选一种或多种组合使用）：</p>

          <h3 className="text-base font-bold text-gray-800 mb-3 mt-6">▎ VSCode 插件类</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200 w-16">序号</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">工具名称</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">说明</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1', '通义灵码（TONGYILingma）', '阿里云智能编码助手'],
                  ['2', '智谱CodeGeeX', '智谱AI代码生成与辅助工具'],
                  ['3', '腾讯云CodeBuddy', '腾讯云AI编程伙伴'],
                  ['4', '文心快码BaiduComate', '百度AI代码助手'],
                  ['5', 'KiloCode', '开源AI编码插件'],
                  ['6', 'Cline', '自主AI编码代理'],
                  ['7', 'RooCode', 'AI编码助手'],
                ].map(([no, name, desc], i) => (
                  <tr key={no} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-2.5 px-4 border border-gray-200 text-center text-gray-500">{no}</td>
                    <td className="py-2.5 px-4 border border-gray-200 font-medium">{name}</td>
                    <td className="py-2.5 px-4 border border-gray-200 text-gray-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-3">▎ AI命令行代码助手（CLI）类</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200 w-16">序号</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">工具名称</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">说明</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1', '通义灵码CLI', '阿里云终端AI编码助手'],
                  ['2', 'CodeGeeXCLI', '智谱终端AI编码助手'],
                  ['3', 'ClaudeCode', 'Anthropic终端AI编码助手'],
                  ['4', 'CodeLlamaCLI', 'Meta终端AI编码助手'],
                ].map(([no, name, desc], i) => (
                  <tr key={no} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-2.5 px-4 border border-gray-200 text-center text-gray-500">{no}</td>
                    <td className="py-2.5 px-4 border border-gray-200 font-medium">{name}</td>
                    <td className="py-2.5 px-4 border border-gray-200 text-gray-600">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>⚠️ 重要提示：</strong>选手在比赛过程中可同时使用VSCode插件类与CLI类工具，二者不互斥。
            </p>
          </div>
        </section>

        {/* 各阶段详情 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">各阶段难度阶梯与考核要点</h2>

          {/* 初赛 */}
          <Accordion title="初赛 — 单文件基础逻辑与语法纠错  ★★☆☆☆" defaultOpen={true}>
            <div className="space-y-4">
              <p className="text-sm text-gray-600"><strong>难度定位：</strong>基础级</p>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">任务形态：</p>
                <p className="text-sm text-gray-600">组委会提供包含<strong>3–5个独立代码文件</strong>（语言涵盖Python/JavaScript/Java/C中的2–3种），每个文件为<strong>单一功能模块</strong>，含有若干已知Bug。</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">考核要点：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">编号</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">考核维度</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">具体内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['D1-01', '语法错误识别', '拼写错误、缺少分号/括号、缩进错误、类型声明不匹配等'],
                        ['D1-02', '基础逻辑修复', '循环边界条件错误（off-by-one）、条件判断逻辑反转、变量误用等'],
                        ['D1-03', '运行时异常处理', '空指针/未定义引用、数组越界、除零错误等常见运行时异常'],
                        ['D1-04', 'AI工具基本运用', '能否正确使用AI工具进行代码解释、错误定位与修复建议获取'],
                      ].map(([id, dim, detail], i) => (
                        <tr key={id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-2 px-3 border border-gray-200 font-mono text-xs text-blue-600">{id}</td>
                          <td className="py-2 px-3 border border-gray-200 font-medium">{dim}</td>
                          <td className="py-2 px-3 border border-gray-200 text-gray-600">{detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">评判标准：</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>修复正确性（Bug是否消除且不引入新Bug）</li>
                  <li>修复完整性（是否全部修复）</li>
                  <li>完成效率（用时排名）</li>
                </ul>
              </div>
            </div>
          </Accordion>

          {/* 复赛 */}
          <Accordion title="复赛 — 多文件/模块级依赖与接口调用纠错  ★★★★☆">
            <div className="space-y-4">
              <p className="text-sm text-gray-600"><strong>难度定位：</strong>进阶级</p>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">任务形态：</p>
                <p className="text-sm text-gray-600">组委会提供一个<strong>中等规模的多文件项目</strong>（包含5–15个源文件，含模块间依赖关系），项目可正常编译/加载但运行结果不正确，或部分功能失效。</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">考核要点：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">编号</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">考核维度</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">具体内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['D2-01', '跨文件依赖分析', '模块导入/导出错误、循环依赖、包路径配置错误'],
                        ['D2-02', '接口调用纠错', '函数签名不匹配、参数类型/顺序错误、返回值处理异常、回调/Promise链断裂'],
                        ['D2-03', '数据流追踪', '变量在多模块间的传递异常、状态管理缺陷、数据格式转换错误'],
                        ['D2-04', '配置与环境排错', '依赖版本冲突、环境变量缺失、配置文件格式错误'],
                        ['D2-05', 'AI深度运用', '能否利用AI工具进行跨文件上下文关联分析、依赖图谱理解与系统性修复方案生成'],
                      ].map(([id, dim, detail], i) => (
                        <tr key={id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-2 px-3 border border-gray-200 font-mono text-xs text-blue-600">{id}</td>
                          <td className="py-2 px-3 border border-gray-200 font-medium">{dim}</td>
                          <td className="py-2 px-3 border border-gray-200 text-gray-600">{detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">评判标准：</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>项目修复后的功能完整性（通过官方提供的自动化测试套件验证）</li>
                  <li>修复方案的合理性与工程规范性</li>
                  <li>完成效率与AI工具使用策略的优劣</li>
                </ul>
              </div>
            </div>
          </Accordion>

          {/* 决赛 */}
          <Accordion title="决赛 — 复杂系统级架构优化与深层隐藏Bug修复  ★★★★★">
            <div className="space-y-4">
              <p className="text-sm text-gray-600"><strong>难度定位：</strong>专家级</p>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">任务形态：</p>
                <p className="text-sm text-gray-600">组委会提供一个<strong>大型复杂工程项目</strong>（20+源文件，涉及多层架构），项目包含显性Bug与<strong>深层隐藏缺陷</strong>（如竞态条件、内存泄漏、安全漏洞等），同时附带性能优化要求。</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">考核要点：</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">编号</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">考核维度</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">具体内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['D3-01', '并发与异步缺陷', '竞态条件（Race Condition）、死锁、线程安全问题、异步回调地狱'],
                        ['D3-02', '性能瓶颈定位与调优', '算法复杂度优化、数据库查询优化（N+1问题等）、内存泄漏定位与修复'],
                        ['D3-03', '安全漏洞修复', 'SQL注入、XSS、路径穿越、不安全的反序列化、敏感信息泄露等'],
                        ['D3-04', '架构级缺陷分析', '设计模式误用、服务间通信异常、缓存策略缺陷、错误的异常传播链'],
                        ['D3-05', '隐藏Bug挖掘', '仅在特定边界条件/高并发/大数据量下触发的深层潜伏Bug'],
                        ['D3-06', 'AI高阶运用与答辩', '向评委阐述AI工具辅助系统级调试的完整方法论、Prompt策略及工具链组合逻辑'],
                      ].map(([id, dim, detail], i) => (
                        <tr key={id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-2 px-3 border border-gray-200 font-mono text-xs text-blue-600">{id}</td>
                          <td className="py-2 px-3 border border-gray-200 font-medium">{dim}</td>
                          <td className="py-2 px-3 border border-gray-200 text-gray-600">{detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">评判标准：</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>自动化测试通过率与功能回归完整性</li>
                  <li>性能指标提升幅度（响应时间、吞吐量、内存占用等量化评测）</li>
                  <li>安全漏洞修复完整性</li>
                  <li>代码质量（可读性、可维护性、工程规范）</li>
                  <li>现场答辩表现（解题思路清晰度、AI使用策略合理性）</li>
                </ul>
              </div>
            </div>
          </Accordion>
        </section>
      </div>
    </div>
  )
}
