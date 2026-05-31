package com.my_blog.common.enums;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // 通用错误
    SUCCESS(200, "操作成功"),
    SYSTEM_ERROR(500, "系统繁忙，请稍后重试"),
    UNAUTHORIZED(401, "未登录或登录已过期，请重新登录"),
    FORBIDDEN(403, "无权限访问该资源"),

    // 参数错误
    PARAM_ERROR(400, "参数错误"),
    PARAM_MISSING(400, "缺少必要参数"),
    PARAM_INVALID(400, "参数格式不正确"),

    // 认证错误
    USERNAME_PASSWORD_ERROR(401, "用户名或密码错误"),
    TOKEN_EXPIRED(401, "Token 已过期，请重新登录"),
    TOKEN_INVALID(401, "无效的 Token"),
    USER_NOT_FOUND(404, "用户不存在"),

    // 注册错误
    USERNAME_EXIST(409, "用户名已存在"),
    EMAIL_EXIST(409, "邮箱已被注册"),

    // 业务错误
    ARTICLE_NOT_FOUND(404, "文章不存在"),
    COMMENT_NOT_FOUND(404, "评论不存在"),
    CATEGORY_NOT_FOUND(404, "分类不存在"),
    TAG_NOT_FOUND(404, "标签不存在");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
