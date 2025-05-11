# Build stage
FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create necessary directory (if used in the app)
RUN mkdir -p /app/uploads

# Expose app port
EXPOSE 8080

# Expect environment variables to be injected by Kubernetes (via Secret or ConfigMap)
ENV SPRING_DATASOURCE_URL=jdbc:mysql://mysql.database.svc.cluster.local:3306/elvitrina?allowPublicKeyRetrieval=true&useSSL=false

# Remove hardcoded credentials from Dockerfile — they will be injected at runtime by Kubernetes
# ENV SPRING_DATASOURCE_USERNAME=root
# ENV SPRING_DATASOURCE_PASSWORD=root

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
