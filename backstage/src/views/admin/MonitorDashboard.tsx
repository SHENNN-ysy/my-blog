import { useState, useEffect, useRef } from 'react'
import * as echarts from 'echarts'

type ResizeHandler = () => void

interface HealthData {
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  components?: {
    db?: { status: string; details?: { database: string } }
    diskSpace?: { status: string; details?: { total: number; free: number } }
  }
}

interface MetricPoint {
  time: string
  qps: number
  errorRate: number
  avgLatency: number
  heapUsed: number
  heapMax: number
}

function fmtBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024
    i++
  }
  return `${bytes.toFixed(1)} ${units[i]}`
}

function fmtMs(seconds: number): string {
  if (seconds < 1) return `${(seconds * 1000).toFixed(1)} ms`
  return `${seconds.toFixed(2)} s`
}

function getHealthColor(status: string): string {
  switch (status) {
    case 'UP': return '#238636'
    case 'DOWN': return '#f85149'
    default: return '#d29922'
  }
}

export default function MonitorDashboard() {
  const [health, setHealth] = useState<HealthData | null>(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // ECharts refs
  const qpsChartRef = useRef<HTMLDivElement>(null)
  const latencyChartRef = useRef<HTMLDivElement>(null)
  const heapChartRef = useRef<HTMLDivElement>(null)
  const chartsRef = useRef<{ qps?: echarts.ECharts; latency?: echarts.ECharts; heap?: echarts.ECharts }>({})

  // 数据历史（保留最近 60 个点，约 10 分钟）
  const MAX_POINTS = 60
  const [dataHistory, setDataHistory] = useState<MetricPoint[]>([])

  // 轮询 fetch
  const fetchMetrics = async () => {
    try {
      // 模拟指标数据（实际项目中从 /actuator/prometheus 或 /admin/monitor/snapshot 获取）
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      const newPoint: MetricPoint = {
        time: timeStr,
        qps: parseFloat((Math.random() * 5 + 0.5).toFixed(3)),
        errorRate: parseFloat((Math.random() * 0.02).toFixed(4)),
        avgLatency: parseFloat((Math.random() * 0.3 + 0.02).toFixed(3)),
        heapUsed: Math.floor(Math.random() * 200 * 1024 * 1024 + 100 * 1024 * 1024),
        heapMax: 512 * 1024 * 1024,
      }
      setDataHistory((prev) => {
        const next = [...prev, newPoint]
        return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next
      })
      setLastUpdate(now)

      // 尝试获取健康状态
      try {
        const res = await fetch('/api/actuator/health')
        if (res.ok) {
          const data = await res.json()
          setHealth(data)
        }
      } catch {
        // 后端未启动时静默忽略
      }
    } finally {
      setHealthLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 10000)
    return () => clearInterval(interval)
  }, [])

  // 初始化 ECharts
  useEffect(() => {
    const resizeHandler: ResizeHandler = () => {
      Object.values(chartsRef.current).forEach((chart) => chart?.resize())
    }

    const initChart = (el: HTMLDivElement | null, key: keyof typeof chartsRef.current) => {
      if (!el) return
      const chart = echarts.init(el)
      chartsRef.current[key] = chart
      window.addEventListener('resize', resizeHandler)
    }

    initChart(qpsChartRef.current, 'qps')
    initChart(latencyChartRef.current, 'latency')
    initChart(heapChartRef.current, 'heap')

    return () => {
      window.removeEventListener('resize', resizeHandler)
      Object.values(chartsRef.current).forEach((chart) => chart?.dispose())
    }
  }, [])

  // 更新图表
  useEffect(() => {
    if (dataHistory.length === 0) return
    const times = dataHistory.map((d) => d.time)
    const qpsData = dataHistory.map((d) => d.qps)
    const errorData = dataHistory.map((d) => d.errorRate * 100)
    const latencyData = dataHistory.map((d) => d.avgLatency * 1000)
    const heapUsedData = dataHistory.map((d) => d.heapUsed)
    const heapMaxData = dataHistory.map((d) => d.heapMax)

    // QPS + 错误率
    chartsRef.current.qps?.setOption({
      backgroundColor: 'transparent',
      grid: { top: 40, right: 60, bottom: 40, left: 60, containLabel: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#161b22',
        borderColor: '#30363d',
        textStyle: { color: '#e6edf3', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { seriesName: string; value: number; color: string }[]
          return p.map((s) => `${s.seriesName}: <b style="color:${s.color}">${s.value.toFixed(3)}</b>`).join('<br>')
        },
      },
      legend: { top: 5, textStyle: { color: '#8b949e', fontSize: 12 }, itemWidth: 14, itemHeight: 8 },
      xAxis: {
        type: 'category', data: times,
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { color: '#8b949e', fontSize: 10, interval: Math.floor(times.length / 6) },
        splitLine: { show: false },
      },
      yAxis: [
        {
          type: 'value', name: 'QPS',
          axisLine: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11 },
          splitLine: { lineStyle: { color: '#21262d' } },
        },
        {
          type: 'value', name: '错误率(%)', max: 5,
          axisLine: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11 },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'QPS', type: 'line', smooth: true,
          data: qpsData,
          lineStyle: { color: '#238636', width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(35,134,54,0.3)' },
            { offset: 1, color: 'rgba(35,134,54,0)' },
          ]) },
          symbol: 'none',
        },
        {
          name: '错误率', type: 'line', yAxisIndex: 1, smooth: true,
          data: errorData,
          lineStyle: { color: '#f85149', width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(248,81,73,0.2)' },
            { offset: 1, color: 'rgba(248,81,73,0)' },
          ]) },
          symbol: 'none',
        },
      ],
    })

    // 延迟
    chartsRef.current.latency?.setOption({
      backgroundColor: 'transparent',
      grid: { top: 40, right: 60, bottom: 40, left: 60, containLabel: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#161b22', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { seriesName: string; value: number; color: string }[]
          return p.map((s) => `${s.seriesName}: <b style="color:${s.color}">${s.value.toFixed(1)} ms</b>`).join('<br>')
        },
      },
      legend: { top: 5, textStyle: { color: '#8b949e', fontSize: 12 }, itemWidth: 14, itemHeight: 8 },
      xAxis: {
        type: 'category', data: times,
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { color: '#8b949e', fontSize: 10, interval: Math.floor(times.length / 6) },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value', name: 'ms',
        axisLine: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11 },
        splitLine: { lineStyle: { color: '#21262d' } },
      },
      series: [{
        name: '平均延迟', type: 'line', smooth: true,
        data: latencyData,
        lineStyle: { color: '#1f6feb', width: 2 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(31,111,235,0.25)' },
          { offset: 1, color: 'rgba(31,111,235,0)' },
        ]) },
        symbol: 'none',
      }],
    })

    // 堆内存
    chartsRef.current.heap?.setOption({
      backgroundColor: 'transparent',
      grid: { top: 40, right: 80, bottom: 40, left: 60, containLabel: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#161b22', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 },
        formatter: (params: unknown) => {
          const p = params as { seriesName: string; value: number; color: string }[]
          return p.map((s) => `${s.seriesName}: <b style="color:${s.color}">${fmtBytes(s.value)}</b>`).join('<br>')
        },
      },
      legend: { top: 5, textStyle: { color: '#8b949e', fontSize: 12 }, itemWidth: 14, itemHeight: 8 },
      xAxis: {
        type: 'category', data: times,
        axisLine: { lineStyle: { color: '#30363d' } },
        axisLabel: { color: '#8b949e', fontSize: 10, interval: Math.floor(times.length / 6) },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value', name: '',
        axisLine: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11, formatter: (v: number) => fmtBytes(v) },
        splitLine: { lineStyle: { color: '#21262d' } },
      },
      series: [
        {
          name: '堆内存已用', type: 'line', smooth: true,
          data: heapUsedData,
          lineStyle: { color: '#d29922', width: 2 },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(210,153,34,0.3)' },
            { offset: 1, color: 'rgba(210,153,34,0)' },
          ]) },
          symbol: 'none',
        },
        {
          name: '堆内存最大', type: 'line', smooth: false,
          data: heapMaxData,
          lineStyle: { color: '#484f58', width: 1.5, type: 'dashed' },
          symbol: 'none',
        },
      ],
    })
  }, [dataHistory])

  const latest = dataHistory[dataHistory.length - 1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 页面标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#e6edf3' }}>系统监控</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8b949e' }}>
            实时指标 · 每 10 秒自动刷新
            <span style={{ marginLeft: 12, color: '#484f58' }}>
              最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
            </span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href="/grafana/d/blog-jvm"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '7px 14px',
              background: 'transparent',
              border: '1px solid #30363d',
              borderRadius: 6,
              color: '#8b949e',
              textDecoration: 'none',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Grafana
          </a>
        </div>
      </div>

      {/* 健康状态卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {/* 服务健康 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>服务健康</div>
          {healthLoading ? (
            <div style={{ color: '#484f58', fontSize: 13 }}>检测中...</div>
          ) : health ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: getHealthColor(health.status),
                boxShadow: `0 0 6px ${getHealthColor(health.status)}`,
              }} />
              <span style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>
                {health.status === 'UP' ? '运行正常' : health.status === 'DOWN' ? '服务异常' : '未知'}
              </span>
            </div>
          ) : (
            <div style={{ color: '#484f58', fontSize: 13 }}>后端未启动</div>
          )}
        </div>

        {/* 当前 QPS */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>当前 QPS</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#238636', fontFamily: 'monospace' }}>
            {latest ? latest.qps.toFixed(3) : '--'}
          </div>
        </div>

        {/* 错误率 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>错误率</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f85149', fontFamily: 'monospace' }}>
            {latest ? `${(latest.errorRate * 100).toFixed(2)}%` : '--'}
          </div>
        </div>

        {/* 平均延迟 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>平均延迟</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1f6feb', fontFamily: 'monospace' }}>
            {latest ? fmtMs(latest.avgLatency) : '--'}
          </div>
        </div>

        {/* 堆内存 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>JVM 堆内存</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#d29922', fontFamily: 'monospace' }}>
            {latest ? `${fmtBytes(latest.heapUsed)} / ${fmtBytes(latest.heapMax)}` : '--'}
          </div>
          {latest && (
            <div style={{ marginTop: 6, height: 4, background: '#21262d', borderRadius: 2 }}>
              <div style={{
                height: '100%',
                width: `${(latest.heapUsed / latest.heapMax * 100).toFixed(1)}%`,
                background: latest.heapUsed / latest.heapMax > 0.85 ? '#f85149' : latest.heapUsed / latest.heapMax > 0.7 ? '#d29922' : '#238636',
                borderRadius: 2,
                transition: 'width 0.5s ease',
              }} />
            </div>
          )}
        </div>
      </div>

      {/* 图表区域 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 16 }}>
        {/* QPS + 错误率 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>
            API QPS & 错误率
          </div>
          <div ref={qpsChartRef} style={{ width: '100%', height: 220 }} />
        </div>

        {/* 响应延迟 */}
        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>
            平均响应延迟
          </div>
          <div ref={latencyChartRef} style={{ width: '100%', height: 220 }} />
        </div>
      </div>

      {/* JVM 堆内存 */}
      <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', marginBottom: 12 }}>
          JVM 堆内存使用
        </div>
        <div ref={heapChartRef} style={{ width: '100%', height: 220 }} />
      </div>

      {/* Grafana 快捷入口 */}
      <div style={{
        background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: 20,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12,
      }}>
        {[
          { uid: 'blog-jvm', label: 'JVM 监控', desc: '堆内存、线程数、GC', color: '#d29922' },
          { uid: 'blog-http', label: 'HTTP 请求', desc: 'QPS、延迟 P99、状态码', color: '#1f6feb' },
          { uid: 'blog-host', label: '主机监控', desc: 'CPU、内存、磁盘', color: '#238636' },
          { uid: 'blog-logs', label: '日志监控', desc: '实时日志、Loki 搜索', color: '#8b949e' },
        ].map((item) => (
          <a
            key={item.uid}
            href={`/grafana/d/${item.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: 8,
              padding: '14px 16px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = item.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#30363d')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 12, color: '#8b949e' }}>{item.desc}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
