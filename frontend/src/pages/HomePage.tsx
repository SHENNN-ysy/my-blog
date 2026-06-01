import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import '@/styles/navbar-footer.css'
import '@/pages/HomePage.css'

export default function HomePage() {
  const homePageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = homePageRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    el.querySelectorAll('.reveal').forEach((t, i) => {
      ;(t as HTMLElement).style.transitionDelay = `${i * 0.07}s`
      observer.observe(t)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="home-page" ref={homePageRef}>
      {/* Ambient */}
      <div className="hero-deco deco-1" />
      <div className="hero-deco deco-2" />

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="eyebrow-pulse" />
            My Learning Lab · 个人技术实验场
          </div>

          <h1 className="hero-headline">
            拓宽边界<br />探索<em>新视界</em>
          </h1>

          <p className="hero-sub">
            这里是个人技术实验场，分享编程技巧、阅读笔记与思维模型。
            <br />
            致力于将复杂概念简单化，与你共同成长。
          </p>

          <div className="hero-stats-row">
            <div className="hero-stat reveal">
              <div className="hero-stat-num">50+</div>
              <div className="hero-stat-label">实验记录</div>
            </div>
            <div className="hero-stat reveal">
              <div className="hero-stat-num">98%</div>
              <div className="hero-stat-label">干货密度</div>
            </div>
            <div className="hero-stat reveal">
              <div className="hero-stat-num">每日</div>
              <div className="hero-stat-label">持续更新</div>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/explore" className="btn-primary">
              <span className="mono-tag">def daily_routine()</span>
              &nbsp;开始探索
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/experiments" className="btn-ghost">
              实验记录
            </Link>
          </div>
        </div>

        {/* Right: Code card */}
        <div className="hero-right">
          <div className="code-card">
            <div className="code-header">
              <div className="code-dot code-dot-red" />
              <div className="code-dot code-dot-yellow" />
              <div className="code-dot code-dot-green" />
              <span className="code-title">learning_routine.py</span>
            </div>
            <div className="code-body">
              <pre>
                <span className="py-deco">def</span>{' '}
                <span className="py-fn">daily_routine</span>():
                {'\n'}
                {'  '}focus_time = <span className="py-str">"Deep Work"</span>
                {'\n'}
                {'  '}tools = [<span className="py-str">"Obsidian"</span>,{' '}
                <span className="py-str">"Python"</span>]
                {'\n\n'}
                {'  '}<span className="py-key">while</span> learning:
                {'\n'}
                {'    '}<span className="py-fn">improve_skills</span>()
                {'\n\n'}
                {'  '}<span className="py-key">if</span> stuck:
                {'\n'}
                {'      '}<span className="py-fn">read_documentation</span>()
                {'\n\n'}
                {'  '}<span className="py-deco">return</span> growth
                {'\n\n'}
                <span className="py-cmt"># 保持好奇，保持饥饿</span>
                {'\n'}
                <span className="py-builtin">print</span>(
                <span className="py-str">"Hello World"</span>)<span className="cursor-blink" />
              </pre>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-hint-line" />
          scroll
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-inner">
          <div className="section-header reveal">
            <span className="section-label">// What You'll Find</span>
            <h2 className="section-title">这个实验室做什么</h2>
            <p className="section-desc">记录每一个技术实验与思考，帮你把知识真正用起来</p>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card reveal">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section className="articles">
        <div className="articles-inner">
          <div className="articles-header reveal">
            <div className="section-header">
              <span className="section-label">// Latest Posts</span>
              <h2 className="section-title">最新文章</h2>
              <p className="section-desc">持续输出优质技术内容，记录成长每一步</p>
            </div>
            <Link to="/notes" className="view-all-link">
              查看全部
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="articles-grid">
            {ARTICLES.map((a) => (
              <Link key={a.id} to="/experiments" className="article-card reveal">
                <div className="article-meta">
                  <span className="article-category">
                    <span className="article-category-dot" />
                    {a.category}
                  </span>
                  <span>{a.date}</span>
                </div>
                <h3>{a.title}</h3>
                <p>{a.summary}</p>
                <div className="article-tags">
                  {a.tags.map((tag) => (
                    <span key={tag} className="article-tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const FEATURES = [
  { icon: '🕸', title: '结构化知识', desc: '用系统化的笔记和思维模型，帮你把零散的知识编织成网，形成可复用的知识体系。' },
  { icon: '📡', title: '持续更新', desc: '每周都会分享新的学习心得、项目复盘和效率工具，让你跟我一起保持成长的节奏。' },
  { icon: '⚙', title: '项目实战', desc: '不止理论，更有完整的项目踩坑记录与源码解析，帮你把技术真正用起来。' },
  { icon: '🔕', title: '无广告打扰', desc: '专注内容本身，没有弹窗、没有推送，让你可以安静地阅读和学习。' },
  { icon: '📋', title: '可复制的方法', desc: '分享的学习和工作方法，都可以直接套用在你自己的项目和生活中。' },
  { icon: '🧭', title: '灵活的节奏', desc: '内容不赶进度，不制造焦虑，你可以按自己的节奏慢慢吸收。' },
]

const ARTICLES = [
  {
    id: 1,
    category: '前端开发',
    date: '2026-05-28',
    title: 'Vue3 组合式 API 最佳实践指南',
    summary: '深入解析 Composition API 的核心概念与实战技巧，让你的代码更具可维护性与复用性。',
    tags: ['Vue3', 'Composition API', '前端'],
  },
  {
    id: 2,
    category: '后端架构',
    date: '2026-05-20',
    title: 'Spring Boot 3.x 性能优化实战',
    summary: '从数据库优化、缓存策略到异步处理，全面提升你的 Spring Boot 应用响应速度。',
    tags: ['Spring Boot', '性能优化', 'Java'],
  },
  {
    id: 3,
    category: '数据库',
    date: '2026-05-12',
    title: 'MySQL 索引设计与查询优化',
    summary: '详解 B+Tree 索引原理，分析慢查询原因并给出实战优化方案，让数据库飞起来。',
    tags: ['MySQL', '索引', '数据库'],
  },
]
