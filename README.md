# Banking Project Portfolio Management Dashboard

A full-stack enterprise portfolio management application designed for banking institutions to track, manage, and analyze their project portfolios with real-time dashboards, analytics, and role-based access control.

## Overview

The Banking Portfolio Management Dashboard provides a centralized platform for managing multiple project portfolios across banking divisions. It features real-time KPI tracking, budget monitoring, health status visualization, risk management, and comprehensive analytics — all wrapped in a modern, responsive UI with role-based access for administrators, managers, and viewers.

## Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│                  │     │                  │     │                  │
│   React + Vite   │────▶│   Spring Boot    │────▶│   PostgreSQL 16  │
│   (Port 3000)    │     │   (Port 8080)    │     │   (Port 5432)    │
│                  │     │                  │     │                  │
│  • React Router  │     │  • REST API      │     │  • JPA/Hibernate │
│  • Recharts      │     │  • JWT Auth      │     │  • Flyway Migrate│
│  • Tailwind CSS  │     │  • Spring Security│     │  • Connection Pool│
│  • Axios         │     │  • Validation    │     │                  │
│                  │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

- **Frontend**: React 18 SPA with Vite bundler, Tailwind CSS for styling, Recharts for data visualization, and Axios for API communication.
- **Backend**: Spring Boot 3.2 REST API with Spring Security + JWT for stateless authentication, Spring Data JPA for persistence, and Bean Validation for input validation.
- **Database**: PostgreSQL 16 with Flyway for schema migrations, HikariCP connection pooling, and automatic data seeding.

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.3 | UI framework |
| Frontend | TypeScript | 5.5 | Type safety |
| Frontend | Vite | 5.3 | Build tool & dev server |
| Frontend | Tailwind CSS | 3.4 | Utility-first styling |
| Frontend | Recharts | 2.12 | Charting library |
| Frontend | React Router | 6.24 | Client-side routing |
| Frontend | Axios | 1.7 | HTTP client |
| Frontend | Zustand | 4.5 | State management |
| Frontend | Vitest | 1.6 | Unit testing |
| Frontend | React Testing Library | 16.0 | Component testing |
| Backend | Java | 17 | Runtime |
| Backend | Spring Boot | 3.2.5 | Application framework |
| Backend | Spring Security | 6.2 | Authentication & authorization |
| Backend | Spring Data JPA | 3.2 | Data access |
| Backend | Hibernate | 6.4 | ORM |
| Backend | JJWT | 0.12.3 | JWT token handling |
| Backend | Lombok | - | Boilerplate reduction |
| Backend | Maven | 3.9 | Build tool |
| Database | PostgreSQL | 16 | Primary database |
| Database | Flyway | - | Schema migrations |
| Testing | JUnit 5 | - | Unit & integration testing |
| Testing | Mockito | - | Mocking framework |
| Testing | H2 Database | - | Test database |
| DevOps | Docker | - | Containerization |
| DevOps | Docker Compose | - | Multi-service orchestration |
| DevOps | Nginx | - | Static file serving & reverse proxy |

## Project Structure

