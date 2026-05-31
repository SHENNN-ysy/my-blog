package com.my_blog.my_blog_demo.service;

import com.my_blog.model.dto.LoginDTO;
import com.my_blog.model.dto.RegisterDTO;
import com.my_blog.model.vo.UserVO;

import java.util.Map;

public interface AuthService {

    Map<String, Object> login(LoginDTO dto);

    Map<String, Object> register(RegisterDTO dto);

    UserVO getCurrentUser(Long userId);
}
