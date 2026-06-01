package com.my_blog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("blog_comment")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long articleId;

    private Long userId;

    private String nickname;

    private String email;

    private String content;

    private Long parentId;

    private String ip;

    private String userAgent;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
