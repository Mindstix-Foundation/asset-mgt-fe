# 🏢 Asset Management System (TrackStix)

A comprehensive asset management system for tracking, managing, and maintaining organizational assets.

## 📖 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Docker Deployment Guide](DOCKER.md)** - Complete Docker documentation
- **[Backend README](asset-mgt-be/README.md)** - Backend API documentation
- **[Frontend README](asset-mgt-fe/frontend/README.md)** - Frontend application documentation

## 🚀 Quick Start (Docker)

### Using Startup Script (Recommended)

```bash
# Make script executable
chmod +x start.sh

# Run the startup script
./start.sh
```

The interactive script will guide you through configuration and deployment.

### Manual Setup

**1. Configure Environment Variables**

```bash
# Copy environment file
cp env.example .env

# Generate secure secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET

# Edit .env and update:
# - DB_PASSWORD
# - JWT_SECRET
# - JWT_REFRESH_SECRET
# - Email settings (optional)
nano .env
```

**2. Start Services**

```bash
# Production mode
docker-compose up -d --build

# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up -d --build
```

**3. Access the Application**

**Production:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- API Documentation: http://localhost:3000/api/docs

**Development:**
- Frontend: http://localhost:5173 (with hot reload)
- Backend API: http://localhost:3000/api
- pgAdmin: http://localhost:5050

## 🎯 Features

### Core Functionality
- **Asset Management**: Track all organizational assets with detailed information
- **Employee Management**: Manage employees and their asset assignments
- **Asset Assignment**: Issue and collect assets with complete audit trail
- **Maintenance Scheduling**: Schedule and track preventive and corrective maintenance
- **Vendor Management**: Manage asset vendors and suppliers
- **Category Management**: Organize assets by categories, types, brands, and models
- **Reporting**: Generate comprehensive reports and export data
- **Asset History**: Complete audit trail and timeline for each asset
- **Notifications**: Email notifications for maintenance and important events
- **Bulk Operations**: Bulk upload for assets, employees, and vendors

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and user roles
- **Password Management**: Secure password hashing and reset functionality
- **Session Management**: Secure session handling with refresh tokens
- **CORS Protection**: Configured CORS policies
- **Security Headers**: Helmet.js for HTTP security headers

### Technical Features
- **RESTful API**: Well-documented API with OpenAPI/Swagger
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live notifications and updates
- **Data Export**: Export to Excel, CSV, and PDF
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination
- **Hot Reload**: Development mode with instant updates

## 🏗️ Architecture

### Technology Stack

**Backend:**
- NestJS (Node.js framework)
- PostgreSQL (Database)
- Prisma ORM
- JWT for authentication
- TypeScript

**Frontend:**
- Vue.js 3
- TypeScript
- Bootstrap 5
- Axios
- Pinia (State Management)

**Infrastructure:**
- Docker & Docker Compose
- Nginx (Production web server)
- Multi-stage Docker builds

### Project Structure

```
asset mgt/
├── asset-mgt-be/          # Backend API (NestJS)
│   ├── src/               # Source code
│   ├── prisma/            # Database schema & migrations
│   ├── Dockerfile         # Production Docker image
│   └── Dockerfile.dev     # Development Docker image
│
├── asset-mgt-fe/          # Frontend Application
│   └── frontend/          # Vue.js app
│       ├── src/           # Source code
│       ├── Dockerfile     # Production Docker image
│       ├── Dockerfile.dev # Development Docker image
│       └── nginx.conf     # Nginx configuration
│
├── docker-compose.yml     # Production deployment
├── docker-compose.dev.yml # Development deployment
├── start.sh              # Interactive startup script
├── QUICKSTART.md         # Quick start guide
├── DOCKER.md             # Detailed Docker documentation
└── README.md             # This file
```

## 📋 Default Credentials

After first deployment, use these credentials:
- **Username**: Check seed script in `asset-mgt-be/prisma/seeds/01-clean-and-admin.seed.ts`
- **Password**: Check seed script

**⚠️ Important**: Change default password immediately after first login!

## 🔧 Configuration

### Environment Variables

Key environment variables in `.env`:

