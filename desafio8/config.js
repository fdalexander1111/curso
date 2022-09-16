const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const user = process.env.DATABASE_MONGODB_USER;
const password = process.env.DATABASE_MONGODB_PASSWORD;
const database = process.env.DATABASE_MONGODB_NAME;
const URIString = `mongodb+srv://${user}:${password}@cluster0.zdu2a1t.mongodb.net/${database}?retryWrites=true&w=majority`;

const config = {
    type: process.env.DATABASE,
    URIString: URIString,
}

module.exports = {config: config};