const socket = io();

socket.on("NEW_MESSAGE", (msg) => {
    appendMessage(msg);
  })
socket.on("UPDATE_MESSAGES", (allMessages) => {

    document.getElementById("posts").innerHTML = "";
    allMessages
    .sort((a,b) => a.date - b.date)
    .forEach(msg => appendMessage(msg));
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

    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
  
    socket.emit("POST_MESSAGE", {email, message});
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
            <span class="text-blue-600 font-bols">${msg.email}</span>
            <span class="text-amber-900">[${msg.date}]: </span>
            <span class="italic text-green-600">${msg.message}</span>
        </p>
    `;
}



