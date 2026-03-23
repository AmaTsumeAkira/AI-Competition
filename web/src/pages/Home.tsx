import { useState, useEffect } from 'react'

/* ─── Countdown Hook ─── */
function useCountdown(target: Date) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target.getTime() - now.getTime())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

/* ─── Reusable Section Heading ─── */
function SectionHeading({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        <span className="mr-2">{icon}</span>{title}
      </h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-gray-500">{subtitle}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const regDeadline = new Date('2026-04-20T00:00:00+08:00')
  const cd = useCountdown(regDeadline)

  return (
    <div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20">
          {/* top label */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              招募中
            </span>
          </div>

          <h1 className="text-center text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            open study<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              全国大学生跨学科细胞生物学竞赛
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-500">
            面向全国大学生，推动跨学科创新，激发细胞生物学研究热情
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://github.com/nicekid1/Cell-Competition-2025-Development-Track"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              立即报名
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>

          {/* Countdown */}
          <div className="mt-12 flex justify-center gap-4">
            {[
              { val: cd.days, label: '天' },
              { val: cd.hours, label: '时' },
              { val: cd.minutes, label: '分' },
              { val: cd.seconds, label: '秒' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-2xl font-bold text-gray-900 shadow-sm sm:h-20 sm:w-20 sm:text-3xl">
                  {String(item.val).padStart(2, '0')}
                </div>
                <span className="mt-1.5 text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-sm text-gray-400">距 2026 年 4 月 20 日报名截止</p>
        </div>
      </section>

      {/* ── 三个里程碑 ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading icon="🏆" title="项目内容" />

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                ),
                title: 'Development Track',
                subtitle: '开发赛道',
                desc: '我们鼓励参赛者围绕真实需求，提交完整的开发作品。项目必须包含可运行的前端界面与后端服务，确保全流程可交互。无论是工具平台、可视化面板还是智能应用，技术栈不限。',
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                ),
                title: 'Research Track',
                subtitle: '综述赛道',
                desc: '围绕给定主题撰写中文综述论文（1500–5000字）。要求逻辑严谨、引用充分、观点独立。鼓励使用AI辅助检索与润色，但须保证学术诚信与人工审核。',
              },
              {
                icon: (
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                ),
                title: 'Geek Bonus',
                subtitle: '极客加分',
                desc: '竞赛鼓励技术创新，设有额外加分项。包括：自主接入外部API（+10分）、本地部署大语言模型Ollama（+12分）、使用Agent框架如OpenClaw（+8分）。总计最高可加30分。',
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                <p className="mb-3 text-sm font-medium text-blue-600">{card.subtitle}</p>
                <p className="text-sm leading-relaxed text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 竞赛项目 ── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading icon="📋" title="竞赛项目" subtitle="开放获取的科学过程与资源" />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '🎯', title: '项目选题与目标定义', desc: '明确研究问题、开发目标和预期成果，制定清晰的项目路线图' },
              { icon: '🔍', title: '相关文献调研', desc: '系统检索和分析领域内最新研究成果，建立理论基础' },
              { icon: '⚙️', title: '项目实施', desc: '按照计划执行开发或研究任务，记录过程数据和关键发现' },
              { icon: '📊', title: '结果总结与展示', desc: '整理分析结果，制作展示材料，准备最终答辩' },
            ].map((card) => (
              <div key={card.title} className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                <div className="mb-4 text-3xl">{card.icon}</div>
                <h3 className="mb-2 text-base font-bold text-gray-900">{card.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 详细时间线 ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading icon="📅" title="项目时间线" />

          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 to-blue-200" />

            <div className="space-y-8">
              {[
                { date: '3.20 前', title: '提交队伍信息', desc: '组建团队，确定参赛方向，提交队伍基本信息与成员名单', color: 'bg-blue-600' },
                { date: '3.24', title: '开幕仪式', desc: '正式发布赛事通知、公布题目与竞赛材料', color: 'bg-blue-600' },
                { date: '3.25', title: '第一次Check in', desc: '确认参赛队伍信息，发放初始竞赛材料与工具', color: 'bg-blue-500' },
                { date: '3.30', title: '第二次Check in', desc: '确认队伍准备情况，解答参赛疑问', color: 'bg-blue-500' },
                { date: '3.31 ~ 4.6', title: '第一阶段（开发/综述撰写）', desc: '各赛道正式开始项目开发或综述撰写', color: 'bg-indigo-500' },
                { date: '4.6', title: '作品初稿提交截止', desc: '提交阶段性成果，接受初步评审反馈', color: 'bg-indigo-500' },
                { date: '4.7 ~ 4.13', title: '第二阶段（优化迭代）', desc: '根据评审意见优化完善作品，准备最终提交', color: 'bg-violet-500' },
                { date: '4.13', title: '最终作品提交', desc: '提交完整项目代码、文档和演示材料', color: 'bg-violet-500' },
                { date: '4.14 ~ 4.15', title: '评审与打分', desc: '评委对各赛道作品进行综合评审打分', color: 'bg-purple-500' },
                { date: '4.20', title: '公布结果，闭幕', desc: '公布最终成绩与获奖名单，举办线上闭幕式', color: 'bg-purple-600' },
              ].map((item, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.color} text-xs font-bold text-white shadow-md`}>
                    {i + 1}
                  </div>
                  <div className="pb-2">
                    <span className="text-xs font-medium text-blue-600">{item.date}</span>
                    <h3 className="mt-0.5 text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading icon="❓" title="常见问题" subtitle="快速了解参赛信息" />
          <div className="space-y-4">
            {[
              { q: '竞赛是否需要组队参加？', a: '是的，本次竞赛鼓励组队参加，团队成员可以来自不同学科背景，以促进跨学科合作。建议团队规模为2-4人。' },
              { q: '竞赛对技术栈有要求吗？', a: '没有硬性要求。开发赛道中，参赛者可以自由选择技术栈，只要最终成果可运行、可交互即可。' },
              { q: '可以使用AI辅助工具吗？', a: '可以。我们鼓励合理使用AI工具提升效率，但需要保证作品的核心逻辑和创新点由参赛者本人完成。使用AI辅助还可能获得额外加分。' },
              { q: '提交的作品需要包含哪些内容？', a: '开发赛道需提交完整源码、README文档和演示视频/截图。综述赛道需提交Word或PDF格式的论文文档。' },
              { q: '评审标准是什么？', a: '评审将从创新性、完整性、技术难度、实用价值和文档质量五个维度进行综合评定。详细评分规则请参见竞赛说明。' },
            ].map((item, i) => (
              <details key={i} className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-semibold text-gray-900">
                  {item.q}
                  <svg className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-gray-500">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
