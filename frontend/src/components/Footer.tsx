import { Link } from 'react-router-dom'
import '@/styles/navbar-footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <span className="footer-tag">v2.0</span>
        <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
          个人学习实验室
        </Link>
        · My Learning Lab
      </div>
      <div className="footer-right">Built with curiosity &amp; code</div>
    </footer>
  )
}
