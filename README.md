# Backend Practice

This is a backend application that uses Node.js, Express, and MongoDB. The application provides a platform for managing products, shopping carts, messages, and tickets.

## Features

- User authentication and authorization with Passport.js, supporting local, Google, and GitHub strategies.
- Session management with MongoDB store.
- API endpoints for managing sessions, messages, products, carts, and tickets.
- View routes for home, session, products, and carts.
- Error handling with a custom error class.

## Directory Structure

- src/
  - app.js                 - The main application file
  - config/                - Contains configuration files, including Passport.js setup
  - dao/                   - Data Access Object layer, with MongoDB implementations and Data Transfer Objects
  - middlewares/           - Contains middleware functions for authentication and authorization
  - routes/                - Contains all the route handlers for the application
  - services/              - Contains service classes that encapsulate business logic
  - utils/                 - Contains utility functions and configurations
- public/
  - js/                    - Contains client-side JavaScript files


## API Endpoints

- `/api/session`: Manages user sessions.
- `/api/messages`: Manages user messages.
- `/api/products`: Manages products.
- `/api/carts`: Manages shopping carts.
- `/api/tickets`: Manages tickets.

## View Routes

- `/`: Home page.
- `/session`: User session page.
- `/products`: Products page.
- `/carts`: Shopping cart page.

## Services

- `messageService`: Manages operations related to messages.
- `cartService`: Manages operations related to shopping carts.
- `productService`: Manages operations related to products.
- `ticketService`: Manages operations related to tickets.

## Middlewares

- `auth`: Checks if a user is authenticated.
- `authRedirect`: Redirects if a user is already authenticated.
- `isAdmin`: Checks if a user has admin privileges.
- `isVerified`: Checks if a user's email is verified.
- `logged`: Checks if a user is logged in.

## Utilities

- `bcrypt`: Provides functions for hashing and checking passwords.
- `config`: Contains application configuration.
- `faker`: Used for generating fake data for testing.
- `mailer`: Provides functions for sending emails.
- `utils`: Contains various utility functions.

## Dependencies

- `Express.js`: Web application framework.
- `MongoDB`: NoSQL database.
- `Passport.js`: Authentication middleware.
- `bcrypt`: Password hashing.
- `faker`: Fake data generator.
- `nodemailer`: Node.js library for sending emails.