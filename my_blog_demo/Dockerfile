FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml pom.xml
COPY blog-common/pom.xml blog-common/pom.xml
COPY blog-model/pom.xml blog-model/pom.xml
COPY blog-admin/pom.xml blog-admin/pom.xml
COPY dev-ops/settings.xml /root/.m2/settings.xml

RUN mvn dependency:go-offline -B

COPY . .

RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre

RUN groupadd -r blog && useradd -r -g blog blog

WORKDIR /app

COPY --from=builder /build/blog-admin/target/*.jar app.jar

RUN chown blog:blog app.jar

USER blog

EXPOSE 8080

ENTRYPOINT ["java", "-Xlog:gc*=info:file=/tmp/gc.log:time,uptime,level,tags:filecount=5,filesize=10M", "-XX:+HeapDumpOnOutOfMemoryError", "-XX:HeapDumpPath=/tmp", "-Duser.timezone=Asia/Shanghai", "-jar", "app.jar"]
