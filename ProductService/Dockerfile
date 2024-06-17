FROM openjdk:17-jdk-slim

RUN mkdir /product-service
COPY ./target/*.jar /product-service/product-service.jar
WORKDIR /product-service

EXPOSE 8083
CMD ["java", "-jar", "product-service.jar"]