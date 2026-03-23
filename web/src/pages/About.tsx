export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-blue-900">关于大赛</h1>

      <div className="space-y-8">
        {/* 背景 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-3 text-lg font-bold text-blue-800">📖 赛事背景</h2>
          <p className="text-sm leading-relaxed text-gray-700">
            AI素养大赛·专业赛道是一场面向计算机专业学生的 AI 实战能力竞赛。
            随着 AI 工具在软件开发中的广泛应用，如何正确、高效地使用 AI 工具已成为
            每位开发者的核心技能。本赛事通过真实场景下的代码调试和项目部署，
            考察参赛者对 AI 辅助开发工具的掌握程度与工程化实践能力。
          </p>
        </section>

        {/* 组织者 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-3 text-lg font-bold text-blue-800">👥 组织信息</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>赛事主办方：</strong>AI素养大赛组委会</p>
            <p><strong>赛事负责人：</strong>Boss</p>
            <p><strong>最后更新：</strong>2026-03-23</p>
          </div>
        </section>

        {/* 环境要求 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-3 text-lg font-bold text-blue-800">💻 环境要求</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>操作系统：Windows / Mac / Linux 均可</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>Python 3.8+</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>pip 镜像源：<code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">https://pypi.tuna.tsinghua.edu.cn/simple/</code></span>
            </li>
          </ul>
        </section>

        {/* 联系方式 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-3 text-lg font-bold text-blue-800">📬 联系我们</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>GitHub 仓库：</strong>
              <a
                href="https://github.com/AmaTsumeAkira/AI-Competition"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                AmaTsumeAkira/AI-Competition
              </a>
            </p>
            <p><strong>赛题提交：</strong>通过 GitHub Issues 提交问题或反馈</p>
            <p><strong>赛事咨询：</strong>联系组委会负责人</p>
          </div>
        </section>
      </div>
    </div>
  )
}
