package com.my_blog.model.vo;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVO {
    private Long id;
    private String username;
    private String nickname;
    private String email;
    private String avatar;
    private String role;
    private LocalDateTime createdAt;
}
