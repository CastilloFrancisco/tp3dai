import axios from "axios";
const APIKEY = "e84efcd2";
const Test = async () => {

  // Esto solo busca ‘cars’

  const requestString = `http://www.omdbapi.com/?apikey=e84efcd2&s=cars`;

  const apiResponse = await axios.get(requestString);

  return apiResponse.data;

};


const OMDBSearchByPage = async (searchText, page = 1) => {
  let returnObject = {
    respuesta: false,
    cantidadTotal: 0,
    datos: []
  };
  // No seas vago, acá hay que hacer el cuerpo de la función!!!
  
  let stringBusqueda = `http://www.omdbapi.com/?apikey=e84efcd2&s=${searchText}&page=${page}`;
  returnObject = await axios.get(stringBusqueda);

  return returnObject.data;
};

const OMDBSearchComplete = async (searchText) => {
  let returnObject = {
    respuesta: false,
    cantidadTotal: 0,
    datos: []
  };
  // No seas vago, acá hay que hacer el cuerpo de la función!!!

  let stringBusquedaSinPage = `http://www.omdbapi.com/?apikey=e84efcd2&s=${searchText}`;
  returnObject = await axios.get(stringBusquedaSinPage);

  return returnObject.data;
};
const OMDBGetByImdbID = async (imdbID) => {
  let returnObject = {
    respuesta: false,
    cantidadTotal: 0,
    datos: {}
  };
  // No seas vago, acá hay que hacer el cuerpo de la función!!!

    let stringBusquedaSinPage = `http://www.omdbapi.com/?apikey=e84efcd2&i=${imdbID}`;
  returnObject = await axios.get(stringBusquedaSinPage);

  return returnObject.data;
};
// Exporto todo lo que yo quiero exponer del módulo:
export { Test, OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID };