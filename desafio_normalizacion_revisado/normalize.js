import { normalize, schema } from 'normalizr';

const authorsSchema = new schema.Entity('authors');
const msgSchema = new schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: 'id' });
const fileSchema = [msgSchema]

const normalizeMsg = (msg) => {
    const normalizedMessage = normalize(msg, fileSchema);
    console.log(normalizedMessage);
    return normalizedMessage;
}

export { normalizeMsg };