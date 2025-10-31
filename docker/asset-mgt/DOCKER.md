# 🐳 Docker Deployment Guide

Complete guide for deploying the Asset Management System using Docker.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deployment Modes](#deployment-modes)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## Prerequisites

### Required Software

- **Docker Engine**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

### System Requirements

- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 10GB free
- **OS**: Linux, macOS, or Windows with WSL2

### Install Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install --cask docker
```

**Windows:**
Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Verify Installation

```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### Method 1: Using the Startup Script (Recommended)

```bash
# Make script executable
chmod +x start.sh

# Run the startup script
./start.sh
```

The script will guide you through:
1. Creating `.env` file if it doesn't exist
2. Choosing deployment mode
3. Starting services
4. Viewing logs and managing the application

### Method 2: Manual Setup

```bash
# 1. Copy environment file
cp env.example .env

# 2. Edit configuration (IMPORTANT!)
nano .env
# Update: DB_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET

# 3. Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET

# 4. Start services
docker-compose up -d

# 5. View logs
docker-compose logs -f
```

### First Time Setup

After starting services for the first time:

1. **Wait for services to be healthy** (~30-60 seconds)
2. **Access the application**: http://localhost:8080
3. **Login with default admin credentials** (check seed scripts)
4. **Change default password immediately!**

## 🔧 Deployment Modes

### Production Mode (docker-compose.yml)

**Features:**
- Optimized builds with multi-stage Docker
- Nginx serving static files
- Production-ready configuration
- Health checks and restarts
- Minimal resource usage

**Start:**
```bash
docker-compose up -d --build
```

**Access:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- API Docs: http://localhost:3000/api/docs

### Development Mode (docker-compose.dev.yml)

**Features:**
- Hot reload for backend and frontend
- Debug ports exposed
- Source code mounted as volumes
- pgAdmin for database management
- Development dependencies included

**Start:**
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

**Access:**
- Frontend: http://localhost:5173 (with hot reload)
- Backend API: http://localhost:3000/api (with hot reload)
- API Docs: http://localhost:3000/api/docs
- pgAdmin: http://localhost:5050 (admin@trackstix.com / admin)

**Debug Backend:**
```bash
# Backend runs on debug port 9229
# Connect your debugger to: localhost:9229
```

## ⚙️ Configuration

### Environment Variables

**Critical Variables (Must Change for Production):**

```env
# Database
DB_PASSWORD=your-secure-password-here

# JWT Secrets (32+ characters each)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
```

**Optional Variables:**

```env
# Ports
BACKEND_PORT=3000
FRONTEND_PORT=8080
DB_PORT=5432

# JWT Expiration
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Email (for password reset, notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Generate Secure Secrets

```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Port Configuration

To change default ports, update `.env`:

```env
FRONTEND_PORT=8080  # Frontend will be available on this port
BACKEND_PORT=3000   # Backend API will be available on this port
DB_PORT=5432        # PostgreSQL will be available on this port
```

Then restart services:
```bash
docker-compose down
docker-compose up -d
```

## 🏗️ Architecture

### Services Overview

```
┌─────────────────────────────────────────────────────┐
│                   Docker Network                     │
│                                                      │
│  ┌──────────────┐    ┌──────────────┐             │
│  │   Frontend   │◄──►│   Backend    │             │
│  │   (Nginx)    │    │   (NestJS)   │             │
│  │   Port 8080  │    │   Port 3000  │             │
│  └──────────────┘    └──────┬───────┘             │
│                              │                      │
│                              ▼                      │
│                      ┌──────────────┐              │
│                      │  PostgreSQL  │              │
│                      │  Port 5432   │              │
│                      └──────────────┘              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Docker Images

1. **Backend (asset-mgt-backend)**
   - Base: `node:22-alpine`
   - Multi-stage build
   - Production: ~300MB
   - Development: ~800MB (includes dev deps)

2. **Frontend (asset-mgt-frontend)**
   - Base: `nginx:alpine`
   - Static files served by Nginx
   - Production: ~50MB
   - Development: `node:22-alpine` with Vite

3. **Database (postgres)**
   - Image: `postgres:16-alpine`
   - Size: ~150MB
   - Persistent volume for data

### Volumes

```bash
# List volumes
docker volume ls | grep asset-mgt

# Inspect volume
docker volume inspect asset-mgt_postgres_data

# Backup volume
docker run --rm -v asset-mgt_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

### Networks

```bash
# List networks
docker network ls | grep asset-mgt

# Inspect network
docker network inspect asset-mgt_asset-mgt-network

# Test connectivity
docker-compose exec backend ping postgres
docker-compose exec frontend ping backend
```

## 📝 Common Commands

### Service Management

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Stop all services
docker-compose down

# Stop without removing containers
docker-compose stop

# Restart service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend

# Scale service (for load balancing)
docker-compose up -d --scale backend=3
```

### Logs and Monitoring

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend

# Logs since timestamp
docker-compose logs --since 2024-01-01T10:00:00 backend

# Monitor resource usage
docker stats

# Check service health
docker-compose ps
```

### Container Access

```bash
# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh

# Access database shell
docker-compose exec postgres psql -U postgres -d asset_management

# Run command in container
docker-compose exec backend npm run db:seed

# Copy files from container
docker cp asset-mgt-backend:/app/uploads ./local-uploads

# Copy files to container
docker cp ./local-file.txt asset-mgt-backend:/app/
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Run seeds
docker-compose exec backend npm run db:seed

# Database backup
docker-compose exec -T postgres pg_dump -U postgres asset_management > backup.sql

# Database restore
docker-compose exec -T postgres psql -U postgres asset_management < backup.sql

# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d asset_management

# Reset database (⚠️ DESTRUCTIVE)
docker-compose exec backend npx prisma migrate reset
```

### Cleanup and Maintenance

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes (⚠️ CAREFUL)
docker volume prune

# Remove unused networks
docker network prune

# Complete cleanup (⚠️ VERY DESTRUCTIVE)
docker system prune -a --volumes

# Free up space (safe)
docker image prune -a --filter "until=24h"
```

## 🔍 Troubleshooting

### Service Won't Start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

**Check container status:**
```bash
docker-compose ps
```

**Common issues:**

1. **Port already in use:**
```bash
# Find process using port
lsof -i :3000
lsof -i :8080

# Change port in .env
BACKEND_PORT=3001
FRONTEND_PORT=8081
```

2. **Database connection failed:**
```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify credentials
docker-compose exec postgres psql -U postgres -d asset_management
```

3. **Migration errors:**
```bash
# Check migration status
docker-compose exec backend npx prisma migrate status

# Force reset (⚠️ deletes data)
docker-compose exec backend npx prisma migrate reset
```

### Performance Issues

**Check resource usage:**
```bash
docker stats
```

**Increase memory limits:**
```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

**Clear Docker cache:**
```bash
docker system prune -a
docker builder prune
```

### Network Issues

**Test connectivity:**
```bash
# From backend to database
docker-compose exec backend ping postgres

# From frontend to backend
docker-compose exec frontend ping backend

# Check DNS resolution
docker-compose exec backend nslookup postgres
```

**Reset network:**
```bash
docker-compose down
docker network rm asset-mgt_asset-mgt-network
docker-compose up -d
```

### Frontend Issues

**Nginx not serving files:**
```bash
# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Check static files exist
docker-compose exec frontend ls -la /usr/share/nginx/html

# Reload nginx
docker-compose exec frontend nginx -s reload
```

**API calls failing:**
```bash
# Check VITE_API_BASE_URL in .env
echo $VITE_API_BASE_URL

# Verify backend is accessible
curl http://localhost:3000/api

# Check CORS configuration in backend
docker-compose logs backend | grep CORS
```

### Backend Issues

**Prisma errors:**
```bash
# Regenerate Prisma Client
docker-compose exec backend npx prisma generate

# Check database connection
docker-compose exec backend npx prisma db pull

# View schema
docker-compose exec backend npx prisma studio
```

**Module not found:**
```bash
# Rebuild with fresh dependencies
docker-compose down
docker-compose up -d --build --force-recreate backend
```

## 🚀 Production Deployment

### Pre-Production Checklist

- [ ] Update all passwords and secrets in `.env`
- [ ] Configure email settings (SMTP)
- [ ] Set `NODE_ENV=production`
- [ ] Configure SSL/HTTPS
- [ ] Set up firewall rules
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts
- [ ] Review CORS settings
- [ ] Enable rate limiting
- [ ] Configure logging

### Recommended Production Setup

1. **Use strong secrets:**
```bash
# Generate strong secrets
openssl rand -base64 48
```

2. **Limit exposed ports:**
```yaml
# Only expose necessary ports
# Remove database port exposure
```

3. **Add health checks:**
Already included in docker-compose.yml

4. **Set resource limits:**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
```

5. **Enable SSL (using nginx):**
```bash
# Generate SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Update nginx configuration to use SSL
# See nginx.conf example in repository
```

6. **Automated backups:**
```bash
# Add to crontab
0 2 * * * cd /path/to/app && docker-compose exec -T postgres pg_dump -U postgres asset_management > backups/db_$(date +\%Y\%m\%d).sql
```

7. **Monitoring:**
```yaml
# Add monitoring services to docker-compose.yml
# Examples: Prometheus, Grafana, ELK Stack
```

### Environment-Specific Configurations

**Development:**
```env
NODE_ENV=development
JWT_EXPIRATION=1h
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3000/api
```

**Staging:**
```env
NODE_ENV=staging
JWT_EXPIRATION=30m
FRONTEND_URL=https://staging.your-domain.com
VITE_API_BASE_URL=/api
```

**Production:**
```env
NODE_ENV=production
JWT_EXPIRATION=15m
FRONTEND_URL=https://your-domain.com
VITE_API_BASE_URL=/api
```

### Deployment Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Backup database
docker-compose exec -T postgres pg_dump -U postgres asset_management > backup_pre_deploy.sql

# 3. Stop services
docker-compose down

# 4. Rebuild images
docker-compose build --no-cache

# 5. Start services
docker-compose up -d

# 6. Run migrations
docker-compose exec backend npx prisma migrate deploy

# 7. Verify health
docker-compose ps
curl http://localhost:3000/api
curl http://localhost:8080

# 8. Monitor logs
docker-compose logs -f --tail=100
```

### High Availability Setup

For production with high availability:

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
```

Deploy with:
```bash
docker stack deploy -c docker-compose.prod.yml asset-mgt
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Best Practices](https://docs.nestjs.com/techniques/configuration)
- [Vue.js Deployment](https://vuejs.org/guide/best-practices/production-deployment.html)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Nginx Configuration](https://nginx.org/en/docs/)

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub Issues
4. Contact support team

## 📄 License

[Your License Information]

