import express from 'express'
import cartsRouter from "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//BIENVENIDA
app.get('/', (req, res) => {
  res.send("Bievenido")
})

//ROUTES
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//PORT LISTEN
const port = 8800;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})