import express from 'express'
import handlebars from "express-handlebars";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import flash from 'connect-flash';
import path from 'path';
import cors from 'cors';

import { __dirname } from './utils/utils.js';
import initializatePassport from './config/passportConfig.js';
import apiCartsRouter from "./routes/apiCarts.router.js"
import apiProductsRouter from "./routes/apiProducts.router.js"
import apiSessionRouter from "./routes/apiSession.router.js"
import apiTicketsRouter from "./routes/apiTickets.router.js"
import apiMessagesRouter from "./routes/apiMessages.router.js"
import { FRONT_URL, MONGODB_URI, SECRET_SESSION } from './utils/config.js';
import { addLogger } from './middlewares/logger.js';

export const app = express();

//MONGOOSE
mongoose.connect(MONGODB_URI)

// SWAGGER
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "Ecommerce API Information. For admin pourpuses use the following credentials: email: adminCoder@coder.com password: adminCod3r123",
    },
  },
  apis: [path.resolve(__dirname, '../docs/**/*.yaml')]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

//MIDDLEWARES

app.use(addLogger)
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(`${__dirname}/../../public`));
app.use(cookieParser());
app.use(flash())
app.use(cors({
  origin: `${FRONT_URL}`,
  credentials: true
}))

//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views",`${__dirname}/../views`);
app.set("view engine", "handlebars");

//MONGO SESSION AND FLASH
app.use(session(
  {
    store: MongoStore.create(
      {
        mongoUrl: MONGODB_URI,
        mongoOption: { useUnifiedTopology: true},
        ttl: 40000
      }),
      secret: SECRET_SESSION,
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24
      }
    }
  ))

//PASSPORT
initializatePassport();
app.use(passport.initialize())
app.use(passport.session())
  
//ROUTES

//API ROUTES
app.use("/api/products", apiProductsRouter)
app.use("/api/carts", apiCartsRouter)
app.use('/api/session', apiSessionRouter)
app.use("/api/tickets", apiTicketsRouter)
app.use('/api/messages', apiMessagesRouter)

//PORT LISTEN
const port = process.env.PORT || 10000;
const httpServer = app.listen(port, () => {
  console.log(`Server online on port ${port}`)
})

// SOCKET SERVER
export const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("New connection", socket.id);

  socket.on("newMessage", async () => {
    socketServer.emit("newMessage");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
})