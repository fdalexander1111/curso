import fs from "fs";
import { DefaultDeserializer } from 'v8'
import { config } from "../../config.js";
import { renameField, removeField, asPOJO } from '../utils.js';
import mongoose from "mongoose";

const URIString = config.URIString;

export default class mongoDBContainer{

    constructor(model){

      this.model = model;
      this.connect();
    
    }

    async connect(){

        try {
            return await mongoose.connect(URIString);

        } catch (err) {

        throw new Error(`ERROR DE CONEXION + ${err}`)

        }
    }
  
    async save(object){
        try {
            const document = new this.model(object);
            const result = await document.save();
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
    
    async getByname(field, name){

        try {
            const documents = await this.model.findOne({ [field] : name });
            if(documents){

                return documents;
            }else{
                return false;
            }
        } catch (error) {
            return false;
        }

    }


}