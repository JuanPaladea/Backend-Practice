import express from 'express'
import handlebars from "express-handlebars";
import apiCartsRouter from "./routes/apiCarts.router.js"
import apiProductsRouter from "./routes/apiProducts.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import { Server } from "socket.io";
import { __dirname } from './utils.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

//MONGOOSE
mongoose.connect(process.env.MONGODB_URI)

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.engine("handlebars", handlebars.engine());
app.set("views",`${__dirname}/views`);
app.set("view engine", "handlebars");

//BIENVENIDA
app.get('/', (req, res) => {
  res.render(
    "home", {
      layout: "default",
      title: 'Backend Juan Paladea'
    }
  )
})

//ROUTES
app.use("/api/products", apiProductsRouter)
app.use("/api/carts", apiCartsRouter)
app.use("/products", productsRouter)
app.use("/carts", cartsRouter)

//PORT LISTEN
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})

// SOCKET SERVER
const socketServer = new Server(httpServer);