```env
# Database
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=asset_management

# Backend
BACKEND_PORT=3000
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# Frontend
FRONTEND_PORT=8080
VITE_API_BASE_URL=/api

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Port Configuration

Default ports:
- Frontend: 8080
- Backend: 3000
- Database: 5432

To change ports, update the corresponding variables in `.env`:

```env
FRONTEND_PORT=8080
BACKEND_PORT=3000
DB_PORT=5432
```

## 📦 Docker Services

The application consists of three main services:

### 1. PostgreSQL Database (`postgres`)
- Image: `postgres:16-alpine`
- Stores all application data
- Persistent volume: `postgres_data`

### 2. Backend API (`backend`)
- Built from `asset-mgt-be/Dockerfile`
- NestJS application
- Handles all business logic and API endpoints
- Persistent volume: `backend_uploads` (for file uploads)

### 3. Frontend (`frontend`)
- Built from `asset-mgt-fe/frontend/Dockerfile`
- Vue.js application served by Nginx
- Provides the user interface

## 🔨 Common Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d backend

# Start with build (rebuild images)
docker-compose up -d --build
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes all data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Service Management

```bash
# Check service status
docker-compose ps

# Restart service
docker-compose restart backend

# Rebuild and restart service
docker-compose up -d --build backend
```

### Database Operations

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d asset_management

# Run database migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma Client
docker-compose exec backend npx prisma generate

# Run database seeds
docker-compose exec backend npm run db:seed

# Database backup
docker-compose exec postgres pg_dump -U postgres asset_management > backup.sql

# Database restore
docker-compose exec -T postgres psql -U postgres asset_management < backup.sql
```

### Container Access

```bash
# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh

# Access database shell
docker-compose exec postgres sh
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run any new migrations
docker-compose exec backend npx prisma migrate deploy
```

### Update Docker Images

```bash
# Pull latest base images
docker-compose pull

# Rebuild with latest images
docker-compose up -d --build
```

### Clear Docker Cache

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune

# Clean everything (⚠️ use with caution)
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs for errors
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Check service health
docker-compose ps

# Restart problematic service
docker-compose restart backend
```

### Database Connection Issues

```bash
# Check database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Verify database credentials in .env
cat .env | grep DB_

# Test database connection
docker-compose exec postgres psql -U postgres -d asset_management -c "SELECT 1"
```

### Backend API Issues

```bash
# Check backend logs
docker-compose logs -f backend

# Verify environment variables
docker-compose exec backend env | grep -E "DATABASE_URL|JWT_SECRET|PORT"

# Restart backend
docker-compose restart backend

# Check API health
curl http://localhost:3000/api
```

### Frontend Issues

```bash
# Check frontend logs
docker-compose logs -f frontend

# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Restart frontend
docker-compose restart frontend

# Check if frontend is accessible
curl http://localhost:8080
```

### Port Conflicts

If ports are already in use:

```bash
# Find process using port
lsof -i :3000
lsof -i :8080

# Change port in .env
FRONTEND_PORT=8081
BACKEND_PORT=3001

# Restart services
docker-compose down
docker-compose up -d
```

### Database Migration Issues

```bash
# Check migration status
docker-compose exec backend npx prisma migrate status

# Reset database (⚠️ deletes all data)
docker-compose exec backend npx prisma migrate reset

# Apply pending migrations
docker-compose exec backend npx prisma migrate deploy
```

### Out of Memory

```bash
# Check Docker memory usage
docker stats

# Increase Docker memory limit in Docker Desktop settings
# Or add memory limits to docker-compose.yml

# Example in docker-compose.yml:
# services:
#   backend:
#     deploy:
#       resources:
#         limits:
#           memory: 2G
```

## 🔒 Security Considerations

### Before Production Deployment

1. **Change all default passwords and secrets**
2. **Enable SSL/HTTPS**
3. **Configure firewall rules**
4. **Set up regular backups**
5. **Enable database encryption**
6. **Review and update CORS settings**
7. **Implement rate limiting**
8. **Set up monitoring and alerting**

### Environment Security

```bash
# Ensure .env file has restricted permissions
chmod 600 .env

# Never commit .env file to version control
git update-index --assume-unchanged .env
```

## 📊 Monitoring

### Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:3000/api
curl http://localhost:8080/health
```

### Resource Usage

```bash
# Monitor resource usage
docker stats

# Check disk usage
docker system df
```

## 🔄 Backup and Restore

### Backup

```bash
# Create backup directory
mkdir -p backups

# Database backup
docker-compose exec -T postgres pg_dump -U postgres asset_management > backups/db_$(date +%Y%m%d_%H%M%S).sql

# Uploads backup
docker-compose exec -T backend tar czf - /app/uploads > backups/uploads_$(date +%Y%m%d_%H%M%S).tar.gz
```

### Restore

```bash
# Restore database
docker-compose exec -T postgres psql -U postgres asset_management < backups/db_backup.sql

# Restore uploads
docker-compose exec -T backend tar xzf - -C /app/uploads < backups/uploads_backup.tar.gz
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Vue.js Documentation](https://vuejs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub Issues
4. Contact support team

## 📝 License

[Your License Information]

