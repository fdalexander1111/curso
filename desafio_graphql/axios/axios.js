import axios from 'axios';

async function getAllProducts(){

    try {
        const response = await axios.get("http://localhost:8080/api/productos/");
        console.log(response.data);
    } catch (error) {
        console.log("no se puede obtener la lista de productos");
    }
}

function saveProduct(){

    axios.post('http://localhost:8080/api/productos/', {
        title: 'producto1',
        price: 1000,
        thumbnail: 'foto 1',
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}

function deleteProduct(){

    axios.delete("http://localhost:8080/api/productos/639632d9730c90b135e76644", {
   
      }) 
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

}

function editProduct(){

    axios.put("http://localhost:8080/api/productos/63962c18730c90b135e76634", {
        data: {
          title: 'producto editado',
          price: 2001,
          thumbnail: 'foto 2 ed',
        }
      }) 
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
}



  /* 
    Zona de pruebas
  */

//getAllProducts();
saveProduct();
//deleteProduct();
//editProduct();