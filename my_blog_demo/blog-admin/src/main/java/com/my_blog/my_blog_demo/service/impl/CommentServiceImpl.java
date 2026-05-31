package com.my_blog.my_blog_demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.my_blog.model.dto.CommentDTO;
import com.my_blog.model.entity.Comment;
import com.my_blog.model.entity.User;
import com.my_blog.model.vo.CommentVO;
import com.my_blog.my_blog_demo.mapper.CommentMapper;
import com.my_blog.my_blog_demo.mapper.UserMapper;
import com.my_blog.my_blog_demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserMapper userMapper;

    @Override
    public List<CommentVO> listByArticle(Long articleId) {
        List<Comment> all = commentMapper.selectList(
                new LambdaQueryWrapper<Comment>()
                        .eq(Comment::getArticleId, articleId)
                        .eq(Comment::getStatus, 1)
                        .orderByAsc(Comment::getCreateTime)
        );
        if (all.isEmpty()) {
            return List.of();
        }

        List<Long> userIds = all.stream()
                .map(Comment::getUserId)
                .filter(id -> id != null)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, User> userMap = userIds.isEmpty()
                ? Map.of()
                : userMapper.selectBatchIds(userIds).stream()
                        .collect(Collectors.toMap(User::getId, Function.identity()));

        return buildTree(all, userMap);
    }

    @Override
    @Transactional
    public CommentVO submit(CommentDTO dto, Long userId) {
        Comment comment = new Comment();
        comment.setArticleId(dto.getArticleId());
        comment.setUserId(userId);
        comment.setContent(dto.getContent());
        comment.setParentId(dto.getParentId());
        comment.setStatus(1);
        commentMapper.insert(comment);
        return toVO(comment, Map.of());
    }

    private List<CommentVO> buildTree(List<Comment> comments, Map<Long, User> userMap) {
        Map<Long, List<Comment>> parentMap = comments.stream()
                .collect(Collectors.groupingBy(c -> c.getParentId() == null ? 0L : c.getParentId()));

        List<CommentVO> topLevel = comments.stream()
                .filter(c -> c.getParentId() == null)
                .map(c -> toVO(c, userMap))
                .collect(Collectors.toList());

        for (CommentVO vo : topLevel) {
            buildChildren(vo, parentMap, userMap);
        }
        return topLevel;
    }

    private void buildChildren(CommentVO parent, Map<Long, List<Comment>> parentMap, Map<Long, User> userMap) {
        List<Comment> children = parentMap.getOrDefault(parent.getId(), List.of());
        List<CommentVO> childVOs = children.stream()
                .map(c -> toVO(c, userMap))
                .collect(Collectors.toList());
        parent.setChildren(childVOs);
        for (CommentVO child : childVOs) {
            buildChildren(child, parentMap, userMap);
        }
    }

    private CommentVO toVO(Comment comment, Map<Long, User> userMap) {
        CommentVO vo = new CommentVO();
        vo.setId(comment.getId());
        vo.setArticleId(comment.getArticleId());
        vo.setUserId(comment.getUserId());
        vo.setContent(comment.getContent());
        vo.setCreateTime(comment.getCreateTime());
        vo.setParentId(comment.getParentId());

        if (comment.getUserId() != null) {
            User user = userMap.get(comment.getUserId());
            if (user != null) {
                vo.setUsername(user.getUsername());
                vo.setAvatar(user.getAvatar());
            }
        }

        return vo;
    }
}
