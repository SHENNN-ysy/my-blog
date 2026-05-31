package com.my_blog.my_blog_demo.service;

import com.my_blog.model.dto.CommentDTO;
import com.my_blog.model.vo.CommentVO;

import java.util.List;

public interface CommentService {

    List<CommentVO> listByArticle(Long articleId);

    CommentVO submit(CommentDTO dto, Long userId);
}
