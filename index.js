//SE CORRE PONIENDO node index.js
//hay que hacerlo cada vez q cambias la URL

import express from "express"; // hacer npm i express
import cors from "cors";    // hacer npm i cors
import axios from "axios";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./src/modules/OMDBWrapper.js"
import Alumno from "./src/models/alumno.js"
import { sumar, restar, multiplicar, dividir } from "./src/modules/matematica.js"
import ValidacionesHelper from "./src/modules/ValiacionesHelper.js";


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

    let strNombre = req.params.nombre
    if (ValidacionesHelper.getStringOrDefault(strNombre, 0) == 0) {
        return res.status(400).send('Falló algo :(');
    }

    return res.send(`Hola ${strNombre}👋`);
})

app.get('/validarfecha/:anio/:mes/:dia', (req, res) => {
    const anio = ValidacionesHelper.getIntegerOrDefault(req.params.anio, 0);
    const mes = ValidacionesHelper.getIntegerOrDefault(req.params.mes, 0);
    const dia = ValidacionesHelper.getIntegerOrDefault(req.params.dia, 0);


    if (anio === 0 || mes === 0 || dia === 0) {
        return res.status(400).send('Corregí los parámetros');
    }


    const fecha = new Date(`${anio}-${mes}-${dia}`);

    if (isNaN(fecha.getTime())) {
        return res.status(400).send('Fecha inválida');
    }

    return res.status(200).send('Fecha válida');
});

app.get(`/matematica/sumar`, (req, res) => {

    if (ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.n1, 'error')) == 'error' ||
        ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.n2, 'error')) == 'error') {
        return res.status(400).send('Están mal las cosas');
    }
    let resultado = sumar(
        parseInt(req.query.n1),
        parseInt(req.query.n2)
    );

    return res.status(200).send(resultado);
})
app.get(`/matematica/restar`, (req, res) => {

    if (ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.n1, 'error')) == 'error' ||
        ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.n2, 'error')) == 'error') {
        return res.status(400).send('Están mal las cosas');
    }

    let resultado = restar(
        parseInt(req.query.n1),
        parseInt(req.query.n2)
    );

    return res.status(200).send(resultado);
})
app.get(`/matematica/multiplicar`, (req, res) => {
    if (ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.n1, 'error')) == 'error' ||
        ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.n2, 'error')) == 'error') {
        return res.status(400).send('Están mal las cosas');
    }
    let resultado = multiplicar(
        parseInt(req.query.n1),
        parseInt(req.query.n2)
    );

    return res.status(200).send(resultado);
})
app.get(`/matematica/dividir`, (req, res) => {

    let num1 = parseInt(req.query.n1)
    let num2 = parseInt(req.query.n2)
    if (ValidacionesHelper.getIntegerOrDefault(parseInt(num1, 'error')) == 'error' ||
        ValidacionesHelper.getIntegerOrDefault(parseInt(num2, 'error')) == 'error') {
        return res.status(400).send('Están mal las cosas');
    }
    if (num2 != 0) {

        let resultado = dividir(num1, num2);
        return res.status(200).send(resultado);
    } else {

        return res.status(400).send('no se puede dividir por 0');
    }

})



app.get(`/omdb/searchbypage`, async (req, res) => {

    if (ValidacionesHelper.getStringOrDefault(req.query.search, 0) == 0 ||
        ValidacionesHelper.getIntegerOrDefault(parseInt(req.query.p, 'error')) == 'error') {
        return res.status(400).send('Falló algo :(');
    }
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

app.get(`/omdb/searchcomplete`, async (req, res) => {
    if (ValidacionesHelper.getStringOrDefault(req.query.search, 0) == 0) {
        return res.status(400).send('Falló algo :(');
    }
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

app.get(`/omdb/getbyomdbid`, async (req, res) => {
    if (ValidacionesHelper.getStringOrDefault(req.query.search, 0) == 0) {
        return res.status(400).send('Falló algo :(');
    }
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


const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`/alumnos`, async (req, res) => {


    const alumnosArray = [];

    alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
    alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
    alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

    return res.status(200).send(alumnosArray);
}
)

app.get(`/alumnos/:dni`, async (req, res) => {

    let DNI = req.params.dni;
    let alumnoEncontrado = null

    if (ValidacionesHelper.getIntegerOrDefault(parseInt(DNI, 'error')) == 'error') {
        return res.status(400).send('Están mal las cosas');
    }

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
    alumnosArray.push(nuevoAlumno);
    return res.status(201).json(nuevoAlumno);
});

app.delete('/alumnos', (req, res) => {

    const { dni } = req.body;

    if (!dni) {
        return res.status(400).send("No está el dni");
    }

    const index = alumnosArray.findIndex(alum => alum.strDNI === dni);

    if (index !== -1) {
        const eliminado = alumnosArray.splice(index, 1);
        return res.status(200).send("Alumno eliminado");
    } else {
        return res.status(404).send("No se encontró el alumno con ese DNI");
    }
});
//
// Inicio el Server y lo pongo a escuchar.
//

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


