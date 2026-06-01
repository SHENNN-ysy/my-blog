# 个人博客 (My Blog)

前后端分离博客项目，前端基于 React + Vite + TypeScript，后端基于 Spring Boot 3 + MyBatis-Plus，支持 Docker 一键部署与 PLG 监控栈。

## 项目结构

```
my_blog/
├── frontend/                   # React 前端（Vite + React + TypeScript）
│   ├── src/
│   │   ├── api/               # Axios 实例 + API 接口封装
│   │   ├── components/         # NavBar、Footer、ProtectedRoute
│   │   ├── pages/              # 页面组件（首页/探索/关于等）
│   │   ├── stores/             # Zustand 状态管理
│   │   ├── hooks/              # 自定义 Hooks
│   │   ├── types/              # TypeScript 类型定义
│   │   └── styles/             # 全局样式
│   └── package.json
├── backstage/                 # React 管理后台（Vite + React + TypeScript）
│   ├── src/
│   │   ├── api/               # 监控 API
│   │   ├── layouts/            # AdminLayout 布局
│   │   ├── views/admin/        # 监控大盘页面
│   │   └── stores/            # Zustand 状态管理
│   └── Dockerfile
├── my_blog_demo/              # Spring Boot 后端（Maven 多模块）
│   ├── pom.xml
│   ├── blog-model/           # Entity / DTO / VO
│   ├── blog-common/          # Result / GlobalExceptionHandler / AOP 切面
│   │   └── aspect/           # DbWriteTraceAspect、RequestTraceAspect
│   └── blog-admin/           # Spring Boot 主模块
│       └── src/main/java/com/my_blog/my_blog_demo/
│           ├── controller/   # REST 接口层
│           ├── service/      # Service 接口层 + 实现层
│           └── mapper/       # MyBatis-Plus Mapper 层
├── monitoring/               # PLG 监控栈配置（Prometheus + Loki + Grafana）
│   ├── prometheus/
│   ├── loki/
│   ├── promtail/
│   └── grafana/              # 数据源 + 仪表盘自动配置
├── nginx/                    # Nginx 反向代理配置
├── dev-ops/                  # 数据库建表脚本
├── docker-compose.yml        # 全套容器编排
└── deploy.sh                # 一键部署管理脚本
```

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端框架 | React 18 + TypeScript + Vite |
| 路由 | React Router v6 |
| 状态管理 | Zustand |
| HTTP 客户端 | Axios（带拦截器） |
| 管理后台 | React + Vite（独立部署） |
| 后端 | Spring Boot 3 + Maven 多模块 |
| ORM | MyBatis-Plus 4.0 |
| 数据库 | MySQL 8 |
| 认证 | JWT（jjwt 0.12） |
| 日志 | Lombok + Hutool |
| 容器化 | Docker + Docker Compose |
| 监控 | Prometheus + Loki + Grafana + node-exporter |

## 快速启动

### Docker 一键部署（推荐）

```bash
./deploy.sh dev      # 启动核心服务（MySQL + Redis + 后端 API）
./deploy.sh prod     # 启动全套服务（核心 + Nginx 前台 + 管理后台）
./deploy.sh monitor  # 启动监控栈（Prometheus + Loki + Grafana + node-exporter）
./deploy.sh logs     # 查看所有容器日志
./deploy.sh stop     # 停止所有服务
./deploy.sh restart  # 重启所有服务
./deploy.sh status   # 查看容器运行状态
```

### 前端（开发模式）

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run build        # 生产构建
```

### 管理后台（开发模式）

```bash
cd backstage
npm install
npm run dev          # http://localhost:5174
```

### 后端（本地开发）

```bash
cd my_blog_demo
./mvnw clean install -DskipTests
cd blog-admin
./mvnw spring-boot:run
# 或直接运行 jar 包
java -jar blog-admin/target/blog-admin-0.0.1-SNAPSHOT.jar
```

后端地址：`http://localhost:8080`

### 初始化数据库

```bash
mysql -u root -p < my_blog_demo/dev-ops/sql/create_table.sql
```

## 访问地址

| 服务 | 地址 | 备注 |
|---|---|---|
| 博客前台 | http://localhost | |
| 管理后台 | http://localhost:5173 | |
| 后端 API | http://localhost:8080 | |
| 健康检查 | http://localhost:8080/actuator/health | |
| Prometheus | http://localhost:9090 | |
| Grafana | http://localhost:3000/grafana | admin / admin |
| Loki | http://localhost:3100 | |
| node-exporter | http://localhost:9100 | |

## 架构概览

```
Internet
   │
   ▼
Nginx (:80)
   ├── /           → 博客前台静态资源
   ├── /admin/     → 管理后台
   ├── /api/**     → 后端 API (:8080)
   ├── /grafana/   → Grafana (:3000)
   └── /prometheus/ → Prometheus (:9090)

┌──────────────────────────────────────────────┐
│           PLG 监控栈                          │
│  Grafana (:3000)                             │
│       ├── Prometheus (:9090) → JVM/HTTP 指标  │
│       │                 → node-exporter (:9100)│
│       └── Loki (:3100) ← Promtail ← 应用日志  │
└──────────────────────────────────────────────┘
```

## API 列表

| 接口 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 登录 | POST | `/api/auth/login` | 返回 JWT Token |
| 注册 | POST | `/api/auth/register` | 创建用户账号 |
| 当前用户 | GET | `/api/auth/current` | 需登录 |
| 文章列表 | GET | `/api/articles` | 支持 category/tag 筛选 + 分页 |
| 文章详情 | GET | `/api/articles/:id` | 浏览量 +1 |
| 分类列表 | GET | `/api/categories` | 公开 |
| 标签列表 | GET | `/api/tags` | 公开 |
| 评论列表 | GET | `/api/comments/article/:id` | 公开 |
| 提交评论 | POST | `/api/comments` | 需登录 |

## 后端分层说明

采用标准三层架构 + 接口-实现分离模式：

- **Controller** — 接收 HTTP 请求，参数校验，调用 Service 层
- **Service 接口层** — `service/XxxService.java`，定义业务方法抽象契约
- **Service 实现层** — `service/impl/XxxServiceImpl.java`，承载全部业务逻辑
- **Mapper 层** — MyBatis-Plus Mapper，操作数据库

## 监控仪表盘

| 仪表盘 | 说明 |
|---|---|
| Blog - JVM 监控 | 堆内存、线程数、GC 频率/耗时 |
| Blog - HTTP 请求 | QPS、延迟 P50/P90/P95/P99、状态码分布 |
| Blog - 主机监控 | CPU、内存、磁盘使用率 |
| Blog - 日志监控 | Loki 实时日志搜索、级别分布 |

## 开发说明

- 前端通过 Vite 代理 `/api` 请求到后端 `localhost:8080`，无需配置 CORS
- JWT Token 有效期 24 小时，存于 `localStorage`
- 敏感配置（数据库密码、JWT 密钥）存于 `application-local.yml`，已加入 `.gitignore`
- `blog-model` 无外部依赖，可独立编译
- `blog-common` 依赖 `blog-model`，被 `blog-admin` 依赖
