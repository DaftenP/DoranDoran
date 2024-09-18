# 베이스 이미지로 OpenJDK 17 사용
FROM openjdk:17-jdk-slim AS build

# 작업 디렉토리 설정
WORKDIR /app

# 빌드에 필요한 파일 복사
COPY . .

# gradlew 실행 권한 부여
RUN chmod +x gradlew

# 빌드
RUN ./gradlew build --no-daemon -x test


# 빌드 결과물을 실행할 이미지
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 결과물 복사
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

# 실행
CMD ["java", "-jar", "app.jar"]
