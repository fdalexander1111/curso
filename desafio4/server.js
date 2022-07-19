const express = require("express");
const { Router } = express;

const app = express();
const router = Router();
const Contenedor = require("./src/Contenedor.js").Contenedor;

const container = new Contenedor("./archivos/productos.txt");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

router.get('/', async (req, res)=>{
     
    const products = await container.getAll();
    res.send({products});
}); 

router.get('/:id', async (req, res, next)=>{
    
    let product_id = req.params.id;
    const product = await container.getById(product_id);
    res.send({product});
});

router.post('/', async(req, res) => {
    
    const product =  req.body;
    const saveProduct = await container.save(product);
    res.send({saveProduct});

});

router.put('/:id', async(req, res) => {

    const product =  req.body;
    let product_id = req.params.id;
    const updateProduct = await container.updateById(product_id, product);
    res.send({updateProduct});
    
});

router.delete('/:id', async(req, res) => {

    let product_id = req.params.id;
    const deleteProduct = await container.deleteById(product_id);
    res.send({deleteProduct});
});

app.use("/api/productos", router);

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


server.on("error", error => console.log(`Error: ${error}`));