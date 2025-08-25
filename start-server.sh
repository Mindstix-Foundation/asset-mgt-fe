#!/bin/bash

# Asset Management Frontend - Server Start Script
# This script serves the static HTML prototype using Python's built-in server

# Set the port (default: 8000)
PORT=${PORT:-8000}

# Navigate to the Prototype directory
cd "$(dirname "$0")/Prototype"

echo "Starting Asset Management Prototype Server..."
echo "Server will be available at: http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"

# Start Python HTTP server (works with both Python 2 and 3)
if command -v python3 &> /dev/null; then
    echo "Using Python 3..."
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    echo "Using Python 2..."
    python -m SimpleHTTPServer $PORT
else
    echo "Error: Python is not installed or not in PATH"
    exit 1
fi
