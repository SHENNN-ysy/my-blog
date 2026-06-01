package com.my_blog.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("blog_category")
public class Category {
    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String slug;

    private String description;

    private Integer sort;

    private Integer status;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
