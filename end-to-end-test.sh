#!/bin/bash

# End-to-End Test Script for MazLogic Properties
# This script tests the complete flow of creating a property with an agent and uploading images

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting MazLogic Properties End-to-End Test${NC}"
echo "==============================================="

# Backend URL
API_URL="http://localhost:8081/api"

echo -e "\n${YELLOW}Step 1: Creating a new property with agent information${NC}"
# Create a new property
PROPERTY_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test E2E Property",
    "description": "This property is created as part of an end-to-end test",
    "price": 299000,
    "type": "sale",
    "location": "123 Test Lane, E2E City",
    "agent": {
      "id": 1,
      "name": "Test Agent",
      "email": "test@mazlogic.com",
      "phone": "123-456-7890"
    }
  }' \
  $API_URL/properties)

# Extract property ID
PROPERTY_ID=$(echo $PROPERTY_RESPONSE | grep -o '"id":[0-9]\+' | head -1 | cut -d':' -f2)

if [ -z "$PROPERTY_ID" ]; then
  echo -e "${RED}Failed to create property or extract property ID!${NC}"
  echo "Server response:"
  echo "$PROPERTY_RESPONSE"
  exit 1
else
  echo -e "${GREEN}✓ Property created successfully with ID: $PROPERTY_ID${NC}"
  echo "Response summary:"
  echo "$PROPERTY_RESPONSE" | grep -E '"id"|"title"|"agent"'
fi

echo -e "\n${YELLOW}Step 2: Uploading an image for the property${NC}"
# Upload an image for the property
IMAGE_PATH="$(pwd)/spring-backend/property-images/test-image.jpg"
if [ ! -f "$IMAGE_PATH" ]; then
  echo -e "${RED}Test image file not found at $IMAGE_PATH${NC}"
  exit 1
fi

# Upload the image
IMAGE_RESPONSE=$(curl -s -X POST \
  -F "file=@$IMAGE_PATH" \
  -F "description=Test image for E2E property" \
  -F "displayOrder=1" \
  $API_URL/properties/$PROPERTY_ID/images)

# Extract image URL
IMAGE_URL=$(echo $IMAGE_RESPONSE | grep -o '"imageUrl":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$IMAGE_URL" ]; then
  echo -e "${RED}Failed to upload image or extract image URL!${NC}"
  echo "Server response:"
  echo "$IMAGE_RESPONSE"
else
  echo -e "${GREEN}✓ Image uploaded successfully${NC}"
  echo "Image URL: $IMAGE_URL"
fi

echo -e "\n${YELLOW}Step 3: Retrieving the property with its image URL${NC}"
# Get the property details including images
PROPERTY_WITH_IMAGES=$(curl -s -X GET $API_URL/properties/$PROPERTY_ID)

# Check if response contains images
if echo "$PROPERTY_WITH_IMAGES" | grep -q '"imageUrl"'; then
  echo -e "${GREEN}✓ Property retrieved with images successfully${NC}"
  echo "Image URLs:"
  echo "$PROPERTY_WITH_IMAGES" | grep -o '"imageUrl":"[^"]*"' | cut -d'"' -f4
else
  echo -e "${RED}Property response does not contain images!${NC}"
  echo "Server response:"
  echo "$PROPERTY_WITH_IMAGES"
fi

echo -e "\n${YELLOW}Step 4: Verifying the image can be accessed${NC}"
# Check if image URL is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $IMAGE_URL)

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✓ Image accessible via URL (HTTP 200 OK)${NC}"
else
  echo -e "${RED}Image not accessible! HTTP code: $HTTP_CODE${NC}"
fi

echo -e "\n${GREEN}End-to-End Test Complete!${NC}"
echo "==============================================="
echo "Property ID: $PROPERTY_ID"
echo "Image URL: $IMAGE_URL"
echo -e "${YELLOW}You can view the test property at: http://localhost:4200/properties/$PROPERTY_ID${NC}"
