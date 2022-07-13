const fs = require('fs');

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
            products.push(product);
            const writeFile = await fs.promises.writeFile(this.archivo, JSON.stringify(products));

            return "se ha agregado el producto";

        } catch (error) {
              return "No se pudo agregar el producto al archivo";
        }
    }
        
    async getById(id){
        try {
            
            const productos = await fs.promises.readFile(this.archivo, 'utf-8');
            const productosParse = JSON.parse(productos);
            let producto = productosParse.find(item => item.id === id );

            return producto;

        } catch (error) {
            return "No se encontro el producto solicitado";
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
            const productDeleteIndex = products.filter(item => item.id != product.id);

            const deleteById = await fs.promises.writeFile(this.archivo, JSON.stringify(productDeleteIndex));      
      
            return  `se borro el producto de id ${id}`;

        } catch (error) {
          
            return  `no se pudo borrar el producto de id ${id}`;
        }
    }

    async deleteAll(){
        try {
            const deleteAll = await fs.promises.writeFile(this.archivo,"[]");
                   
            return "Se borraron todos los productos del archivo";

        } catch (error) {
        
            return "No se pudo borrar los datos"
            
        }
    }
    async random(){
        try {
            const products = await this.getAll();
            let randomNum =  Math.floor(Math.random() * products.length) + 1;
            const product = await this.getById(randomNum);
            return product;

        } catch (error) {
            
            return "No se pudo obtener el producto random"
            
        }

    }

}
module.exports = {Contenedor: Contenedor};