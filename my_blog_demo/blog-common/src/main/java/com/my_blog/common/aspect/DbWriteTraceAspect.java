package com.my_blog.common.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * 数据库写操作日志跟踪
 * 拦截所有 Mapper 的 INSERT / UPDATE / DELETE 操作，记录方法名、参数、影响行数
 */
@Slf4j
@Aspect
@Component
public class DbWriteTraceAspect {

    @Pointcut("execution(* com.my_blog.my_blog_demo.mapper..*.insert*(..)) " +
             "|| execution(* com.my_blog.my_blog_demo.mapper..*.update*(..)) " +
             "|| execution(* com.my_blog.my_blog_demo.mapper..*.delete*(..))")
    public void mapperWritePointcut() {}

    @AfterReturning(pointcut = "mapperWritePointcut()", returning = "result")
    public void afterWrite(JoinPoint joinPoint, Object result) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();

        int rowsAffected = 0;
        if (result instanceof Integer) {
            rowsAffected = (Integer) result;
        }

        log.info("[DB-WRITE] {}.{} | args={} | rowsAffected={}",
                className, methodName,
                Arrays.toString(args),
                rowsAffected);
    }

    @AfterThrowing(pointcut = "mapperWritePointcut()", throwing = "ex")
    public void afterWriteError(JoinPoint joinPoint, Throwable ex) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();

        log.error("[DB-WRITE-ERROR] {}.{} | args={} | ex={}",
                className, methodName,
                Arrays.toString(joinPoint.getArgs()),
                ex.getMessage());
    }
}
