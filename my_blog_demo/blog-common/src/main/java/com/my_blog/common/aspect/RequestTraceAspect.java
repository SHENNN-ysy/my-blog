package com.my_blog.common.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

/**
 * 全链路请求跟踪切面
 * 记录每个 HTTP 请求的：请求参数、执行耗时、响应状态、响应体、异常信息
 */
@Slf4j
@Aspect
@Component
public class RequestTraceAspect {

    @Autowired
    private ObjectMapper objectMapper;

    /** 切所有 Controller */
    @Pointcut("execution(* com.my_blog.my_blog_demo.controller..*(..))")
    public void controllerPointcut() {}

    @Around("controllerPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attrs != null ? attrs.getRequest() : null;

        String traceId = buildTraceId(request);
        Object[] args = joinPoint.getArgs();

        log.info("[TRACE] {} | START | {} {} | args={}",
                traceId,
                request != null ? request.getMethod() : "UNKNOWN",
                request != null ? request.getRequestURI() : "unknown",
                Arrays.toString(args));

        try {
            Object result = joinPoint.proceed();
            long cost = System.currentTimeMillis() - start;
            int httpStatus = extractStatus(result, 200);
            String responseBody = result != null ? toJson(result) : "";

            log.info("[TRACE] {} | SUCCESS | {} {} | status={} | cost={}ms | body={}",
                    traceId,
                    request != null ? request.getMethod() : "UNKNOWN",
                    request != null ? request.getRequestURI() : "unknown",
                    httpStatus,
                    cost,
                    responseBody);

            return result;
        } catch (Throwable t) {
            long cost = System.currentTimeMillis() - start;
            log.error("[TRACE] {} | ERROR   | {} {} | cost={}ms | ex={} | msg={}",
                    traceId,
                    request != null ? request.getMethod() : "UNKNOWN",
                    request != null ? request.getRequestURI() : "unknown",
                    cost,
                    t.getClass().getSimpleName(),
                    t.getMessage());
            throw t;
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{\"serialize-error\":\"" + e.getMessage() + "\"}";
        }
    }

    private int extractStatus(Object result, int fallback) {
        if (result instanceof ResponseEntity<?> re) {
            return re.getStatusCode().value();
        }
        return fallback;
    }

    private String buildTraceId(HttpServletRequest request) {
        if (request == null) return "NO-REQUEST";
        String headerTraceId = request.getHeader("X-Trace-Id");
        if (headerTraceId != null && !headerTraceId.isBlank()) {
            return headerTraceId;
        }
        return "TRACE-" + System.currentTimeMillis() + "-" +
                Integer.toHexString(request.hashCode());
    }
}
