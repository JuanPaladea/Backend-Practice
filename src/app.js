import express from 'express'
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"
import { Server } from "socket.io";
import { __dirname } from './utils.js';
import mongoose from 'mongoose';
import messagesManagerDB from './dao/utils/messageManagerDB.js';

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
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//PORT LISTEN
const port = 8080;
const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// SOCKET SERVER CHAT
const socketServer = new Server(httpServer);
const messagesManagerService = new messagesManagerDB()

app.get('/chat', async (req, res) => {
  const chat = await messagesManagerService.getMessages({})
  res.render(
    "chat",
    {
      style: 'index.css',
      layout: 'main',
      chat: chat
    }
  )
})

socketServer.on("connection", socket => {
  socket.on("addMessage", async messageData => {
    await messagesManagerService.addMessage(messageData.user, messageData.message)
  })

  socket.on("getMessages", async () => {
    const message = await messagesManagerService.getMessages()
    socket.emit("receiveMessages", message)
  })
})