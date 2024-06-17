FROM openjdk:17-jdk-slim

RUN mkdir /image-service
COPY ./target/*.jar /image-service/image-service.jar
WORKDIR /image-service

EXPOSE 8080
CMD ["java","-jar", "image-service.jar"]

