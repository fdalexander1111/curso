function generaAleatorio(min,max){
    
    return Math.round(Math.random() * (max - min) + min)

}

function generaNaleatorios(n,min,max){

    let arrayNaleatorios=new Array(n);
    for (let index = 0; index < n; index++) {
        arrayNaleatorios[index]=generaAleatorio(min,max);
    }
 
    return arrayNaleatorios;
}

function calcular(n = null) {

    const cantidad = n ? n : 100000000;
    const array = generaNaleatorios(cantidad,1,1000);
    const repetidos = {};

    array.forEach(function(numero){
        repetidos[numero] = (repetidos[numero] || 0) + 1;
    });

    return repetidos
    
}  
  // Message del padre al hijo
    process.on("message", (msg) => {
        const repetidos = calcular(msg);
            process.send(repetidos); // Del hijo hacia el padre
    })