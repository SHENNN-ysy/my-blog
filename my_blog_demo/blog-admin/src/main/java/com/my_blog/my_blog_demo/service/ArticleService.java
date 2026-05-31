package com.my_blog.my_blog_demo.service;

import com.my_blog.model.vo.ArticleVO;
import com.my_blog.model.vo.PageResult;

public interface ArticleService {

    PageResult<ArticleVO> list(String category, Integer page, Integer size);

    ArticleVO getById(Long id);

    ArticleVO incrementViewCount(Long id);
}
