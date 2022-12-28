'use strict'

const ProductModel =  use('App/Models/Product');


class ProductController {

    async create({request, response}){

        const product = new ProductModel;
        product.title =   request.input('title');
        product.price = request.input('price');
        product.thumbnail = request.input('thumbnail');

        const productSave = await product.save();
      
        
            if(productSave){
    
                response.json({
                    'status':'ok',
                    'message' : 'producto creado correctamente',
                    'code':'200',
                    'products': product
                });
            }else{
                response.status(400).json({
                    'status':'nok',
                    'message' : 'No se pudo crear el producto',
                    'code':'400',
                    'products': null
                });
            }
    }
     

    async getAll({request, response}) {
    
        const products = await ProductModel.all();
       
        if(products){
    
            response.json({
                'status':'ok',
                'message' : 'Se envio la lista de productos',
                'code':'200',
                'products': products
            });
        }else{
            response.status(400).json({
                'status':'nok',
                'message' : 'No se pudo enviar la lista de productos',
                'code':'400',
                'products': null
            });
        }
    }

    async getProductById({request, response, params}) {

        const product = await ProductModel.findBy('id', params.id);
        if(product){
    
            response.json({
                'status':'ok',
                'message' : 'Se envio el producto',
                'code':'200',
                'products': product
            });
        }else{
            response.status(400).json({
                'status':'nok',
                'message' : 'No se pudo encontro el producto',
                'code':'400',
                'products': null
            });
        }
    }
    async updateById({ request, response, params }) {

        const product = await ProductModel.findBy('id', params.id);

        product.title =   request.input('title');
        product.price = request.input('price');
        product.thumbnail = request.input('thumbnail');

        const productEdit = await product.save();

        if(productEdit){
    
            response.json({
                'status':'ok',
                'message' : 'producto editado correctamente',
                'code':'200',
                'products': product
            });
        }else{
            response.status(400).json({
                'status':'nok',
                'message' : 'No se pudo editar el producto',
                'code':'400',
                'products': null
            });
        }
        

    }
    async deleteById({ request, response, params }) {

        const product = await ProductModel.findBy('id', params.id);

        if(product.delete()){
            response.json({
                'status':'ok',
                'message' : 'producto eliominado correctamente',
                'code':'200'
              
            });
        }else{
            response.status(400).json({
                'status':'nok',
                'message' : 'No se pudo eliminar el producto',
                'code':'400',
                'products': null
            });
        }
    }

    
}

module.exports = ProductController
