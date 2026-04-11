//SE CORRE PONIENDO node index.js
//hay que hacerlo cada vez q cambias la URL

import express from "express"; // hacer npm i express
import cors from "cors";    // hacer npm i cors
import axios from "axios";

const app = express();
const port = 3000;              // El puerto 3000 (http://localhost:3000)


// Agrego los Middlewares

app.use(cors());         // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON


//
// Aca pongo todos los EndPoints
//

app.get('/', (req, res) => {                // EndPoint "/"
    return res.send('Ya estoy respondiendo!');
})

app.get('/saludar/:nombre', (req, res) => {             // EndPoint "/saludar"
    return res.send(`Hola ${req.params.nombre}👋`);
})

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {

    let dia = parseInt(req.params.dia);
    let mes = parseInt(req.params.mes);
    let anio = parseInt(req.params.ano);

    let fecha = new Date(anio, mes - 1, dia);

    if (fecha.getDate() == dia && fecha.getMonth() == mes - 1 && fecha.getFullYear() == anio) {

        return res.status(200).send(`Fecha válida`);

    } else {
        return res.status(400).send('Fecha inválida');
    }
})


import { sumar, restar, multiplicar, dividir } from "./modules/matematica.js"

app.get(`/matematica/sumar?n1={numero}&n2={numero}`, (req, res) => {

    let resultado = sumar(
        parseInt(req.query.n1),
        parseInt(req.query.n2)
    );

    return res.status(200).send(resultado);
})
app.get(`/matematica/restar?n1={numero}&n2={numero}`, (req, res) => {

    let resultado = restar(
        parseInt(req.query.n1),
        parseInt(req.query.n2)
    );

    return res.status(200).send(resultado);
})
app.get(`/matematica/multiplicar?n1={numero}&n2={numero}`, (req, res) => {

    let resultado = multiplicar(
        parseInt(req.query.n1),
        parseInt(req.query.n2)
    );

    return res.status(200).send(resultado);
})
app.get(`/matematica/dividir?n1={numero}&n2={numero}`, (req, res) => {

    let num1 = parseInt(req.query.n1)
    let num2 = parseInt(req.query.n2)
    if (num2 != 0) {

        let resultado = dividir(num1, num2);
        return res.status(200).send(resultado);
    } else {

        return res.status(400).send('no se puede dividir por 0');
    }

})


import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./modules/omdb-wrapper.js"

app.get(`/omdb/searchbypage?search={texto}&p={pagina}`, async (req, res) => {
    try {

        let respuesta = await OMDBSearchByPage(
            req.query.search,
            req.query.p
        );
        return res.status(200).send(respuesta);

    } catch {

        return res.status(400).json({
            respuesta: false,
            cantidadTotal: 0,
            datos: [],
        });

    }
})

app.get(`/omdb/searchcomplete?search={texto}`, async (req, res) => {

    try {

        let respuesta = await OMDBSearchComplete(
            req.query.search,
        );
        return res.status(200).send(respuesta);

    } catch {

        return res.status(400).json({
            respuesta: false,
            cantidadTotal: 0,
            datos: [],
        });

    }
})

app.get(`/omdb/getbyomdbid?imdbID={imdb}`, async (req, res) => {

    try {

        let respuesta = await OMDBGetByImdbID(
            req.query.imdbID,
        );

        return res.status(200).send(respuesta);
    } catch {
        return res.status(400).json({
            respuesta: false,
            cantidadTotal: 0,
            datos: [],
        });
    }
})


import Alumno from "./models/alumno.js"
    const alumnosArray = [];

    alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
    alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
    alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));


app.get(`/alumnos`, async (req, res) => {

    const alumnosArray = [];

    alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
    alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
    alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

    return res.status(200).send(alumnosArray);
})

app.get(`/alumnos/:dni`, async (req, res) => {

    let DNI = req.params.dni;
    let alumnoEncontrado = null

    alumnoEncontrado = await alumnosArray.find((alum) => alum.strDNI == DNI) 

    if (alumnoEncontrado != null) {

        return res.status(200).send(alumnoEncontrado);

    } else {
        return res.status(400).send('No se encontró');
    }
})

app.post('/alumnos', async (req, res) => {

    const { username, dni, edad } = req.body;

    const nuevoAlumno = new Alumno(username, dni, edad);

    alumnosArray.push(nuevoAlumno); // 👈 lo que pide la consigna

    return res.status(201).json(nuevoAlumno);
});

app.delete(`/alumnos`, async (req, res) => {

    const { dni } = req.body;

    let index = alumnosArray.findIndex((alum) => alum.strDNI == dni);

    if (index !== -1) {

        alumnosArray.splice(index, 1);

        return res.status(200).send('Alumno eliminado');

    } else {

        return res.status(404).send('No se encontró el alumno');

    }
})
//
// Inicio el Server y lo pongo a escuchar.
//

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

