import axios from 'axios';

export default axios.create({
    baseURL: "http://localhost:4000/api",
    timeout:"30000ms",
    headers: {
        'Content-Type': 'application/multipart/form-data', // ajusta el tipo de contenido según sea necesario
      },
})