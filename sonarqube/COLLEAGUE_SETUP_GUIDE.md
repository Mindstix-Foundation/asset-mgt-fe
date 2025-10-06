# SonarQube Setup Guide for Your Colleague

## 🎯 **Complete Setup Instructions**

This guide will help your colleague set up the same SonarQube environment as yours with separate TrackStix Backend and Frontend projects.

---

## 📋 **Prerequisites**

### **System Requirements:**
- **OS**: Linux (Ubuntu/Debian recommended)
- **Java**: OpenJDK 17 or higher
- **Node.js**: v20.19.0 or higher
- **Memory**: At least 4GB RAM
- **Disk Space**: At least 2GB free space

### **Check Prerequisites:**
```bash
# Check Java version
java -version

# Check Node.js version
node --version

# Check available memory
free -h

# Check disk space
df -h
```

---

## 🚀 **Step 1: Install SonarQube**

### **Download and Install SonarQube:**
```bash
# Create sonar user
sudo useradd -m -s /bin/bash sonar

# Download SonarQube (latest version)
cd /tmp
wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-25.10.0.114319.zip

# Extract SonarQube
sudo unzip sonarqube-25.10.0.114319.zip -d /opt/
sudo mv /opt/sonarqube-25.10.0.114319 /opt/sonarqube

# Set ownership
sudo chown -R sonar:sonar /opt/sonarqube

# Create systemd service
sudo tee /etc/systemd/system/sonarqube.service > /dev/null <<EOF
[Unit]
Description=SonarQube service
After=syslog.target network.target

[Service]
Type=forking
User=sonar
Group=sonar
PermissionsStartOnly=true
ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop
ExecReload=/opt/sonarqube/bin/linux-x86-64/sonar.sh restart
StandardOutput=syslog
LimitNOFILE=65536
LimitNPROC=4096
TimeoutStartSec=5
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start SonarQube
sudo systemctl daemon-reload
sudo systemctl enable sonarqube
sudo systemctl start sonarqube

# Wait for SonarQube to start (2-3 minutes)
echo "Waiting for SonarQube to start..."
sleep 180

# Check status
sudo systemctl status sonarqube
```

---

## 🔧 **Step 2: Install SonarQube Scanner**

### **Install Scanner:**
```bash
# Install SonarQube Scanner globally
npm install -g @sonar/scan

# Verify installation
sonar --version
```

---

## 🌐 **Step 3: Access SonarQube Web Interface**

### **Initial Setup:**
1. **Open Browser**: Go to http://localhost:9000
2. **Login**: 
   - Username: `admin`
   - Password: `admin`
3. **Change Password**: You'll be prompted to change the default password
4. **Complete Setup**: Follow the setup wizard

---

## 🏗️ **Step 4: Create TrackStix Projects**

### **Create Backend Project:**
1. **Go to**: Projects → Create Project
2. **Select**: "Manually"
3. **Project Key**: `TrackStix-Backend`
4. **Display Name**: `TrackStix Backend`
5. **Click**: "Set Up"

### **Create Frontend Project:**
1. **Go to**: Projects → Create Project
2. **Select**: "Manually"
3. **Project Key**: `TrackStix-Frontend`
4. **Display Name**: `TrackStix Frontend`
5. **Click**: "Set Up"

---

## 🔑 **Step 5: Generate Project Tokens**

### **Generate Backend Token:**
1. **Go to**: User Menu → My Account → Security
2. **Generate Token**: Name it `TrackStix-Backend-Token`
3. **Copy the token** (starts with `sqp_...`)

### **Generate Frontend Token:**
1. **Generate Token**: Name it `TrackStix-Frontend-Token`
2. **Copy the token** (starts with `sqp_...`)

---

## 📁 **Step 6: Setup Project Files**

### **Create Project Structure:**
```bash
# Create project directory
mkdir -p ~/TrackStix-Project
cd ~/TrackStix-Project

# Create backend directory
mkdir -p asset-mgt-be
cd asset-mgt-be

# Create frontend directory
mkdir -p ../asset-mgt-fe/frontend
cd ../asset-mgt-fe/frontend
```

---

## ⚙️ **Step 7: Configuration Files**

