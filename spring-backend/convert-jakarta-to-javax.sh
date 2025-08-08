#!/bin/bash

# This script updates Jakarta EE imports to Java EE equivalents
# Run this script from the spring-backend directory

# Replace Jakarta imports with Java EE imports
find src -name "*.java" -type f -exec sed -i '' 's/import jakarta\./import javax\./g' {} \;

# Update pom.xml to use correct validation API
sed -i '' 's/<artifactId>jakarta.validation-api<\/artifactId>/<artifactId>validation-api<\/artifactId>/g' pom.xml

echo "Conversion complete. Remember to check for any remaining Jakarta imports manually."
