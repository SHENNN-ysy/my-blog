-- ================================================
-- 个人博客系统 建表脚本
-- ================================================

-- ----------------------------
-- 1. 用户表
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id`            BIGINT          NOT NULL    AUTO_INCREMENT  COMMENT '主键ID',
    `username`      VARCHAR(50)     NOT NULL                    COMMENT '用户名',
    `password`      VARCHAR(255)    NOT NULL                    COMMENT '密码（加密）',
    `nickname`      VARCHAR(50)     DEFAULT NULL                COMMENT '昵称',
    `avatar`        VARCHAR(500)    DEFAULT NULL                COMMENT '头像URL',
    `email`         VARCHAR(100)    DEFAULT NULL                COMMENT '邮箱',
    `bio`           VARCHAR(255)    DEFAULT NULL                COMMENT '个人简介',
    `status`        TINYINT         NOT NULL    DEFAULT 1       COMMENT '状态：0禁用 1正常',
    `role`          VARCHAR(20)     NOT NULL    DEFAULT 'user'  COMMENT '角色：user / admin',
    `created_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci  COMMENT='用户表';

-- ----------------------------
-- 2. 分类表
-- ----------------------------
DROP TABLE IF EXISTS `blog_category`;
CREATE TABLE `blog_category` (
    `id`            BIGINT          NOT NULL    AUTO_INCREMENT  COMMENT '主键ID',
    `name`          VARCHAR(50)     NOT NULL                    COMMENT '分类名称',
    `slug`          VARCHAR(50)     NOT NULL                    COMMENT '分类别名（URL友好）',
    `description`    VARCHAR(255)    DEFAULT NULL                COMMENT '分类描述',
    `sort`          INT             NOT NULL    DEFAULT 0        COMMENT '排序（越小越靠前）',
    `status`        TINYINT         NOT NULL    DEFAULT 1       COMMENT '状态：0隐藏 1显示',
    `created_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci  COMMENT='分类表';

INSERT INTO `blog_category` (`name`, `slug`, `description`, `sort`) VALUES
('实验记录', 'experiments', '技术实验和项目实战记录', 1),
('技术笔记', 'notes', '知识点梳理与踩坑总结', 2),
('关于', 'about', '关于本站', 3);

-- ----------------------------
-- 3. 文章表
-- ----------------------------
DROP TABLE IF EXISTS `blog_article`;
CREATE TABLE `blog_article` (
    `id`            BIGINT          NOT NULL    AUTO_INCREMENT  COMMENT '主键ID',
    `title`         VARCHAR(200)    NOT NULL                    COMMENT '文章标题',
    `slug`          VARCHAR(200)    DEFAULT NULL                COMMENT '文章别名（URL友好）',
    `content`       LONGTEXT        DEFAULT NULL                COMMENT '文章内容（Markdown）',
    `summary`       VARCHAR(500)    DEFAULT NULL                COMMENT '文章摘要',
    `cover`         VARCHAR(500)    DEFAULT NULL                COMMENT '封面图URL',
    `category_id`   BIGINT          DEFAULT NULL                COMMENT '所属分类ID',
    `author_id`     BIGINT          NOT NULL                    COMMENT '作者ID',
    `view_count`    INT             NOT NULL    DEFAULT 0       COMMENT '浏览量',
    `like_count`    INT             NOT NULL    DEFAULT 0       COMMENT '点赞数',
    `comment_count` INT             NOT NULL    DEFAULT 0       COMMENT '评论数',
    `is_featured`   TINYINT         NOT NULL    DEFAULT 0       COMMENT '是否置顶：0否 1是',
    `status`        TINYINT         NOT NULL    DEFAULT 1       COMMENT '状态：0草稿 1已发布 2回收站',
    `published_at`  DATETIME        DEFAULT NULL                COMMENT '发布时间',
    `created_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_category` (`category_id`),
    KEY `idx_author` (`author_id`),
    KEY `idx_status` (`status`),
    KEY `idx_published_at` (`published_at`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci  COMMENT='文章表';

-- ----------------------------
-- 4. 评论表
-- ----------------------------
DROP TABLE IF EXISTS `blog_comment`;
CREATE TABLE `blog_comment` (
    `id`            BIGINT          NOT NULL    AUTO_INCREMENT  COMMENT '主键ID',
    `article_id`    BIGINT          NOT NULL                    COMMENT '文章ID',
    `user_id`       BIGINT          DEFAULT NULL                COMMENT '评论用户ID（游客为NULL）',
    `nickname`      VARCHAR(50)     DEFAULT NULL                COMMENT '游客昵称',
    `email`         VARCHAR(100)    DEFAULT NULL                COMMENT '游客邮箱',
    `content`       VARCHAR(1000)   NOT NULL                    COMMENT '评论内容',
    `parent_id`     BIGINT          DEFAULT NULL                COMMENT '父评论ID（NULL为一级评论）',
    `ip`            VARCHAR(50)     DEFAULT NULL                COMMENT '评论者IP',
    `user_agent`    VARCHAR(500)    DEFAULT NULL                COMMENT '评论者UA',
    `status`        TINYINT         NOT NULL    DEFAULT 1       COMMENT '状态：0待审核 1通过 2删除',
    `created_at`    DATETIME        NOT NULL    DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_article` (`article_id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_parent` (`parent_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4  COLLATE=utf8mb4_unicode_ci  COMMENT='评论表';

-- ----------------------------
-- 初始管理员账号
-- 密码: admin123 (BCrypt加密)
-- ----------------------------
INSERT INTO `sys_user` (`username`, `password`, `nickname`, `email`, `role`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', '管理员', 'admin@example.com', 'admin');
