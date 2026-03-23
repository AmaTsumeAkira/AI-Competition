import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: '首页' },
    { href: '/debug', label: 'AI纠错赛项' },
    { href: '/cli', label: 'CLI部署赛项' },
    { href: '/rules', label: '评分规则' },
    { href: '/about', label: '关于' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-blue-900">AI素养大赛<span className="text-blue-500">·专业赛道</span></span>
        </a>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              className="px-3 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <a key={item.href} href={`#${item.href}`} className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-blue-50 font-medium" onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
