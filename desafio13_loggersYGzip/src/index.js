import dotenv from 'dotenv';
dotenv.config();
let productDao;
let messageDao;
let userDao;

switch (process.env.DATABASE) {

    case "mongoDB":
        const { default: messageDaoMongoDB } = await import('./dao/message/messageDaoMongoDB.js');
        messageDao = new messageDaoMongoDB();
                
        const { default: productDaoMongoDB } = await import('./dao/product/productDaoMongoDB.js');
        productDao = new productDaoMongoDB();

        const { default: userDaoMongoDB } = await import('./dao/user/userDaoMongoDB.js');
        userDao = new userDaoMongoDB();
           
        break
}

export { productDao, messageDao, userDao }