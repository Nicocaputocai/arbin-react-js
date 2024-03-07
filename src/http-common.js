import axios from 'axios';

export default axios.create({
    baseURL: "https://arbin-api.divisioncode.net.ar/api",
    timeout:"40000ms",
    headers: {
        'Content-Type': 'application/json', // ajusta el tipo de contenido según sea necesario
      },
})