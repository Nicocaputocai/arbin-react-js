import React, { useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Image,
} from "react-bootstrap";
import AuthService from "../Services/AuthService";

const logo = "./arbin-high-resolution-logo-transparent.png"; // Usamos tu mismo logo

export const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ user: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await AuthService.login(
        credentials.user,
        credentials.password,
      );
      // Guardamos el token
      localStorage.setItem("token", response.token);
      // GUARDAMOS EL NOMBRE DE USUARIO
      localStorage.setItem("username", credentials.user);
      // Le avisamos a App.jsx que el login fue exitoso
      onLoginSuccess();
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }}>
          <div className="text-center mb-4">
            <Image
              src={logo}
              style={{
                height: "15vh",
                maxWidth: "fit-content",
                borderStyle: "inset",
              }}
            />
          </div>

          <h3 className="text-center mb-4">Acceso Censo Arbolado</h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="user"
                placeholder="Ingresa tu usuario"
                value={credentials.user}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={credentials.password}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="outline-success"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Validando..." : "Ingresar"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
