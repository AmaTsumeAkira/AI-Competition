import { Link } from 'react-router-dom'

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-blue-900">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-gray-500">{subtitle}</p>}
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 to-blue-900 text-white">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-800/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-800/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-6 pt-28 pb-20">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-800/40 px-4 py-1.5 text-sm font-medium text-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              2026 赛季
            </span>
          </div>
          <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            AI素养大赛
            <span className="block text-blue-300 text-3xl sm:text-4xl lg:text-5xl mt-2">· 专业赛道</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-blue-200/80">
            以赛促学 · 以赛验能 · 以赛育才
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base text-blue-300/60">
            全面检验并提升参赛者在真实工程场景下运用AI工具解决复杂技术问题的综合能力
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/debug"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-900 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              AI纠错赛项
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              to="/cli"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-blue-400/40 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-blue-800/50"
            >
              CLI部署赛项
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 大赛背景 */}
      <section className="bg-white pt-16 pb-0">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-gray-600 leading-relaxed text-base">
            在人工智能技术深刻重塑软件工程范式的时代浪潮中，AI辅助编程能力已从"加分技能"跃升为"核心素养"。
          </p>
        </div>
      </section>

      {/* 大赛宗旨 */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading title="大赛宗旨" subtitle="发掘并培养兼具扎实工程基础与AI驾驭能力的复合型技术人才" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '📚', title: '以赛促学', desc: '驱动参赛者深入理解各类AI编程辅助工具的能力边界与最佳实践' },
              { icon: '🔬', title: '以赛验能', desc: '通过高仿真工程任务，客观评估参赛者的AI协作编程素养水平' },
              { icon: '🎓', title: '以赛育才', desc: '发掘并培养兼具扎实工程基础与AI驾驭能力的复合型技术人才' },
              { icon: '⚡', title: '极客精神', desc: '鼓励选手突破工具封装层，深入底层API调用与本地化部署' },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md text-center">
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 赛程时间轴 */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading title="赛程时间轴" subtitle="初赛 → 复赛 → 决赛，三级赛制，难度阶梯式上升" />
          <div className="relative">
            <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-600 to-blue-300" />
            <div className="space-y-8">
              {[
                {
                  phase: '初赛',
                  label: 'Preliminaries',
                  color: 'bg-blue-600',
                  items: [
                    { k: '形式', v: '线下集中实操' },
                    { k: '时长', v: '60–90 分钟' },
                    { k: '晋级', v: '按赛项分别排名，取前50%选手晋级' },
                    { k: '核心能力', v: '基础能力' },
                  ],
                },
                {
                  phase: '复赛',
                  label: 'Semi-finals',
                  color: 'bg-blue-500',
                  items: [
                    { k: '形式', v: '线下集中实操' },
                    { k: '时长', v: '120–150 分钟' },
                    { k: '晋级', v: '按赛项分别排名，取前30%选手晋级' },
                    { k: '核心能力', v: '工程能力' },
                  ],
                },
                {
                  phase: '决赛',
                  label: 'Finals',
                  color: 'bg-indigo-600',
                  items: [
                    { k: '形式', v: '线下集中实操 + 现场答辩' },
                    { k: '时长', v: '180 分钟（含答辩）' },
                    { k: '晋级', v: '按综合得分排名，评定最终名次与奖项' },
                    { k: '核心能力', v: '系统级能力' },
                    { k: '答辩', v: '约10分钟/人，由技术评审委员会质询' },
                  ],
                },
              ].map((stage, i) => (
                <div key={stage.phase} className="relative flex gap-6">
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${stage.color} text-sm font-bold text-white shadow-md`}>
                    {i + 1}
                  </div>
                  <div className="pb-2 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{stage.phase}</h3>
                      <span className="text-xs text-gray-400">{stage.label}</span>
                    </div>
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                      {stage.items.map((item) => (
                        <div key={item.k} className="flex px-4 py-2.5 text-sm">
                          <span className="w-20 shrink-0 text-gray-400 font-medium">{item.k}</span>
                          <span className="text-gray-700">{item.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>晋级规则补充：</strong>①晋级比例可由组委会根据实际参赛人数微调（±5%），须赛前公示。②同分选手全部晋级，不设末位淘汰。
            </p>
          </div>
        </div>
      </section>

      {/* 两个赛道入口 */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading title="竞赛赛道" subtitle="两个赛项均为平行独立赛道，选手可单赛道报名或双赛道兼报" />
          <div className="grid gap-8 md:grid-cols-2">
            <Link to="/debug" className="group rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">赛项一：AI纠错赛项</h3>
              <p className="text-sm font-medium text-blue-600 mb-3">PRO-DBG</p>
              <p className="text-sm leading-relaxed text-gray-500 mb-4">利用AI辅助工具对含有Bug的代码项目进行缺陷定位、调试分析及修复。考核核心在于选手如何高效运用AI工具辅助完成Debug全流程及性能调优分析。</p>
              <div className="flex flex-wrap gap-2">
                {['VSCode插件', 'CLI工具', '代码审查', '缺陷定位'].map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{tag}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                查看详情
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
            <Link to="/cli" className="group rounded-xl border-2 border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">赛项二：CLI部署开发赛项</h3>
              <p className="text-sm font-medium text-blue-600 mb-3">PRO-CLI</p>
              <p className="text-sm leading-relaxed text-gray-500 mb-4">使用AI命令行代码助手，全程在终端环境下完成CLI工具部署与应用项目开发。考核终端环境开发能力、操作熟练度与AI CLI工具驾驭能力。</p>
              <div className="flex flex-wrap gap-2">
                {['仅限CLI', '终端操作', '工具部署', '自动化工作流'].map((tag) => (
                  <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">{tag}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                查看详情
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 极客加分概览 */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <SectionHeading title="极客加分机制" subtitle="突破工具封装层，追求技术自主可控 — 理论最高可得 130 分" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { score: '+10', title: '自主接入API', desc: '成功申请并配置大模型API密钥，使用API驱动AI工具完成核心任务，多模型切换与对比运用', color: 'from-blue-500 to-blue-600' },
              { score: '+12', title: 'Ollama本地化部署', desc: '成功安装运行Ollama，使用Ollama驱动AI工具完成比赛任务，模型选型与参数调优，多模型本地编排', color: 'from-indigo-500 to-indigo-600' },
              { score: '+8', title: '使用OpenClaw', desc: '成功安装配置OpenClaw，利用OpenClaw进行深度代码修改，构建自动化代码处理流程', color: 'from-violet-500 to-violet-600' },
            ].map((card) => (
              <div key={card.title} className="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
                <div className={`inline-flex rounded-lg bg-gradient-to-r ${card.color} px-3 py-1 text-sm font-bold text-white mb-3`}>
                  {card.score} 分
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/rules" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
              查看完整评分规则 →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
