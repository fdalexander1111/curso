const messages = require("../schemas/messages");
const fs = require('fs');
const { DefaultDeserializer } = require('v8');
const { config } = require("../config");
const URIString = config.URIString;

class Message{

    constructor(){

      this.model = messages;
      this.connect;
    
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
                return [];
            }
        } catch (error) {
            return false;
        }
    }


}

module.exports = { Message: Message };