```
bank-project/
├── docker-compose.yml                    # Multi-service orchestration
├── README.md
│
├── backend/
│   ├── Dockerfile                        # Multi-stage Maven build
│   ├── pom.xml                           # Maven dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/bankportfolio/
│       │   │   ├── BankPortfolioApplication.java
│       │   │   ├── config/
│       │   │   │   ├── CorsConfig.java
│       │   │   │   └── DataInitializer.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── AnalyticsController.java
│       │   │   │   ├── DashboardController.java
│       │   │   │   ├── PortfolioController.java
│       │   │   │   ├── ProjectController.java
│       │   │   │   └── UserController.java
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java
│       │   │   │   ├── AuthResponse.java
│       │   │   │   ├── DashboardAnalytics.java
│       │   │   │   ├── DashboardSummary.java
│       │   │   │   ├── ErrorResponse.java
│       │   │   │   ├── FinancialAnalytics.java
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── PagedResponse.java
│       │   │   │   ├── PortfolioAnalytics.java
│       │   │   │   ├── PortfolioRequest.java
│       │   │   │   ├── PortfolioResponse.java
│       │   │   │   ├── PortfolioSummary.java
│       │   │   │   ├── ProjectAnalytics.java
│       │   │   │   ├── ProjectRequest.java
│       │   │   │   ├── ProjectResponse.java
│       │   │   │   ├── ProjectSummary.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   └── UserDTO.java
│       │   │   ├── entity/
│       │   │   │   ├── AuditLog.java
│       │   │   │   ├── Portfolio.java
│       │   │   │   ├── Project.java
│       │   │   │   ├── ProjectRisk.java
│       │   │   │   ├── ProjectUpdate.java
│       │   │   │   ├── Role.java
│       │   │   │   ├── User.java
│       │   │   │   └── enums/
│       │   │   │       ├── PortfolioHealth.java
│       │   │   │       ├── PortfolioStatus.java
│       │   │   │       ├── ProjectHealth.java
│       │   │   │       ├── ProjectPriority.java
│       │   │   │       ├── ProjectStatus.java
│       │   │   │       ├── RiskSeverity.java
│       │   │   │       ├── RiskStatus.java
│       │   │   │       └── RoleName.java
│       │   │   ├── exception/
│       │   │   │   ├── BadRequestException.java
│       │   │   │   ├── ConflictException.java
│       │   │   │   ├── ForbiddenException.java
│       │   │   │   ├── GlobalExceptionHandler.java
│       │   │   │   ├── ResourceNotFoundException.java
│       │   │   │   └── UnauthorizedException.java
│       │   │   ├── repository/
│       │   │   │   ├── AuditLogRepository.java
│       │   │   │   ├── PortfolioRepository.java
│       │   │   │   ├── ProjectRepository.java
│       │   │   │   ├── ProjectRiskRepository.java
│       │   │   │   ├── ProjectUpdateRepository.java
│       │   │   │   ├── RoleRepository.java
│       │   │   │   └── UserRepository.java
│       │   │   ├── security/
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   ├── JwtAuthenticationEntryPoint.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   └── SecurityConfig.java
│       │   │   └── service/
│       │   │       ├── AnalyticsService.java
│       │   │       ├── AuditService.java
│       │   │       ├── AuthService.java
│       │   │       ├── DashboardService.java
│       │   │       ├── PortfolioService.java
│       │   │       ├── ProjectService.java
│       │   │       └── UserService.java
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/
│       └── test/
│           ├── java/com/bankportfolio/
│           │   ├── controller/
│           │   │   ├── AuthControllerTest.java
│           │   │   ├── DashboardControllerTest.java
│           │   │   └── PortfolioControllerTest.java
│           │   └── service/
│           │       ├── AuthServiceTest.java
│           │       ├── PortfolioServiceTest.java
│           │       └── ProjectServiceTest.java
│           └── resources/
│               └── application-test.yml
│
├── frontend/
│   ├── Dockerfile                        # Multi-stage Node build
│   ├── nginx.conf                        # SPA serving & API proxy
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.config.ts                  # Test configuration
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── vite-env.d.ts
│       ├── __tests__/
│       │   ├── App.test.tsx
│       │   ├── LoginPage.test.tsx
│       │   ├── DashboardPage.test.tsx
│       │   ├── PortfolioListPage.test.tsx
│       │   └── ProjectListPage.test.tsx
│       ├── test/
│       │   └── setup.ts
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
│       │   ├── AdminUsersPage.tsx
│       │   ├── AnalyticsPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── PortfolioDetailPage.tsx
│       │   ├── PortfolioFormPage.tsx
│       │   ├── PortfolioListPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── ProjectDetailPage.tsx
│       │   ├── ProjectFormPage.tsx
│       │   └── ProjectListPage.tsx
│       ├── routes/
│       │   └── AppRoutes.tsx
│       ├── services/
│       │   └── api.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/
│           └── formatters.ts
```

