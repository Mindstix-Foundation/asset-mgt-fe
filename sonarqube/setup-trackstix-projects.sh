#!/bin/bash

# TrackStix Project Setup Script
# This script creates the project structure and configuration files

set -e

echo "=== TrackStix Project Setup Script ==="
echo "This script will create the project structure and configuration files"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Get tokens from user
echo "Please provide your SonarQube tokens:"
echo ""
read -p "Enter TrackStix-Backend token (starts with sqp_): " BACKEND_TOKEN
read -p "Enter TrackStix-Frontend token (starts with sqp_): " FRONTEND_TOKEN

if [ -z "$BACKEND_TOKEN" ] || [ -z "$FRONTEND_TOKEN" ]; then
    echo "Error: Both tokens are required!"
    exit 1
fi

# Create project directory
PROJECT_DIR="$HOME/TrackStix-Project"
print_status "Creating project directory: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Create backend directory and configuration
print_status "Setting up backend project..."
mkdir -p asset-mgt-be
cd asset-mgt-be

# Create backend sonar-project.properties
cat > sonar-project.properties <<EOF
# SonarQube Configuration for TrackStix Backend (NestJS)
sonar.projectKey=TrackStix-Backend
sonar.projectName=TrackStix Backend
sonar.projectVersion=1.0.0
sonar.organization=asset-management

# Source code configuration
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/prisma/migrations/**

# TypeScript configuration
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Coverage configuration
sonar.coverage.exclusions=**/*.spec.ts,**/*.test.ts,**/main.ts,**/prisma/**

# Code quality configuration
sonar.typescript.node=node
sonar.typescript.tsconfigPath=tsconfig.json

# Additional exclusions
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/prisma/migrations/**,**/*.d.ts

# Encoding
sonar.sourceEncoding=UTF-8

# Analysis parameters
sonar.host.url=http://localhost:9000
sonar.token=$BACKEND_TOKEN
EOF

# Create backend package.json
cat > package.json <<EOF
{
  "name": "asset-mgt-be",
  "version": "0.0.1",
  "description": "TrackStix Backend",
  "scripts": {
    "sonar": "sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$BACKEND_TOKEN -Dsonar.projectKey=TrackStix-Backend -Dsonar.projectName=\"TrackStix Backend\"",
    "sonar:coverage": "npm run test:cov && sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$BACKEND_TOKEN -Dsonar.projectKey=TrackStix-Backend -Dsonar.projectName=\"TrackStix Backend\""
  }
}
EOF

print_success "Backend configuration created"

# Create frontend directory and configuration
print_status "Setting up frontend project..."
cd ..
mkdir -p asset-mgt-fe/frontend
cd asset-mgt-fe/frontend

# Create frontend sonar-project.properties
cat > sonar-project.properties <<EOF
# SonarQube Configuration for TrackStix Frontend (Vue.js)
sonar.projectKey=TrackStix-Frontend
sonar.projectName=TrackStix Frontend
sonar.projectVersion=1.0.0
sonar.organization=asset-management

# Source code configuration
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts,**/*.test.ts,**/*.spec.js,**/*.test.js
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/*.spec.ts,**/*.test.ts,**/*.spec.js,**/*.test.js

# TypeScript/JavaScript configuration
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Coverage configuration
sonar.coverage.exclusions=**/*.spec.ts,**/*.test.ts,**/*.spec.js,**/*.test.js,**/main.ts,**/vite.config.ts

# Vue.js specific configuration
sonar.typescript.node=node
sonar.typescript.tsconfigPath=tsconfig.json

# Additional exclusions
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/*.d.ts,**/public/**,**/e2e/**

# Encoding
sonar.sourceEncoding=UTF-8

# Analysis parameters
sonar.host.url=http://localhost:9000
sonar.token=$FRONTEND_TOKEN
EOF

# Create frontend package.json
cat > package.json <<EOF
{
  "name": "frontend",
  "version": "0.0.0",
  "description": "TrackStix Frontend",
  "scripts": {
    "sonar": "sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$FRONTEND_TOKEN -Dsonar.projectKey=TrackStix-Frontend -Dsonar.projectName=\"TrackStix Frontend\"",
    "sonar:coverage": "npm run test:unit -- --coverage && sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=$FRONTEND_TOKEN -Dsonar.projectKey=TrackStix-Frontend -Dsonar.projectName=\"TrackStix Frontend\""
  }
}
EOF

print_success "Frontend configuration created"

# Create README
cd "$PROJECT_DIR"
cat > README.md <<EOF
# TrackStix Project - SonarQube Setup

This project is configured with SonarQube for code quality monitoring.

## Projects

- **TrackStix-Backend**: NestJS backend project
- **TrackStix-Frontend**: Vue.js frontend project

## Quick Commands

### Backend Scanning:
\`\`\`bash
cd asset-mgt-be
npm run sonar
\`\`\`

### Frontend Scanning:
\`\`\`bash
cd asset-mgt-fe/frontend
npm run sonar
\`\`\`

## Dashboards

- **Backend**: http://localhost:9000/dashboard?id=TrackStix-Backend
- **Frontend**: http://localhost:9000/dashboard?id=TrackStix-Frontend

## Tokens

- **Backend Token**: $BACKEND_TOKEN
- **Frontend Token**: $FRONTEND_TOKEN

## SonarQube

- **URL**: http://localhost:9000
- **Version**: 25.10.0.114319
EOF

print_success "README created"

echo ""
print_success "=== Project Setup Complete ==="
echo ""
echo "Project structure created at: $PROJECT_DIR"
echo ""
echo "Next steps:"
echo "1. Copy your source code to the respective directories:"
echo "   - Backend code → $PROJECT_DIR/asset-mgt-be/src/"
echo "   - Frontend code → $PROJECT_DIR/asset-mgt-fe/frontend/src/"
echo ""
echo "2. Test the setup:"
echo "   cd $PROJECT_DIR/asset-mgt-be && npm run sonar"
echo "   cd $PROJECT_DIR/asset-mgt-fe/frontend && npm run sonar"
echo ""
echo "3. View results:"
echo "   - Backend: http://localhost:9000/dashboard?id=TrackStix-Backend"
echo "   - Frontend: http://localhost:9000/dashboard?id=TrackStix-Frontend"
echo ""
print_success "TrackStix projects are ready! 🚀"
