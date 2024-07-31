# Backend Practice

This is a backend application that uses Node.js, Express, and MongoDB. The application provides a platform for managing products, shopping carts, messages, and tickets.
[Live here](https://backend-practice-ml8a.onrender.com/)

## Features

- User authentication and authorization with Passport.js, supporting local, Google, and GitHub strategies. With forgot password functionality.
- Session management with MongoDB store.
- API endpoints for managing sessions, messages, products, carts, and tickets.
- View routes for home, session, products, and carts.
- Admin features. User: adminCoder@coder.com Pass: adminCod3r123

## Directory Structure

- src/
  - app.js                 - The main application file
  - config/                - Contains configuration files, including Passport.js setup
  - controllers/           - Contains controller functions for handling requests
  - dao/                   - Data Access Object layer, with MongoDB implementations and Data Transfer Objects
  - docs/                  - Contains API documentation
  - logs/                  - Contains log files
  - middlewares/           - Contains middleware functions for authentication and authorization
  - routes/                - Contains all the route handlers for the application
  - services/              - Contains service classes that encapsulate business logic
  - utils/                 - Contains utility functions and configurations
  - views/                 - Contains view templates
- public/
  - js/                    - Contains client-side JavaScript files
- test/                    - Contains test in local enviroment
- uploads/                 - Contains uploaded files

## API Endpoints

- `/api/session`: Manages user sessions.
- `/api/messages`: Manages user messages.
- `/api/products`: Manages products.
- `/api/carts`: Manages shopping carts.
- `/api/tickets`: Manages tickets.

## View Routes

- `/`: Home page.
- `/user`: User session page.
- `/products`: Products page.
- `/carts`: Shopping cart page.
- `/forgot-password`: Forgot password page.
- `/reset-password`: Reset password page.
- `/chat`: Chat page.

## Controllers

- `sessionController`: Manages operations related to user sessions.
- `messageController`: Manages operations related to messages.
- `productController`: Manages operations related to products.
- `cartController`: Manages operations related to shopping carts.
- `ticketController`: Manages operations related to tickets.

## Services

- `sessionService`: Provides functions for managing user sessions.
- `messageService`: Provides functions for managing messages.
- `productService`: Provides functions for managing products.
- `cartService`: Provides functions for managing shopping carts.
- `ticketService`: Provides functions for managing tickets.

## Middlewares

- `auth`: Checks if a user is authenticated.
- `authRedirect`: Redirects if a user is already authenticated.
- `isAdmin`: Checks if a user has admin privileges.
- `isPremium`: Checks if a user has premium privileges.
- `logged`: Checks if a user is logged in.
- `logger`: Logs requests to the console.
- `multer`: Handles file uploads.

## Utilities

- `bcrypt`: Provides functions for hashing and checking passwords.
- `config`: Contains application configuration.
- `faker`: Used for generating fake data for testing.
- `mailer`: Provides functions for sending emails.
- `utils`: Contains various utility functions.

## Dependencies

- `Axios`: Promise based HTTP client for the browser and node.js.
- `Bcrypt`: Library for hashing and checking passwords.
- `Connect-flash`: Flash messages for Express.
- `Connect-mongo`: MongoDB session store for Express.
- `Cookie-parser`: Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
- `Dotenv`: Loads environment variables from a .env file into process.env.
- `Express`: Web application framework for Node.js.
- `Express-handlebars`: Handlebars view engine for Express.
- `Express-session`: Session middleware for Express.
- `Jsonwebtoken`
- `Mongodb`: MongoDB driver for Node.js.
- `Mongoose`: MongoDB object modeling tool.
- `Mongoose-paginate-v2`: Pagination plugin for Mongoose.
- `Multer`: Middleware for handling multipart/form-data.
- `Nodemailer`: Module for Node.js applications to allow easy as cake email sending.
- `Passport`: Authentication middleware for Node.
- `Socket.io`: Real-time bidirectional event-based communication.
- `Swagger-jsdoc`: Generates Swagger/OpenAPI 3.0 specifications from JSDoc comments.
- `Swagger-ui-express`: Swagger UI for Express.
- `Winston`: Logger for Node.js.
