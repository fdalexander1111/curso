const express = require("express");
const { Router } = express;

const app = express();
const router = Router();
const Contenedor = require("./src/Contenedor.js").Contenedor;
const container = new Contenedor("./archivos/productos.txt");
const path = require('node:path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', (req,res) => {

    let allProductLink = path.relative('/', '/productos/')
    res.render("addProduct", {
        title: "crear",
        allProductLink: allProductLink   
    });
});

router.get('/', async (req, res)=>{
     
    const products = await container.getAll();
    let addProductLink = path.relative('/productos/', '/')
    res.render("products", {
        title: "Productos",
        productList: products,      
        addProductLink: addProductLink,      
    });
}); 

router.get('/:id', async (req, res, next)=>{
    
    let product_id = req.params.id;
    const product = await container.getById(product_id);
    if(product.status == "ok"){
        res.json(product.producto);
    }else{
        res.json({error: 'producto no encontrado'})
    }
});

router.post('/', async(req, res) => {
    
    const product =  req.body;
    const saveProduct = await container.save(product);
    res.redirect('/');

});

router.put('/:id', async(req, res) => {

    const product =  req.body;
    let product_id = req.params.id;
    const updateProduct = await container.updateById(product_id, product);
    res.json(updateProduct);
    
});

router.delete('/:id', async(req, res) => {

    let product_id = req.params.id;
    const deleteProduct = await container.deleteById(product_id);

    console.log(deleteProduct);
    res.json(deleteProduct);
  
});

app.use("/productos", router);

const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


server.on("error", error => console.log(`Error: ${error}`));