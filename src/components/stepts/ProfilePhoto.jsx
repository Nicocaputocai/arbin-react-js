import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

export const ProfilePhoto = (props) => {
  const [selectedImageProfile, setSelectedImageProfile] = useState(null); // Vista previa de la imagen
  const { handleFormValidityChange, setFotoPerfil } = props;

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImageProfile");
    if (storedImage) {
      setSelectedImageProfile(storedImage);
    }
  }, []);

  const validatePhoto = () => {
    const isValid = selectedImageProfile !== null; // Validación básica
    handleFormValidityChange(isValid); 
  };

  useEffect(() => {
    validatePhoto();
  }, [selectedImageProfile]);

  const handleInputFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader(); 
      reader.onloadend = () => {
        setSelectedImageProfile(reader.result);
        setFotoPerfil(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  return (
    <Container className="text-center mt-3">
      <h3 className="mb-4 text-success fw-bold">Sacar foto del árbol completo</h3>

      {/* 1. ZONA DE SUBIDA DE FOTO */}
      <Row className="justify-content-center mb-4">
        <Col xs={11} md={8} lg={6}>
          {/* Input oculto */}
          <input
            type="file"
            id="perfilInput"
            name="file"
            accept="image/*"
            capture="environment"
            onChange={handleInputFileChange}
            style={{ display: "none" }}
          />

          {/* Botón visual gigante conectado al input con outline-success */}
          <label
            htmlFor="perfilInput"
            className="btn btn-outline-success d-flex flex-column align-items-center justify-content-center p-4 w-100 shadow-sm"
            style={{
              border: "2px dashed #198754", // Borde punteado
              borderRadius: "15px",
              cursor: "pointer",
              backgroundColor: selectedImageProfile ? "#e8f5e9" : "#f8f9fa",
              transition: "all 0.3s ease"
            }}
          >
            <span style={{ fontSize: "3.5rem", marginBottom: "10px" }}>🌳</span>
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {selectedImageProfile ? "Cambiar la foto del árbol" : "Tomar foto o abrir galería"}
            </span>
            <small className="mt-2 px-3">
              Aléjese un poco para que el árbol se vea completo
            </small>
          </label>
        </Col>
      </Row>

      {/* 2. VISTA PREVIA (Solo aparece si hay foto) */}
      {selectedImageProfile && (
        <Row className="justify-content-center mt-2 mb-4">
          <Col xs={11} md={8} lg={6}>
            <p className="text-muted mb-2 fw-bold">Vista previa del árbol:</p>
            <Image
              src={selectedImageProfile}
              alt="Vista previa del árbol completo"
              style={{
                width: "100%", 
                maxHeight: "300px", // Más alto porque los árboles son verticales
                objectFit: "cover",
                borderRadius: "15px",
                border: "4px solid #198754",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
              }}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
};