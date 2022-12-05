import dotenv from 'dotenv';
dotenv.config();
let productDao;


switch (process.env.DATABASE) {

    case "mongoDB":
        const {  default: productDaoMongoDB } = await import('../DAO/ProductsDaoMongoDB.js');
       
        productDao = new productDaoMongoDB();
               
        break
}
export { productDao }