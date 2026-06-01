package com.my_blog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("blog_article")
public class Article {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String slug;

    private String content;

    private String summary;

    private String cover;

    private Long categoryId;

    private Long authorId;

    private Long viewCount;

    private Long likeCount;

    private Long commentCount;

    private Integer isFeatured;

    private Integer status;

    private LocalDateTime publishedAt;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
