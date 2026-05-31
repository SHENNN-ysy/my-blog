import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '@/pages/ExperimentsPage.css'
import { getTagColor } from '@/utils/tagColor'

interface Project {
  id: number
  title: string
  desc: string
  tags: string[]
  status: 'done' | 'wip' | 'plan'
  statusText: string
  date: string
  icon: string
  category: string
}

const STATIC_PROJECTS: Project[] = [
  {
    id: 1,
    title: '个人学习实验室',
    desc: '一站式技术学习平台，整合笔记、项目、工具流，建立个人知识管理闭环。',
    tags: ['React', 'TypeScript', 'Vite'],
    status: 'done',
    statusText: '已完成',
    date: '2025',
    icon: '🌐',
    category: 'web',
  },
  {
    id: 2,
    title: 'RAG 知识库助手',
    desc: '基于检索增强生成的本地知识库问答系统，支持 PDF/Markdown 文档解析与向量化检索。',
    tags: ['Python', 'LangChain', 'FastAPI'],
    status: 'done',
    statusText: '已完成',
    date: '2025',
    icon: '🤖',
    category: 'ai',
  },
  {
    id: 3,
    title: 'Obsidian 同步管理 CLI',
    desc: '命令行工具，管理 Obsidian vault 多端同步状态，支持冲突检测与自动备份策略。',
    tags: ['Python', 'TUI', 'Rich'],
    status: 'wip',
    statusText: '进行中',
    date: '2025',
    icon: '⚡',
    category: 'tool',
  },
  {
    id: 4,
    title: 'dotfiles 管理器',
    desc: '跨平台 dotfiles 自动化配置工具，一条命令初始化所有开发环境配置到新机器。',
    tags: ['Go', 'CLI', 'Cobra'],
    status: 'done',
    statusText: '已完成',
    date: '2024',
    icon: '🔧',
    category: 'cli',
  },
  {
    id: 5,
    title: '数据可视化仪表盘',
    desc: '实时数据监控面板，支持多数据源接入、自定义图表配置与告警规则设置。',
    tags: ['Vue', 'ECharts', 'Node.js'],
    status: 'done',
    statusText: '已完成',
    date: '2024',
    icon: '📊',
    category: 'web',
  },
  {
    id: 6,
    title: 'AI 编程助手',
    desc: '基于大模型的代码审查与重构建议工具，深度集成 CI/CD 流程，自动生成 PR 评审意见。',
    tags: ['Python', 'Agent', 'MCP'],
    status: 'plan',
    statusText: '规划中',
    date: '2026',
    icon: '🧠',
    category: 'ai',
  },
]

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'web', label: 'Web 开发' },
  { key: 'tool', label: '效率工具' },
  { key: 'ai', label: 'AI 应用' },
  { key: 'cli', label: '命令行' },
  { key: 'other', label: '其他' },
]

export default function ExperimentsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(STATIC_PROJECTS)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const filtered =
      activeFilter === 'all'
        ? STATIC_PROJECTS
        : STATIC_PROJECTS.filter((p) => p.category === activeFilter)
    setVisibleProjects(filtered)
  }, [activeFilter])

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
      { threshold: 0.08 },
    )
    el.querySelectorAll('.reveal').forEach((t, i) => {
      ;(t as HTMLElement).style.transitionDelay = `${i * 0.07}s`
      observer.observe(t)
    })
    return () => observer.disconnect()
  }, [visibleProjects])

  return (
    <div className="page-wrap" ref={sectionRef}>
      <div className="page-head">
        <div className="page-title-group">
          <div className="eyebrow">
            <span className="pulse-dot" />
            Experiments
          </div>
          <h1 className="page-title">
            我的<em>实验记录</em>
          </h1>
        </div>
        <div className="page-count">
          共 <span>{visibleProjects.length}</span> 个项目
        </div>
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {visibleProjects.map((project) => (
          <div key={project.id} className="project-card reveal" data-category={project.category}>
            <div className="project-thumb">
              <div className="card-top-bar" />
              <span className={`card-status ${project.status}`}>{project.statusText}</span>
              <div className="project-thumb-icon">{project.icon}</div>
            </div>
            <div className="card-body">
              <div className="card-tags">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="card-tag"
                    style={{ '--tag-color': getTagColor(tag) } as React.CSSProperties}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="card-title">{project.title}</div>
              <div className="card-desc">{project.desc}</div>
              <div className="card-footer">
                <span className="card-date">{project.date}</span>
                <Link to="/experiments" className="card-link">
                  查看 →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
