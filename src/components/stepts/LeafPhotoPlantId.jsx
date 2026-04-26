import { Button, Col, Container, Form, Row, Image, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
const leafExample = "./LeafExample.jpg";
const NOMINATIM_BASE_URL = "https://arbin-ia.divisioncode.net.ar/predict_image";
const NOMINATIM_BASE_URL_PLANT_ID = "https://plant.id/api/v3/identification";

import "./style/gallery.css";

export const LeafPhotoPlantId = (props) => {
  const [selectedImage, setSelectedImage] = useState(null); 
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const { setCheckbox, handleFormValidityChange, setfotoHoja, Checkbox } = props;
  const API_KEY = import.meta.env.VITE_KEY_PLANT_ID

  const validatePhoto = () => {
    const isValid = Checkbox !== null; 
    handleFormValidityChange(isValid); 
  };
  
  useEffect(() => {
    validatePhoto();
  }, [Checkbox]);

  const handleInputFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader(); 
      reader.onloadend = () => {
        setShowImage(reader.result); 
        setfotoHoja(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

const handleSearchPlantId = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const base64Image = showImage.split(',')[1] || showImage;

      // PASO 1: Identificación básica (La que SI funciona)
      const bodyIdent = {
        images: [base64Image],
        similar_images: true
      };

      const respIdent = await fetch(NOMINATIM_BASE_URL_PLANT_ID, {
        method: 'POST',
        headers: { 'Api-Key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyIdent)
      });

      if (!respIdent.ok) throw new Error("Fallo en la identificación básica");
      const resultIdent = await respIdent.json();

      const suggestions = resultIdent.result?.classification?.suggestions || resultIdent.classification?.suggestions;

      if (suggestions && suggestions.length > 0) {
        const suggestion = suggestions[0];
        const sciName = suggestion.name;
        const access_token = resultIdent.access_token; // <--- ESTA ES LA CLAVE

        let commonName = sciName;

        // PASO 2: Pedir los nombres comunes usando el access_token
        // Esto es lo que hace la página web oficial por detrás
        if (access_token) {
            try {
                const respDetails = await fetch(`https://plant.id/api/v3/identification/${access_token}?details=common_names&language=es`, {
                    method: 'GET',
                    headers: { 'Api-Key': API_KEY }
                });
                const resultDetails = await respDetails.json();
                const detailedSuggestion = resultDetails.result?.classification?.suggestions?.[0];
                const cNames = detailedSuggestion?.details?.common_names;
                if (cNames && cNames.length > 0) {
                    commonName = cNames[0];
                }
            } catch (errDet) {
                console.log("No se pudieron obtener nombres comunes, usando científico.");
            }
        }

        commonName = commonName.charAt(0).toUpperCase() + commonName.slice(1);

        const id = suggestion.id || "0";
        const photo = suggestion.similar_images?.[0]?.url || "";

        setListPlace([id, commonName, photo]);
        setCheckbox([id, commonName, sciName]);
        validatePhoto();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en la identificación: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container className="text-center mt-3">
      <h3 className="mb-4 text-success fw-bold">Identificar especie</h3>

      {/* 1. ZONA DE SUBIDA DE FOTO */}
      <Row className="justify-content-center mb-4">
        <Col xs={11} md={8} lg={6}>
          {/* Input oculto - El accept="image/*" asegura que en Android abra cámara y galería */}
          <input
            type="file"
            id="hojaInput"
            name="UploadFile"
            accept="image/*"
            capture="environment"
            onChange={handleInputFileChange}
            style={{ display: "none" }}
          />

          {/* Botón visual gigante conectado al input */}
          <label
            htmlFor="hojaInput"
            className="d-flex flex-column align-items-center justify-content-center p-4 w-100 shadow-sm"
            style={{
              border: "2px dashed #198754",
              borderRadius: "15px",
              cursor: "pointer",
              backgroundColor: showImage ? "#e8f5e9" : "#f8f9fa",
              transition: "all 0.3s ease"
            }}
          >
            <span style={{ fontSize: "3.5rem", marginBottom: "10px" }}>📸</span>
            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#198754" }}>
              {showImage ? "Cambiar la foto de la hoja" : "Tomar foto o abrir galería"}
            </span>
            <small className="text-muted mt-2 px-3">
              Intenta que la hoja o flor se vea clara y centrada
            </small>
          </label>
        </Col>
      </Row>

      {/* 2. VISTA PREVIA Y BOTÓN DE BÚSQUEDA (Solo aparecen si hay foto) */}
      {showImage && (
        <Row className="justify-content-center mb-4 mt-2">
          <Col xs={11} md={8} lg={6}>
            <Image
              src={showImage}
              alt="Vista previa"
              style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "20px",
                border: "4px solid #198754",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
              }}
              className="mb-4"
            />
            <br />
            
            <Button
              size="lg"
              onClick={handleSearchPlantId}
              variant="outline-success"
              className="w-100 fw-bold shadow-sm d-flex justify-content-center align-items-center"
              disabled={isLoading}
              style={{ borderRadius: "10px", padding: "12px" }}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Analizando especie...
                </>
              ) : (
                "🔍 Identificar árbol."
              )}
            </Button>
          </Col>
        </Row>
      )}

      {/* 3. RESULTADO DE LA BÚSQUEDA */}
      {listPlace.length > 0 && Checkbox !== null && (
        <Row className="justify-content-center mt-4 mb-4">
          <Col xs={11} md={8} lg={6}>
            <div 
              className="p-4 shadow" 
              style={{ 
                backgroundColor: "#198754", 
                borderRadius: "20px", 
                color: "white" 
              }}
            >
              <h5 className="mb-2" style={{ opacity: 0.9 }}>¡Árbol identificado!</h5>
              <h2 className="fw-bold my-3">{listPlace[1]}</h2>
              {listPlace[2] && (
                <Image
                  src={listPlace[2]}
                  alt={listPlace[1]}
                  fluid
                  style={{ 
                    borderRadius: "15px", 
                    maxHeight: "250px", 
                    width: "100%", 
                    objectFit: "cover" 
                  }}
                  className="mt-2 shadow-sm"
                />
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};