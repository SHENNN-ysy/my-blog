# 博客监控系统

基于 PLG（Prometheus + Loki + Grafana）栈的博客监控系统。

## 快速开始

### 1. 启动监控栈

```bash
# 仅启动监控服务
./deploy.sh monitor

# 启动全套服务
./deploy.sh prod
```

### 2. 访问地址

| 服务 | 地址 | 默认账号 |
|------|------|---------|
| 博客前台 | http://localhost | - |
| 后端 API | http://localhost:8080 | - |
| Actuator 健康检查 | http://localhost:8080/actuator/health | - |
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3000/grafana | admin / admin |
| Loki | http://localhost:3100 | - |
| node-exporter | http://localhost:9100 | - |

### 3. 管理脚本

```bash
./deploy.sh dev      # 启动核心服务
./deploy.sh prod     # 启动全套服务
./deploy.sh monitor  # 启动监控栈
./deploy.sh logs     # 查看日志
./deploy.sh status   # 查看容器状态
./deploy.sh stop     # 停止所有服务
./deploy.sh restart  # 重启所有服务
```

## 架构

```
Internet
   │
   ▼
Nginx (:80, :443)
   ├── /          → blog-frontend   (Vue SPA)
   ├── /admin/   → blog-backstage  (Vue SPA)
   ├── /api/**   → blog-api        (Spring Boot, :8080)
   ├── /grafana/ → blog-grafana    (:3000)
   └── /prometheus/ → blog-prometheus (:9090)

                    ┌─────────────────────────┐
                    │  Grafana (:3000)       │
                    │  统一大盘：指标 + 日志   │
                    └──┬────────────┬─────────┘
                       │ 查指标     │ 查日志
              ┌────────▼─────┐  ┌──▼──────────────┐
              │ Prometheus   │  │ Loki (:3100)     │
              │ (:9090)      │  │ 日志存储 + 索引   │
              │ 时序指标 DB   │  └──▲───────────────┘
              └──┬──────┬────┘     │  推送
                 │      │       ┌──┴───────────────┐
      ┌──────────┘      └───────┤ Promtail         │
      │ /actuator       │ :9100 │ 采集 Docker 日志  │
      │ /prometheus     │       └──────────────────┘
┌─────▼──────┐  ┌───────▼──────┐
│ blog-api   │  │node_exporter │
│ JVM 指标   │  │宿主机 CPU/MEM│
└────────────┘  └──────────────┘
```

## 目录结构

```
my_blog/
├── monitoring/                   # PLG 监控栈配置
│   ├── prometheus/prometheus.yml
│   ├── loki/loki-config.yml
│   ├── promtail/promtail-config.yml
│   ├── grafana/
│   │   ├── datasources/         # 数据源自动配置
│   │   └── dashboards/          # 预置仪表盘 (JVM/HTTP/主机/日志)
│   └── grafana.ini
├── backstage/                   # Vue 3 管理后台
│   ├── src/
│   │   ├── api/monitor.ts       # 监控 API
│   │   ├── views/admin/MonitorDashboard.tsx
│   │   └── layouts/AdminLayout.tsx
│   └── Dockerfile
├── nginx/nginx.conf              # Nginx 反向代理（含 /grafana 代理）
├── docker-compose.yml            # 全套容器编排
└── deploy.sh                    # 部署管理脚本
```

## 仪表盘说明

| 仪表盘 | UID | 说明 |
|--------|-----|------|
| Blog - JVM 监控 | `blog-jvm` | 堆内存、线程数、GC 频率/耗时 |
| Blog - HTTP 请求 | `blog-http` | QPS、延迟 P50/P90/P95/P99、状态码分布 |
| Blog - 主机监控 | `blog-host` | CPU、内存、磁盘使用率 |
| Blog - 日志监控 | `blog-logs` | Loki 实时日志搜索、级别分布 |

## 后端接入

只需在 `blog-admin/pom.xml` 中添加 2 个依赖，即可在 `/actuator/prometheus` 获取所有 JVM 和 HTTP 指标：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

`application.yml` 中的配置会自动生效，暴露以下端点：
- `/actuator/health` — 健康检查
- `/actuator/prometheus` — Prometheus 格式指标
- `/actuator/metrics` — 所有指标列表
