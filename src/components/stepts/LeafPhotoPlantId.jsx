import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { compressImageFile } from "../../utils/compressImage";
import { Capacitor } from "@capacitor/core";
import { captureOrSelectPhoto } from "../../utils/takePhoto";

const NOMINATIM_BASE_URL_PLANT_ID = "https://plant.id/api/v3/identification";
const CONFIDENCE_THRESHOLD = 0.65; // Umbral mínimo de confianza (65%)

import "./style/gallery.css";

export const LeafPhotoPlantId = (props) => {
  const {
    setCheckbox,
    handleFormValidityChange,
    setfotoHoja,
    fotoHoja,
    Checkbox,
    needsReview,
    setNeedsReview,
    observations,
    setObservations,
    selectPosition,
    position,
  } = props;

  const [selectedImage, setSelectedImage] = useState(null);
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(fotoHoja || null);
  const [manualMode, setManualMode] = useState(false);
  const [manualSpecies, setManualSpecies] = useState("");
  const [confidenceScore, setConfidenceScore] = useState(null);

  const API_KEY = import.meta.env.VITE_KEY_PLANT_ID;

  // El paso es válido si ya hay una especie identificada por IA o si activó la carga manual
  useEffect(() => {
    const isValid = Checkbox !== null;
    handleFormValidityChange(isValid);
  }, [Checkbox]);

  const handleInputFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedImage(file);
    setManualMode(false);
    setConfidenceScore(null);

    try {
      const compressedDataUrl = await compressImageFile(file);
      setShowImage(compressedDataUrl);
      setfotoHoja(compressedDataUrl);
    } catch (error) {
      console.error("Error al comprimir la foto de la hoja:", error);
    }
  };

  // Activa el modo sin foto de hoja (ramas altas, árbol seco, etc.)
  const handleEnableManualMode = () => {
    setManualMode(true);
    setListPlace([]);
    setConfidenceScore(null);
    setNeedsReview(true);
    const label = manualSpecies.trim() || "Sin identificar";
    setCheckbox(["manual", label, label]);
  };

  const handleManualSpeciesChange = (e) => {
    const val = e.target.value;
    setManualSpecies(val);
    const label = val.trim() || "Sin identificar";
    setCheckbox(["manual", label, label]);
  };

  const [plantIdError, setPlantIdError] = useState(false);

  const handleContinueWithoutPlantId = () => {
    setPlantIdError(false);
    setNeedsReview(true);
    setCheckbox([
      "offline-photo",
      "Pendiente de identificación",
      "Sin identificar",
    ]);
    setObservations((prev) => {
      const note =
        "[Foto de hoja adjunta - Identificación pendiente por falta de conexión]";
      const current = (prev || "").trim();
      return current.includes(note)
        ? current
        : current
        ? `${current}\n${note}`
        : note;
    });
  };

  const handleSearchPlantId = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setConfidenceScore(null);

    try {
      const base64Image = showImage.split(",")[1] || showImage;

      // Obtenemos coordenadas desde position o selectPosition si están disponibles
      const lat = position?.lat ?? selectPosition?.lat;
      const lon = position?.lng ?? selectPosition?.lon;

      const bodyIdent = {
        images: [base64Image],
        ...(lat && lon
          ? {
              latitude: Number(lat),
              longitude: Number(lon),
            }
          : {}),
        datetime: new Date().toISOString().split("T")[0],
        similar_images: true,
      };

      const respIdent = await fetch(NOMINATIM_BASE_URL_PLANT_ID, {
        method: "POST",
        headers: { "Api-Key": API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(bodyIdent),
      });

      if (!respIdent.ok) throw new Error("Fallo en la identificación básica");
      const resultIdent = await respIdent.json();

      const suggestions =
        resultIdent.result?.classification?.suggestions ||
        resultIdent.classification?.suggestions;

      if (suggestions && suggestions.length > 0) {
        const suggestion = suggestions[0];
        const sciName = suggestion.name;
        const probability = Number(suggestion.probability ?? 0);
        const pct = Math.round(probability * 100);
        const access_token = resultIdent.access_token;

        let commonName = sciName;

        if (access_token) {
          try {
            const respDetails = await fetch(
              `https://plant.id/api/v3/identification/${access_token}?details=common_names&language=es`,
              {
                method: "GET",
                headers: { "Api-Key": API_KEY },
              },
            );
            const resultDetails = await respDetails.json();
            const detailedSuggestion =
              resultDetails.result?.classification?.suggestions?.[0];
            const cNames = detailedSuggestion?.details?.common_names;
            if (cNames && cNames.length > 0) {
              commonName = cNames[0];
            }
          } catch (errDet) {
            console.log(
              "No se pudieron obtener nombres comunes, usando científico.",
            );
          }
        }

        commonName = commonName.charAt(0).toUpperCase() + commonName.slice(1);

        const id = suggestion.id || "0";
        const photo = suggestion.similar_images?.[0]?.url || "";

        setConfidenceScore(pct);
        setManualMode(false);
        setListPlace([id, commonName, photo]);
        setCheckbox([id, commonName, sciName]);

        // Si la certeza de la IA es baja (< 65%), marcamos revisión manual y agregamos nota automática
        if (probability < CONFIDENCE_THRESHOLD) {
          setNeedsReview(true);
          const autoNote = `[IA baja certeza: ${pct}% - Requiere verificación manual]`;
          setObservations((prev) => {
            const current = (prev || "").trim();
            if (current.includes("[IA baja certeza:")) {
              return current.replace(/\[IA baja certeza:.*?\]/, autoNote);
            }
            return current ? `${current}\n${autoNote}` : autoNote;
          });
        }
      }
    } catch (error) {
      console.error("Error Plant.id:", error);
      setPlantIdError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNativeOrWebClick = async (e) => {
    if (Capacitor.isNativePlatform()) {
      e.preventDefault();
      try {
        const dataUrl = await captureOrSelectPhoto();
        if (dataUrl) {
          setShowImage(dataUrl);
          setfotoHoja(dataUrl);
          setManualMode(false);
          setConfidenceScore(null);
        }
      } catch (err) {
        console.log("Captura cancelada:", err);
      }
    }
  };

  const isLowConfidence =
    confidenceScore !== null && confidenceScore < CONFIDENCE_THRESHOLD * 100;

  return (
    <Container className="text-center mt-3 mb-4">
      <h3 className="mb-4 text-success fw-bold">Identificar especie</h3>

      {/* 1. ZONA DE SUBIDA DE FOTO */}
      <Row className="justify-content-center mb-3">
        <Col xs={11} md={8} lg={6}>
          <input
            type="file"
            id="hojaInput"
            name="UploadFile"
            accept="image/*"
            capture="environment"
            onChange={handleInputFileChange}
            style={{ display: "none" }}
          />

          {plantIdError && (
            <Alert variant="warning" className="text-start mt-3 mb-0">
              <div className="fw-bold mb-1">
                📡 No se pudo conectar con el identificador automático
              </div>
              <p className="small mb-2">
                Podés continuar igual: la foto de la hoja quedará guardada para
                identificarla luego desde el panel.
              </p>
              <Button
                variant="warning"
                size="sm"
                className="fw-bold w-100"
                onClick={handleContinueWithoutPlantId}
              >
                ➡️ Continuar con foto guardada (revisión manual)
              </Button>
            </Alert>
          )}

          <label
            htmlFor="hojaInput"
            onClick={handleNativeOrWebClick}
            className="d-flex flex-column align-items-center justify-content-center p-4 w-100 shadow-sm"
            style={{
              border: "2px dashed #198754",
              borderRadius: "15px",
              cursor: "pointer",
              backgroundColor: showImage ? "#e8f5e9" : "#f8f9fa",
              transition: "all 0.3s ease",
            }}
          >
            <span style={{ fontSize: "3.2rem", marginBottom: "8px" }}>📸</span>
            <span
              style={{
                fontSize: "1.15rem",
                fontWeight: "bold",
                color: "#198754",
              }}
            >
              {showImage
                ? "Cambiar la foto de la hoja"
                : "Tomar foto o abrir galería"}
            </span>
            <small className="text-muted mt-1 px-2">
              Intentá que la hoja o flor se vea clara y centrada
            </small>
          </label>

          {/* OPCIÓN ALTERNATIVA SI NO SE PUEDE FOTOGRAFIAR LA HOJA */}
          {!manualMode && (
            <div className="mt-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleEnableManualMode}
                style={{ borderRadius: "10px" }}
              >
                🚫 No puedo fotografiar la hoja (ramas altas / sin follaje)
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* MODO CARGA MANUAL / SIN FOTO DE HOJA */}
      {manualMode && (
        <Row className="justify-content-center mb-4">
          <Col xs={11} md={8} lg={6}>
            <Card
              className="shadow-sm border-warning text-start"
              style={{ borderRadius: "15px" }}
            >
              <Card.Body className="p-3">
                <Alert variant="warning" className="py-2 small mb-3">
                  ⚠️ Este registro quedará marcado automáticamente para{" "}
                  <strong>revisión posterior</strong> en el panel.
                </Alert>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold small text-muted mb-1">
                    Especie estimada (Opcional)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Fresno, Paraíso, o dejar vacío si no se sabe"
                    value={manualSpecies}
                    onChange={handleManualSpeciesChange}
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>

                <Form.Group className="mb-0">
                  <Form.Label className="fw-bold small text-muted mb-1">
                    Motivo / Observación de campo
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Ej: Las ramas están muy altas y no se alcanza la hoja..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 2. VISTA PREVIA Y BOTÓN DE BÚSQUEDA IA */}
      {showImage && !manualMode && (
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
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              }}
              className="mb-3"
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
                "🔍 Identificar árbol"
              )}
            </Button>
          </Col>
        </Row>
      )}

      {/* 3. RESULTADO DE LA IA + OPCIÓN DE DUDA Y COMENTARIO */}
      {listPlace.length > 0 && Checkbox !== null && !manualMode && (
        <Row className="justify-content-center mt-3 mb-4">
          <Col xs={11} md={8} lg={6}>
            <div
              className="p-4 shadow mb-3"
              style={{
                backgroundColor: isLowConfidence ? "#b45309" : "#198754",
                borderRadius: "20px",
                color: "white",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="mb-0" style={{ opacity: 0.9 }}>
                  {isLowConfidence
                    ? "Posible coincidencia"
                    : "¡Árbol identificado!"}
                </h5>
                {confidenceScore !== null && (
                  <Badge
                    bg={isLowConfidence ? "warning" : "light"}
                    text="dark"
                    className="px-2 py-1"
                  >
                    Certeza: {confidenceScore}%
                  </Badge>
                )}
              </div>

              <h2 className="fw-bold my-2">{listPlace[1]}</h2>

              {listPlace[2] && (
                <Image
                  src={listPlace[2]}
                  alt={listPlace[1]}
                  fluid
                  style={{
                    borderRadius: "15px",
                    maxHeight: "220px",
                    width: "100%",
                    objectFit: "cover",
                  }}
                  className="mt-2 shadow-sm"
                />
              )}
            </div>

            {isLowConfidence && (
              <Alert variant="warning" className="text-start small mb-3">
                ⚠️{" "}
                <strong>Baja certeza del modelo ({confidenceScore}%):</strong>{" "}
                Se activó automáticamente la marca de revisión manual y se
                agregó una nota en las observaciones para su verificación
                posterior.
              </Alert>
            )}

            {/* BLOQUE DE DUDA SOBRE LA IA Y OBSERVACIÓN */}
            <Card
              className="shadow-sm text-start"
              style={{
                borderRadius: "15px",
                borderColor: needsReview ? "#ffc107" : "#dee2e6",
                backgroundColor: needsReview ? "#fffdf5" : "#f8f9fa",
              }}
            >
              <Card.Body className="p-3">
                <Form.Check
                  type="switch"
                  id="doubtSpeciesSwitch"
                  checked={needsReview}
                  onChange={(e) => setNeedsReview(e.target.checked)}
                  label={
                    <span className="fw-bold text-dark">
                      ⚠️ No estoy seguro si la especie es correcta
                    </span>
                  }
                />
                <small className="text-muted d-block mt-1">
                  Activá esta opción si la IA arrojó un resultado dudoso para
                  que un supervisor lo revise.
                </small>

                <Form.Group className="mt-3 mb-0">
                  <Form.Label className="fw-bold small text-muted mb-1">
                    Comentario / Observación (Opcional)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Ej: Hojas muy altas, foto tomada desde lejos, dudas entre dos especies..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    style={{ borderRadius: "10px" }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};
