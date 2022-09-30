import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    email: { type: String, required: true, max: 400},
    password: { type: String, required: true, max: 400 }
});



const messages = mongoose.model(usersCollection, usersSchema);

export default messages;