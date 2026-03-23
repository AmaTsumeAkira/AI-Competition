import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: '首页' },
  { to: '/debug', label: 'AI纠错' },
  { to: '/cli', label: 'CLI部署' },
  { to: '/rules', label: '评分规则' },
  { to: '/about', label: '关于' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-blue-900 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold tracking-wide text-white">
          AI素养大赛<span className="hidden sm:inline text-blue-300"> · 专业赛道</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="sm:hidden text-white p-1"
          onClick={() => setOpen(!open)}
          aria-label="菜单"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-blue-800 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-100 hover:bg-blue-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
