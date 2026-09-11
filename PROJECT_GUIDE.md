# RentEase — Microservices Vehicle Rental Platform
## Complete Project Documentation & University Viva Guide

---

## 📌 1. Project Overview & Architecture

RentEase is a full-stack distributed vehicle rental marketplace built with **Spring Boot 3.3.4 (Java 21)**, **MySQL 8.0**, and **React 18**.

### Architecture: Domain-Driven Microservices (DDD)
```
Browser / Client (Port 3000)
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Port 8080)                   │
└──────┬──────────────┬──────────────┬──────────────┬─────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│ User Service ││Catalog Service││Booking Service││Payment Service│
│  (Port 8081) ││  (Port 8082) ││  (Port 8083) ││  (Port 8084) │
└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘
       │               │               │               │
       ▼               ▼               ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│   user_db    ││  catalog_db  ││  booking_db  ││  payment_db  │
│ (Port 3306)  ││ (Port 3306)  ││ (Port 3306)  ││ (Port 3306)  │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

---

## ⚙️ 2. How to Setup & Run (For Team Members)

### Prerequisites:
- Java JDK 21
- Apache Maven
- Node.js (v18 or v20)
- MySQL 8.0 (Port 3306, user: `root`, password: `root`)

### Step 1: Start MySQL Database
```bash
docker run -d --name mysql-rentease -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.0
```

### Step 2: Start Microservices (In separate terminal tabs)
```bash
# Terminal 1 — User Service (Auth / JWT)
cd user-service
mvn spring-boot:run

# Terminal 2 — Catalog Service (Vehicles)
cd catalog-service
mvn spring-boot:run

# Terminal 3 — Booking Service (Bookings & Distance Pricing)
cd booking-service
mvn spring-boot:run

# Terminal 4 — Payment Service (15% Commission & Escrow)
cd payment-service
mvn spring-boot:run
```

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm start
```
Access the application at `http://localhost:3000`.

---

## 🧮 3. Core Business Logics Implemented

### 1. Distance-Based Dynamic Pricing
- **Formula:** `Total Cost = (Days × Daily Rate) + Max(0, Actual KM - Base KM × Days) × Extra Rate Per KM`
- **Example:** 3 days @ LKR 7,500/day (100km/day base, LKR 45/extra km):
  - Driven 250km (under limit) ➔ **LKR 22,500**
  - Driven 380km (80km over limit) ➔ 22,500 + (80 × 45) = **LKR 26,100**

### 2. Escrow & Security Deposits
- System calculates a **30% security deposit** at booking approval.
- Held in an Escrow state and deducted automatically for any excess mileage or damages upon return, releasing the balance to the customer.

### 3. Commission & Owner Payouts
- Platform automatically retains a **15% commission** on gross rental fees.
- Net 85% is transferred to the owner payout ledger.

### 4. Smart Recommendation Engine
- Recommends "Similar Vehicles" matching: **Same category + Same district + Price within ±20%**.

### 5. Strict State Machine
- `REQUESTED` ➔ `APPROVED` ➔ `ACTIVE` ➔ `COMPLETED`
- Exceptions: `REJECTED`, `CANCELLED`, `DISPUTED` (freezes payouts for Admin review).

---

## 👥 4. Team Task Delegation

| Member | Focus Area | Responsibilities |
|---|---|---|
| **Member 1 (Lead)** | Core Backend & Architecture | User Service, Catalog Service, JWT Auth, API Gateway, DB schemas |
| **Member 2** | Frontend & UI/UX | Search widget polish, City autocomplete, Datepicker, Dashboard pages, Mobile responsiveness |
| **Member 3** | QA & Payment / Booking Logic | Booking State Machine testing, Payment & Escrow QA, Postman collection preparation for Viva |

---

## 🎓 5. Viva Preparation (Top Questions & Answers)

1. **Q: Why is there no separate Admin Service?**
   - **A:** We followed **Domain-Driven Design (DDD)**. Admin functionality is secured with `ROLE_ADMIN` RBAC directly inside their domain boundaries (e.g. KYC in User Service, Disputes in Booking Service, Commission in Payment Service).
2. **Q: How is data isolated between services?**
   - **A:** Database-per-Service pattern. Each microservice manages its own schema (`user_db`, `catalog_db`, etc.), preventing tight database coupling.
3. **Q: How does authentication work?**
   - **A:** Stateless JWT with BCrypt password hashing. Tokens contain user claims and roles signed with HS256.
