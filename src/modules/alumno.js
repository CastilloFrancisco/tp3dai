class Alumno {
    strNombre = "";
    strDNI = "";
    intEdad = 0;

    constructor(nombre, dni, edad){
        this.strNombre = nombre;
        this.strDNI = dni;
        this.intEdad = edad;
    }

    toString() {
        return `nombre: '${this.strNombre}' || DNI: '${this.strDNI}' || Edad: '${this.intEdad}' `
    }
}

export default Alumno;