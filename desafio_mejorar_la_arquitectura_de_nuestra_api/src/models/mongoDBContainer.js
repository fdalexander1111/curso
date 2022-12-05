import { renameField, removeField, asPOJO } from '../utils/utils.js';
import DbClient from "./dbClient/DbClient.js";

export default class mongoDBContainer{

    constructor(model){

      this.client = new DbClient;
      this.model = model;    
      this.client.connect();
    
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