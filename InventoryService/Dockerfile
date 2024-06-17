FROM openjdk:17-jdk-slim

RUN mkdir /inventory-service
COPY ./target/*.jar /inventory-service/inventory-service.jar
WORKDIR /inventory-service

EXPOSE 8082
CMD ["java", "-jar", "inventory-service.jar"]