FROM openjdk:17-jdk-slim

RUN mkdir /account-service
COPY ./target/*.jar /account-service/account-service.jar
WORKDIR /account-service

EXPOSE 8081
CMD ["java", "-jar", "account-service.jar"]