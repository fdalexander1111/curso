import messages  from "../../schemas/messages.js";
import fs from "fs";
import { DefaultDeserializer } from 'v8'
import { config } from "../../config.js";
import { renameField, removeField, asPOJO } from '../utils.js';
import mongoose from "mongoose";

const URIString = config.URIString;

export default class Message{

    constructor(){

      this.model = messages;
      this.connect();
    
    }

    async connect(){

        try {
            console.log("se conecto a la base de datos");
            return await mongoose.connect(URIString);

        } catch (err) {

        throw new Error(`ERROR DE CONEXION + ${err}`)

        }
    }
  
    async save(object){
        try {
            const document = new this.model(object);
            console.log(object);
            console.log(document);
            const result = await document.save();
            console.log(result);
            return result;
            
        } catch (error) {
            return false;
        }
    }

    async getAll(){

        try {

            const documents = await this.model.find();
            if(documents){

                return documents;
            }else{
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async updateById(object) {
        try {
            renameField(object, 'id', '_id')
            const { n, nModified } = await this.model.replaceOne({ '_id': object._id }, object)
            if (n == 0 || nModified == 0) {
                return false
            } else {
                renameField(object, '_id', 'id');
                removeField(object, '__v');
                return asPOJO(object);
            }
        } catch (error) {
            return false;
        }
    }

    async deleteById(id) {
        try {
            const { n, nDeleted } = await this.model.deleteOne({ '_id': id })
            if (n == 0 || nDeleted == 0) {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async deleteAll() {
        try {
            await this.model.deleteMany({})
        } catch (error) {
            return false;
        }
    }


}