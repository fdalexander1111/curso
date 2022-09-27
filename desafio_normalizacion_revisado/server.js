import express from 'express';
import { Router } from "express";
import {Server as HTTPServer} from 'http';
import {Server as SocketServer } from 'socket.io';
import { NEW_PRODUCT, UPDATE_PRODUCTS, POST_PRODUCT , NEW_MESSAGE, POST_MESSAGE, UPDATE_MESSAGES } from "./socket_events.js";
import dayjs from "dayjs";
import { productDao } from './src/index.js';
import { messageDao } from './src/index.js';
import handlebars from "express-handlebars";
import path from 'node:path';
import { FakerList } from './src/controllers/ProductsController.js';
import {fileURLToPath} from 'url';
import { normalizeMsg } from './normalize.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from './config.js';
import { auth } from './middlewares/login.js';




const app = express();
const router = Router();
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
/*
app.use(session({
    store: new MongoStore({
      mongoUrl: config.URIString,
      ttl: 60 * 10, // 10 segundo
      retries: 0
    }),
    secret: config.ESTRING_SECRETA ,
    resave: false,
    saveUninitialized: true,
}));*/

app.get('/', (req,res) => {

    let allProductLink = path.relative('/', '/productos/')

   /* console.log(req.session.name);
    let name = req.session.name ? req.session.name : null*/
    res.render("addProduct", {
        allProductLink: allProductLink  ,
       // sessionName: name,
    });
});


app.get('/login/', (req,res) => {

    res.render("login");
});

app.post('/login/', (req,res) => {
    
    if(req.body.name){
        req.session.name = req.body.name;
        res.redirect('/');
    }
    
});

app.get('/logout/', (req,res) => {

    res.render("logout");
});
app.post('/logout/', (req,res) => {
    
   
    req.session.destroy(err => {
        if(err) {
          res.send("Error al cerrar sesion");
        } else {
            res.render("logout");
        }
    });
});

app.get('/api/productos-test', async (req,res) => {

    const productsList = await FakerList.FakerList();

    res.render("productsFaker", {
        fakerProductList: productsList   
    });

});

socketServer.on("connection", async (socket) => {

    const messages = await messageDao.getAll();
    const products = await productDao.getAll();
    const url = "http://localhost:8080/hbs/table.hbs"; 


    messages.forEach( message => {
       message.date = dayjs(message.date).format('YYYY-MM-DD HH:mm:ss');
    });

    socketServer.emit(UPDATE_MESSAGES,normalizeMsg(messages));
    socketServer.emit(UPDATE_PRODUCTS, products, url);

    socket.on(POST_MESSAGE, async (msg) => {
        /*const _msg = {
            ...msg, 
            date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };*/
        const saveD = messageDao.save(msg);
  
        socketServer.sockets.emit(NEW_MESSAGE, msg);
    });

    socket.on(POST_PRODUCT, async(product) => {
        await productDao.save(product);
        socketServer.sockets.emit(UPDATE_PRODUCTS, await productDao.getAll(), url);
    });

});

app.use("/productos", router);

const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


server.on("error", error => console.log(`Error: ${error}`));