## Database Design

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    roles     │       │    user_roles     │       │    users     │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ role_id (FK)     │       │ id (PK)      │
│ name         │       │ user_id (FK)     │──────▶│ username     │
│ description  │       └──────────────────┘       │ email        │
└──────────────┘                                  │ password     │
                                                  │ first_name   │
                                                  │ last_name    │
                                                  │ enabled      │
                                                  │ created_at   │
                                                  │ updated_at   │
                                                  └──────┬───────┘
                                                         │
┌──────────────────┐       ┌──────────────────┐          │
│   portfolios     │       │    projects       │          │
├──────────────────┤       ├──────────────────┤          │
│ id (PK)          │◄──────│ portfolio_id (FK)│          │
│ name             │       │ id (PK)          │          │
│ description      │       │ name             │          │
│ owner            │       │ description      │          │
│ status           │       │ project_manager  │          │
│ health           │       │ status           │          │
│ budget           │       │ health           │          │
│ actual_cost      │       │ priority         │          │
│ start_date       │       │ budget           │          │
│ end_date         │       │ actual_cost      │          │
│ completion_pct   │       │ completion_pct   │          │
│ created_at       │       │ start_date       │          │
│ updated_at       │       │ end_date         │          │
└──────────────────┘       │ created_at       │          │
                           │ updated_at       │          │
                           └────────┬─────────┘          │
                                    │                    │
                           ┌────────┴─────────┐          │
                           │                  │          │
                    ┌──────▼──────┐   ┌──────▼──────┐   │
                    │project_risks│   │project_updates│  │
                    ├─────────────┤   ├──────────────┤   │
                    │ id (PK)     │   │ id (PK)      │   │
                    │ project_id  │   │ project_id   │   │
                    │ title       │   │ title        │   │
                    │ description │   │ content      │   │
                    │ severity    │   │ author       │   │
                    │ status      │   │ created_at   │   │
                    │ mitigation  │   │ updated_at   │   │
                    │ created_at  │   └──────────────┘   │
                    │ updated_at  │                      │
                    └─────────────┘                      │
                                                         │
                           ┌──────────────────┐          │
                           │    audit_logs     │          │
                           ├──────────────────┤          │
                           │ id (PK)          │          │
                           │ user_id (FK)     │◄─────────┘
                           │ action           │
                           │ entity_name      │
                           │ entity_id        │
                           │ old_values       │
                           │ new_values       │
                           │ created_at       │
                           └──────────────────┘
```

**Relationships:**
- `users` ↔ `roles` (Many-to-Many via `user_roles`)
- `portfolios` → `projects` (One-to-Many)
- `projects` → `project_risks` (One-to-Many)
- `projects` → `project_updates` (One-to-Many)
- `users` → `audit_logs` (One-to-Many)

## Getting Started

### Prerequisites

- **Java 17+** (JDK or JRE)
- **Node.js 18+** and npm
- **PostgreSQL 16+** (or use Docker)
- **Maven 3.9+** (or use included Maven wrapper)
- **Docker & Docker Compose** (optional, recommended)

### Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `DB_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/banking_portfolio` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `myDefaultSecretKey...` |
| `JWT_EXPIRATION_MS` | JWT token expiration in ms | `86400000` (24h) |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000` |
| `SERVER_PORT` | Backend server port | `8080` |
| `SHOW_SQL` | Enable SQL logging | `false` |
| `FLYWAY_ENABLED` | Enable DB migrations | `true` |

### Option 1: Docker (Recommended)

```bash
# Clone the repository and navigate to the project root
docker-compose up -d
```

This will:
1. Start PostgreSQL 16 with health checks and persistent data
2. Build and start the Spring Boot backend (waits for DB to be healthy)
3. Build and start the React frontend via Nginx

