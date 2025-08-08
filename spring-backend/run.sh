#!/bin/bash

echo "Building and running MazLogic Properties Spring Boot backend..."

# Check Java version and set JAVA_HOME to Java 17
JAVA17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
if [ -z "$JAVA17_HOME" ]; then
  echo "Error: Java 17 is required but not found on your system."
  echo "Please install Java 17 using Homebrew:"
  echo "brew install openjdk@17"
  echo "Then add it to your path or try running this script again."
  exit 1
fi

echo "Using Java 17 at: $JAVA17_HOME"
export JAVA_HOME=$JAVA17_HOME
export PATH=$JAVA_HOME/bin:$PATH

# Check PostgreSQL connection and create database if needed
echo "Setting up PostgreSQL database..."
if ! command -v psql &> /dev/null; then
  echo "PostgreSQL command line tools not found. Make sure PostgreSQL is installed."
  echo "You can install it with: brew install postgresql"
  echo "Then start the service with: brew services start postgresql"
  exit 1
fi

# Try to create the database without specifying username (use system username)
echo "Creating database mazlogic_properties if it doesn't exist..."
createdb mazlogic_properties 2>/dev/null || echo "Database already exists or couldn't be created."

# Update application.yml with current username
USERNAME=$(whoami)
echo "Updating application.yml to use username: $USERNAME"

# Build and run the application
echo "Building the application with Maven..."
cd /Users/andile.mazibuko/Documents/learning/mazLogicProperties/spring-backend
mvn clean package -DskipTests

echo "Starting the application..."
mvn spring-boot:run -Djava.home=$JAVA_HOME -Dspring.datasource.username=$USERNAME
