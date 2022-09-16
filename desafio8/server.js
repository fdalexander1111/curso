const express = require("express");
const { Router } = express;
const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const events = require("./socket_events");
const dayjs = require('dayjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const database = knex(knexConfig);
const tableName = 'productos ';
const tableNameMsg = 'mensajes ';

const app = express();
const router = Router();
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);

const Contenedor = require("./src/Contenedor.js").Contenedor;
const Message = require("./src/Message.js").Message;
const handlebars = require("express-handlebars");
const container = new Contenedor(database, tableName);
const chat = new Message();
console.log(chat);
const path = require('node:path');


const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layout",
    partialsDir: __dirname + "/views/partials/"
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");


app.get('/', (req,res) => {

    let allProductLink = path.relative('/', '/productos/')
    res.render("addProduct", {
        allProductLink: allProductLink   
    });
});

router.get('/', async (req, res)=>{
     
    const products = await container.getAll();
    let addProductLink = path.relative('/productos/', '/')
    res.render("products", {
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

    res.json(deleteProduct);
  
});

app.get('/api/productos-test', async (req,res) => {

    const productsList = await container.FakerList();

    res.render("productsFaker", {
        fakerProductList: productsList   
    });

});

socketServer.on("connection", async (socket) => {

    const messages = await chat.getAll();
    const products = await container.getAll();
    const url = "http://localhost:8080/hbs/table.hbs"; 


    messages.forEach( message => {
       message.date = dayjs(message.date).format('YYYY-MM-DD HH:mm:ss');
    });

    socketServer.emit(events.UPDATE_MESSAGES, messages);
    socketServer.emit(events.UPDATE_PRODUCTS, products, url);

    socket.on(events.POST_MESSAGE, async (msg) => {
        const _msg = {
            ...msg, 
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        chat.save(_msg);
        socketServer.sockets.emit(events.NEW_MESSAGE, _msg);
    });

    socket.on(events.POST_PRODUCT, async(product) => {
        await container.save(product);
        socketServer.sockets.emit(events.UPDATE_PRODUCTS, await container.getAll(), url);
    });

});

app.use("/productos", router);

const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


server.on("error", error => console.log(`Error: ${error}`));