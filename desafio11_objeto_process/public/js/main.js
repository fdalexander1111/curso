const socket = io();

//normalizacion 

const authorsSchema = new normalizr.schema.Entity('authors');
const msjSchema = new normalizr.schema.Entity('mensajes', { author: authorsSchema }, { idAttribute: 'id' });
const fileSchema = [msjSchema]

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("NEW_MESSAGE", (msg) => {
    appendMessage(msg);
  })
socket.on("UPDATE_MESSAGES", (allMessages) => {
    const denormalizeMsg = normalizr.denormalize(allMessages.result, fileSchema, allMessages.entities);
    document.getElementById("posts").innerHTML = "";
    denormalizeMsg
    .forEach(msg => appendMessage(msg._doc));
    compresion(allMessages, denormalizeMsg);
}); 

socket.on("UPDATE_PRODUCTS", (allProducts, url) => {
    
    fetch(url).then((resp) => {
      return resp.text();
    }).then((text) => {
        const template = Handlebars.compile(text);
        const html = template({ productsList: allProducts });
        document.querySelector("#products").innerHTML = html;
    });
}); 


function enviarMensaje(){

    const mensaje = {
        author: {
            id: document.getElementById("id").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            edad: document.getElementById("edad").value,
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value,
        },
        text: document.getElementById("text").value
    }
    socket.emit("POST_MESSAGE", mensaje);
}


function sendProduct(){

    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const thumbnail = document.getElementById("thumbnail").value;
  
    socket.emit("POST_PRODUCT", { title, price, thumbnail });
}

function appendMessage(msg) {
  
    document.getElementById("posts").innerHTML += `

        <p>
            <span class="text-blue-600 font-bols">${msg.author.id}</span>
            <span class="text-amber-900">[${msg.author.timestamp}]: </span>
            <span class="italic text-green-600">${msg.text}</span>
        </p>
    `;
}

function compresion(allMessages, denormalizeMsg){
    const comp = document.getElementById("compresion");
    const denormalizeMsgLength = (JSON.stringify(denormalizeMsg)).length;
    const allMessagesLength = (JSON.stringify(allMessages)).length;
    const compresion = ((allMessagesLength - denormalizeMsgLength) / allMessagesLength * 100).toFixed(2);
    comp.innerHTML = `(Compresion: ${compresion}%)`;
}



