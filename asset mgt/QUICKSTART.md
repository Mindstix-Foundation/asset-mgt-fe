# 🚀 Quick Start Guide

Get the Asset Management System running in 5 minutes!

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed
- 4GB RAM available
- 10GB disk space available

## Steps

### 1. Configure Environment

```bash
# Copy environment example
cp env.example .env

# Generate secure secrets
openssl rand -base64 32  # Copy this for JWT_SECRET
openssl rand -base64 32  # Copy this for JWT_REFRESH_SECRET

# Edit .env file
nano .env
```

**Required changes in `.env`:**
```env
DB_PASSWORD=your-secure-password-here
JWT_SECRET=paste-generated-secret-here
JWT_REFRESH_SECRET=paste-generated-secret-here
```

### 2. Start Services

**Option A: Using startup script (Recommended)**
```bash
chmod +x start.sh
./start.sh
```
Then select option 1 (Production) or 2 (Development)

**Option B: Manual start**
```bash
# Production
docker-compose up -d

# Development (with hot reload)
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Wait for Services

The services will take 30-60 seconds to start and run migrations.

Check status:
```bash
docker-compose ps
```

All services should show `healthy` status.

### 4. Access Application

**Production:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- API Docs: http://localhost:3000/api/docs

**Development:**
- Frontend: http://localhost:5173 (hot reload)
- Backend API: http://localhost:3000/api (hot reload)
- API Docs: http://localhost:3000/api/docs
- pgAdmin: http://localhost:5050

### 5. Login

Use the default admin credentials (check seed scripts in `asset-mgt-be/prisma/seeds/01-clean-and-admin.seed.ts`).

**⚠️ Important:** Change the default password immediately!

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild
docker-compose up -d --build
```

## Troubleshooting

### Port Already in Use

Change ports in `.env`:
```env
FRONTEND_PORT=8081
BACKEND_PORT=3001
```

### Database Connection Failed

Check database is running:
```bash
docker-compose logs postgres
docker-compose ps
```

### Service Not Healthy

Wait a bit longer, or check logs:
```bash
docker-compose logs -f backend
```

## Next Steps

- Read [DOCKER.md](DOCKER.md) for detailed documentation
- Configure email settings in `.env` (optional)
- Set up backups
- Review security settings

## Need Help?

- Check [DOCKER.md](DOCKER.md) for detailed troubleshooting
- View logs: `docker-compose logs -f`
- Check service status: `docker-compose ps`

