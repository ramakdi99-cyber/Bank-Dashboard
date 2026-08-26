# Banking Project Portfolio Management Dashboard

A full-stack enterprise portfolio management application built for banking institutions to track, manage, and analyze project portfolios with real-time dashboards, analytics, and role-based access control.

**Live Demo:** [https://bank-dashboard-zj3l.onrender.com](https://bank-dashboard-zj3l.onrender.com)
**GitHub:** [https://github.com/ramakdi99-cyber/Bank-Dashboard](https://github.com/ramakdi99-cyber/Bank-Dashboard)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Default Credentials](#default-credentials)
- [API Reference](#api-reference)
- [Features](#features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Banking Portfolio Management Dashboard provides a centralized platform for managing multiple project portfolios across banking divisions. It features:

- **Real-time KPI tracking** with budget monitoring and health status visualization
- **Portfolio & Project CRUD** with status, health, priority, and budget management
- **Interactive analytics** with Recharts-powered charts (pie, bar, line)
- **Role-based access control** (ADMIN / MANAGER / VIEWER)
- **JWT authentication** with BCrypt password hashing
- **Responsive UI** built with Tailwind CSS

---

## Architecture

```
┌──────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
│                      │        │                      │        │                      │
│   React 18 + Vite    │───────▶│   Spring Boot 3.2    │───────▶│   PostgreSQL 16      │
│   (Port 3000)        │  /api  │   (Port 8080)        │   JPA  │   (Port 5432)        │
│                      │        │                      │        │                      │
│  React Router 6      │        │  Spring Security 6   │        │  Flyway Migrations   │
│  Recharts 2.12       │        │  JWT Authentication  │        │  HikariCP Pooling    │
│  Tailwind CSS 3.4    │        │  Bean Validation     │        │                      │
│  Axios 1.7           │        │  Lombok              │        │                      │
│  Zustand 4.5         │        │                      │        │                      │
│                      │        │                      │        │                      │
└──────────────────────┘        └──────────────────────┘        └──────────────────────┘
```

- **Frontend**: React 18 SPA with Vite bundler, Tailwind CSS, Recharts for data visualization, Zustand for state management, and Axios for API communication.
- **Backend**: Spring Boot 3.2 REST API with Spring Security + JWT for stateless authentication, Spring Data JPA + Hibernate for persistence, and Bean Validation.
- **Database**: PostgreSQL 16 with Flyway for schema migrations. H2 in-memory database for development and testing.
- **DevOps**: Docker + Docker Compose for containerization, Nginx for SPA serving and reverse proxy in production.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.3 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| Recharts | 2.12 | Charting library |
| React Router | 6.24 | Client-side routing |
| Axios | 1.7 | HTTP client |
| Zustand | 4.5 | State management |
| Lucide React | 0.394 | Icon library |
| date-fns | 3.6 | Date formatting |
| Vitest | 1.6 | Unit testing |
| React Testing Library | 16.0 | Component testing |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17 | Runtime |
| Spring Boot | 3.2.5 | Application framework |
| Spring Security | 6.2 | Authentication & authorization |
| Spring Data JPA | 3.2 | Data access |
| Hibernate | 6.4 | ORM |
| JJWT | 0.12.5 | JWT token handling |
| Lombok | - | Boilerplate reduction |
| Flyway | 10.10 | Schema migrations |
| Maven | 3.9 | Build tool |
| H2 Database | - | Dev/test database |
| PostgreSQL | 16 | Production database |

### DevOps

| Technology | Purpose |
|-----------|---------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |
| Nginx | Static file serving & reverse proxy |
| Render | Cloud deployment |

---

## Project Structure

```
bank-project/
├── docker-compose.yml                      # Multi-service orchestration
├── README.md
├── .gitignore
│
├── banking-portfolio-management/
│   └── backend/                            # Spring Boot API
│       ├── Dockerfile
│       ├── pom.xml
│       └── src/
│           ├── main/
│           │   ├── java/com/banking/portfolio/
│           │   │   ├── PortfolioManagementApplication.java
│           │   │   ├── config/
│           │   │   │   └── CorsConfig.java
│           │   │   ├── controller/
│           │   │   │   ├── AuthController.java
│           │   │   │   ├── AnalyticsController.java
│           │   │   │   ├── DashboardController.java
│           │   │   │   ├── PortfolioController.java
│           │   │   │   └── ProjectController.java
│           │   │   ├── dto/
│           │   │   │   ├── request/
│           │   │   │   │   ├── LoginRequest.java
│           │   │   │   │   ├── PortfolioRequest.java
│           │   │   │   │   ├── ProjectRequest.java
│           │   │   │   │   └── RegisterRequest.java
│           │   │   │   └── response/
│           │   │   │       ├── AnalyticsResponse.java
│           │   │   │       ├── AuthResponse.java
│           │   │   │       ├── DashboardResponse.java
│           │   │   │       ├── PortfolioAnalyticsItem.java
│           │   │   │       ├── PortfolioResponse.java
│           │   │   │       ├── ProjectResponse.java
│           │   │   │       └── ProjectUpdateResponse.java
│           │   │   ├── entity/
│           │   │   │   ├── User.java
│           │   │   │   ├── Role.java
│           │   │   │   ├── Portfolio.java
│           │   │   │   ├── Project.java
│           │   │   │   ├── ProjectRisk.java
│           │   │   │   ├── ProjectUpdate.java
│           │   │   │   ├── AuditLog.java
│           │   │   │   └── enums/
│           │   │   │       ├── HealthStatus.java
│           │   │   │       ├── PortfolioStatus.java
│           │   │   │       ├── Priority.java
│           │   │   │       ├── ProjectStatus.java
│           │   │   │       └── RiskLevel.java
│           │   │   ├── exception/
│           │   │   │   ├── BadRequestException.java
│           │   │   │   ├── GlobalExceptionHandler.java
│           │   │   │   └── ResourceNotFoundException.java
│           │   │   ├── repository/
│           │   │   │   ├── UserRepository.java
│           │   │   │   ├── PortfolioRepository.java
│           │   │   │   ├── ProjectRepository.java
│           │   │   │   ├── ProjectRiskRepository.java
│           │   │   │   ├── ProjectUpdateRepository.java
│           │   │   │   └── AuditLogRepository.java
│           │   │   ├── security/
│           │   │   │   ├── CustomUserDetailsService.java
│           │   │   │   ├── JwtAuthenticationFilter.java
│           │   │   │   └── JwtTokenProvider.java
│           │   │   └── service/
│           │   │       ├── AnalyticsService.java
│           │   │       ├── AuthService.java
│           │   │       ├── DashboardService.java
│           │   │       ├── PortfolioService.java
│           │   │       ├── ProjectService.java
│           │   │       └── impl/
│           │   └── resources/
│           │       ├── application.yml
│           │       └── db/migration/
│           │           ├── V1__init_schema.sql
│           │           └── V2__seed_data.sql
│           └── test/
│               └── java/com/banking/portfolio/
│
├── frontend/                               # React SPA
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   ├── public/
│   │   └── _redirects                      # Netlify SPA routing
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── __tests__/
│       │   ├── LoginPage.test.tsx
│       │   └── ...
│       ├── components/
│       │   ├── layout/
│       │   │   ├── DashboardLayout.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   └── TopBar.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Card.tsx
│       │       ├── ConfirmDialog.tsx
│       │       ├── DataTable.tsx
│       │       ├── EmptyState.tsx
│       │       ├── ErrorState.tsx
│       │       ├── FilterSelect.tsx
│       │       ├── Input.tsx
│       │       ├── KPICard.tsx
│       │       ├── LoadingSkeleton.tsx
│       │       ├── LoadingSpinner.tsx
│       │       ├── Modal.tsx
│       │       ├── Pagination.tsx
│       │       ├── SearchInput.tsx
│       │       ├── Select.tsx
│       │       ├── StatusBadge.tsx
│       │       └── Textarea.tsx
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useDebounce.ts
│       │   └── usePagination.ts
│       ├── pages/
│       │   ├── LoginPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── AnalyticsPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── AdminUsersPage.tsx
│       │   ├── PortfolioListPage.tsx
│       │   ├── PortfolioDetailPage.tsx
│       │   ├── PortfolioFormPage.tsx
│       │   ├── ProjectListPage.tsx
│       │   ├── ProjectDetailPage.tsx
│       │   └── ProjectFormPage.tsx
│       ├── routes/
│       │   └── AppRoutes.tsx
│       ├── services/
│       │   └── api.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           └── formatters.ts
```

---

## Database Schema

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ username     │
│ email        │
│ password     │
│ full_name    │
│ role         │
│ enabled      │
│ created_at   │
│ updated_at   │
└──────┬───────┘
       │
       │  (one-to-many)
       ▼
┌──────────────────┐       ┌──────────────────┐
│   portfolios     │       │   audit_logs     │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │       │ id (PK)          │
│ name             │       │ user_id (FK)     │
│ description      │       │ action           │
│ owner            │       │ entity           │
│ status           │       │ entity_id        │
│ health           │       │ details          │
│ budget           │       │ ip_address       │
│ actual_cost      │       │ created_at       │
│ start_date       │       └──────────────────┘
│ end_date         │
│ completion_pct   │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │
         │  (one-to-many)
         ▼
┌──────────────────┐
│    projects      │
├──────────────────┤
│ id (PK)          │
│ portfolio_id(FK) │
│ name             │
│ description      │
│ project_manager  │
│ status           │
│ health           │
│ priority         │
│ budget           │
│ actual_cost      │
│ completion_pct   │
│ start_date       │
│ end_date         │
│ created_at       │
│ updated_at       │
└────────┬─────────┘
         │
         ├──▶ (one-to-many) ──▶ ┌────────────────┐
         │                      │ project_risks  │
         │                      ├────────────────┤
         │                      │ id (PK)        │
         │                      │ project_id(FK) │
         │                      │ title          │
         │                      │ description    │
         │                      │ severity       │
         │                      │ status         │
         │                      │ mitigation     │
         │                      │ created_at     │
         │                      └────────────────┘
         │
         └──▶ (one-to-many) ──▶ ┌──────────────────┐
                                │ project_updates  │
                                ├──────────────────┤
                                │ id (PK)          │
                                │ project_id (FK)  │
                                │ title            │
                                │ content          │
                                │ author           │
                                │ created_at       │
                                └──────────────────┘
```

**Key relationships:**
- `users` --< `audit_logs` (One-to-Many)
- `portfolios` --< `projects` (One-to-Many, cascade delete)
- `projects` --< `project_risks` (One-to-Many, cascade delete)
- `projects` --< `project_updates` (One-to-Many, cascade delete)

---

## Getting Started

### Prerequisites

- **Java 17+** (JDK)
- **Node.js 18+** and npm
- **Maven 3.9+** (or use included Maven wrapper)
- **PostgreSQL 16+** (or use Docker)
- **Docker & Docker Compose** (optional, recommended)

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/ramakdi99-cyber/Bank-Dashboard.git
cd Bank-Dashboard
docker-compose up -d
```

This starts:
1. PostgreSQL 16 with health checks and persistent data
2. Spring Boot backend on port 8080
3. React frontend via Nginx on port 3000

Access at: **http://localhost:3000**

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

### Option 2: Manual Setup

#### Database

```sql
CREATE DATABASE banking_portfolio;
CREATE USER bankadmin WITH PASSWORD 'bankpass123';
GRANT ALL PRIVILEGES ON DATABASE banking_portfolio TO bankadmin;
\c banking_portfolio
GRANT ALL ON SCHEMA public TO bankadmin;
```

> **Note:** The backend uses H2 in-memory database in the default `dev` profile, so no PostgreSQL setup is required for local development. Flyway migrations run automatically on startup.

#### Backend

```bash
cd banking-portfolio-management/backend
mvn clean package -DskipTests
java -jar target/portfolio-management-1.0.0.jar
```

Backend starts on **http://localhost:8080**.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server starts on **http://localhost:5173** with API proxy to the backend.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/banking_portfolio` |
| `DATABASE_USERNAME` | Database username | `bankadmin` |
| `DATABASE_PASSWORD` | Database password | `bankpass123` |
| `JWT_SECRET` | Secret key for JWT signing | (built-in default) |
| `SPRING_PROFILES_ACTIVE` | Spring profile (`dev` / `prod`) | `dev` |
| `VITE_API_URL` | Frontend API base URL | `http://localhost:8080/api` |

---

## Default Credentials

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `Ram123` | ADMIN | Full access — create, edit, delete, manage users |
| `ram` | `Ram123` | MANAGER | Portfolio & project management |
| `viewer` | `Ram123` | VIEWER | Read-only access to dashboards and reports |

---

## API Reference

All endpoints are prefixed with `/api`. JWT authentication is required for all endpoints except login and register. Include the token in the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `POST` | `/api/auth/register` | Register a new user | No |

### Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| `GET` | `/api/dashboard/summary` | KPI summary (totals, distributions) | Yes |
| `GET` | `/api/dashboard/analytics` | Dashboard analytics data | Yes |

### Portfolios

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/portfolios` | List portfolios (paginated, filterable) | All |
| `GET` | `/api/portfolios/{id}` | Get portfolio by ID | All |
| `POST` | `/api/portfolios` | Create new portfolio | ADMIN, MANAGER |
| `PUT` | `/api/portfolios/{id}` | Update portfolio | ADMIN |
| `DELETE` | `/api/portfolios/{id}` | Delete portfolio | ADMIN |

### Projects

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/projects` | List projects (paginated, filterable) | All |
| `GET` | `/api/projects/{id}` | Get project by ID | All |
| `POST` | `/api/projects` | Create new project | ADMIN, MANAGER |
| `PUT` | `/api/projects/{id}` | Update project | ADMIN, MANAGER |
| `DELETE` | `/api/projects/{id}` | Delete project | ADMIN |

### Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| `GET` | `/api/analytics` | Full analytics (all fields) | Yes |
| `GET` | `/api/analytics/projects` | Project-focused analytics | Yes |
| `GET` | `/api/analytics/portfolios` | Portfolio-focused analytics | Yes |
| `GET` | `/api/analytics/financial` | Financial metrics | Yes |

### Users

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/users` | List all users | ADMIN |
| `PUT` | `/api/users/{id}/role` | Update user role | ADMIN |
| `GET` | `/api/users/me` | Get current user profile | All |

---

## Features

### Authentication & Authorization
- Stateless JWT-based authentication with 24-hour token expiration
- BCrypt password hashing
- Three-tier role system: ADMIN, MANAGER, VIEWER
- Route-level and component-level access control
- Automatic 401 redirect handling

### Portfolio Management
- Full CRUD operations with status, health, budget, and completion tracking
- Health indicators: GREEN, AMBER, RED
- Status management: ACTIVE, ON_HOLD, COMPLETED, INACTIVE
- Search across name, description, and owner fields
- Filter by status with server-side pagination

### Project Management
- Full CRUD operations within portfolios
- Six status states: PLANNED, ACTIVE, ON_HOLD, COMPLETED, DELAYED, CANCELLED
- Priority levels: LOW, MEDIUM, HIGH, CRITICAL
- Risk tracking with severity and mitigation
- Project update history
- Filter by status, health, and priority

### Dashboard & KPIs
- Real-time KPI cards: total portfolios, projects, active, completed, delayed, at-risk
- Budget vs. actual cost comparison
- Project status and health distribution charts
- Portfolio performance horizontal bar chart
- Recent project updates feed

### Analytics
- Project analytics: status, priority, and health distributions (pie/bar charts)
- Portfolio analytics: performance comparison, budget utilization, status breakdown
- Financial analytics: total budget, spending, variance, utilization percentage
- Interactive Recharts visualizations

### Search, Filter & Pagination
- Global search with debounced input (300ms)
- Multi-field filtering across all list views
- Column-based sorting with ascending/descending toggle
- Server-side pagination with configurable page sizes

### Responsive Design
- Mobile-first responsive layout with Tailwind CSS
- Collapsible sidebar navigation
- Adaptive grid layouts for dashboards and tables

---

## Testing

### Backend Tests

```bash
cd banking-portfolio-management/backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test                        # Run tests in watch mode
npx vitest run                  # Run all tests once
npx vitest run --coverage       # Run with coverage
```

---

## Deployment

### Frontend (Netlify)

The frontend is deployed on Netlify with:
- SPA routing via `public/_redirects` (`/* /index.html 200`)
- Production API URL configured via `VITE_API_URL` environment variable
- Build command: `npm run build`
- Publish directory: `dist`

### Backend (Render)

The backend is deployed on Render:
- Production URL: `https://bank-dashboard-zj3l.onrender.com/api`
- Build command: `mvn clean package -DskipTests`
- Start command: `java -jar target/portfolio-management-1.0.0.jar`
- Environment: `SPRING_PROFILES_ACTIVE=prod`

### Docker Deployment

```bash
docker-compose up -d --build
```

---

## Troubleshooting

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# Linux/Mac
lsof -i :8080
kill -9 <process_id>
```

**Frontend build fails:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**TypeScript errors:**
```bash
cd frontend
npx tsc --noEmit
```

**Backend build fails:**
```bash
cd banking-portfolio-management/backend
mvn clean package -DskipTests
```

**Database connection issues:**
- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- In `dev` profile, H2 in-memory database is used automatically (no PostgreSQL needed)

**JWT authentication errors (401):**
- Ensure the JWT secret is at least 32 characters
- Check that the `Authorization: Bearer <token>` header is included
- Verify the token has not expired (24-hour default)

---

## License

MIT License.
