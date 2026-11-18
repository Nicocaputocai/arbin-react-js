import React, { useEffect, useMemo } from "react";
import { Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import nativosPBA from "../../assets/nativosPBA.json"; 

// Diccionario de sinónimos botánicos que Plant.id suele devolver para especies de PBA
const SYNONYMS_MAP = {
  "prosopis alba": "neltuma alba",
  "prosopis flexuosa": "neltuma flexuosa",
  "prosopis caldenia": "neltuma caldenia",
  "acacia caven": "vachellia caven",
  "caesalpinia gilliesii": "erythrostemon gilliesii",
  "acacia bonariensis": "senegalia bonariensis",
  "celtis ehrenbergiana": "celtis tala",
  "sapium haematospermum": "sapium haematospermun",
};

const normalizeScientificName = (rawName) => {
  if (!rawName) return "";
  // 1. Pasa a minúsculas, quita el símbolo de híbrido '×' y recorta "subsp.", "var." o "f."
  const baseName = rawName
    .toLowerCase()
    .replace(/×/g, "")
    .split(/\s+(?:subsp\.|var\.|f\.)\s+/)[0]
    .replace(/\s+/g, " ")
    .trim();

  // 2. Si Plant.id devolvió el sinónimo antiguo, lo traduce al nombre de nativosPBA.json
  return SYNONYMS_MAP[baseName] || baseName;
};

export const TreeCondition = ({
  treeDetails,
  setTreeDetails,
  handleFormValidityChange,
  Checkbox,
}) => {
  const { origin, relativeHeight, visibleState } = treeDetails;

  const speciesCommon = Checkbox?.[1] || "";
  const speciesScientific = Checkbox?.[2] || "";
  const isUnidentified =
    !speciesScientific ||
    speciesScientific.toLowerCase() === "sin identificar";

  // Busca la especie en nativosPBA.json (por nombre científico normalizado o común)
  const matchedNative = useMemo(() => {
    if (isUnidentified) return null;

    const sciNormalized = normalizeScientificName(speciesScientific);
    const comLower = speciesCommon.trim().toLowerCase();

    return (
      nativosPBA.find((item) => {
        const itemSci = normalizeScientificName(item.scientificName);
        const itemComList = item.commonName
          .split(",")
          .map((c) => c.trim().toLowerCase());

        return (
          item.native === true &&
          (itemSci === sciNormalized ||
            sciNormalized.startsWith(`${itemSci} `) ||
            itemComList.includes(comLower))
        );
      }) || null
    );
  }, [speciesScientific, speciesCommon, isUnidentified]);

  // Asigna automáticamente "Nativa" o "Exótica" cuando hay una especie identificada
  useEffect(() => {
    if (!isUnidentified) {
      const detectedOrigin = matchedNative ? "Nativa" : "Exótica";
      if (origin !== detectedOrigin) {
        setTreeDetails((prev) => ({
          ...prev,
          origin: detectedOrigin,
        }));
      }
    }
  }, [isUnidentified, matchedNative]);

  // Validación del paso (los 3 campos requeridos del esquema CensusTree)
  useEffect(() => {
    const isValid =
      origin !== "" && relativeHeight !== "" && visibleState !== "";
    handleFormValidityChange(isValid);
  }, [origin, relativeHeight, visibleState]);

  const handleSelect = (field, value) => {
    setTreeDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const heightOptions = [
{
      value: "Bajo la línea de cables",
      label: "Bajo la línea de cables",
      desc: "Ejemplar joven o de porte bajo",
    },
    {
      value: "A la altura",
      label: "A la altura",
      desc: "Copa a nivel del tendido eléctrico",
    },
    {
      value: "Por encima",
      label: "Por encima",
      desc: "Supera la línea de cables",
    },
    {
      value: "Gran porte",
      label: "Gran porte",
      desc: "Árbol maduro de gran desarrollo",
    },
  ];

  const stateOptions = [
    { value: "Bueno", label: "Bueno" },
    { value: "Regular", label: "Regular" },
    { value: "Malo", label: "Malo" },
    { value: "Seco", label: "Seco" },
  ];

  return (
    <Container className="mt-2 mb-4">
      <h3 className="text-center text-success fw-bold mb-3">
        Características del Árbol
      </h3>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          {/* 1. ORIGEN (AUTOMÁTICO SEGÚN nativosPBA.json O MANUAL SI NO SE IDENTIFICÓ) */}
          <Card
            className="shadow-sm border-0 mb-3"
            style={{ borderRadius: "15px" }}
          >
            <Card.Body className="p-3">
              <Form.Label className="fw-bold text-secondary mb-2">
                1. Origen de la especie
              </Form.Label>

              {!isUnidentified ? (
                <div
                  className="p-3 rounded text-center"
                  style={{
                    backgroundColor: matchedNative ? "#e8f5e9" : "#f8f9fa",
                    border: matchedNative
                      ? "1px solid #198754"
                      : "1px solid #dee2e6",
                  }}
                >
                  <div className="mb-1">
                    <Badge
                      bg={matchedNative ? "success" : "secondary"}
                      className="px-3 py-2"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {matchedNative
                        ? "🌿 Especie Nativa (PBA)"
                        : "🌍 Especie Exótica"}
                    </Badge>
                  </div>
                  <div className="small text-muted mt-1">
                    <strong>{speciesCommon}</strong> ({speciesScientific})
                    {matchedNative?.ecoregion && (
                      <div className="text-success fw-semibold mt-1">
                        Ecorregión: {matchedNative.ecoregion}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <small className="text-muted d-block mb-2">
                    Como la especie quedó sin identificar, seleccioná el origen
                    manualmente:
                  </small>
                  <div
                    className="d-grid gap-2"
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                  >
                    {["Nativa", "Exótica"].map((opt) => (
                      <Button
                        key={opt}
                        variant={origin === opt ? "success" : "outline-success"}
                        className="fw-bold py-2"
                        style={{ borderRadius: "10px" }}
                        onClick={() => handleSelect("origin", opt)}
                      >
                        {opt === "Nativa" ? "🌿 Nativa" : "🌍 Exótica"}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {/* 2. ALTURA RELATIVA */}
          <Card
            className="shadow-sm border-0 mb-3"
            style={{ borderRadius: "15px" }}
          >
            <Card.Body className="p-3">
              <Form.Label className="fw-bold text-secondary mb-2">
                2. Altura relativa
              </Form.Label>
              <div className="d-flex flex-column gap-2">
                {heightOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={
                      relativeHeight === opt.value
                        ? "success"
                        : "outline-secondary"
                    }
                    className="text-start p-3 d-flex justify-content-between align-items-center"
                    style={{ borderRadius: "12px" }}
                    onClick={() => handleSelect("relativeHeight", opt.value)}
                  >
                    <div>
                      <div className="fw-bold">{opt.label}</div>
                      <small
                        style={{
                          opacity: relativeHeight === opt.value ? 0.9 : 0.75,
                        }}
                      >
                        {opt.desc}
                      </small>
                    </div>
                    {relativeHeight === opt.value && <span>✔</span>}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* 3. ESTADO VISIBLE */}
          <Card
            className="shadow-sm border-0 mb-3"
            style={{ borderRadius: "15px" }}
          >
            <Card.Body className="p-3">
              <Form.Label className="fw-bold text-secondary mb-2">
                3. Estado visible del ejemplar
              </Form.Label>
              <div
                className="d-grid gap-2"
                style={{ gridTemplateColumns: "1fr 1fr" }}
              >
                {stateOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={
                      visibleState === opt.value
                        ? "success"
                        : "outline-secondary"
                    }
                    className="fw-bold py-3"
                    style={{ borderRadius: "12px" }}
                    onClick={() => handleSelect("visibleState", opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
