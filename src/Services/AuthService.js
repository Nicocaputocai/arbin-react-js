import http from "../http-common";

const AuthService = {
  login: async (user, password) => {
    try {
      // Usamos tu instancia de axios. 
      // IMPORTANTE: Sobrescribimos el header porque tu http-common usa 'multipart/form-data' por defecto, y el login necesita JSON.
      const response = await http.post("/users/login", { user, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data; 
    } catch (error) {
      // Si el backend devuelve un error (ej. contraseña incorrecta), lo capturamos aquí
      throw error.response?.data || { message: "Error al conectar con el servidor" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  }
};

export default AuthService;