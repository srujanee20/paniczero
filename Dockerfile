# =========================================================
# Stage 1: Build Frontend (React + Vite)
# =========================================================
FROM node:20-alpine AS ui-builder
WORKDIR /app/paniczero-ui

# Copy frontend dependency declarations and install
COPY paniczero-ui/package*.json ./
RUN npm ci

# Copy frontend source code and build production assets
COPY paniczero-ui/ ./
RUN npm run build

# =========================================================
# Stage 2: Build Backend (Spring Boot JAR)
# =========================================================
FROM maven:3.9-eclipse-temurin-25 AS api-builder
WORKDIR /app

# Copy Spring Boot POM and source code
COPY paniczero-api/pom.xml ./paniczero-api/
COPY paniczero-api/src ./paniczero-api/src

# Copy static frontend assets built in Stage 1 into Spring Boot static resources
COPY --from=ui-builder /app/paniczero-ui/dist ./paniczero-api/src/main/resources/static/

# Package executable JAR
WORKDIR /app/paniczero-api
RUN mvn clean package -DskipTests

# =========================================================
# Stage 3: Production Runtime
# =========================================================
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy compiled JAR from Stage 2
COPY --from=api-builder /app/paniczero-api/target/paniczero-api-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
