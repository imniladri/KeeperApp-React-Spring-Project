# ---------- Build stage ----------
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy only files needed to resolve dependencies first (better layer caching)
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make wrapper executable and pre-download dependencies
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Now copy the actual source and build
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Run as non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]