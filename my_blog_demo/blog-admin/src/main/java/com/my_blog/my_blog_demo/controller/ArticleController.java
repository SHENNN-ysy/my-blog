package com.my_blog.my_blog_demo.controller;

import com.my_blog.model.vo.ArticleVO;
import com.my_blog.model.vo.Result;
import com.my_blog.my_blog_demo.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping
    public Result<Object> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size
    ) {
        return Result.success(articleService.list(category, page, size));
    }

    @GetMapping("/{id}")
    public Result<ArticleVO> getById(@PathVariable Long id) {
        return Result.success(articleService.getById(id));
    }

    @PostMapping("/{id}/view")
    public Result<ArticleVO> incrementViewCount(@PathVariable Long id) {
        return Result.success(articleService.incrementViewCount(id));
    }
}
