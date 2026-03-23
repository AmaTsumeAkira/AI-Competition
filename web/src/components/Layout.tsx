import { NavLink, Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-brand">
            AI素养大赛 · 专业赛道
          </NavLink>
          <ul className="navbar-links">
            <li><NavLink to="/" end>首页</NavLink></li>
            <li><NavLink to="/debug">AI纠错</NavLink></li>
            <li><NavLink to="/cli">CLI部署</NavLink></li>
            <li><NavLink to="/rules">评分规则</NavLink></li>
            <li><NavLink to="/about">关于</NavLink></li>
          </ul>
        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>

      <footer className="footer">
        AI素养大赛 © 2026 · 主办方：AmaTsume Akira ·
        仓库地址：<a href="https://github.com/AmaTsumeAkira/AI-Competition" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </footer>
    </>
  )
}

export default Layout
