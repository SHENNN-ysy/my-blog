import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/stores/authStore'
import '@/pages/ExplorePage.css'

type Tab = 'login' | 'register'

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!account || !password) {
      setError('请填写账号和密码')
      return
    }

    if (tab === 'register' && password !== confirmPwd) {
      setError('两次密码不一致')
      return
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        const res = await authApi.login({ username: account, password })
        setAuth(res.token, res.user)
        navigate('/')
      } else {
        await authApi.register({ username: account, password, email: `${account}@example.com` })
        setTab('login')
        setError('')
        setPassword('')
        setConfirmPwd('')
      }
    } catch (err: any) {
      setError(err?.message || (tab === 'login' ? '登录失败，请检查账号密码' : '注册失败，请重试'))
    } finally {
      setLoading(false)
    }
  }

  function switchTab(t: Tab) {
    setTab(t)
    setError('')
    setPassword('')
    setConfirmPwd('')
  }

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left brand panel */}
        <div className="brand-panel">
          <div className="brand-grid" />
          <div className="brand-content">
            <div className="brand-icon">&lt;/&gt;</div>
            <div className="brand-title">
              开启你的<br />技术探索之旅
            </div>
            <p className="brand-desc">
              加入个人学习实验室，与志同道合的伙伴一起探索技术的边界。每一行代码，都是成长的印记。
            </p>
            <ul className="brand-features">
              {[
                '访问所有原创技术文章',
                '追踪实验项目进度',
                '获取思维模型与笔记',
                '参与社区讨论交流',
              ].map((f) => (
                <li key={f}>
                  <span className="brand-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right form panel */}
        <div className="form-panel">
          {/* Tab switcher */}
          <div className="tab-switch">
            <button
              className={`tab-btn${tab === 'login' ? ' active' : ''}`}
              onClick={() => switchTab('login')}
              type="button"
            >
              登录
            </button>
            <button
              className={`tab-btn${tab === 'register' ? ' active' : ''}`}
              onClick={() => switchTab('register')}
              type="button"
            >
              注册
            </button>
          </div>

          <h2 className="form-heading">
            {tab === 'login' ? '欢迎回来' : '创建账号'}
          </h2>
          <p className="form-sub">
            {tab === 'login'
              ? <>登录后开始你的技术探索之旅 <a href="/">← 返回首页</a></>
              : '注册后解锁全部功能'}
          </p>

          <form onSubmit={handleSubmit}>
            {/* Account */}
            <div className="form-group">
              <label className="form-label">账号</label>
              <div className="form-input-wrap">
                <input
                  type="text"
                  className={`form-input${error ? ' has-error' : ''}`}
                  placeholder="输入账号"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  autoComplete={tab === 'login' ? 'username' : 'username'}
                />
                <span className="form-input-icon">⊙</span>
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">密码</label>
              <div className="form-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-input${error ? ' has-error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                <span className="form-input-icon">🔒</span>
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? '隐藏密码' : '显示密码'}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Confirm password (register only) */}
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">确认密码</label>
                <div className="form-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    autoComplete="new-password"
                  />
                  <span className="form-input-icon">🔒</span>
                </div>
              </div>
            )}

            {/* Error message */}
            <div className={`form-error${error ? ' show' : ''}`}>
              <span>⚠</span>
              {error}
            </div>

            {/* Remember + forgot (login only) */}
            {tab === 'login' && (
              <div className="form-row">
                <label className="remember-me">
                  <input type="checkbox" defaultChecked />
                  <span className="remember-check" />
                  <span className="remember-label">记住我</span>
                </label>
                <a href="#" className="forgot-link">忘记密码？</a>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className={`btn-submit${loading ? ' loading' : ''}`} disabled={loading}>
              <span className="spinner" />
              <span>{tab === 'login' ? '登录' : '注册'}</span>
            </button>
          </form>

          {/* Social login divider */}
          <div className="form-divider">
            <span>或继续使用</span>
          </div>

          {/* Social login */}
          <div className="social-btns">
            <a href="#" className="social-btn">
              <span style={{ fontSize: '1rem' }}>G</span>
              GitHub
            </a>
            <a href="#" className="social-btn">
              <span style={{ fontSize: '1rem' }}>✉</span>
              邮箱
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
