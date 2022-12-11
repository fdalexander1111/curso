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
        router.post("/", this.productController.save);
        router.put("/:id", this.productController.updateById);
        router.delete("/:id", this.productController.deleteById);

        return router;
    }
}


export default RouterProduct;