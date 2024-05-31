import express from 'express'
import handlebars from "express-handlebars";
import mongoose from 'mongoose';
import { Server } from "socket.io";
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';

import { __dirname } from './utils/utils.js';
import cartService from './services/cartService.js';
import initializatePassport from './config/passportConfig.js';
import apiCartsRouter from "./routes/apiCarts.router.js"
import apiProductsRouter from "./routes/apiProducts.router.js"
import apiSessionRouter from "./routes/apiSession.router.js"
import apiTicketsRouter from "./routes/apiTickets.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import sessionRouter from "./routes/session.router.js"
import { MONGODB_URI, SECRET_SESSION } from './utils/config.js';
import authRedirect from './middlewares/authRedirect.js';
import messageService from './services/messageService.js';

const app = express();

//MONGOOSE
mongoose.connect(MONGODB_URI)

//MIDLEWARES
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(`${__dirname}/../../public`));
app.use(cookieParser());
app.use(flash())

//HANDLEBARS
app.engine("handlebars", handlebars.engine());
app.set("views",`${__dirname}/../views`);
app.set("view engine", "handlebars");

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
      saveUninitialized: true
  }
))

//PASSPORT
initializatePassport();
app.use(passport.initialize())
app.use(passport.session())

//BIENVENIDA
app.get('/', authRedirect, async (req, res) => {
  try {
    const userId = req.session.user._id
    const cart = await cartService.getCartWithUserId(userId)
    res.render(
      "home", {
        layout: "default",
        title: 'Backend Juan Paladea',
        user: req.session.user,
        cart: cart 
      }
    )
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

//ROUTES

//API ROUTES
app.use('/api/session', apiSessionRouter)
app.use("/api/products", apiProductsRouter)
app.use("/api/carts", apiCartsRouter)
app.use("/api/tickets", apiTicketsRouter)

//VIEWS ROUTES
app.use(sessionRouter)
app.use("/products", productsRouter)
app.use("/carts", cartsRouter)

//PORT LISTEN
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// SOCKET SERVER
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("New connection", socket.id);
  
  const messages = await messageService.getMessages();

  socket.emit("messages", messages);

  socket.on("newMessage", (data) => {
    socketServer.emit("messages", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
})