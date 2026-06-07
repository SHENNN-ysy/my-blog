# My Blog

基于 Spring Boot + Vue 3 的全栈博客系统，支持文章管理、评论、用户认证，并配备 Prometheus + Loki + Grafana 监控栈。

## 访问地址

| 服务 | 地址 |
|------|------|
| 博客前台 | http://localhost |
| 管理后台 | http://localhost:5173/admin |
| 后端 API | http://localhost:8080 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 |
| Jenkins | http://localhost:8888 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前台 | Vue 3 + Vite + TypeScript |
| 管理后台 | Vue 3 + Backstage |
| 后端 | Spring Boot 3 + MyBatis + MySQL 8 |
| 认证 | JWT |
| 监控 | Prometheus + Loki + Grafana (PLG 栈) |
| CI/CD | Jenkins |
| 容器 | Docker + Docker Compose |
| Webhook | GitHub Webhooks → Jenkins 自动触发部署 |

## 快速部署

### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填入以下关键变量：
#   MYSQL_ROOT_PASSWORD=<你的数据库密码>
#   JWT_SECRET=<至少 32 字符的 JWT 签名密钥>
```

### 2. 启动服务

```bash
# 启动全套服务（前端 + 后端 + 数据库 + 监控）
docker-compose up -d

# 仅启动核心服务（不含监控）
docker-compose up -d --scale grafana=0 --scale prometheus=0 --scale loki=0 --scale promtail=0 --scale node-exporter=0
```

### 3. 初始化数据库

```bash
# 首次启动后等待 MySQL 初始化（约 10 秒）
docker-compose logs -f my-blog-demo
# 看到 "Started BlogAdminApplication" 后即可访问
```

## 自动化部署（CI/CD）

### GitHub Webhook → Jenkins 自动部署流程

```
GitHub Push
    │
    ▼
GitHub Webhook ──POST──► Jenkins (/github-webhook/)
    │
    ▼
Jenkins Pipeline:
    Checkout ──► Build Backend ──► Build Frontend ──► Build Backstage
        │
        ▼
    Docker Build ──► Docker Up ──► Health Check
```

### Jenkins 配置步骤

1. 打开 Jenkins：`http://<你的公网地址>:8888`
2. 创建 Pipeline 项目，粘贴 `Jenkinsfile` 内容
3. 在项目配置中勾选：**GitHub hook trigger for GITScm polling**
4. 在 GitHub 仓库 `Settings → Webhooks` 添加 webhook：
   - Payload URL: `http://<你的公网地址>:8889/github-webhook/`
   - Content type: `application/json`
   - Events: **Push events**
5. 推送代码到 GitHub，Jenkins 会自动触发构建和部署

## 目录结构

```
my_blog/
├── my_blog_demo/           # Spring Boot 后端（多模块 Maven 项目）
│   ├── blog-admin/         # API 服务
│   ├── blog-common/        # 公共组件（AOP、异常、工具类）
│   ├── blog-model/         # 数据模型（Entity、DTO、VO）
│   └── dev-ops/sql/        # 建表 SQL
├── frontend/               # Vue 3 博客前台
├── backstage/              # Vue 3 管理后台 + Dockerfile
├── nginx/                  # Nginx 配置
│   └── nginx.conf
├── monitoring/             # PLG 监控栈配置
│   ├── prometheus/
│   ├── loki/
│   ├── promtail/
│   └── grafana/
├── docker-compose.yml      # 容器编排
├── Jenkinsfile             # Jenkins Pipeline 配置
├── deploy.sh               # 一键部署脚本
└── .env                    # 环境变量（不上传 GitHub）
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/articles | 文章列表 |
| POST | /api/articles | 发布文章（需认证） |
| GET | /api/articles/{id} | 文章详情 |
| POST | /api/comments | 发表评论 |
| GET | /api/categories | 分类列表 |

## 管理后台

访问 `http://localhost:5173/admin`，使用管理员账号登录后可管理文章、评论、分类。

默认管理员（首次启动自动创建）：
- 用户名：`admin`
- 密码：`admin123`

## 监控

访问 `http://localhost:3000`，使用 `admin / admin` 登录 Grafana 查看：

- **Blog - JVM 监控**：堆内存、线程数、GC 频率/耗时
- **Blog - HTTP 请求**：QPS、延迟 P50/P90/P95/P99、状态码分布
- **Blog - 主机监控**：CPU、内存、磁盘使用率
- **Blog - 日志监控**：Loki 实时日志搜索、级别分布

## 开发

### 后端启动

```bash
cd my_blog_demo
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 运行测试

```bash
cd my_blog_demo
mvn test
```
