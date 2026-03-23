export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero */}
      <div className="mb-12">
        <p className="mb-2 text-sm font-medium text-blue-600">关于我们</p>
        <h1 className="text-4xl font-bold text-gray-900">
          关于<span className="text-blue-600">open study</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 leading-relaxed">
          open study 旨在打造一个开放、协作的学习与创新平台。
          我们相信通过跨学科合作、开源精神与实践驱动，
          能够激发大学生的创造力与研究热情。
        </p>
      </div>

      {/* Content cards */}
      <div className="space-y-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">赛事背景</h2>
          <p className="text-sm leading-relaxed text-gray-600">
            open study 竞赛项目是一场面向大学生的跨学科创新实践竞赛。
            随着 AI 工具、开源框架和跨学科方法在科研与工程中的广泛应用，
            如何正确、高效地运用这些工具已成为每位未来研究者与工程师的核心技能。
            本赛事通过真实的项目开发和学术写作场景，
            考察参赛者的创新思维、工程实践与学术素养。
          </p>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">组织信息</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong className="text-gray-900">赛事主办方：</strong>open study 组委会</p>
            <p><strong className="text-gray-900">赛事负责人：</strong>nicekid</p>
            <p><strong className="text-gray-900">最后更新：</strong>2026-03-22</p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900">联系方式</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong className="text-gray-900">GitHub 仓库：</strong>
              <a
                href="https://github.com/nicekid1/Cell-Competition-2025-Development-Track"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-600 underline hover:text-blue-800"
              >
                nicekid1/Cell-Competition-2025-Development-Track
              </a>
            </p>
            <p><strong className="text-gray-900">赛题提交：</strong>通过 GitHub Issues 提交</p>
          </div>
        </section>
      </div>
    </div>
  )
}
