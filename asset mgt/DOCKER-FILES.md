# 🐳 Docker Files Overview

This document provides an overview of all Docker-related files created for the Asset Management System.

## 📁 Files Created

### Docker Configuration Files

1. **docker-compose.yml**
   - Production deployment configuration
   - Services: PostgreSQL, Backend, Frontend
   - Includes health checks and resource limits
   - Path: `/docker-compose.yml`

2. **docker-compose.dev.yml**
   - Development deployment configuration
   - Includes hot reload for backend and frontend
   - Additional services: pgAdmin
   - Debug ports exposed
   - Path: `/docker-compose.dev.yml`

### Backend Docker Files

3. **asset-mgt-be/Dockerfile**
   - Production Docker image for NestJS backend
   - Multi-stage build for optimization
   - Base image: `node:22-alpine`
   - Final size: ~300MB
   - Path: `/asset-mgt-be/Dockerfile`

4. **asset-mgt-be/Dockerfile.dev**
   - Development Docker image for backend
   - Includes all dev dependencies
   - Hot reload enabled
   - Debug port exposed (9229)
   - Path: `/asset-mgt-be/Dockerfile.dev`

5. **asset-mgt-be/.dockerignore**
   - Excludes unnecessary files from Docker build
   - Reduces build context size
   - Path: `/asset-mgt-be/.dockerignore`

### Frontend Docker Files

6. **asset-mgt-fe/frontend/Dockerfile**
   - Production Docker image for Vue.js frontend
   - Multi-stage build with Nginx
   - Base image: `nginx:alpine`
   - Final size: ~50MB
   - Path: `/asset-mgt-fe/frontend/Dockerfile`

7. **asset-mgt-fe/frontend/Dockerfile.dev**
   - Development Docker image for frontend
   - Vite dev server with hot reload
   - Path: `/asset-mgt-fe/frontend/Dockerfile.dev`

8. **asset-mgt-fe/frontend/nginx.conf**
   - Nginx configuration for production
   - Gzip compression
   - Security headers
   - API proxy configuration
   - SPA routing support
   - Path: `/asset-mgt-fe/frontend/nginx.conf`

9. **asset-mgt-fe/frontend/.dockerignore**
   - Excludes unnecessary files from Docker build
   - Path: `/asset-mgt-fe/frontend/.dockerignore`

### Environment & Configuration

10. **env.example**
    - Example environment variables file
    - Template for production configuration
    - Path: `/env.example`

11. **.env.dev.example** (blocked by gitignore, use env.example)
    - Example environment for development
    - Includes pgAdmin credentials
    - Path: `/env.example`

### Scripts

12. **start.sh**
    - Interactive startup script
    - Guided deployment process
    - Service management menu
    - Database operations
    - Path: `/start.sh`
    - Executable: ✓

13. **check-health.sh**
    - Health check script for all services
    - Tests endpoints and connectivity
    - Shows resource usage
    - Path: `/check-health.sh`
    - Executable: ✓

### Documentation

14. **README.md** (Updated)
    - Main documentation
    - Quick start guide
    - Features and architecture overview
    - Path: `/README.md`

15. **DOCKER.md**
    - Comprehensive Docker documentation
    - Detailed deployment instructions
    - Troubleshooting guide
    - Production deployment best practices
    - Path: `/DOCKER.md`

16. **QUICKSTART.md**
    - 5-minute quick start guide
    - Essential commands
    - Basic troubleshooting
    - Path: `/QUICKSTART.md`

17. **DOCKER-FILES.md**
    - This file
    - Overview of all Docker files
    - Path: `/DOCKER-FILES.md`

## 🗂️ File Structure

```
asset mgt/
├── docker-compose.yml              # Production deployment
├── docker-compose.dev.yml          # Development deployment
├── env.example                     # Environment template
├── start.sh                        # Startup script
├── check-health.sh                 # Health check script
├── README.md                       # Main documentation
├── DOCKER.md                       # Docker guide
├── QUICKSTART.md                   # Quick start
├── DOCKER-FILES.md                 # This file
│
├── asset-mgt-be/
│   ├── Dockerfile                  # Production backend image
│   ├── Dockerfile.dev              # Development backend image
│   └── .dockerignore               # Docker ignore rules
│
└── asset-mgt-fe/frontend/
    ├── Dockerfile                  # Production frontend image
    ├── Dockerfile.dev              # Development frontend image
    ├── nginx.conf                  # Nginx configuration
    └── .dockerignore               # Docker ignore rules
```

