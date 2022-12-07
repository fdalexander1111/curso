import express from 'express';
import RouterProduct from "./src/routes/products.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

/**
 * Zona de rutas
 */
app.use("/api/productos", RouterProduct);
/*app.use("/api/mensajes", routerShoppingCart);
app.use("/api/user", routerUser);*/


app.use((req, res) => {
  const array = {
    "error": -2,
    "descripcion":  `ruta: ${req.url} metodo: ${req.method} no implementado`
  }
  res.status(404).json(array);

})

const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => {
  console.log('Servidor corriendo en el puerto 8080');
});