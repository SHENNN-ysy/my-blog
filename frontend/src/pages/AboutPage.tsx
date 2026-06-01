import { useEffect, useRef, type RefObject } from 'react'
import '@/pages/AboutPage.css'

const PRINCIPLES = [
  { num: '01', title: '保持好奇，保持饥饿', desc: '对未知保持敬畏，对已懂的不止于会用，而是追问"为什么"。' },
  { num: '02', title: '复杂问题简单化', desc: '技术最终要服务于人。把复杂的概念用朴素的语言讲清楚，是真正的能力。' },
  { num: '03', title: '输出是最好的学习', desc: '写出来、教出去，才能真正内化。每一篇笔记都是对知识的再加工。' },
  { num: '04', title: '慢即是快', desc: '不追热点，不赶进度。扎实的基础，才是长期竞争力的来源。' },
]

const TIMELINE = [
  { year: '2022 — 起点', title: '踏入编程世界', desc: '从第一行 "Hello World" 开始，写下第一行代码时的兴奋感至今难忘。选定了方向，开始系统性地构建知识体系。' },
  { year: '2023 — 深入', title: '从前端到后端', desc: '不再满足于表面的页面效果，开始探索计算机系统、网络协议与数据结构，逐渐建立起对软件工程的全栈认知。' },
  { year: '2024 — 沉淀', title: '构建知识网络', desc: '用 Obsidian 将零散的笔记串联成网，开始大量输出技术文章，在写作中深化理解，也在交流中持续成长。' },
  { year: '2025 — 现在', title: '持续实验，不断突破', desc: '深耕核心领域的同时探索新的可能性。保持输出节奏，用代码记录成长的每一步。' },
]

const TECH_STACK = [
  { name: 'Python', level: 5 },
  { name: 'JavaScript', level: 4 },
  { name: 'Go', level: 3 },
  { name: '系统设计', level: 4 },
  { name: 'DevOps', level: 3 },
]

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null)

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
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    )
    el.querySelectorAll('.reveal').forEach((t, i) => {
      ;(t as HTMLElement).style.transitionDelay = `${i * 0.07}s`
      observer.observe(t)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef as RefObject<HTMLElement>}>
      {/* Page header */}
      <div className="page-header">
        <div className="page-eyebrow">
          <span className="eyebrow-pulse" />
          About Me · 关于我
        </div>
        <h1 className="page-title">
          一个热爱<em>技术</em>的<br />持续学习者
        </h1>
        <p className="page-desc">
          在代码的世界里，我是一名永不停歇的探索者。这里记录着我对技术的每一次追问、每一次实验与每一次突破。
        </p>
      </div>

      {/* Main content */}
      <div className="about-main">

        {/* Left */}
        <div className="about-left">

          {/* Principles */}
          <div className="about-section reveal">
            <div className="section-heading">
              <div className="section-heading-line" />
              <h2>核心理念</h2>
            </div>
            <div className="principles-grid">
              {PRINCIPLES.map((p) => (
                <div key={p.num} className="principle-card">
                  <div className="principle-num">{p.num}</div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="about-section reveal">
            <div className="section-heading">
              <div className="section-heading-line" />
              <h2>学习历程</h2>
            </div>
            <div className="timeline">
              {TIMELINE.map((item) => (
                <div key={item.year} className="timeline-item">
                  <div className="timeline-year">{item.year}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What I share */}
          <div className="about-section reveal">
            <div className="section-heading">
              <div className="section-heading-line" />
              <h2>在这里能学到什么</h2>
            </div>
            <div className="about-text">
              <p>这个实验室是我<strong>技术实验的记录本</strong>，也是<strong>学习方法的实验场</strong>。我会在这里分享：</p>
              <p><strong>编程技巧</strong>——来自真实项目的踩坑复盘，不止于文档翻译；<strong>思维模型</strong>——用工程视角拆解复杂问题；<strong>效率工具</strong>——不断迭代个人工作流；<strong>阅读笔记</strong>——技术书籍的精华提炼与批判性思考。</p>
              <p>每一篇内容都经过反复推敲，力求做到<strong>有深度、有逻辑、有价值</strong>。希望这些记录不仅对我有用，也能帮到同在路上的你。</p>
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="about-right">

          {/* Profile card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="profile-avatar-icon">⚗</div>
            </div>
            <div className="profile-info">
              <div className="profile-name">一亩三分学田</div>
              <div className="profile-role">Full-Stack Developer</div>
              <div className="profile-bio">
                热爱技术，沉迷折腾工具链。相信代码是思想的延伸，持续学习者，终身写作者。
              </div>
              <div className="profile-tags">
                {['Python', 'JavaScript', 'Go', '系统设计', '效率工具'].map((tag) => (
                  <span key={tag} className="profile-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tech stack */}
          <div className="tech-stack-card">
            <h3>技术栈</h3>
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className="tech-item">
                <span className="tech-name">{tech.name}</span>
                <div className="tech-level">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`tech-dot${i < tech.level ? ' filled' : ''}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="contact-card">
            <h3>建立连接</h3>
            <div className="contact-links">
              <a href="#" className="contact-link">
                <div className="contact-icon">✉</div>
                <div className="contact-link-text">
                  <div className="contact-link-label">Email</div>
                  <div className="contact-link-value">hello@example.com</div>
                </div>
              </a>
              <a href="#" className="contact-link">
                <div className="contact-icon">◈</div>
                <div className="contact-link-text">
                  <div className="contact-link-label">GitHub</div>
                  <div className="contact-link-value">@username</div>
                </div>
              </a>
              <a href="#" className="contact-link">
                <div className="contact-icon">◉</div>
                <div className="contact-link-text">
                  <div className="contact-link-label">Blog</div>
                  <div className="contact-link-value">lskk.fun</div>
                </div>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
