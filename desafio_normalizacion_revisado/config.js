import dotenv from 'dotenv';

dotenv.config();

const user = process.env.DATABASE_MONGODB_USER;
const password = process.env.DATABASE_MONGODB_PASSWORD;
const database = process.env.DATABASE_MONGODB_NAME;
const URIString = `mongodb+srv://${user}:${password}@cluster0.zdu2a1t.mongodb.net/${database}?retryWrites=true&w=majority`;
const URIStringSessions = `mongodb+srv://${user}:${password}@cluster0.zdu2a1t.mongodb.net/sessions?retryWrites=true&w=majority`;

const config = {
    type: process.env.DATABASE,
    URIString: URIString,
    ESTRING_SECRETA: 'claveultrasecrea'
}

export {config};