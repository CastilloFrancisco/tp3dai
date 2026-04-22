//SE CORRE PONIENDO node index.js
//hay que hacerlo cada vez q cambias la URL

import express from "express"; // hacer npm i express
import cors from "cors";    // hacer npm i cors
import axios from "axios";
import { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID } from "./src/modules/OMDBWrapper.js"
import Alumno from "./src/models/alumno.js"
import { sumar, restar, multiplicar, dividir } from "./src/modules/matematica.js"
import ValidacionesHelper from "./src/modules/ValiacionesHelper.js";
import DateTimeHelper from './src/modules/datetime-helper.js';

const app = express();
const port = 3000;              // El puerto 3000 (http://localhost:3000)


// Agrego los Middlewares

app.use(cors());         // Middleware de CORS
app.use(express.json()); // Middleware para parsear y comprender JSON


//
// Aca pongo todos los EndPoints
//

app.get('/', (req, res) => {    // EndPoint "/"
    return res.send('Ya estoy respondiendo!');
})

app.get('/saludar/:nombre', (req, res) => {       // EndPoint "/saludar"

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

    const fecha = new Date(anio, mes - 1, dia);

    if (!DateTimeHelper.isDate(fecha) || fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia) {
        return res.status(400).send('Fecha inválida');
    }

    return res.status(200).send('Fecha válida');
});

app.get('/matematica/sumar', (req, res) => {

    const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

    if (n1 === null || n2 === null) {
        return res.status(400).send('n1 y n2 deben ser números enteros');
    }

    let resultado = sumar(n1, n2);

    return res.status(200).send(String(resultado));
});

app.get('/matematica/restar', (req, res) => {

    const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

    if (n1 === null || n2 === null) {
        return res.status(400).send('n1 y n2 deben ser números enteros');
    }

    let resultado = restar(n1, n2);

    return res.status(200).send(String(resultado));
});

app.get('/matematica/multiplicar', (req, res) => {

    const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

    if (n1 === null || n2 === null) {
        return res.status(400).send('n1 y n2 deben ser números enteros');
    }

    let resultado = multiplicar(n1, n2);

    return res.status(200).send(String(resultado));
});

app.get('/matematica/dividir', (req, res) => {

    const n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    const n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);

    if (n1 === null || n2 === null) {
        return res.status(400).send('n1 y n2 deben ser números enteros');
    }
    if (n2 === 0) {
        return res.status(400).send('n2 no puede ser 0');
    }
    let resultado = dividir(n1, n2);

    return res.status(200).send(String(resultado));
});





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

    const imdbID = ValidacionesHelper.getStringOrDefault(req.query.imdbID, '');
    if (imdbID === '') {
        return res.status(400).send('Falló algo :(');
    }
    try {

        let respuesta = await OMDBGetByImdbID(imdbID);

        return res.status(200).send(respuesta);

    } catch {
        return res.status(400).json({
            respuesta: false,
            cantidadTotal: 0,
            datos: [],
        });
    }
});


const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido", "22888444", 20));
alumnosArray.push(new Alumno("Matias Queroso", "28946255", 51));
alumnosArray.push(new Alumno("Elba Calao", "32623391", 18));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(`/alumnos`, async (req, res) => {

    return res.status(200).send(alumnosArray);
}
)

app.get('/alumnos/:dni', (req, res) => {

    const dni = ValidacionesHelper.getStringOrDefault(req.params.dni, '');

    if (dni === '') {
        return res.status(400).send('DNI inválido');
    }

    const alumnoEncontrado = alumnosArray.find(alum => alum.strDNI === dni);

    if (alumnoEncontrado) {
        return res.status(200).send(alumnoEncontrado);
    } else {
        return res.status(404).send('No se encontró');
    }

})

app.post('/alumnos', async (req, res) => {

    const username = ValidacionesHelper.getStringOrDefault(req.body.username, '');
    const dni = ValidacionesHelper.getStringOrDefault(req.body.dni, '');
    const edad = ValidacionesHelper.getIntegerOrDefault(req.body.edad, 0);

    if (username === '' || dni === '' || edad <= 0) {
        return res.status(400).send('username, dni y edad son obligatorios');
    }

    const nuevoAlumno = new Alumno(username, dni, edad);
    alumnosArray.push(nuevoAlumno);

    return res.status(201).send(nuevoAlumno);
});

app.delete('/alumnos', (req, res) => {

    const dni = ValidacionesHelper.getStringOrDefault(req.body.dni, '');

    if (dni === '') {
        return res.status(400).send('DNI requerido');
    }

    const index = alumnosArray.findIndex(alum => alum.strDNI === dni);

    if (index !== -1) {
        alumnosArray.splice(index, 1);
        return res.status(200).send('Alumno eliminado');
    } else {
        return res.status(404).send('No se encontró el alumno');
    }

});

app.get('/fechas/isDate', (req, res) => {

    const fecha = ValidacionesHelper.getDateOrDefault(req.query.fecha, null);

    if (!DateTimeHelper.isDate(fecha)) {
        return res.status(400).send('Fecha inválida');
    }

    return res.status(200).send({ valido: true });
});

app.get('/fechas/getEdadActual', (req, res) => {

    const fechaNac = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

    if (!DateTimeHelper.isDate(fechaNac)) {
        return res.status(400).send('Fecha inválida');
    }

    const edad = DateTimeHelper.getEdadActual(fechaNac);

    return res.status(200).send({ edad: edad });
});

app.get('/fechas/getDiasHastaMiCumple', (req, res) => {

    const fechaNac = ValidacionesHelper.getDateOrDefault(req.query.fechaNacimiento, null);

    if (!DateTimeHelper.isDate(fechaNac)) {
        return res.status(400).send('Fecha inválida');
    }

    const dias = DateTimeHelper.getDiasHastaMiCumple(fechaNac);

    return res.status(200).send({ diasRestantes: dias });
});

app.get('/fechas/getDiaTexto', (req, res) => {

    const fechaStr = ValidacionesHelper.getStringOrDefault(req.query.fecha, '');
    const abr = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

    if (fechaStr === '') {
        return res.status(400).send('Fecha inválida');
    }

    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    if (!DateTimeHelper.isDate(fecha) || fecha.getFullYear() !== anio || fecha.getMonth() !== mes - 1 || fecha.getDate() !== dia
    ) {
        return res.status(400).send('Fecha inválida');
    }

    const diaTexto = DateTimeHelper.getDiaTexto(fecha, abr);

    return res.status(200).send({ dia: diaTexto });
});

app.get('/fechas/getMesTexto', (req, res) => {

    const fechaStr = ValidacionesHelper.getStringOrDefault(req.query.fecha, '');
    const abr = ValidacionesHelper.getBooleanOrDefault(req.query.abr, false);

    if (fechaStr === '') {
        return res.status(400).send('Fecha inválida');
    }

    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    const fecha = new Date(anio, mes - 1, dia);

    if (
        !DateTimeHelper.isDate(fecha) ||
        fecha.getFullYear() !== anio ||
        fecha.getMonth() !== mes - 1 ||
        fecha.getDate() !== dia
    ) {
        return res.status(400).send('Fecha inválida');
    }

    const mesTexto = DateTimeHelper.getMesTexto(fecha, abr);

    return res.status(200).send({ mes: mesTexto });
});

//
// Inicio el Server y lo pongo a escuchar.
//

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


