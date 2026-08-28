# RentEase Platform

RentEase is a platform for vehicle rentals with a microservices architecture built using Spring Boot.

## Architecture Diagram

```
+----------------+       +---------------+      +-------------------+
|    Frontend    | ----> |  API Gateway  | ---> |   User Service    |
+----------------+       +-------+-------+      +---------+---------+
                                 |                        | MySQL (3307)
                                 |                        
                                 +------------> |  Catalog Service  |
                                 |              +---------+---------+
                                 |                        | MySQL (3308)
                                 |
                                 +------------> |  Booking Service  |
                                 |              +---------+---------+
                                 |                        | MySQL (3309)
                                 |
                                 +------------> |  Payment Service  |
                                 |              +---------+---------+
                                 |                        | MySQL (3310)
                                 |
                                 +------------> |Notification Service|
                                                +-------------------+
```

## Prerequisites
- Docker & Docker Compose
- Java 21 & Maven 3.9+
- Node.js 18+ (for frontend)

## How to Run Locally (Step by step)
1. Navigate to each service directory (`user-service`, `catalog-service`, etc.).
2. Run `mvn spring-boot:run`.
3. Ensure you have local MySQL instances running on the appropriate ports or update `application.properties` accordingly.

## How to Run with Docker Compose
1. In the root directory of the project, run:
   ```bash
   docker-compose up -d --build
   ```
2. The application will start all services and databases.

## API Documentation

| Service              | Port | Base URL                | Main Functions                         |
|----------------------|------|-------------------------|----------------------------------------|
| API Gateway          | 8080 | http://localhost:8080   | Routes requests to internal services   |
| User Service         | 8081 | /api/v1/users           | User auth, profiles, documents         |
| Catalog Service      | 8082 | /api/v1/catalog         | Vehicle listings, categories           |
| Booking Service      | 8083 | /api/v1/bookings        | Bookings, status management            |
| Payment Service      | 8084 | /api/v1/payments        | Deposits, payouts, transactions        |
| Notification Service | 8085 | /api/v1/notifications   | Email notifications                    |

## Team Member Work Division
- Alice: User & Auth Service
- Bob: Catalog Service
- Charlie: Booking Service
- Dave: Payment Service
- Eve: Notification Service, API Gateway, DevOps

## Technology Stack
- Java 21, Spring Boot 3.3.4
- MySQL 8.0
- Docker, Docker Compose
- Maven
- Jenkins, SonarQube
