# Etap 1: Użyj obrazu Mavena do zbudowania aplikacji
FROM maven:3.8.4-openjdk-8 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etap 2: Utwórz finalny obraz z JRE
FROM openjdk:8-jre
WORKDIR /app
COPY --from=build /app/target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
