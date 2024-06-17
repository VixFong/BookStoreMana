FROM openjdk:17-jdk-slim

RUN mkdir /api-gateway
COPY ./target/*.jar /api-gateway/api-gateway.jar
WORKDIR /api-gateway

EXPOSE 8888
CMD ["java", "-jar", "api-gateway.jar"]