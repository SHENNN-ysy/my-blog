import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 1,
      padding: '0 24px',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '8rem',
        fontWeight: 800,
        color: 'var(--primary)',
        opacity: 0.2,
        lineHeight: 1,
        marginBottom: '24px',
      }}>
        404
      </div>
      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(1.5rem, 4vw, 2.4rem)',
        fontWeight: 800,
        color: 'var(--text-hi)',
        marginBottom: '12px',
        letterSpacing: '-0.02em',
      }}>
        页面未找到
      </h1>
      <p style={{
        color: 'var(--text-mid)',
        fontSize: '1rem',
        marginBottom: '36px',
      }}>
        你访问的页面似乎不存在或已被移除
      </p>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'var(--primary)',
        color: '#0D1117',
        padding: '12px 28px',
        borderRadius: 'var(--radius-sm)',
        fontWeight: 700,
        fontSize: '0.9rem',
        textDecoration: 'none',
        transition: 'all 0.25s',
        boxShadow: '0 0 20px var(--primary-glow)',
      }}>
        ← 返回首页
      </Link>
    </div>
  )
}
