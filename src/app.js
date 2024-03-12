import express from 'express'
import handlebars from "express-handlebars";
import cartsRouter from "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"
import { __dirname } from './utils.js';

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

//Incializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());

//Establecemos la ruta de vistas
app.set("views",`${__dirname}/views`);

//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

//Establecemos el servidor estático de archivos
app.use(express.static(`${__dirname}/../public`));

//BIENVENIDA
app.get('/', (req, res) => {
  res.send("Bievenido")
})

//ROUTES
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//PORT LISTEN
const port = 8080;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})