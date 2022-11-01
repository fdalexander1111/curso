import express from 'express';
import { Router } from "express";
import {Server as HTTPServer} from 'http';
import {Server as SocketServer } from 'socket.io';
import { NEW_PRODUCT, UPDATE_PRODUCTS, POST_PRODUCT , NEW_MESSAGE, POST_MESSAGE, UPDATE_MESSAGES } from "./socket_events.js";
import dayjs from "dayjs";
import { productDao } from './src/index.js';
import { messageDao } from './src/index.js';
import { userDao } from './src/index.js';
import handlebars from "express-handlebars";
import path from 'node:path';
import { FakerList } from './src/controllers/ProductsController.js';
import {fileURLToPath} from 'url';
import { normalizeMsg } from './normalize.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from './config.js';
import { auth } from './middlewares/login.js';
import bcrypt from "bcrypt";
import passport from "passport";
import LocalStrategy  from "passport-local";
import yargs from 'yargs';
import { fork } from 'child_process';
import compression from 'compression';

const app = express();
const router = Router();
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gzipMiddleware = compression();
const args = yargs(process.argv.slice(2))
  .alias({
    a: "modo",
    p: "puerto",
    d: "debug",
    m: "modo"
  })
  .default({
    ambiente: "dev",
    puerto: 8080,
    debug: false,
    modo: "FORK",
  })
  .argv

const port = args.puerto;
const mode = args.modo;
console.log(mode);

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

app.use(session({
    store: new MongoStore({
      mongoUrl: config.URIString,
      ttl: 60 * 10, // 10 segundo
      retries: 0
    }),
    secret: config.ESTRING_SECRETA ,
    resave: false,
    saveUninitialized: true,
}));

app.get('/', auth,  (req,res) => {

    let allProductLink = path.relative('/', '/productos/')
    let name = req.session.username ? req.session.username : null
    res.render("addProduct", {
        allProductLink: allProductLink  ,
        sessionName: name,
    });
});
console.log(args._);
app.get('/info', (req,res) => {

    res.render("info", {
        args: args._,
        io: process.platform,
        nodeVersion: process.version,
        rss: process.memoryUsage().rss,
        pathEjecution: process.cwd(),
        processId: process.pid,
        folderProy: __dirname
    });
});

app.get('/infoZip',gzipMiddleware, (req,res) => {

    res.render("info", {
        args: args._,
        io: process.platform,
        nodeVersion: process.version,
        rss: process.memoryUsage().rss,
        pathEjecution: process.cwd(),
        processId: process.pid,
        folderProy: __dirname
    });
});

passport.use("login", new LocalStrategy(async (username, password, done) => {

    const user = await userDao.getByname('email', username);
    const passwordHassBD = user.password;
    const passwordHass = bcrypt.compareSync(password, passwordHassBD)

    if (!user || !passwordHass) {
      return done(null, null, { message: "Invalid username or password" });
    }
    return done(null, user);
    
}));

passport.use("signup", new LocalStrategy({
    passReqToCallback: true
  }, async (req, username, password, done) => {
    
    const user = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    user.password = passwordHash;
    const userSave = await userDao.save(user);

    return done(null, newUser);

  }));
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    id = Types.ObjectId(id);
    const user = await userDao.findById(id);
    done(null, user);
  });
  

app.get('/login/', (req,res) => {

    let registerLink = path.relative('/', '/register/')

    res.render("login", { registerLink });
});

app.get('/login/error', (req,res) => {

    let loginLink = path.relative('../', '/login/')
    res.render("loginError" , { loginLink });
});

app.get('/register', (req,res) => {

    let loginLink = path.relative('/', '/login/')
    res.render("register" , { loginLink });
});

app.post('/register', async (req,res) => {

    if(userSave){
        res.redirect('/login')
    }else{
        res.redirect('/register/error');
    }

});

app.post("/register", passport.authenticate("signup", {
    failureRedirect: "/register/error",
}) , (req, res) => {  
        if(req.body.email){
            req.session.email = req.body.email;
            res.redirect('/');
        }
    });

app.get('/register/error', (req,res) => {

    let registerLink = path.relative('../', '/register/')
    res.render("registerError" , { registerLink });
});

app.post("/login", passport.authenticate("login", {
    failureRedirect: "/login/error",
  }) ,(req, res) => {
    if(req.body.username){
        req.session.username = req.body.username;
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
        const saveD = messageDao.save(msg);
  
        socketServer.sockets.emit(NEW_MESSAGE, msg);
    });

    socket.on(POST_PRODUCT, async(product) => {
        await productDao.save(product);
        socketServer.sockets.emit(UPDATE_PRODUCTS, await productDao.getAll(), url);
    });

});

app.use("/productos", router);


const server = httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


server.on("error", error => console.log(`Error: ${error}`));