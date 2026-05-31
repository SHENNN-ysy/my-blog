import { NavLink } from 'react-router-dom'
import { useEffect } from 'react'
import { useScrollY } from '@/hooks/useScrollY'
import '@/styles/navbar-footer.css'

export default function NavBar() {
  const scrolled = useScrollY()

  // Run once on mount to handle page refresh (scroll position may already be > threshold)
  useEffect(() => {
    const handler = () => {
      const nav = document.querySelector('.navbar') as HTMLElement
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20)
    }
    handler()
  }, [])

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
        <li><NavLink to="/explore" className="nav-cta">开始探索</NavLink></li>
      </ul>
    </nav>
  )
}
