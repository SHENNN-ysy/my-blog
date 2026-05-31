package com.my_blog.my_blog_demo.interceptor;

import com.my_blog.common.enums.ErrorCode;
import com.my_blog.common.exception.BizException;
import com.my_blog.common.util.JwtUtil;
import com.my_blog.common.util.RequestHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = RequestHolder.getToken();
        if (token == null) {
            throw new BizException(ErrorCode.UNAUTHORIZED);
        }
        if (jwtUtil.isTokenExpired(token)) {
            throw new BizException(ErrorCode.TOKEN_EXPIRED);
        }
        if (!jwtUtil.validateToken(token)) {
            throw new BizException(ErrorCode.TOKEN_INVALID);
        }
        request.setAttribute("userId", jwtUtil.getUserId(token));
        request.setAttribute("username", jwtUtil.getUsername(token));
        return true;
    }
}
