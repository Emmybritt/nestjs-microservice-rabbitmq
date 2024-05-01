## Hotel and Flights Reservation Microservices Documentation

### Introduction

This README provides instructions for starting the authentication, hotel, and flight microservices built with NestJS, Redis for in memory caching, Mongodb as the primary database, casljs for user role and permission implementation and RabbitMQ as a message broker. The microservices are part of a monorepo structure managed by Nx.

### Prerequisites

Before proceeding, ensure that you have the following prerequisites installed on your system:

- Node.js and npm
- Docker
- Docker Compose

### Setup Instructions

#### 1. Clone the Repository

Clone the repository containing the microservices codebase from the Git repository.

```bash
git clone https://github.com/Emmybritt/nestjs-microservice-rabbitmq.git
cd nestjs-microservice-rabbitmq
code .
```

#### 2. Install Dependencies

Navigate to the root directory of the repository and install dependencies.

```bash
npm install
```

#### 2. Setup Docker

Setup Docker Container for redis and mongodb

```bash
docker-compose up -d
```

#### 3. Start Microservices

Run the following commands to start the authentication, hotel, and flight microservices:

- **Authentication Microservice** (Port 3000):

```bash
npm run start:api:auth
```

- **Flight Microservice** (Port 3001):

```bash
npm run start:api:flight
```

- **Hotel Microservice** (Port 3002):

```bash
npm run start:api:hotel
```

### Access Microservices

Once the microservices are started, you can access them using the following endpoints:

- **Authentication Microservice**: [http://localhost:3000](http://localhost:3000)
- **Hotel Microservice**: [http://localhost:3001](http://localhost:3001)
- **Flight Microservice**: [http://localhost:3002](http://localhost:3002)

### Conclusion

You have successfully started the authentication, hotel, and flight microservices. You can now interact with these microservices to handle hotel and flight reservations, along with authentication functionalities.

### API Documentation

For detailed API documentation and usage instructions, access all route via api.

- **Authentication Microservice**: [http://localhost:3000/api](http://localhost:3000/api)
- **Hotel Microservice**: [http://localhost:3001/api](http://localhost:3001/api)
- **Flight Microservice**: [http://localhost:3002/api](http://localhost:3002/api)

### Additional Information

For further assistance or troubleshooting, please refer to the README.md file in the repository or contact the development team.
