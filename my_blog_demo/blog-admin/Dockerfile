# 多阶段构建：构建阶段使用 Maven 打包，运行阶段使用 JRE
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# 复制 Maven settings，使用阿里云镜像加速依赖下载
COPY dev-ops/settings.xml /root/.m2/settings.xml

# 复制所有模块的 pom.xml（按依赖顺序）
COPY pom.xml .
COPY blog-model/pom.xml blog-model/
COPY blog-common/pom.xml blog-common/
COPY blog-admin/pom.xml blog-admin/

# 复制各模块源码
COPY blog-model/src blog-model/src
COPY blog-common/src blog-common/src
COPY blog-admin/src blog-admin/src

# 静默构建，跳过测试
RUN mvn -s /root/.m2/settings.xml clean package -DskipTests -q

# 运行阶段：只打包 JRE，减少镜像体积
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/blog-admin/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
