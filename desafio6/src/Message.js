const fs = require('fs');
const { DefaultDeserializer } = require('v8');

class Message{

    constructor(archivo){

        this.archivo = archivo;

    }

    async getAll(){
        try {
            const messages = await fs.promises.readFile(this.archivo, 'utf-8');
            const messageParse = JSON.parse(messages);
            
            return messageParse;

        } catch (error) {
            return "No se pudo devolver la lista de mensajes";
        }
    }

    async save(message){
        try {
            const messages = await this.getAll();
            let nextId;

            if(!messages.length){
                nextId = 1;
            }else{
                const lastMessage = messages.slice(-1)[0];
                let lastMessageId = lastMessage.id;
                nextId = lastMessageId + 1; 
            }
            message['id'] = nextId;
            messages.push(message);
            const writeFile = await fs.promises.writeFile(this.archivo, JSON.stringify(messages));
            return message;

        } catch (error) {
              return "No se pudo agregar el mensaje al archivo";
        }
    }


}

module.exports = {Message: Message};