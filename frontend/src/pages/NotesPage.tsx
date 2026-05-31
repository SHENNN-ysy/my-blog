import { useEffect, useRef } from 'react'
import '@/pages/NotesPage.css'
import { getTagColor } from '@/utils/tagColor'

const SIDEBAR_CATS = [
  { label: '全部', count: 50, active: true },
  { label: '前端', count: 18 },
  { label: '后端', count: 15 },
  { label: '系统设计', count: 8 },
  { label: '效率工具', count: 5 },
  { label: '思维模型', count: 4 },
]

const SIDEBAR_TAGS = [
  { label: 'Python', count: 22 },
  { label: 'JavaScript', count: 16 },
  { label: 'Go', count: 9 },
  { label: '系统设计', count: 8 },
  { label: 'DevOps', count: 6 },
]

const ARTICLES = [
  {
    id: 1,
    title: '从零构建 RAG 系统：架构设计与踩坑实录',
    excerpt: '完整记录基于 LangChain + FastAPI 构建检索增强生成系统的全过程，涵盖向量数据库选型、Embedding 策略、分块优化与幻觉问题的工程解法。',
    date: '2025-05-12',
    category: 'AI 应用',
    tags: ['Python', 'LangChain', 'RAG', 'FastAPI'],
    featured: true,
  },
  {
    id: 2,
    title: 'CSS Grid 布局深度指南：从入门到精通',
    excerpt: 'Grid 是现代 CSS 布局的核心能力。本文从基础概念讲起，涵盖 grid-template、fr 单位、minmax、auto-fill/auto-fit 等关键特性，以及与 Flexbox 的协同策略。',
    date: '2025-05-12',
    category: '前端',
    tags: ['CSS', 'Layout', '前端'],
  },
  {
    id: 3,
    title: 'Go 并发模式：goroutine、channel 与 context 取消',
    excerpt: '深入解析 Go 并发三件套的使用范式与常见陷阱，涵盖 select 多路复用、context 超时控制、以及 channel 关闭的最佳实践。',
    date: '2025-04-28',
    category: '后端',
    tags: ['Go', 'Concurrency', '后端'],
  },
  {
    id: 4,
    title: '分布式系统一致性：CAP 定理与工程权衡',
    excerpt: '从理论到实践，拆解 CAP 定理的三元悖论，结合 Redis、Kafka、MySQL 等组件分析不同场景下的一致性方案选型。',
    date: '2025-04-15',
    category: '系统设计',
    tags: ['系统设计', '分布式', '数据库'],
  },
  {
    id: 5,
    title: 'Obsidian + GPT 打造第二大脑：我的知识管理流',
    excerpt: '分享我如何用 Obsidian 构建 PKM 系统，将 AI 融入笔记工作流，实现知识捕获→整理→检索→输出的完整闭环。',
    date: '2025-03-30',
    category: '效率工具',
    tags: ['Obsidian', 'PKM', 'AI'],
  },
  {
    id: 6,
    title: 'TypeScript 高级类型体操：条件类型与模板字面量',
    excerpt: '通过实际案例讲解 TypeScript 条件类型 infer、分布式条件类型，以及模板字面量类型的字符串操作能力，写出更精准的类型推导。',
    date: '2025-03-10',
    category: '前端',
    tags: ['TypeScript', '类型系统'],
  },
  {
    id: 7,
    title: 'FastAPI 性能调优：从 100 QPS 到 2000 QPS',
    excerpt: '记录一次 FastAPI 接口性能优化的完整过程，涵盖异步 ORM 选择、连接池调优、数据库索引优化与缓存层引入的实战经验。',
    date: '2025-02-20',
    category: '后端',
    tags: ['Python', 'FastAPI', '性能'],
  },
]

export default function NotesPage() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
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
      { threshold: 0.06 },
    )
    el.querySelectorAll('.reveal').forEach((t, i) => {
      ;(t as HTMLElement).style.transitionDelay = `${i * 0.07}s`
      observer.observe(t)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page-wrap" ref={sectionRef}>
      <div className="page-head">
        <div className="eyebrow">
          <span className="pulse-dot" />
          Notes &amp; Articles
        </div>
        <h1 className="page-title">
          我的<em>技术笔记</em>
        </h1>
      </div>

      <div className="notes-stats">
        <div className="stat-item">
          <span className="stat-num">50+</span>
          <span className="stat-label">篇原创文章</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">98%</span>
          <span className="stat-label">干货密度</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-num">每周</span>
          <span className="stat-label">持续更新</span>
        </div>
      </div>

      <div className="notes-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">分类</div>
            <ul className="sidebar-list">
              {SIDEBAR_CATS.map((cat) => (
                <li key={cat.label}>
                  <a href="#" className={cat.active ? 'active' : ''}>
                    {cat.label}
                    <span className="sidebar-count">{cat.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">标签</div>
            <ul className="sidebar-list">
              {SIDEBAR_TAGS.map((tag) => (
                <li key={tag.label}>
                  <a href="#">
                    {tag.label}
                    <span className="sidebar-count">{tag.count}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Articles */}
        <div className="article-list">
          {/* Featured */}
          <a href="#" className="featured-card reveal">
            <div className="featured-inner">
              <div className="featured-content">
                <div className="featured-label">
                  <span className="featured-pulse" />
                  置顶推荐
                </div>
                <div className="featured-title">{ARTICLES[0].title}</div>
                <div className="featured-excerpt">{ARTICLES[0].excerpt}</div>
                <div className="article-tags" style={{ gap: 5, flexWrap: 'wrap' }}>
                  {ARTICLES[0].tags.map((tag) => (
                    <span
                      key={tag}
                      className="article-tag"
                      style={{ '--tag-color': getTagColor(tag) } as React.CSSProperties}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="featured-thumb">
                <div className="featured-thumb-icon">🤖</div>
              </div>
            </div>
          </a>

          {ARTICLES.slice(1).map((article) => (
            <a key={article.id} href="#" className="article-card reveal">
              <div className="article-meta">
                <span className="article-date">{article.date}</span>
                <span className="article-category">{article.category}</span>
              </div>
              <div className="article-title">{article.title}</div>
              <div className="article-excerpt">{article.excerpt}</div>
              <div className="article-footer">
                <div className="article-tags">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="article-tag"
                      style={{ '--tag-color': getTagColor(tag) } as React.CSSProperties}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="article-arrow">→</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
