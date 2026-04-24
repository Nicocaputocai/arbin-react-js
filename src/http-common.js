import axios from 'axios';

export default axios.create({
    baseURL: "https://arbin-ees20.desarrolloi.org/api",
    timeout:"40000ms",
    headers: {
        'Content-Type': 'application/multipart/form-data', // ajusta el tipo de contenido según sea necesario
      },
})