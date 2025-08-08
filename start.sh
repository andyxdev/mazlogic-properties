#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo "Stopping all processes..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up cleanup on Ctrl+C
trap cleanup SIGINT

# Check Java version and set JAVA_HOME to Java 17
JAVA17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
if [ -z "$JAVA17_HOME" ]; then
  echo "Error: Java 17 is required but not found on your system."
  exit 1
fi
export JAVA_HOME=$JAVA17_HOME
export PATH=$JAVA_HOME/bin:$PATH

# Create property images directory if it doesn't exist
echo "Ensuring property-images directory exists..."
mkdir -p spring-backend/property-images
chmod 755 spring-backend/property-images

# Start Spring Boot backend
echo "Starting Spring Boot backend..."
cd spring-backend
./run.sh &

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start Angular frontend
echo "Starting Angular frontend..."
cd ../angular-client
npm start &

# Keep the script running
echo "Both services are running. Press Ctrl+C to stop all services."
wait
