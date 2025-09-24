# Mini LIMS

A lightweight Laboratory Information Management System (LIMS) built with modern web technologies.

## 🏗️ Architecture

Mini LIMS is a containerized application with the following components:

- **Backend**: FastAPI (Python) - RESTful API server
- **Database**: PostgreSQL - Data persistence layer
- **Database Migrations**: Alembic - Schema version control
- **Frontend**: (To be implemented) - Javascript framework
- **Infrastructure**: Docker Compose - Container orchestration

## 📋 Prerequisites

- Docker & Docker Compose
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-lims
   ```

2. **Set up environment variables**
   ```bash
   cd infra
   cp .env.example .env
   # Edit .env if needed - default values should work for development
   ```

3. **Start the application**
   ```bash
   cd infra
   make up
   # Runs `docker-compose up -d` under the hood to start all services
   ```

4. **Verify the setup**
   ```bash
   cd infra
   make status
   # Check if all services are running and displays some extra info
   ```

## 🧰 Database

### Database Management

**Create a new migration:**
```bash
cd infra
docker-compose run --rm alembic alembic revision --autogenerate -m "Description of changes"
```

**Apply migrations:**
```bash
docker-compose run --rm alembic alembic upgrade head
```

**Check migration status:**
```bash
docker-compose run --rm alembic alembic current
docker-compose run --rm alembic alembic history
```

**Rollback to previous migration:**
```bash
docker-compose run --rm alembic alembic downgrade -1
```

### Database Access

**Connect to PostgreSQL:**
```bash
docker-compose exec database psql -U mini_lims -d mini_lims
```

**Common SQL commands:**
```sql
-- List all tables
\dt

-- Describe table structure
\d table_name

-- View table data
SELECT * FROM users;
```

## 🌐 API Endpoints

The API server runs on `http://localhost:8000`

### Available Endpoints

- `GET /` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## 🧪 Testing

TODO: Testing instructions will be added here once tests are implemented.

## 🛠️ Environment Variables

Key environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `mini_lims` |
| `POSTGRES_PASSWORD` | Database password | `mini_lims` |
| `POSTGRES_DB` | Database name | `mini_lims` |
| `POSTGRES_PORT` | Database port | `5432` |
| `DATABASE_URL` | Full database connection string | Auto-generated |

## 🚧 Roadmap

- [ ] Create frontend application
- [ ] Implement user permissions, and management
- [ ] Add sample and experiment management
- [ ] Add API tests
- [ ] Implement file upload/storage
- [ ] Add reporting features
- [ ] Create user documentation
- [ ] Implement customer authentication with sample assignment
- [ ] Add notifications (email/SMS)
- [ ] Add admin dashboard with analytics & data visualizations

---

Made with ❤️ by Harmonie
