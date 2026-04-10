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
    res.send('Ya estoy respondiendo!');
})

app.get('/saludar/:nombre', (req, res) => {             // EndPoint "/saludar"
    res.send(`Hola ${req.params.nombre}👋`);
})

app.get('/validarfecha/:ano/:mes/:dia', (req, res) => {

    let dia = req.params.dia;
    let mes = req.params.mes;
    let anio = req.params.ano;

    let fecha = Date.parse(`${anio}-${mes - 1}-${dia}`)

    let nCodigo = '400'

    if (fecha.getDate() == dia && fecha.getMonth() == mes - 1 && fecha.getYear() == anio) { //getDate no existe

        nCodigo = '200'

        app.get('/saludar/:nombre', (req, res) => {             // EndPoint "/saludar"
            res.status(200).send(`Hola ${req.params.nombre}👋`);
        })

    }


})

//
// Inicio el Server y lo pongo a escuchar.
//

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

