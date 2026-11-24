import React, { useState, useEffect, useCallback } from "react";
import CensusTreesServices from "../../Services/CensusTreeService";
import {
  Alert,
  Badge,
  Button,
  Form,
  Image,
  Modal,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";
import {
  saveTreeOffline,
  getPendingTrees,
  removePendingTree,
} from "../../utils/offlineQueue";

const dataURLtoFile = (dataUrl, filename) => {
  if (!dataUrl) return null;
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const Finish = (props) => {
  const {
    selectPosition,
    Checkbox,
    fotoHoja,
    fotoPerfil,
    position,
    treeDetails,
    needsReview,
    observations,
    startTime,
    handleFormValidityChange,
    formValid,
    onSuccess,
    onReset,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savedOffline, setSavedOffline] = useState(false);

  const street = selectPosition?.address?.road || "";
  const houseNumber = selectPosition?.address?.house_number || "";
  const defaultAddress = `${street} ${houseNumber}`.trim();

  const defaultNeighborhood =
    selectPosition?.address?.neighbourhood ||
    selectPosition?.address?.suburb ||
    selectPosition?.address?.city_district ||
    selectPosition?.address?.quarter ||
    selectPosition?.address?.residential ||
    "";

  // Coordenadas [lng, lat] priorizando el pin ajustado manualmente (position)
  const finalLat =
    position?.lat !== undefined ? position.lat : selectPosition?.lat;
  const finalLng =
    position?.lng !== undefined ? position.lng : selectPosition?.lon;
  const formattedCoordinates =
    finalLng !== undefined && finalLat !== undefined
      ? `${finalLng}, ${finalLat}`
      : "";

  const treeCommonName = Checkbox ? Checkbox[1] : "";
  const treeScientificName = Checkbox ? Checkbox[2] : "";

  const [imagesConverter, setImagesConverter] = useState({
    leafImg: null,
    profileImg: null,
  });

  useEffect(() => {
    setImagesConverter({
      leafImg: fotoHoja ? dataURLtoFile(fotoHoja, "leafImage.jpg") : null,
      profileImg: fotoPerfil
        ? dataURLtoFile(fotoPerfil, "profileImage.jpg")
        : null,
    });
  }, [fotoHoja, fotoPerfil]);

  const [formState, setFormState] = useState({
    tree: treeScientificName,
    commonName: treeCommonName,
    origin: treeDetails?.origin || "",
    relativeHeight: treeDetails?.relativeHeight || "",
    visibleState: treeDetails?.visibleState || "",
    address: defaultAddress,
    neighborhood: defaultNeighborhood,
    needsReview: Boolean(needsReview),
    observations: observations || "",
    leafImg: null,
    profileImg: null,
    coordinates: formattedCoordinates,
    createdBy: props.createdBy,
  });

  const [submitted, setSubmitted] = useState(false);
  const [savedSeconds, setSavedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Actualizar contador y sincronizar árboles guardados offline cuando vuelve la señal
  const refreshPendingCount = useCallback(async () => {
    try {
      const list = await getPendingTrees();
      setPendingCount(list.length);
    } catch (e) {
      console.warn("No se pudo leer la cola offline:", e);
    }
  }, []);

  const syncPendingTrees = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;
    try {
      const list = await getPendingTrees();
      if (list.length === 0) return;

      setIsSyncing(true);
      for (const item of list) {
        try {
          const fd = new FormData();
          Object.keys(item.fields).forEach((key) => {
            if (item.fields[key] !== null && item.fields[key] !== undefined) {
              fd.append(key, item.fields[key]);
            }
          });
          if (item.fotoHojaDataUrl) {
            fd.append("leafImg", dataURLtoFile(item.fotoHojaDataUrl, "leafImage.jpg"));
          }
          if (item.fotoPerfilDataUrl) {
            fd.append("profileImg", dataURLtoFile(item.fotoPerfilDataUrl, "profileImage.jpg"));
          }

          await CensusTreesServices.createCensusTrees(fd);
          await removePendingTree(item.offlineId);
        } catch (err) {
          console.warn("Aún sin conexión estable para sincronizar:", err);
          break;
        }
      }
    } finally {
      await refreshPendingCount();
      setIsSyncing(false);
    }
  }, [isSyncing, refreshPendingCount]);

  useEffect(() => {
    refreshPendingCount();
    syncPendingTrees();
    window.addEventListener("online", syncPendingTrees);
    return () => window.removeEventListener("online", syncPendingTrees);
  }, [refreshPendingCount, syncPendingTrees]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      tree: treeScientificName,
      commonName: treeCommonName,
      origin: treeDetails?.origin || "",
      relativeHeight: treeDetails?.relativeHeight || "",
      visibleState: treeDetails?.visibleState || "",
      address: prev.address !== "" ? prev.address : defaultAddress,
      neighborhood:
        prev.neighborhood !== "" ? prev.neighborhood : defaultNeighborhood,
      needsReview: Boolean(needsReview),
      observations: observations || prev.observations,
      leafImg: imagesConverter.leafImg,
      profileImg: imagesConverter.profileImg,
      coordinates: formattedCoordinates,
    }));
  }, [
    imagesConverter,
    defaultAddress,
    defaultNeighborhood,
    formattedCoordinates,
    treeScientificName,
    treeCommonName,
    treeDetails,
    needsReview,
    observations,
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    const isValid =
      formState.tree !== "" &&
      formState.origin !== "" &&
      formState.relativeHeight !== "" &&
      formState.visibleState !== "" &&
      formState.address.trim() !== "" &&
      formState.profileImg !== null &&
      formState.coordinates !== "";

    handleFormValidityChange(isValid);
  }, [formState]);

  const save = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSavedOffline(false);

    const elapsedSeconds = startTime
      ? Math.max(1, Math.round((Date.now() - startTime) / 1000))
      : 0;

    const formData = new FormData();
    Object.keys(formState).forEach((key) => {
      if (formState[key] !== null && formState[key] !== undefined) {
        formData.append(key, formState[key]);
      }
    });
    formData.append("loadTimeSeconds", elapsedSeconds);

    try {
      await CensusTreesServices.createCensusTrees(formData);
      setSavedSeconds(elapsedSeconds);
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error al guardar en MongoDB:", err);

      // Si no hay conexión o falló la red (sin respuesta del servidor), guardamos localmente en IndexedDB
      const isNetworkFailure =
        !navigator.onLine ||
        !err.response ||
        err.code === "ERR_NETWORK" ||
        err.message?.includes("Network Error") ||
        err.message?.includes("Failed to fetch");

      if (isNetworkFailure) {
        try {
          const { leafImg, profileImg, ...serializableFields } = formState;
          await saveTreeOffline({
            fields: {
              ...serializableFields,
              loadTimeSeconds: elapsedSeconds,
            },
            fotoHojaDataUrl: fotoHoja || null,
            fotoPerfilDataUrl: fotoPerfil || null,
          });
          await refreshPendingCount();
          setSavedSeconds(elapsedSeconds);
          setSavedOffline(true);
          setSubmitted(true);
          if (onSuccess) onSuccess();
          return;
        } catch (offlineErr) {
          console.error("Error guardando offline:", offlineErr);
        }
      }

      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Error de conexión con el servidor";
      setErrorMessage(`Error al enviar: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-2 mb-5">
      {/* BANNER DE REGISTROS PENDIENTES EN COLA OFFLINE */}
      {pendingCount > 0 && (
        <Alert
          variant="info"
          className="d-flex justify-content-between align-items-center py-2 mb-3 shadow-sm"
        >
          <span className="small fw-bold">
            📦 {pendingCount}{" "}
            {pendingCount === 1 ? "árbol pendiente" : "árboles pendientes"} de
            sincronizar
          </span>
          <Button
            size="sm"
            variant="primary"
            disabled={isSyncing}
            onClick={syncPendingTrees}
          >
            {isSyncing ? "Subiendo..." : "Sincronizar"}
          </Button>
        </Alert>
      )}

      {submitted ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog centered>
            <Modal.Body className="text-center p-4">
              {savedOffline ? (
                <>
                  <h4 className="text-warning fw-bold mb-2">
                    📦 Guardado sin conexión
                  </h4>
                  <p className="mb-2 small">
                    No había señal de internet. El árbol y sus fotos quedaron
                    guardados en el teléfono y se subirán automáticamente
                    apenas vuelva la conexión.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-success fw-bold mb-2">¡Excelente!</h4>
                  <p className="mb-2">
                    Árbol registrado correctamente en el sistema Arbin.
                  </p>
                </>
              )}
              <Badge bg="light" text="dark" className="border px-3 py-2">
                ⏱️ Tiempo de relevamiento: {savedSeconds} segundos
              </Badge>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center" }}>
              <Button
                variant="success"
                onClick={onReset}
                className="fw-bold px-4"
              >
                Relevar otro árbol
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <h3 className="text-center text-success fw-bold mb-3">
              Resumen del Censo
            </h3>

            <Form encType="multipart/form-data" onSubmit={save}>
              {/* VISTA PREVIA DE ESPECIE Y ATRIBUTOS */}
              <div
                className="p-3 shadow-sm mb-3 text-center"
                style={{
                  backgroundColor: "#198754",
                  borderRadius: "15px",
                  color: "white",
                }}
              >
                <p
                  className="mb-1"
                  style={{ fontSize: "0.85rem", opacity: 0.85 }}
                >
                  Especie identificada:
                </p>
                <h4 className="fw-bold mb-0">{treeCommonName}</h4>
                <p
                  className="mb-2 fst-italic"
                  style={{ opacity: 0.85, fontSize: "0.9rem" }}
                >
                  {treeScientificName}
                </p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <Badge bg="light" text="dark">
                    {formState.origin}
                  </Badge>
                  <Badge bg="light" text="dark">
                    {formState.relativeHeight}
                  </Badge>
                  <Badge bg="light" text="dark">
                    Estado: {formState.visibleState}
                  </Badge>
                </div>
              </div>

              {/* FOTOS */}
              <Row className="text-center mb-3 g-2">
                <Col xs={6}>
                  <p className="text-success fw-bold mb-1 small">Hoja / Flor</p>
                  {fotoHoja ? (
                    <Image
                      src={fotoHoja}
                      alt="Hoja"
                      className="shadow-sm border"
                      style={{
                        height: "120px",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center border bg-light text-muted small px-2"
                      style={{ height: "120px", borderRadius: "12px" }}
                    >
                      Sin foto de hoja (carga manual)
                    </div>
                  )}
                </Col>
                <Col xs={6}>
                  <p className="text-success fw-bold mb-1 small">
                    Árbol completo
                  </p>
                  {fotoPerfil && (
                    <Image
                      src={fotoPerfil}
                      alt="Perfil"
                      className="shadow-sm border"
                      style={{
                        height: "120px",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  )}
                </Col>
              </Row>

              {/* CAMPOS EDITABLES */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-muted small mb-1">
                  Dirección (Editable)
                </Form.Label>
                <Form.Control
                  value={formState.address}
                  name="address"
                  onChange={handleInputChange}
                  type="text"
                  className="text-center"
                  style={{ borderRadius: "10px" }}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-muted small mb-1">
                  Barrio (Editable)
                </Form.Label>
                <Form.Control
                  type="text"
                  value={formState.neighborhood}
                  onChange={handleInputChange}
                  name="neighborhood"
                  className="text-center"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>

              {/* OBSERVACIONES */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-muted small mb-1">
                  Observaciones (Opcional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Ej: Vereda levantada, ramas muy altas, cazuela vacía..."
                  value={formState.observations}
                  onChange={handleInputChange}
                  name="observations"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>

              {/* CHECKBOX REVISIÓN IA */}
              <Form.Group className="mb-3 p-2 border rounded bg-light">
                <Form.Check
                  type="switch"
                  id="needsReviewSwitch"
                  name="needsReview"
                  checked={formState.needsReview}
                  onChange={handleInputChange}
                  label="Marcar para revisión (especie dudosa o sin identificar)"
                  className="small fw-semibold text-secondary"
                />
              </Form.Group>

              {/* ERROR ALERT */}
              {errorMessage && (
                <div className="alert alert-danger text-center py-2 mb-3 small fw-bold">
                  {errorMessage}
                </div>
              )}

              {!submitted && (
                <Button
                  variant="success"
                  size="lg"
                  type="submit"
                  disabled={!formValid || isLoading}
                  className="w-100 fw-bold shadow-sm mt-2 mb-4 d-flex justify-content-center align-items-center"
                  style={{ borderRadius: "12px", padding: "14px" }}
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      <span>Guardando datos...</span>
                    </>
                  ) : (
                    "Confirmar y Guardar"
                  )}
                </Button>
              )}
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
};