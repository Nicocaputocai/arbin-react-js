import React, { useState } from "react";
import UserDataService from "../Services/UserService";
import { Badge, Button, Container, Form, FormLabel } from "react-bootstrap";

export const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await UserDataService.login({
        user: formData.user,
        password: formData.password,
      });

      // Si el login es exitoso
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Guardar token en localStorage
        setIsAuthenticated(true); // Cambiar el estado de autenticación
      }
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <Container>
        <h1>
        <Badge bg="primary">Iniciar Sesión</Badge>
        </h1>
              <br />
        <Form  onSubmit={handleSubmit}>
        <FormLabel>     Usuario    </FormLabel>
        <div className="bg-white my-2 p-1 flex border border-gray-200">
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
            required
          />
        </div>

        <FormLabel>     Contraseña    </FormLabel>
        <div className="bg-white my-2 p-1 flex border border-gray-200">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
            required
          />
        </div>

        {error && <p className="error">{error}</p>} <br />
        <Button variant="outline-primary" type="submit">Ingresar</Button>

    </Form>
    </Container>
  );
};
