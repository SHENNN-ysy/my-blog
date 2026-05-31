package com.my_blog.model.vo;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleVO {
    private Long id;
    private String title;
    private String slug;
    private String content;
    private String summary;
    private String cover;
    private Long categoryId;
    private String categoryName;
    private Long authorId;
    private String authorName;
    private Long viewCount;
    private Long likeCount;
    private Long commentCount;
    private Integer isFeatured;
    private Integer status;
    private LocalDateTime publishedAt;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
