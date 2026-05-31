# 个人学习实验室 (My Learning Lab)

前后端分离的博客项目，前端基于 React + Vite + TypeScript，后端基于 Spring Boot 3 + MyBatis-Plus。

## 项目结构

```
my_blog/
├── frontend/                   # React 前端 (Vite + React + TypeScript)
│   ├── src/
│   │   ├── api/              # Axios 实例 + API 接口封装
│   │   ├── components/       # NavBar, Footer
│   │   ├── pages/            # 5 个页面组件
│   │   ├── stores/           # Zustand 状态管理
│   │   ├── hooks/            # 自定义 Hooks
│   │   ├── types/            # TypeScript 类型定义
│   │   └── styles/           # 全局样式
│   └── package.json
├── my_blog_demo/              # Spring Boot 后端 (Maven 父项目)
│   ├── pom.xml                # 父 POM
│   ├── blog-model/           # Entity / DTO / VO
│   ├── blog-common/          # Result / ErrorCode / BizException / JwtUtil
│   └── blog-admin/           # Spring Boot 主模块
│       └── src/main/java/com/my_blog/my_blog_demo/
│           ├── controller/   # REST 接口层
│           ├── service/      # Service 接口层
│           │   └── impl/     # Service 实现层（接口-实现分离）
│           └── mapper/       # MyBatis-Plus Mapper 层
├── dev-ops/sql/               # 数据库建表脚本
│   └── create_table.sql
└── doc/                       # (可选) 项目文档
```

## 快速启动

### 前端

```bash
cd frontend
npm install
npm run dev          # 开发模式: http://localhost:5173
npm run build        # 生产构建
```

### 后端

1. **初始化数据库**

```bash
mysql -u root -p < dev-ops/sql/create_table.sql
```

2. **配置数据库连接**

敏感配置已分离到 `application-local.yml`（不提交版本库）。首次克隆项目后：

```bash
# 复制配置模板
cp blog-admin/src/main/resources/application-local.yml.example \
   blog-admin/src/main/resources/application-local.yml

# 编辑 application-local.yml，填入实际值：
#   spring.datasource.username / password
#   jwt.secret / jwt.expiration
```

3. **编译并运行**

```bash
cd my_blog_demo
./mvnw clean install -DskipTests
cd blog-admin
./mvnw spring-boot:run
# 或直接运行 jar 包
java -jar blog-admin/target/blog-admin-0.0.1-SNAPSHOT.jar
```

后端地址: http://localhost:8080

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| 路由 | React Router v6 |
| 状态管理 | Zustand |
| HTTP 客户端 | Axios (带拦截器) |
| CSS 方案 | CSS Modules + CSS 变量 |
| 后端 | Spring Boot 3 + Maven 多模块 |
| ORM | MyBatis-Plus 4.0 |
| 数据库 | MySQL 8 |
| 认证 | JWT (jjwt 0.12) |
| 工具库 | Lombok + Hutool |

## 后端分层说明

采用标准三层架构 + 接口-实现分离模式：

- **Controller** — 接收 HTTP 请求，参数校验，调用 Service 层
- **Service 接口层** — `service/XxxService.java`，定义业务方法抽象契约
- **Service 实现层** — `service/impl/XxxServiceImpl.java`，承载全部业务逻辑
- **Mapper 层** — MyBatis-Plus Mapper，操作数据库

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

## 开发说明

- 前端通过 Vite 代理 `/api` 请求到后端 `localhost:8080`，无需配置 CORS
- JWT Token 有效期 24 小时，存于 `localStorage`
- 敏感配置（数据库密码、JWT 密钥）存于 `application-local.yml`，已加入 `.gitignore`
- `application-local.yml.example` 提供配置模板，可参考
- `blog-model` 无外部依赖，可独立编译
- `blog-common` 依赖 `blog-model`，被 `blog-admin` 依赖
