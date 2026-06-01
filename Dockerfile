FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY back/pom.xml back/
COPY back/blog-model/pom.xml back/blog-model/
COPY back/blog-common/pom.xml back/blog-common/
COPY back/blog-admin/pom.xml back/blog-admin/
COPY back/blog-model/src back/blog-model/src
COPY back/blog-common/src back/blog-common/src
COPY back/blog-admin/src back/blog-admin/src
RUN mvn -f back/pom.xml clean package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/back/blog-admin/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
