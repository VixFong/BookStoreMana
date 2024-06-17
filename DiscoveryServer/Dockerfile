FROM openjdk:17-jdk-slim

RUN mkdir /discovery-server
COPY ./target/*.jar /discovery-server/discovery-server.jar
WORKDIR /discovery-server

EXPOSE 8761
CMD ["java","-jar", "discovery-server.jar"]

