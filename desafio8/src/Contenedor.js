const fs = require('fs');
const { DefaultDeserializer } = require('v8');
const { faker } = require("@faker-js/faker");



class Contenedor{

    constructor(knex, database){

        this.knex = knex;
        this.database = database;

    }

    async save(product){
        try {
            product['price'] = parseInt(product['price']);
            const insert = await this.knex(this.database).insert(product);
            return product;

        } catch (error) {
              return "No se pudo agregar el producto al archivo";
        }
    }
        
    async getById(id){
        try {
            
            const producto = await this.knex(this.database).where('id', id)
            if(producto){
                return { 'status': 'ok', 'producto': producto };
            }else{
                return { 'status': 'nok'};
            }

        } catch (error) {
            return "Error al buscar el producto solicitado";
        }
    }

    async getAll(){
        try {
            const productos =  await this.knex(this.database).select();
                     
            return productos;

        } catch (error) {
            return "No se pudo devolver la lista de productos";
        }
    }

    async deleteById(id){
        try {

            const productDeleteIndex = await this.knex(this.database).where('id', id).del();
                       
             return `se borro el producto de id ${id}`;
         
        } catch (error) {
            return  `no se pudo borrar el producto de id ${id}`;
        }
    }

    /*async deleteAll(){
        try {
            const deleteAll = await fs.promises.writeFile(this.archivo,"[]");
                   
            return "Se borraron todos los productos del archivo";

        } catch (error) {
        
            return "No se pudo borrar los datos";
            
        }
    }*/
   /* async random(){
        try {
            const products = await this.getAll();
            let randomNum =  Math.floor(Math.random() * products.length) + 1;
            const product = await this.getById(randomNum);
            return product.producto;

        } catch (error) {
            
            return "No se pudo obtener el producto random";
            
        }

    }*/

    async updateById(id, product){
        try {
                product['price'] = parseInt(product['price']);           
                  
            
                const updateById = await this.knex(this.database).where(({ id: parseInt(id) })).update(product); 
                return product; 

        } catch (error) {
            
            return "No se pudo actualizar el producto";
            
        }
      
    }

    async FakerList(){

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



}
module.exports = {Contenedor: Contenedor};