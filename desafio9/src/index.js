import dotenv from 'dotenv';
dotenv.config();
let productDao;
let messageDao;

switch (process.env.DATABASE) {

    case "mongoDB":
        const { default: messageDaoMongoDB } = await import('./dao/message/messageDaoMongoDB.js');
        messageDao = new messageDaoMongoDB();
        
        const { default: productDaoMongoDB } = await import('./dao/product/productDaoMongoDB.js');
        productDao = new productDaoMongoDB();
           
        break
}

export { productDao, messageDao }