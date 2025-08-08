# MazLogic Properties - Spring Boot Backend

This is the Spring Boot backend for the MazLogic Properties application. It provides RESTful API endpoints to manage property listings, agents, and property images.

## Prerequisites

- Java 17 or higher
- PostgreSQL database
- Maven

## Database Setup

1. Create a PostgreSQL database named `mazlogic_properties`
2. The application uses the following database configuration:
   - Username: postgres
   - Password: postgres
   - URL: jdbc:postgresql://localhost:5432/mazlogic_properties

You can modify these settings in `src/main/resources/application.yml` if needed.

## Running the Application

You can run the application using the provided script:

```bash
./run.sh
```

Or manually:

```bash
mvn clean package
mvn spring-boot:run
```

## API Endpoints

### Properties

- `GET /api/properties` - Get all properties
- `GET /api/properties/{id}` - Get a property by ID
- `POST /api/properties` - Create a new property
- `PUT /api/properties/{id}` - Update a property
- `DELETE /api/properties/{id}` - Delete a property
- `GET /api/properties/search?keyword={keyword}` - Search properties by keyword
- `GET /api/properties/type/{type}` - Get properties by type (rent/sale)
- `GET /api/properties/agent/{agentId}` - Get properties by agent ID
- `GET /api/properties/price?maxPrice={maxPrice}` - Get properties with price less than or equal to maxPrice

### Property Images

- `GET /api/properties/{propertyId}/images` - Get all images for a property
- `POST /api/properties/{propertyId}/images` - Upload an image for a property
- `DELETE /api/properties/images/{imageId}` - Delete a property image
- `PUT /api/properties/images/{imageId}` - Update image details

### Agents

- `GET /api/agents` - Get all agents
- `GET /api/agents/{id}` - Get an agent by ID
- `POST /api/agents` - Create a new agent
- `PUT /api/agents/{id}` - Update an agent
- `DELETE /api/agents/{id}` - Delete an agent

## File Storage

Property images are stored in the directory specified by the `application.storage.image-directory` property in the application.yml file. By default, this is set to `property-images` in the current working directory.

## CORS Configuration

The application is configured to allow requests from Angular running on `http://localhost:4200`.
