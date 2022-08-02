const fs = require('fs');
const { DefaultDeserializer } = require('v8');

class Contenedor{

    constructor(archivo){

        this.archivo = archivo;

    }

    async save(product){
        try {
            const products = await this.getAll();
            let nextId;

            if(!products.length){
                nextId = 1;
            }else{
                const lastProduct = products.slice(-1)[0];
                let lastProductId = lastProduct.id;
                nextId = lastProductId + 1; 
            }
            product['id'] = nextId;
            product['price'] = parseInt(product['price']);
            products.push(product);
            const writeFile = await fs.promises.writeFile(this.archivo, JSON.stringify(products));
            return product;

        } catch (error) {
              return "No se pudo agregar el producto al archivo";
        }
    }
        
    async getById(id){
        try {
            
            const productos = await fs.promises.readFile(this.archivo, 'utf-8');
            const productosParse = JSON.parse(productos);
            let producto = productosParse.find(item => item.id == id );
            if(producto){
                return { 'status': 'ok', 'producto': producto };
            }else{
                return { 'status': 'nok'};
            }
            return producto;

        } catch (error) {
            return "Error al buscar el producto solicitado";
        }
    }

    async getAll(){
        try {
            const productos = await fs.promises.readFile(this.archivo, 'utf-8');
            const productosParse = JSON.parse(productos);
            
            return productosParse;

        } catch (error) {
            return "No se pudo devolver la lista de productos";
        }
    }

    async deleteById(id){
        try {

            const product = await this.getById(id);
            const products = await this.getAll();
            const productDeleteIndex = products.filter(item => item.id != product.producto.id);
            const deleteById = await fs.promises.writeFile(this.archivo, JSON.stringify(productDeleteIndex));  
            
            if(product.status == "ok"){
                return `se borro el producto de id ${id}`;
            }else{
                return `No se encontro el producto de id ${id}`;                
            }

        } catch (error) {
            return  `no se pudo borrar el producto de id ${id}`;
        }
    }

    async deleteAll(){
        try {
            const deleteAll = await fs.promises.writeFile(this.archivo,"[]");
                   
            return "Se borraron todos los productos del archivo";

        } catch (error) {
        
            return "No se pudo borrar los datos";
            
        }
    }
    async random(){
        try {
            const products = await this.getAll();
            let randomNum =  Math.floor(Math.random() * products.length) + 1;
            const product = await this.getById(randomNum);
            return product.producto;

        } catch (error) {
            
            return "No se pudo obtener el producto random";
            
        }

    }

    async updateById(id, product){
        try {
            const productsList = await this.getAll();
            const productIndex = productsList.findIndex(item => item.id == id);

            if(productIndex >= 0){
                              
                product['id'] = parseInt(id);
                productsList.splice(productIndex,1, product);
                const updateById = await fs.promises.writeFile(this.archivo, JSON.stringify(productsList));
                return product; 

            }else{
                return "No se encontro el Producto";
            }

        } catch (error) {
            
            return "No se pudo actualizar el producto";
            
        }
      
    }

}
module.exports = {Contenedor: Contenedor};