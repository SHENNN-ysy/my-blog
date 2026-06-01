import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { useScrollY } from '@/hooks/useScrollY'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/api/authApi'
import '@/styles/navbar-footer.css'

export default function NavBar() {
  const scrolled = useScrollY()
  const { isLoggedIn, user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handler = () => {
      const nav = document.querySelector('.navbar') as HTMLElement
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20)
    }
    handler()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function handleLogout() {
    setLoggingOut(true)
    setMenuOpen(false)
    try {
      await authApi.logout()
    } catch {
      // logout API failure is non-critical; clear local state regardless
    } finally {
      clearAuth()
      setLoggingOut(false)
      navigate('/')
    }
  }

  function getInitials(name: string) {
    return name.charAt(0).toUpperCase()
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <NavLink to="/" className="nav-logo">
        <div className="logo-icon">&lt;/&gt;</div>
        个人学习实验室
      </NavLink>
      <ul className="nav-links">
        <li><NavLink to="/" end>首页</NavLink></li>
        <li><NavLink to="/experiments">实验记录</NavLink></li>
        <li><NavLink to="/notes">技术笔记</NavLink></li>
        <li><NavLink to="/about">关于</NavLink></li>

        {isLoggedIn && user ? (
          <li className="nav-user-menu" ref={menuRef}>
            <button
              className="nav-user-btn"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.nickname} className="nav-avatar" />
              ) : (
                <div className="nav-avatar-fallback">{getInitials(user.nickname || user.username)}</div>
              )}
              <span className="nav-username">{user.nickname || user.username}</span>
              <svg className={`nav-chevron${menuOpen ? ' open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div className={`nav-dropdown${menuOpen ? ' open' : ''}`}>
              <div className="nav-dropdown-user">
                <div className="nav-dropdown-name">{user.nickname || user.username}</div>
                <div className="nav-dropdown-role">{user.role === 'admin' ? '管理员' : '普通用户'}</div>
              </div>
              <div className="nav-dropdown-divider" />
              <button
                className="nav-dropdown-item nav-dropdown-logout"
                onClick={handleLogout}
                disabled={loggingOut}
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {loggingOut ? '退出中...' : '退出登录'}
              </button>
            </div>
          </li>
        ) : (
          <li><NavLink to="/explore" className="nav-cta">开始探索</NavLink></li>
        )}
      </ul>
    </nav>
  )
}
