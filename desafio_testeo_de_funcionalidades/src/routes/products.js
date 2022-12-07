import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import ProductController from '../controllers/ProductController.js';

const router = Router();

class RouterProduct{

    constructor(){

        this.productController = new ProductController();
    }

    start(){
       
        router.get("/", this.productController.getAll);
        router.post("/", auth, this.productController.save);

        return router;
    }
}


export default RouterProduct;