## 🎯 Quick Reference

### Start Application

```bash
# Using script (recommended)
./start.sh

# Manual - Production
docker-compose up -d

# Manual - Development
docker-compose -f docker-compose.dev.yml up -d
```

### Check Health

```bash
./check-health.sh
```

### View Logs

```bash
docker-compose logs -f
```

### Stop Services

```bash
docker-compose down
```

## 📊 Docker Images

| Service | Production Image | Size | Development Image | Size |
|---------|------------------|------|-------------------|------|
| Backend | node:22-alpine + build | ~300MB | node:22-alpine | ~800MB |
| Frontend | nginx:alpine + static | ~50MB | node:22-alpine + Vite | ~700MB |
| Database | postgres:16-alpine | ~150MB | postgres:16-alpine | ~150MB |

## 🔒 Security Features

### Production Images
- Non-root user execution
- Multi-stage builds (smaller attack surface)
- Minimal base images (Alpine Linux)
- Health checks enabled
- Resource limits configured
- Security headers (Helmet.js, Nginx)

### Development Images
- Includes dev dependencies
- Debug ports exposed
- Hot reload enabled
- pgAdmin for database management

## 🚀 Deployment Modes

### Production Mode
- Optimized Docker images
- No dev dependencies
- Static asset serving with Nginx
- Health checks active
- Production environment variables
- **Command**: `docker-compose up -d`

### Development Mode
- Full dev dependencies
- Hot module replacement
- Source code mounted as volumes
- Debug ports exposed
- pgAdmin included
- Development environment variables
- **Command**: `docker-compose -f docker-compose.dev.yml up -d`

## 📦 Volumes

| Volume | Purpose | Production | Development |
|--------|---------|------------|-------------|
| postgres_data | Database persistence | ✓ | postgres_data_dev |
| backend_uploads | File uploads | ✓ | backend_uploads_dev |
| backend_node_modules | Backend dependencies | - | ✓ |
| frontend_node_modules | Frontend dependencies | - | ✓ |
| pgadmin_data | pgAdmin config | - | ✓ |

## 🌐 Networks

| Network | Purpose | Services |
|---------|---------|----------|
| asset-mgt-network | Production | postgres, backend, frontend |
| asset-mgt-network-dev | Development | postgres, backend, frontend, pgadmin |

## 🔌 Ports

### Production
| Service | Internal Port | External Port |
|---------|--------------|---------------|
| Frontend | 8080 | 8080 |
| Backend | 3000 | 3000 |
| PostgreSQL | 5432 | 5432 |

### Development
| Service | Internal Port | External Port |
|---------|--------------|---------------|
| Frontend | 5173 | 5173 |
| Backend | 3000 | 3000 |
| Backend Debug | 9229 | 9229 |
| PostgreSQL | 5432 | 5432 |
| pgAdmin | 80 | 5050 |

## ✅ Health Checks

All services include health checks:

- **Backend**: HTTP GET to `/api`
- **Frontend**: HTTP GET to `/health`
- **PostgreSQL**: `pg_isready` command

Health check parameters:
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3
- Start period: 20-60 seconds

## 🛠️ Maintenance Commands

```bash
# Rebuild images
docker-compose build --no-cache

# View service status
docker-compose ps

# Restart service
docker-compose restart backend

# View resource usage
docker stats

# Clean up
docker system prune -a
```

## 📝 Notes

1. **Environment Variables**: Always configure `.env` before deployment
2. **Secrets**: Never commit `.env` or sensitive data to version control
3. **Ports**: Ensure ports are not already in use
4. **Resources**: Allocate sufficient RAM and disk space
5. **Backups**: Regular database backups recommended
6. **Updates**: Pull latest images regularly for security updates

## 🆘 Support

For issues or questions:
1. Check [DOCKER.md](DOCKER.md) for detailed troubleshooting
2. Run `./check-health.sh` to diagnose issues
3. View logs: `docker-compose logs -f`
4. Check service status: `docker-compose ps`

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [NestJS Docker](https://docs.nestjs.com/recipes/terminus)
- [Vue.js Deployment](https://vuejs.org/guide/best-practices/production-deployment.html)

