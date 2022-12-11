import mongoose from 'mongoose';

const productsCollection = 'products';

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true, max: 100 }

});

const products = mongoose.model(productsCollection, productsSchema);

export default products;