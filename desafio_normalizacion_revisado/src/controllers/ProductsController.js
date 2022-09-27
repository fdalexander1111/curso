import { productDao } from '../index.js';
import { Document, Types } from "mongoose";


    export async function getAll(req, res){

        try {
            const product = await productDao.getAll();
            if(product){
    
                res.json({
                    'status':'ok',
                    'message' : 'Lista de productos enviada correctamente',
                    'code':'200',
                    'message': product
                });
            }else{
                res.status(400).json({
                    'status':'nok',
                    'message' : 'No se encontro la lista de productos',
                    'code':'400',
                    'products': null
                });
            }
       
        } catch (error) {
            res.json({error: error.message});
        }

    }

   export async function save(req , res){

        try {

            const product = req.body;
            const result = await messageDao.save(product);

            if(result){

                res.json({
                    'status':'ok',
                    'message' : 'Producto guardado correctamente',
                    'code':'200',
                    'result': result
                });
            }else{
                res.status(400).json({
                    'status':'nok',
                    'message' : 'No se pudo guardar el producto',
                    'code':'400',
                    'result': null
                });
            }
            
        } catch (err) {

            res.status(400).json({error: err.message});
        }
        
    }

    export async function FakerList(){

        const products = Array.from({ length: 5 }).map(() => {
           
            return {
              id: faker.datatype.uuid(),
              title: faker.commerce.product(),
              price: faker.commerce.price(100, 10000, 0),
              thumbnail: faker.image.imageUrl()
            };
        });
         return products;

    }

    
    