export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">About</p>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">关于大赛</h1>
          <p className="text-gray-500">AI素养大赛·专业赛道 — 赛事背景与组织信息</p>
        </div>

        {/* 大赛背景 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            大赛背景
          </h2>
          <p className="text-gray-700 leading-relaxed">
            在人工智能技术深刻重塑软件工程范式的时代浪潮中，AI辅助编程能力已从"加分技能"跃升为"核心素养"。掌握与AI协作的能力——精准地向AI提出指令、批判性地审查AI输出、高效地将AI工具融入开发工作流——正成为定义下一代技术人才的关键标尺。
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong className="text-gray-900">AI素养大赛</strong>应运而生，旨在构建一个高规格、强实战的竞技平台，全面检验并提升参赛者在真实工程场景下运用AI工具解决复杂技术问题的综合能力。
          </p>
        </section>

        {/* 大赛宗旨 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            大赛宗旨
          </h2>
          <div className="space-y-3">
            {[
              { label: '以赛促学', desc: '驱动参赛者深入理解各类AI编程辅助工具的能力边界与最佳实践。' },
              { label: '以赛验能', desc: '通过高仿真工程任务，客观评估参赛者的AI协作编程素养水平。' },
              { label: '以赛育才', desc: '发掘并培养兼具扎实工程基础与AI驾驭能力的复合型技术人才。' },
              { label: '倡导极客精神', desc: '鼓励选手突破工具封装层，深入底层API调用与本地化部署，追求技术自主可控。' },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" />
                <div>
                  <span className="font-semibold text-gray-900">{item.label}：</span>
                  <span className="text-gray-600">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 专业赛道简介 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            专业赛道简介
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            专业赛道面向具备一定编程基础的选手，下设两个子赛项，均采用<strong className="text-gray-900">初赛 → 复赛 → 决赛</strong>三级赛制，难度呈阶梯式上升。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">赛项编号</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">赛项名称</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 border border-gray-200">核心能力考察维度</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border border-gray-200 font-medium">赛项一</td>
                  <td className="py-3 px-4 border border-gray-200 font-medium text-blue-700">AI纠错赛项</td>
                  <td className="py-3 px-4 border border-gray-200 text-gray-600">AI辅助代码审查、缺陷定位、逻辑修复、性能调优</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 px-4 border border-gray-200 font-medium">赛项二</td>
                  <td className="py-3 px-4 border border-gray-200 font-medium text-blue-700">AI命令行工具部署与开发赛道</td>
                  <td className="py-3 px-4 border border-gray-200 text-gray-600">AI CLI工具链运维、终端环境开发、自动化工作流构建</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 赛项独立性 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            赛项独立性声明
          </h2>
          <p className="text-gray-700 leading-relaxed">
            AI纠错赛项与CLI部署开发赛项为平行独立赛道。选手可选择单赛道报名或双赛道兼报。兼报选手须分别参加两个赛道各阶段的比赛，成绩独立计算，不交叉影响。
          </p>
        </section>

        {/* 组织信息 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            组织信息
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong className="text-gray-900">赛事名称：</strong>AI素养大赛·专业赛道</p>
            <p><strong className="text-gray-900">赛事性质：</strong>面向具备一定编程基础选手的专业级AI编程素养竞赛</p>
            <p><strong className="text-gray-900">GitHub 仓库：</strong>
              <a
                href="https://github.com/AmaTsumeAkira/AI-Competition"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 underline hover:text-blue-800"
              >
                AmaTsumeAkira/AI-Competition
              </a>
            </p>
            <p className="text-gray-500 mt-3 text-xs">本秩序册为AI素养大赛专业赛道的权威性竞赛规则文件，一经发布，对组委会、裁判组、全体参赛选手及相关工作人员均具有约束力。组委会保留最终解释权。</p>
          </div>
        </section>
      </div>
    </div>
  )
}
