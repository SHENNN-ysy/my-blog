package com.my_blog.common.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
        HttpServletResponse response = attrs != null ? attrs.getResponse() : null;

        String traceId = buildTraceId(request);
        Object[] args = joinPoint.getArgs();

        log.info("[TRACE] {} | START | {} {} | args={}",
                traceId,
                request != null ? request.getMethod() : "UNKNOWN",
                request != null ? request.getRequestURI() : "unknown",
                Arrays.toString(args));

        Object result = null;
        Throwable thrown = null;
        int httpStatus = 200;
        String responseBody = "";

        try {
            result = joinPoint.proceed();
        } catch (Throwable t) {
            thrown = t;
            httpStatus = 500;
        }

        long cost = System.currentTimeMillis() - start;

        if (thrown != null) {
            responseBody = buildErrorBody(thrown);
            log.error("[TRACE] {} | ERROR   | {} {} | status=500 | cost={}ms | ex={} | msg={}",
                    traceId,
                    request != null ? request.getMethod() : "UNKNOWN",
                    request != null ? request.getRequestURI() : "unknown",
                    cost,
                    thrown.getClass().getSimpleName(),
                    thrown.getMessage());
            throw thrown;
        }

        if (result != null) {
            responseBody = toJson(result);
            httpStatus = extractStatus(result, 200);
        }

        writeJsonResponse(response, httpStatus, responseBody);

        log.info("[TRACE] {} | SUCCESS | {} {} | status={} | cost={}ms | body={}",
                traceId,
                request != null ? request.getMethod() : "UNKNOWN",
                request != null ? request.getRequestURI() : "unknown",
                httpStatus,
                cost,
                responseBody);

        return null;
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

    private String buildErrorBody(Throwable t) {
        try {
            return objectMapper.writeValueAsString(
                    java.util.Map.of("code", 500, "message", t.getMessage())
            );
        } catch (Exception e) {
            return "{\"code\":500,\"message\":\"" + t.getMessage() + "\"}";
        }
    }

    private void writeJsonResponse(HttpServletResponse response, int status, String body) {
        if (response == null || response.isCommitted()) {
            return;
        }
        try {
            byte[] bytes = body.getBytes(java.nio.charset.StandardCharsets.UTF_8);
            response.setStatus(status);
            response.setContentType("application/json;charset=UTF-8");
            response.setContentLength(bytes.length);
            response.getOutputStream().write(bytes);
            response.getOutputStream().flush();
        } catch (Exception ignored) {}
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
