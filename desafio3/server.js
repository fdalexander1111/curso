const express = require("express");
const app = express();
const Contenedor = require("./src/Contenedor.js").Contenedor;

const container = new Contenedor("./archivos/productos.txt");

app.get('/', (req, res)=>{
   res.send('hola mundo'); 
});

app.get('/productos', async (req, res)=>{
     
    const products = await container.getAll();
    res.send({products});
}); 

app.get('/productoRandom', async (req, res)=>{
     
    const product = await container.random();
    res.send({product});
}); 

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

server.on("error", error => console.log(`Error: ${error}`));