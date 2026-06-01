package com.my_blog.model.vo;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentVO {
    private Long id;
    private Long articleId;
    private Long userId;
    private String username;
    private String nickname;
    private String email;
    private String avatar;
    private String content;
    private LocalDateTime createdAt;
    private Long parentId;
    private List<CommentVO> children;
}
