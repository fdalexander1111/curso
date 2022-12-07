import mongoose from "mongoose";
import { config } from "../../config/config.js";

const URIString = config.URIString;

export default class DbClient {

    constructor(){
        const URIString = config.URIString;
        this.connect();
    }

    async connect(){

        try {
            return await mongoose.connect(URIString);

        } catch (err) {

            throw new Error(`ERROR DE CONEXION + ${err}`);
        
        }

    }

    async disconnect(){

        try {
            mongoose.connection.close();
        } catch (err) {
            
            throw new Error(`ERROR AL CERRAR LA CONEXION + ${err}`);
        }
        
    }

}