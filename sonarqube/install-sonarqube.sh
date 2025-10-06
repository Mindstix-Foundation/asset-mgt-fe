#!/bin/bash

# SonarQube Installation Script for TrackStix Project
# This script installs SonarQube 25.10.0 and sets up the TrackStix projects

set -e

echo "=== SonarQube Installation Script for TrackStix ==="
echo "This script will install SonarQube 25.10.0 and set up TrackStix projects"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check Java
if ! command -v java &> /dev/null; then
    print_error "Java is not installed. Please install OpenJDK 17 or higher."
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    print_error "Java version $JAVA_VERSION is too old. Please install OpenJDK 17 or higher."
    exit 1
fi

print_success "Java version: $(java -version 2>&1 | head -n 1)"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js v20.19.0 or higher."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js v20.19.0 or higher."
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Check memory
MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
if [ "$MEMORY_GB" -lt 4 ]; then
    print_warning "Only $MEMORY_GB GB of memory available. SonarQube recommends at least 4GB."
fi

print_success "Memory: ${MEMORY_GB}GB available"

# Check disk space
DISK_SPACE=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
if [ "$DISK_SPACE" -lt 2 ]; then
    print_error "Only ${DISK_SPACE}GB of disk space available. SonarQube requires at least 2GB."
    exit 1
fi

print_success "Disk space: ${DISK_SPACE}GB available"

echo ""
print_status "All prerequisites met. Proceeding with installation..."
echo ""

# Create sonar user
print_status "Creating sonar user..."
if ! id "sonar" &>/dev/null; then
    sudo useradd -m -s /bin/bash sonar
    print_success "Sonar user created"
else
    print_success "Sonar user already exists"
fi

# Download SonarQube
print_status "Downloading SonarQube 25.10.0.114319..."
cd /tmp
if [ ! -f "sonarqube-25.10.0.114319.zip" ]; then
    wget -q --show-progress https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-25.10.0.114319.zip
    print_success "SonarQube downloaded"
else
    print_success "SonarQube already downloaded"
fi

# Extract SonarQube
print_status "Extracting SonarQube..."
sudo rm -rf /opt/sonarqube
sudo unzip -q sonarqube-25.10.0.114319.zip -d /opt/
sudo mv /opt/sonarqube-25.10.0.114319 /opt/sonarqube
sudo chown -R sonar:sonar /opt/sonarqube
print_success "SonarQube extracted to /opt/sonarqube"

# Create systemd service
print_status "Creating systemd service..."
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

sudo systemctl daemon-reload
sudo systemctl enable sonarqube
print_success "Systemd service created and enabled"

# Start SonarQube
print_status "Starting SonarQube service..."
sudo systemctl start sonarqube
print_success "SonarQube service started"

# Wait for SonarQube to start
print_status "Waiting for SonarQube to start (this may take 2-3 minutes)..."
for i in {1..30}; do
    if curl -s http://localhost:9000/api/system/status | grep -q "UP"; then
        print_success "SonarQube is now running!"
        break
    fi
    echo -n "."
    sleep 10
done

# Check final status
if curl -s http://localhost:9000/api/system/status | grep -q "UP"; then
    VERSION=$(curl -s http://localhost:9000/api/system/status | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    print_success "SonarQube $VERSION is running successfully!"
else
    print_error "SonarQube failed to start. Check logs: sudo journalctl -u sonarqube -f"
    exit 1
fi

# Install SonarQube Scanner
print_status "Installing SonarQube Scanner..."
npm install -g @sonar/scan --force
print_success "SonarQube Scanner installed"

# Verify scanner installation
SCANNER_VERSION=$(sonar --version 2>&1 | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1)
print_success "SonarQube Scanner $SCANNER_VERSION installed"

echo ""
print_success "=== Installation Complete ==="
echo ""
echo "Next steps:"
echo "1. Open your browser and go to: http://localhost:9000"
echo "2. Login with: admin / admin (you'll be prompted to change password)"
echo "3. Create TrackStix projects:"
echo "   - TrackStix-Backend"
echo "   - TrackStix-Frontend"
echo "4. Generate tokens for each project"
echo "5. Update configuration files with your tokens"
echo ""
echo "For detailed instructions, see: COLLEAGUE_SETUP_GUIDE.md"
echo ""
print_success "SonarQube is ready to use! 🚀"
