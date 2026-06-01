import request from './request'

export interface HealthStatus {
  status: 'UP' | 'DOWN' | 'UNKNOWN'
  components?: {
    db?: { status: string; details?: { database: string } }
    redis?: { status: string }
    diskSpace?: { status: string; details?: { total: number; free: number } }
  }
}

export interface MetricSnapshot {
  timestamp: number
  jvm: {
    heapUsed: number
    heapMax: number
    nonHeapUsed: number
    threadsLive: number
    threadsPeak: number
    gcPausePerSec: number
    gcTimePerSec: number
  }
  http: {
    qps: number
    errorRate: number
    p50: number
    p95: number
    p99: number
  }
  host: {
    cpuUsage: number
    memUsage: number
    memTotal: number
    memAvailable: number
  }
}

export const monitorApi = {
  /** 获取后端健康状态 */
  getHealth: () => request.get<HealthStatus>('/actuator/health'),

  /** 获取指标快照 */
  getMetricsSnapshot: () => request.get<MetricSnapshot>('/admin/monitor/snapshot'),

  /** 获取 Grafana iframe URL */
  getGrafanaUrl: (uid: string) => `/grafana/d/${uid}`,
}
