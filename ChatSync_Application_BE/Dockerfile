# State 1: Build the application
FROM gradle:8.13-jdk17-alpine AS build
COPY --chown=gradle:gradle . /nphuy/chatsync
WORKDIR /nphuy/chatsync

# Skip task: test
RUN gradle build -x test --no-daemon --info --stacktrace

#State 2: Run the application
FROM openjdk:17-slim
EXPOSE 8080
COPY --from=build /nphuy/chatsync/build/libs/*.jar /nphuy/spring-boot-chatsync.jar
ENTRYPOINT [ "java", "-jar", "/nphuy/spring-boot-chatsync.jar" ] 