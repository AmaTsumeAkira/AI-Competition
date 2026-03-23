import { useState } from 'react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="#/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-blue-900">AI素养大赛<span className="text-blue-600">.</span></span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <a href="#/" className="hover:text-blue-700 transition-colors">首页</a>
          <a href="#/debug" className="hover:text-blue-700 transition-colors">AI纠错</a>
          <a href="#/cli" className="hover:text-blue-700 transition-colors">CLI部署</a>
          <a href="#/rules" className="hover:text-blue-700 transition-colors">评分规则</a>
          <a href="#/about" className="hover:text-blue-700 transition-colors">关于</a>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
          <div className="w-5 h-0.5 bg-gray-700"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          <a href="#/" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>首页</a>
          <a href="#/debug" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>AI纠错</a>
          <a href="#/cli" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>CLI部署</a>
          <a href="#/rules" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>评分规则</a>
          <a href="#/about" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>关于</a>
        </nav>
      )}
    </header>
  )
}
