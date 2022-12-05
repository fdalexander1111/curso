import mongoDBContainer from "../mongoDBContainer.js";
import  products from "../schemas/products.js";

export default class productDaoMongoDB extends mongoDBContainer{


    constructor() {
 
        super(products);
    }    
} 