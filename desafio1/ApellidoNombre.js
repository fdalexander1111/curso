class Usuario {

    constructor(nombre,apellido,libros,mascotas){

        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
        
    }

    getFullName(){
        
        console.log(`${this.nombre} ${this.apellido}`);
    }

    addMascota(mascota){
        this.mascotas.push(mascota);
    }

    countMascotas(){
       return this.mascotas.length;
    }

    addBook(nombre, autor){

        const libro = { nombre: nombre, autor: autor};
        this.libros.push(libro);
    }

    getBookNames(){

        const names = this.libros.map(book => {
            return book.nombre;
        });

        return names;
    }
}

const libros = [{ nombre: "Harry Potter", autor: "J. K. Rowling"}];
const mascotas = ['Conejo', 'Perro', 'Gato'];
const usuario = new Usuario('Alexander', 'Fernandez', libros, mascotas);

usuario.getFullName();
console.log(usuario.countMascotas());
usuario.addMascota('Camaleon');
console.log(usuario.mascotas);
console.log(usuario.countMascotas());
usuario.addBook("El poder del ahora", "Eckhart Tolle");
console.log(usuario.libros);
console.log(usuario.getBookNames());
