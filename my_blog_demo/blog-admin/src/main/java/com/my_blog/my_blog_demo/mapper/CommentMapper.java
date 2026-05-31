package com.my_blog.my_blog_demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.my_blog.model.entity.Comment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
}
