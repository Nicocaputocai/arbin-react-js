import axios from "axios";
import httpLocal from '../http-local-common';
import http from '../http-common'




const service = axios.create({
  baseURL: http, // Ajusta la URL base según tu configuración
});

service.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Recuperar el token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const UserDataService = {
  login: (data) => service.post("/users/login", data),
  // Agrega otras funciones según sea necesario
};

export default UserDataService;
