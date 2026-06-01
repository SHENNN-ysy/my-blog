import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/stores/authStore'
import { setRememberMePreference, getRememberMe } from '@/stores/authStore'
import '@/pages/ExplorePage.css'

type Tab = 'login' | 'register'

interface FieldErrors {
  account?: string
  password?: string
  confirmPwd?: string
  email?: string
}

export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [email, setEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [globalError, setGlobalError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [rememberMe, setRememberMe] = useState(getRememberMe())
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  function validate(fields: {
    account: string
    password: string
    confirmPwd: string
    email: string
    tab: Tab
  }): FieldErrors {
    const errors: FieldErrors = {}

    if (!fields.account.trim()) {
      errors.account = '请输入账号'
    } else if (!/^\w{3,20}$/.test(fields.account.trim())) {
      errors.account = '账号为 3-20 位字母、数字或下划线'
    }

    if (!fields.password) {
      errors.password = '请输入密码'
    } else if (fields.password.length < 6) {
      errors.password = '密码至少 6 位'
    }

    if (fields.tab === 'register') {
      if (!fields.confirmPwd) {
        errors.confirmPwd = '请确认密码'
      } else if (fields.password !== fields.confirmPwd) {
        errors.confirmPwd = '两次密码不一致'
      }

      if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
        errors.email = '邮箱格式不正确'
      }
    }

    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')

    const errors = validate({ account, password, confirmPwd, email, tab })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})

    setLoading(true)
    try {
      if (tab === 'login') {
        setRememberMePreference(rememberMe)
        const res = await authApi.login({ username: account.trim(), password })
        setAuth(res.token, res.user)
        navigate('/')
      } else {
        await authApi.register({
          username: account.trim(),
          password,
          email: email || `${account.trim()}@example.com`,
        })
        setTab('login')
        setFieldErrors({})
        setPassword('')
        setConfirmPwd('')
        setEmail('')
        setGlobalError('')
      }
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message
      setGlobalError(message || (tab === 'login' ? '登录失败，请检查账号密码' : '注册失败，请重试'))
    } finally {
      setLoading(false)
    }
  }

  function switchTab(t: Tab) {
    setTab(t)
    setFieldErrors({})
    setGlobalError('')
    setPassword('')
    setConfirmPwd('')
    setEmail('')
  }

  function handleAccountChange(val: string) {
    setAccount(val)
    if (fieldErrors.account) setFieldErrors((prev) => ({ ...prev, account: undefined }))
  }

  function handlePasswordChange(val: string) {
    setPassword(val)
    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }))
  }

  function handleConfirmChange(val: string) {
    setConfirmPwd(val)
    if (fieldErrors.confirmPwd) setFieldErrors((prev) => ({ ...prev, confirmPwd: undefined }))
  }

  function handleEmailChange(val: string) {
    setEmail(val)
    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
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

          <form onSubmit={handleSubmit} noValidate>
            {/* Account */}
            <div className="form-group">
              <label className="form-label">账号</label>
              <div className="form-input-wrap">
                <input
                  type="text"
                  className={`form-input${fieldErrors.account ? ' has-error' : ''}`}
                  placeholder="3-20位字母、数字或下划线"
                  value={account}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  autoComplete="username"
                />
                <span className="form-input-icon">⊙</span>
              </div>
              {fieldErrors.account && (
                <p className="field-error">{fieldErrors.account}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">密码</label>
              <div className="form-input-wrap">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`form-input${fieldErrors.password ? ' has-error' : ''}`}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
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
              {fieldErrors.password && (
                <p className="field-error">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm password (register only) */}
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">确认密码</label>
                <div className="form-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`form-input${fieldErrors.confirmPwd ? ' has-error' : ''}`}
                    placeholder="再次输入密码"
                    value={confirmPwd}
                    onChange={(e) => handleConfirmChange(e.target.value)}
                    autoComplete="new-password"
                  />
                  <span className="form-input-icon">🔒</span>
                </div>
                {fieldErrors.confirmPwd && (
                  <p className="field-error">{fieldErrors.confirmPwd}</p>
                )}
              </div>
            )}

            {/* Email (register only) */}
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">邮箱（选填）</label>
                <div className="form-input-wrap">
                  <input
                    type="email"
                    className={`form-input${fieldErrors.email ? ' has-error' : ''}`}
                    placeholder="选填，用于找回密码"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    autoComplete="email"
                  />
                  <span className="form-input-icon">✉</span>
                </div>
                {fieldErrors.email && (
                  <p className="field-error">{fieldErrors.email}</p>
                )}
              </div>
            )}

            {/* Global error message */}
            <div className={`form-error${globalError ? ' show' : ''}`}>
              <span>⚠</span>
              {globalError}
            </div>

            {/* Remember + forgot (login only) */}
            {tab === 'login' && (
              <div className="form-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="remember-check" />
                  <span className="remember-label">记住我</span>
                </label>
                <span className="forgot-link" role="button" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                  忘记密码？
                </span>
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
            <span className="social-btn social-btn-disabled">
              <span style={{ fontSize: '1rem' }}>G</span>
              GitHub
            </span>
            <span className="social-btn social-btn-disabled">
              <span style={{ fontSize: '1rem' }}>✉</span>
              邮箱
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
