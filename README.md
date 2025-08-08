# MazLogic Properties

A comprehensive full-stack property management system built with Angular frontend and Spring Boot backend.

![MazLogic Properties](angular-client/src/assets/mazlogic-logo.png)

## 🏠 Overview

MazLogic Properties is a modern property management application that allows users to browse, add, edit, and manage real estate properties. The application features a responsive Angular frontend with a robust Spring Boot backend, complete with image upload functionality and comprehensive property management tools.

## ✨ Features


## 🛠️ Tech Stack

### Frontend

### Backend

### Additional Tools

## 🚀 Getting Started

### Prerequisites


### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/andyxdev/mazlogic-properties.git
   cd mazlogic-properties
   ```

2. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb property_management
   ```

3. **Configure the backend**
   ```bash
   cd spring-backend
   # Update src/main/resources/application.yml with your database credentials
   ```

4. **Start the backend server**
   ```bash
   cd spring-backend
   ./run.sh
   # Or alternatively: mvn spring-boot:run
   ```

5. **Install frontend dependencies**
   ```bash
   cd angular-client
   npm install
   ```

6. **Start the frontend development server**
   ```bash
   cd angular-client
   ng serve
   # Or use: npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8081

## 📁 Project Structure

```
mazlogic-properties/
├── angular-client/          # Angular frontend application
│   ├── src/app/
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # HTTP services and business logic
│   │   ├── models/          # TypeScript interfaces/models
│   │   └── assets/          # Static files (images, styles)
│   └── package.json
├── spring-backend/          # Spring Boot backend API
│   ├── src/main/java/       # Java source code
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic services
│   │   ├── model/           # JPA entities and DTOs
│   │   └── repository/      # Data access layer
│   ├── src/main/resources/  # Configuration files
│   └── pom.xml
├── client/                  # Legacy React client (not used)
├── start.sh                 # Application startup script
└── README.md
```

## 🔌 API Endpoints

- `DELETE /api/properties/{id}` - Delete a property

- `DELETE /api/properties/images/{imageId}` - Delete property image

- `POST /api/agents` - Create a new agent

- `GET /api/system/health` - Health check endpoint

## 🧪 Testing

The project includes HTTP files for API testing:
- `end-to-end-test.sh` - Automated end-to-end testing script

## 🔧 Configuration

### Backend Configuration
Edit `spring-backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/property_management
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

### Frontend Configuration
Edit `angular-client/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api'
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 8081 already in use**
   ```bash
   lsof -ti:8081 | xargs kill -9
   ```

2. **Node.js version compatibility**
   - Ensure you're using Node.js v18.19 or higher
   - Consider using nvm to manage Node.js versions

3. **Database connection issues**
   - Verify PostgreSQL is running
   - Check database credentials in application.yml
   - Ensure the database exists

4. **Image upload not working**
   - Check file permissions in the property-images directory
   - Verify CORS configuration
   - Check browser console for JavaScript errors

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors
- **Andile Mazibuko** - *Initial work* - [@andyxdev](https://github.com/andyxdev)

## 🙏 Acknowledgments
- PostgreSQL for reliable database management

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues on GitHub
3. Create a new issue with detailed information about your problem
---

**Made with ❤️ by the MazLogic team**
=======
A property management application with Spring Boot backend and Angular frontend.

## Testing Image Upload Functionality

### Backend

1. Start the Spring Boot backend:

```bash
cd spring-backend
./run.sh
```

2. Make sure the backend is running on port 8081.

3. Verify that the image directory exists and is writable:

```bash
mkdir -p property-images
chmod 755 property-images
```

### Frontend

1. Start the Angular frontend:

```bash
cd angular-client
npm start
```

2. Make sure the frontend is running on port 4200.

## Testing Image Upload Process

1. Open the application at http://localhost:4200
2. Click on "Add Property"
3. Fill in the property details
4. Upload images using the "Upload Images" section
5. Click "Add Property" to save
6. Verify that the property is created with images

## Troubleshooting

If images aren't showing up:

1. Check browser console for errors
2. Verify that the images were uploaded to `property-images` directory
3. Check that the image URLs in the property data are correct
4. Make sure the WebConfig is correctly serving static resources

## Manual Testing API

You can use the `test-upload.http` file to manually test image upload API:

1. Create a property
2. Get the property ID from the response
3. Upload an image to the property
4. Verify the image was uploaded correctly
>>>>>>> 4e46866 (Initial commit: MazLogic Properties - Full-stack property management application)