Access the application at: **http://localhost:3000**

View logs:
```bash
docker-compose logs -f
```

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes (reset data):
```bash
docker-compose down -v
```

### Option 2: Manual Setup

#### Database Setup

```sql
-- Connect to PostgreSQL and create the database
CREATE DATABASE banking_portfolio;
CREATE USER bankadmin WITH PASSWORD 'bankpass123';
GRANT ALL PRIVILEGES ON DATABASE banking_portfolio TO bankadmin;

-- Connect to banking_portfolio and grant schema privileges
GRANT ALL ON SCHEMA public TO bankadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO bankadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO bankadmin;
```

#### Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**. On first run, Flyway applies migrations and the DataInitializer seeds test data.

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server starts on **http://localhost:5173** with API proxy to the backend.

### Build for Production

#### Frontend
```bash
cd frontend
npm run build
# Output in dist/
```

#### Backend
```bash
cd backend
mvn clean package -DskipTests
# Output JAR in target/
```

## Default Credentials

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `admin` | `admin123` | ADMIN | Full access — create, edit, delete, manage users |
| `manager` | `manager123` | MANAGER | Portfolio & project management, read-only admin |
| `viewer` | `viewer123` | VIEWER | Read-only access to dashboards and reports |

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `POST` | `/api/auth/login` | Authenticate user, returns JWT | No |
| `POST` | `/api/auth/register` | Register new user account | No |

### Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/api/dashboard/summary` | Get dashboard KPI summary | Yes |
| `GET` | `/api/dashboard/analytics` | Get dashboard analytics data | Yes |

### Portfolios

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/portfolios` | List all portfolios (paginated) | All |
| `GET` | `/api/portfolios/{id}` | Get portfolio by ID | All |
| `GET` | `/api/portfolios/search?query=` | Search portfolios | All |
| `GET` | `/api/portfolios/filter/status?status=` | Filter by status | All |
| `GET` | `/api/portfolios/filter/health?health=` | Filter by health | All |
| `GET` | `/api/portfolios/summaries` | Get portfolio summaries | All |
| `POST` | `/api/portfolios` | Create new portfolio | ADMIN, MANAGER |
| `PUT` | `/api/portfolios/{id}` | Update portfolio | ADMIN |
| `DELETE` | `/api/portfolios/{id}` | Delete portfolio | ADMIN |

### Projects

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/projects` | List all projects (paginated) | All |
| `GET` | `/api/projects/{id}` | Get project by ID | All |
| `GET` | `/api/projects/search?query=` | Search projects | All |
| `GET` | `/api/projects/portfolio/{id}` | Get projects by portfolio | All |
| `GET` | `/api/projects/filter/status?status=` | Filter by status | All |
| `GET` | `/api/projects/filter/health?health=` | Filter by health | All |
| `GET` | `/api/projects/filter/priority?priority=` | Filter by priority | All |
| `POST` | `/api/projects` | Create new project | ADMIN, MANAGER |
| `PUT` | `/api/projects/{id}` | Update project | ADMIN, MANAGER |
| `DELETE` | `/api/projects/{id}` | Delete project | ADMIN |

