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

}


const producto =   {
    tittle: 'Quinoa Organica',
    price: '4900',
    thumbnail: 'https://jumbo.vtexassets.com/arquivos/ids/357170-750-750?width=750&height=750&aspect=true',
};

let contenedor = new Contenedor('./archivos/productos.txt');
(async() => {
    const productById = await contenedor.getById(1);
    console.log(productById);
    const productsList = await contenedor.getAll();
    console.log(productsList);
    const deleteProducts = await contenedor.deleteAll();
    console.log(deleteProducts);
    const productsListafterDeleteAll = await contenedor.getAll();
    console.log( await productsListafterDeleteAll);
    const saveProduct = await contenedor.save(producto);
    console.log(saveProduct);
    const deleteById = await contenedor.deleteById(1);
    console.log(deleteById);
    const saveProduct2 = await contenedor.save(producto);
    console.log(saveProduct2);
    const saveProduct3 = await contenedor.save(producto);
    console.log(saveProduct3);
    const productsList2 = await contenedor.getAll();
    console.log(productsList2);

})();