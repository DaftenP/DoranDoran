FROM openjdk:17-jdk-slim AS build

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew build --no-daemon -x test

FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar"]
