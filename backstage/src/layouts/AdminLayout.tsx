import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAdminStore } from '@/stores/adminStore'

const MENU_ITEMS = [
  {
    key: '/admin/dashboard',
    label: '仪表盘',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    key: '/admin/monitor',
    label: '系统监控',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user, clearAuth } = useAdminStore()
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0d1117', color: '#e6edf3' }}>
      {/* 侧边栏 */}
      <aside
        style={{
          width: collapsed ? 64 : 220,
          background: '#161b22',
          borderRight: '1px solid #30363d',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 12px' : '0 20px',
            borderBottom: '1px solid #30363d',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #238636 0%, #1a7f37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            &lt;/&gt;
          </div>
          {!collapsed && (
            <span style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', whiteSpace: 'nowrap' }}>
              博客管理后台
            </span>
          )}
        </div>

        {/* 菜单 */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.key}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: collapsed ? '10px 12px' : '10px 20px',
                margin: '2px 8px',
                borderRadius: 6,
                color: isActive ? '#e6edf3' : '#8b949e',
                background: isActive ? '#238636' : 'transparent',
                textDecoration: 'none',
                fontSize: 14,
                transition: 'all 0.15s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10,
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            borderTop: '1px solid #30363d',
            color: '#8b949e',
            cursor: 'pointer',
            fontSize: 13,
            width: '100%',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
          {!collapsed && <span>收起</span>}
        </button>
      </aside>

      {/* 主内容区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 顶栏 */}
        <header
          style={{
            height: 60,
            background: '#161b22',
            borderBottom: '1px solid #30363d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            gap: 16,
          }}
        >
          {/* 用户信息 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#238636',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {user?.nickname?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span style={{ fontSize: 14, color: '#e6edf3' }}>
              {user?.nickname || user?.username || '管理员'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: '1px solid #30363d',
              borderRadius: 6,
              color: '#8b949e',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            退出登录
          </button>
        </header>

        {/* 页面内容 */}
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
