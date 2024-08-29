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

## Docker Compose Setup

This project supports Docker containerization for easy deployment. To run the application using Docker Compose, follow these steps:

1. Make sure you have Docker installed on your machine.
2. Create a `.env` file in the root directory and add the necessary environment variables.
3. Build and start the containers using Docker Compose:
    ```sh
    docker-compose up --build -d
    ```
4. The application should now be running inside a Docker container.
5. Access the API at http://localhost:3010/ or use Postman for interactions.

## Setup Installations Requirements

    * To set up and run the application locally, follow these steps:

    1. git clone https://github.com/YomZsamora/node-jwt-auth.git.
    2. Create a .env file in the root directory and add the environment variables.
    3. Install dependencies: `docker-compose exec node-jwt npm install`.
    4. Run database migrations: `docker-compose exec node-jwt npx sequelize db:migrate`.
    5. Start the development server: `docker-compose up --build -d`.
    6. Navigate to http://localhost:3010/ in your browser or use Postman to interact with the API.

### Development

Want to contribute? Great! Here's how you can help:

- Fork the repo
- Create a new branch (git checkout -b feature-name)
- Make the appropriate changes in the codebase.
- Test your changes to ensure they work as expected.
- Commit your changes (git commit -m 'Add feature')
- Push to the branch (git push origin feature-name)
- Create a Pull Request explaining your changes.

### Running Tests

This project includes unit and integration tests to ensure the correctness of the codebase.

To run the tests:
```sh
docker-compose exec node-jwt npm test
```
To run tests in watch mode:
```sh
docker-compose exec node-jwt npm run test:watch
```

### Known Bugs

If you encounter any bugs or issues while using the application, please open an issue on the GitHub repository here. Be sure to include details of the issue and steps to reproduce it.

### License

*MIT License*

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