### Users

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/api/users` | List all users (admin) | ADMIN |
| `PUT` | `/api/users/{id}/role` | Update user role | ADMIN |
| `GET` | `/api/users/me` | Get current user profile | All |

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:-------------:|
| `GET` | `/api/analytics/projects` | Project analytics data | Yes |
| `GET` | `/api/analytics/portfolios` | Portfolio analytics data | Yes |
| `GET` | `/api/analytics/financial` | Financial analytics data | Yes |

## Features

### Authentication & Authorization
- Stateless JWT-based authentication with configurable token expiration
- BCrypt password hashing
- Three-tier role system: ADMIN, MANAGER, VIEWER
- Route-level and component-level access control
- Automatic token refresh and 401 redirect handling

### Portfolio Management
- Full CRUD operations for portfolios
- Portfolio health tracking (GREEN / AMBER / RED)
- Status management (ACTIVE / ON_HOLD / ARCHIVED)
- Budget and cost tracking with completion percentage
- Search across name, description, and owner fields
- Filter by status and health
- Pagination with configurable page sizes

### Project Management
- Full CRUD operations for projects within portfolios
- Status tracking (PLANNED / ACTIVE / ON_HOLD / COMPLETED / DELAYED / CANCELLED)
- Health monitoring (GREEN / AMBER / RED)
- Priority levels (LOW / MEDIUM / HIGH / CRITICAL)
- Budget tracking and cost variance analysis
- Risk management with severity levels
- Project update tracking and history
- Filter by status, health, and priority
- Search across name, description, and project manager

### Dashboard & KPIs
- Real-time KPI cards for key metrics
- Total portfolios, projects, active, completed, delayed, at-risk
- Budget vs. actual cost comparison
- Project status distribution pie chart
- Health distribution bar chart
- Portfolio performance horizontal bar chart
- Recent project updates feed

### Analytics
- Project analytics with status, priority, and health distributions
- Portfolio performance comparison
- Financial analytics with budget utilization and monthly spending trends
- Budget vs. actual cost visualization

### Search, Filter, Sort & Pagination
- Global search with debounced input
- Multi-field filtering across all list views
- Column-based sorting with ascending/descending toggle
- Server-side pagination with page navigation
- Configurable page sizes

### Audit Trail
- Automatic logging of all create, update, and delete operations
- Old/new value comparison for change tracking
- User attribution for all audit events

### Responsive Design
- Mobile-first responsive layout
- Collapsible sidebar navigation
- Adaptive grid layouts for dashboards and tables
- Touch-friendly interactions

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest
mvn test -Dtest=PortfolioServiceTest
mvn test -Dtest=ProjectServiceTest
mvn test -Dtest=DashboardControllerTest
mvn test -Dtest=PortfolioControllerTest
mvn test -Dtest=AuthControllerTest
```

**Test Types:**
- **Service Tests**: Unit tests using Mockito for mocking dependencies (`@ExtendWith(MockitoExtension.class)`)
- **Controller Tests**: Integration tests using MockMvc with Spring context (`@SpringBootTest` + `@AutoConfigureMockMvc`)
- **Test Database**: H2 in-memory database for fast test execution

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npx vitest run --coverage

# Run in watch mode
npm test
```

**Test Types:**
- **Component Tests**: Using React Testing Library + jsdom
- **API Mocking**: Using `vi.mock()` for isolating components from API layer
- **User Interaction**: Testing form submissions, navigation, and state changes

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill the process using the port
netstat -ano | findstr :8080
taskkill /PID <process_id> /F
```

**Database connection refused:**
- Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
- Check credentials match `application.yml` or environment variables
- Ensure the `banking_portfolio` database exists

**Frontend build fails:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Docker build fails:**
```bash
# Rebuild without cache
docker-compose build --no-cache

# Check Docker daemon is running
docker info
```

**JWT authentication errors (401):**
- Ensure the JWT secret is at least 32 characters
- Check that the `Authorization: Bearer <token>` header is included
- Verify the token has not expired

**Flyway migration errors:**
- Ensure the database is empty or consistent with existing migrations
- For development reset: `DROP DATABASE banking_portfolio; CREATE DATABASE banking_portfolio;`

**CORS errors in development:**
- Verify `CORS_ORIGINS` includes `http://localhost:5173` for Vite dev server
- The backend proxy in `vite.config.ts` should handle this automatically

### Health Checks

```bash
# Check backend health
curl http://localhost:8080/api/dashboard/summary -H "Authorization: Bearer <token>"

# Check frontend
curl http://localhost:3000

# Check database
psql -h localhost -U bankadmin -d banking_portfolio -c "SELECT count(*) FROM users;"
```

## License

MIT License. See [LICENSE](LICENSE) for details.
