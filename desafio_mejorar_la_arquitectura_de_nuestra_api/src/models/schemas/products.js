import mongoose from 'mongoose';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    price: { type: String, required: true, max: 10 },
    thumbnail: { type: String, required: true, max: 100 }

});

const products = mongoose.model(productsCollection, productsSchema);

export default products;