# Node-JWT-Auth

A robust and secure JWT (JSON Web Token) authentication and authorization system implemented in a Node.js (Express) application. This project includes custom permission middlewares, JWT authentication, and permission-based access control for API endpoints.

## Description

The `node-jwt-auth` project is designed to provide a solid foundation for building a secure authentication and authorization system using JWT in a Node.js (Express) application. It handles user registration, login, token generation, and verification, along with the implementation of custom permissions to control access to different API endpoints.

## Specifications

- **User Registration:** Securely register users with encrypted passwords.
- **User Login:** Authenticate users using email and password.
- **JWT Generation:** Generate JWT access tokens on successful login.
- **Token Refresh:** Implement a refresh token mechanism for handling expired tokens.
- **Permission Middleware:** Custom middleware for enforcing permission-based access control.
- **Error Handling:** Centralized error handling with custom exceptions.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (or any other SQL database)
- Docker (for containerization)

## Technologies Used 

- **Node.js (Express):** Backend framework for building the API.
- **Sequelize (MySQL):** ORM for managing database operations.
- **JSON Web Token (JWT):** Token-based authentication system.
- **Bcrypt:** Library for hashing passwords.
- **Dotenv:** Environment variable management.
- **Jest:** Testing framework for unit and integration tests.
- **Docker:** Containerization of the application.

## Setup Installations Requirements

    * To set up and run the application locally, follow these steps:

    1. git clone https://github.com/YomZsamora/node-jwt-auth.git.
    2. Create a .env file in the root directory and add your environment variables.
    3. Install dependencies: `npm install`.
    4. Run database migrations: `npx sequelize db:migrate`.
    5. Start the development server: `docker-compose up --build -d`.
    6. Navigate to http://localhost:3010/ in your browser or use Postman to interact with the API.