package com.my_blog.my_blog_demo.controller;

import com.my_blog.model.dto.CommentDTO;
import com.my_blog.model.vo.CommentVO;
import com.my_blog.model.vo.Result;
import com.my_blog.my_blog_demo.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/article/{articleId}")
    public Result<List<CommentVO>> listByArticle(@PathVariable Long articleId) {
        return Result.success(commentService.listByArticle(articleId));
    }

    @PostMapping
    public Result<CommentVO> submit(
            @Valid @RequestBody CommentDTO dto,
            HttpServletRequest request
    ) {
        Long userId = (Long) request.getAttribute("userId");
        return Result.success(commentService.submit(dto, userId, request));
    }
}
