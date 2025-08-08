# MazLogic Properties - File Upload Testing Guide

This document provides instructions for testing the file upload functionality in the MazLogic Properties application, including details on what was fixed to make it work correctly.

## Setup and Running the Application

### Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd /Users/andile.mazibuko/Documents/learning/mazLogicProperties/spring-backend
   ```

2. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   
   The backend will run on http://localhost:8081

### Frontend (Angular)

1. Navigate to the frontend directory:
   ```bash
   cd /Users/andile.mazibuko/Documents/learning/mazLogicProperties/angular-client
   ```

2. Start the Angular development server:
   ```bash
   npm start
   ```
   
   The frontend will run on http://localhost:4200

## Testing File Uploads

There are multiple ways to test the file upload functionality:

### Method 1: Using the Angular Application

1. Go to http://localhost:4200 in your browser
2. Click on "Add Property" button
3. Fill in the property details, including agent information
4. Upload images using the file upload component
5. Submit the form
6. Verify that the property is created with images displayed

### Method 2: Using the HTML Test Page

We've created a simple HTML tester to help you verify the file upload functionality:

1. Open `/Users/andile.mazibuko/Documents/learning/mazLogicProperties/file-upload-tester.html` in your browser
2. Follow these steps in the tester:
   - Step 1: Create a Property (fill the form and click "Create Property")
   - Step 2: Upload an Image (select a file and click "Upload Image")
   - Step 3: View the property with its images

### Method 3: Using the End-to-End Test Script

We've also created an automated test script:

1. Run the script:
   ```bash
   cd /Users/andile.mazibuko/Documents/learning/mazLogicProperties
   ./end-to-end-test.sh
   ```
   
2. The script will:
   - Create a new property
   - Upload an image
   - Retrieve the property with images
   - Verify the image is accessible

## What Was Fixed

The following issues have been resolved to make file uploads work properly:

1. **Entity Relationships**:
   - Removed `@Data` annotation from entity classes and implemented proper getters/setters
   - Fixed bidirectional relationship between `Property` and `PropertyImage`
   - Added helper methods to maintain consistency between related entities

2. **File Storage**:
   - Enhanced logging in `FileStorageService` to track file saving issues
   - Properly configured file paths and URL generation
   - Added error handling for file operations

3. **Agent Management**:
   - Implemented proper agent lookup/creation when handling properties
   - Added `findAgentsByEmail` method to find existing agents
   - Enhanced `AgentController` to support filtering by email

4. **Transaction Management**:
   - Added `@Transactional` annotations to methods that update relationships
   - Ensured proper database transaction handling

5. **URL Generation**:
   - Fixed image URL generation to use the correct host and port
   - Configured proper static resource serving in WebConfig

6. **Compatibility**:
   - Updated Java version to 11 from 17 for compatibility
   - Converted Jakarta EE imports to Java EE for Spring Boot 2.x compatibility

## Troubleshooting

If you encounter issues:

1. **Images not appearing**: 
   - Check the browser console for image loading errors
   - Verify the image URL is correctly generated (should be http://localhost:8081/images/[filename])
   - Make sure the image directory exists and is writable

2. **Upload errors**:
   - Check server logs for file saving issues
   - Verify multipart configuration in application.yml
   - Ensure proper CORS configuration for cross-domain requests

3. **Database issues**:
   - Check that agent relationships are properly saved
   - Verify that bidirectional relationships are maintained
