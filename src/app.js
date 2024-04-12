import express from 'express'
import handlebars from "express-handlebars";
import apiCartsRouter from "./routes/apiCarts.router.js"
import apiProductsRouter from "./routes/apiProducts.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import { Server } from "socket.io";
import { __dirname } from './utils.js';
import mongoose from 'mongoose';

const app = express();

//MONGOOSE
const uri = "mongodb+srv://juanpaladea:coderpaladea@database.hkfmtm1.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=DataBase"
mongoose.connect(uri)

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

app.engine("handlebars", handlebars.engine());
app.set("views",`${__dirname}/views`);
app.set("view engine", "handlebars");

//BIENVENIDA
app.get('/', (req, res) => {
  res.send("Bievenido")
})

//ROUTES
app.use("/api/products", apiProductsRouter)
app.use("/api/carts", apiCartsRouter)
app.use("/products", productsRouter)
app.use("/carts", cartsRouter)

//PORT LISTEN
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// SOCKET SERVER
const socketServer = new Server(httpServer);