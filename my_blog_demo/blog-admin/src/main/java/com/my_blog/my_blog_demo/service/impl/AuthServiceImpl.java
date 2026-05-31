package com.my_blog.my_blog_demo.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.my_blog.common.enums.ErrorCode;
import com.my_blog.common.exception.BizException;
import com.my_blog.common.util.JwtUtil;
import com.my_blog.model.dto.LoginDTO;
import com.my_blog.model.dto.RegisterDTO;
import com.my_blog.model.entity.User;
import com.my_blog.model.vo.UserVO;
import com.my_blog.my_blog_demo.mapper.UserMapper;
import com.my_blog.my_blog_demo.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public Map<String, Object> login(LoginDTO dto) {
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername())
        );
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BizException(ErrorCode.USERNAME_PASSWORD_ERROR);
        }
        if (user.getStatus() != null && user.getStatus() == 0) {
            throw new BizException(ErrorCode.FORBIDDEN);
        }
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return Map.of(
                "token", token,
                "user", toVO(user)
        );
    }

    @Override
    public Map<String, Object> register(RegisterDTO dto) {
        if (userMapper.selectCount(
                new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername())
        ) > 0) {
            throw new BizException(ErrorCode.USERNAME_EXIST);
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole("user");
        user.setStatus(1);
        userMapper.insert(user);

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return Map.of(
                "token", token,
                "user", toVO(user)
        );
    }

    @Override
    public UserVO getCurrentUser(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }
        return toVO(user);
    }

    private UserVO toVO(User user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setNickname(user.getNickname());
        vo.setEmail(user.getEmail());
        vo.setAvatar(user.getAvatar());
        vo.setRole(user.getRole());
        vo.setCreateTime(user.getCreateTime());
        return vo;
    }
}
