import { messageDao } from '../index.js';
import { Document, Types } from "mongoose";


    export async function getAll(req, res){

        try {
            const message = await messageDao.getAll();
            if(message){
    
                res.json({
                    'status':'ok',
                    'message' : 'Lista de message enviada correctamente',
                    'code':'200',
                    'message': message
                });
            }else{
                res.status(400).json({
                    'status':'nok',
                    'message' : 'No se encontraron los mensajes',
                    'code':'400',
                    'products': null
                });
            }
       
        } catch (error) {
            res.json({error: error.message});
        }

    }

   export async function save(req , res){

        try {

            const message = req.body;
            const result = await messageDao.save(message);

            if(result){

                res.json({
                    'status':'ok',
                    'message' : 'Lista de mensajes entregada correctamente',
                    'code':'200',
                    'result': result
                });
            }else{
                res.status(400).json({
                    'status':'nok',
                    'message' : 'No se pudo devolver la lista de mensajes',
                    'code':'400',
                    'result': null
                });
            }
            
        } catch (err) {

            res.status(400).json({error: err.message});
        }
        
    }

