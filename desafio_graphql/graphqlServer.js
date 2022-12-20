import express from "express";
const app = express();

import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

import crypto from "crypto";

const schema = buildSchema(`
  type Product {
    id: ID!
    title: String
    price: String
    thumbnail: String
  }
  input ProductInput {
    title: String
    price: Int
    thumbnail: String
  }
  type Query {
    getProduct(id: ID!): Product
    getProducts(campo: String, valor: String): [Product]
  }
  type Mutation {
    createProduct(datos: ProductInput): Product
    updateProduct(id: ID!, datos: ProductInput): Product
    deleteProduct(id: ID!): Product
  }
`);

class Product {
  constructor (id, {title, price, thumbnail}) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.thumbnail = thumbnail;
  }
}

const ProductsContainer = {};


function getProduct({ id }) {
   if (!ProductsContainer[id]) {
    throw new Error('Producto no encontrado');
   }
   return ProductsContainer[id];
}

function getProducts({ campo, valor }) {
  const products = Object.values(ProductsContainer);
  if (campo && valor) {
    return products.filter( p => p[campo] === valor);
  } else return products;
}

function createProduct({datos}) {
  const id = crypto.randomBytes(10).toString('hex');
  const product = new Product(id, datos);
  ProductsContainer[id] = product;
  return product;
}

function updateProduct ({id, datos}) {
  if (!ProductsContainer[id]) {
    throw new Error('Producto no encontrado');
  }
  const updatedProduct = new Product(id, datos);
  ProductsContainer[id] = updatedProduct;
  return updatedProduct
}

function deleteProduct({id}) {
  if (!ProductsContainer[id]) {
    throw new Error('Producto no encontrado')
  }
  const deletedProduct = ProductsContainer[id];
  delete ProductsContainer[id];
  return deletedProduct;
}

//app.use(cors());
app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
  },
  graphiql: true,
}));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Ejecuntando servidor en puerto: ${PORT}`);
});