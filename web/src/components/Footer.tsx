import { COMPETITION_NAME } from '../config'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-blue-900 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500">{COMPETITION_NAME} · 专业赛道</span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-sm text-gray-400">© 2026 {COMPETITION_NAME}组委会. 保留所有权利。</p>
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              陕ICP备20011108号-2
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
