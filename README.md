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
# or use make apply_migration
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

### Automated Test Suite

**Run the complete JWT authentication test suite:**
```bash
# Make sure the backend is running first
cd infra && docker-compose up backend -d

# Run the automated tests
cd .. && ./tests/jwt.sh
```

The test suite includes:
- ✅ API health check
- ✅ User registration (valid/invalid cases)
- ✅ User login authentication
- ✅ JWT token validation
- ✅ Protected endpoint access
- ✅ User data retrieval
- ✅ API documentation accessibility

**Example output:**
```
🎉 All tests passed!
Total Tests: 15
Passed: 15
Failed: 0
JWT Authentication is working correctly.
```

### Manual API Testing with curl

**1. Health Check**
```bash
curl http://localhost:8000/
# Expected: {"ok": true}
```

**2. Create a new user**
```bash
curl -X POST "http://localhost:8000/users?email=test@example.com&password=testpassword123"
# Expected: {"id": 1, "email": "test@example.com", "created_at": "..."}
```

**3. Login to get JWT token**
```bash
curl -X POST "http://localhost:8000/login?email=test@example.com&password=testpassword123"
# Expected: {"access_token": "eyJ...", "token_type": "bearer", "user_id": 1, "email": "test@example.com"}
```

**4. Test protected endpoint**
```bash
TOKEN="your_jwt_token_here"
curl -X GET "http://localhost:8000/protected_test" \
  -H "Authorization: Bearer $TOKEN"
# Expected: {"ok": true, "message": "You are authorized...", "user_id": 1, "email": "test@example.com", "roles": null}
```

### API Testing with Python

Create a test script `test_api.py`:

```python
import requests
import json

BASE_URL = "http://localhost:8000"

# 1. Health check
response = requests.get(f"{BASE_URL}/")
print("Health check:", response.json())

# 2. Create user
user_data = {"email": "test@example.com", "password": "testpassword123"}
response = requests.post(f"{BASE_URL}/users", data=user_data)
print("Create user:", response.json())

# 3. Login
response = requests.post(f"{BASE_URL}/login", data=user_data)
token_data = response.json()
print("Login:", token_data)

# 4. Test protected endpoint
if "access_token" in token_data:
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    response = requests.get(f"{BASE_URL}/protected_test", headers=headers)
    print("Protected endpoint:", response.json())
else:
    print("Failed to get access token")
```

### Interactive API Documentation

Visit the auto-generated API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These interfaces allow you to:
- View all available endpoints
- See request/response schemas
- Test endpoints directly in your browser
- Try authentication flows

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
