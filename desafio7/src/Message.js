const fs = require('fs');
const { DefaultDeserializer } = require('v8');

class Message{

    constructor(knex, database){

        this.knex = knex;
        this.database = database;

    }

    async getAll(){
        try {
            const messages = await this.knex(this.database).select();
            return messages;
        } catch (error) {
            return "No se pudo devolver la lista de mensajes";
        }
    }

    async save(message){
        try {
            const insert = await this.knex(this.database).insert(message);
            return message;

        } catch (error) {
              return "No se pudo agregar el mensaje al archivo";
        }
    }


}

module.exports = {Message: Message};