### **Backend Configuration** (`asset-mgt-be/sonar-project.properties`):
```properties
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
sonar.token=YOUR_BACKEND_TOKEN_HERE
```

### **Frontend Configuration** (`asset-mgt-fe/frontend/sonar-project.properties`):
```properties
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
sonar.token=YOUR_FRONTEND_TOKEN_HERE
```

---

## 📦 **Step 8: Package.json Scripts**

### **Backend Package.json** (`asset-mgt-be/package.json`):
```json
{
  "name": "asset-mgt-be",
  "version": "0.0.1",
  "scripts": {
    "sonar": "sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=YOUR_BACKEND_TOKEN_HERE -Dsonar.projectKey=TrackStix-Backend -Dsonar.projectName=\"TrackStix Backend\"",
    "sonar:coverage": "npm run test:cov && sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=YOUR_BACKEND_TOKEN_HERE -Dsonar.projectKey=TrackStix-Backend -Dsonar.projectName=\"TrackStix Backend\""
  }
}
```

### **Frontend Package.json** (`asset-mgt-fe/frontend/package.json`):
```json
{
  "name": "frontend",
  "version": "0.0.0",
  "scripts": {
    "sonar": "sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=YOUR_FRONTEND_TOKEN_HERE -Dsonar.projectKey=TrackStix-Frontend -Dsonar.projectName=\"TrackStix Frontend\"",
    "sonar:coverage": "npm run test:unit -- --coverage && sonar -Dsonar.host.url=http://localhost:9000 -Dsonar.token=YOUR_FRONTEND_TOKEN_HERE -Dsonar.projectKey=TrackStix-Frontend -Dsonar.projectName=\"TrackStix Frontend\""
  }
}
```

---

## 🧪 **Step 9: Test the Setup**

### **Test Backend Scanning:**
```bash
cd ~/TrackStix-Project/asset-mgt-be
npm run sonar
```

### **Test Frontend Scanning:**
```bash
cd ~/TrackStix-Project/asset-mgt-fe/frontend
npm run sonar
```

---

## 📊 **Step 10: View Results**

### **Access Dashboards:**
- **Backend**: http://localhost:9000/dashboard?id=TrackStix-Backend
- **Frontend**: http://localhost:9000/dashboard?id=TrackStix-Frontend

---

## 🛠️ **Troubleshooting**

### **If SonarQube Won't Start:**
```bash
# Check logs
sudo journalctl -u sonarqube -f

# Check SonarQube logs
sudo tail -f /opt/sonarqube/logs/sonar.log
```

### **If Scanner Fails:**
```bash
# Check SonarQube status
curl http://localhost:9000/api/system/status

# Check token validity
curl -u YOUR_TOKEN: http://localhost:9000/api/authentication/validate
```

### **If Port 9000 is in Use:**
```bash
# Check what's using port 9000
sudo netstat -tlnp | grep 9000
sudo lsof -i :9000
```

---

## 📋 **Quick Reference Commands**

### **Start/Stop SonarQube:**
```bash
# Start SonarQube
sudo systemctl start sonarqube

# Stop SonarQube
sudo systemctl stop sonarqube

# Check status
sudo systemctl status sonarqube

# Restart SonarQube
sudo systemctl restart sonarqube
```

### **Scanning Commands:**
```bash
# Backend scanning
cd asset-mgt-be && npm run sonar

# Frontend scanning
cd asset-mgt-fe/frontend && npm run sonar

# With coverage
cd asset-mgt-be && npm run sonar:coverage
cd asset-mgt-fe/frontend && npm run sonar:coverage
```

---

## 🎯 **What Your Colleague Will Have:**

✅ **Latest SonarQube** (25.10.0) - No "end of life" warnings
✅ **Separate Projects** for TrackStix Backend and Frontend
✅ **Professional Code Quality** monitoring
✅ **Automated Scanning** via npm scripts
✅ **Industry-Standard Metrics** for code quality, security, and maintainability
✅ **Ready for CI/CD** integration

---

## 📞 **Support**

If your colleague encounters any issues:
1. **Check the logs** using the troubleshooting commands above
2. **Verify prerequisites** are met
3. **Ensure SonarQube is running** on port 9000
4. **Check token permissions** in SonarQube web interface

---

**Your colleague will have the exact same SonarQube setup as you! 🚀**
