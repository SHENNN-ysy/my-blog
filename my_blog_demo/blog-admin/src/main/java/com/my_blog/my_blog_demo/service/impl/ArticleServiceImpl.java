package com.my_blog.my_blog_demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.my_blog.common.enums.ErrorCode;
import com.my_blog.common.exception.BizException;
import com.my_blog.model.entity.Article;
import com.my_blog.model.entity.Category;
import com.my_blog.model.entity.User;
import com.my_blog.model.vo.ArticleVO;
import com.my_blog.model.vo.PageResult;
import com.my_blog.my_blog_demo.mapper.ArticleMapper;
import com.my_blog.my_blog_demo.mapper.CategoryMapper;
import com.my_blog.my_blog_demo.mapper.UserMapper;
import com.my_blog.my_blog_demo.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleMapper articleMapper;
    private final CategoryMapper categoryMapper;
    private final UserMapper userMapper;

    @Override
    public PageResult<ArticleVO> list(String category, Integer page, Integer size) {
        int p = (page != null && page > 0) ? page : 1;
        int s = (size != null && size > 0) ? Math.min(size, 100) : 10;

        Long categoryId = null;
        if (StringUtils.hasText(category)) {
            if (category.matches("\\d+")) {
                categoryId = Long.parseLong(category);
            } else {
                Category cat = categoryMapper.selectOne(
                        new LambdaQueryWrapper<Category>().eq(Category::getSlug, category));
                if (cat != null) categoryId = cat.getId();
            }
        }

        Page<Article> pg = new Page<>(p, s);
        LambdaQueryWrapper<Article> qw = new LambdaQueryWrapper<>();
        qw.eq(Article::getStatus, 1);
        if (categoryId != null) {
            qw.eq(Article::getCategoryId, categoryId);
        }
        qw.orderByDesc(Article::getCreateTime);
        Page<Article> result = articleMapper.selectPage(pg, qw);

        List<ArticleVO> list = result.getRecords().stream()
                .map(this::toVO)
                .collect(Collectors.toList());

        return PageResult.of(list, result.getTotal(), result.getCurrent(), result.getSize());
    }

    @Override
    public ArticleVO getById(Long id) {
        Article article = articleMapper.selectById(id);
        if (article == null) {
            throw new BizException(ErrorCode.ARTICLE_NOT_FOUND);
        }
        return toVO(article);
    }

    @Override
    @Transactional
    public ArticleVO incrementViewCount(Long id) {
        LambdaUpdateWrapper<Article> uw = new LambdaUpdateWrapper<>();
        uw.eq(Article::getId, id).setSql("view_count = view_count + 1");
        int rows = articleMapper.update(null, uw);
        if (rows == 0) {
            throw new BizException(ErrorCode.ARTICLE_NOT_FOUND);
        }
        return toVO(articleMapper.selectById(id));
    }

    private ArticleVO toVO(Article article) {
        ArticleVO vo = new ArticleVO();
        vo.setId(article.getId());
        vo.setTitle(article.getTitle());
        vo.setSlug(article.getSlug());
        vo.setContent(article.getContent());
        vo.setSummary(article.getSummary());
        vo.setCover(article.getCover());
        vo.setCategoryId(article.getCategoryId());
        vo.setAuthorId(article.getAuthorId());
        vo.setIsFeatured(article.getIsFeatured());
        vo.setViewCount(article.getViewCount());
        vo.setLikeCount(article.getLikeCount());
        vo.setCommentCount(article.getCommentCount());
        vo.setStatus(article.getStatus());
        vo.setPublishedAt(article.getPublishedAt());
        vo.setCreateTime(article.getCreateTime());
        vo.setUpdateTime(article.getUpdateTime());

        if (article.getCategoryId() != null) {
            Category category = categoryMapper.selectById(article.getCategoryId());
            if (category != null) {
                vo.setCategoryName(category.getName());
            }
        }
        if (article.getAuthorId() != null) {
            User author = userMapper.selectById(article.getAuthorId());
            if (author != null) {
                vo.setAuthorName(author.getNickname());
            }
        }
        return vo;
    }
}
