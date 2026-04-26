import React, { useState, useEffect } from "react";
import CensusTreesServices from "../../Services/CensusTreeService";
import {
  Button,
  Form,
  Image,
  Modal,
  Row,
  Col,
  Container,
  Spinner,
} from "react-bootstrap";

export const Finish = (props) => {
  const {
    selectPosition,
    Checkbox,
    fotoHoja,
    fotoPerfil,
    position,
    handleFormValidityChange,
    formValid,
    onSuccess,
    onReset,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const street = selectPosition?.address?.road || "";
  const houeseNumber = selectPosition?.address?.house_number || "";
  const address = `${street} ${houeseNumber}`.trim();

  const neighbourhood =
    selectPosition?.address?.neighbourhood ||
    selectPosition?.address?.suburb ||
    selectPosition?.address?.city_district ||
    selectPosition?.address?.quarter ||
    selectPosition?.address?.residential ||
    "";

  const lat = selectPosition?.lat;
  const lng = selectPosition?.lon;

  const lat2 = position?.lat;
  const lng2 = position?.lng;

  const latlng = `${lng}, ${lat}`;
  const latlng2 = `${lng2}, ${lat2}`;

  // Capturamos los nombres desde el Checkbox
  const treeCommonName = Checkbox ? Checkbox[1] : "";
  const treeScientificName = Checkbox ? Checkbox[2] : "";

  const [imagesConverter, setImagesConverter] = useState({});

  useEffect(() => {
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

    const leafImgFile = fotoHoja
      ? dataURLtoFile(fotoHoja, "leafImage.jpg")
      : null;
    const profileImgFile = fotoPerfil
      ? dataURLtoFile(fotoPerfil, "profileImage.jpg")
      : null;

    setImagesConverter({
      leafImg: leafImgFile,
      profileImg: profileImgFile,
    });
  }, [fotoHoja, fotoPerfil]);

  // AJUSTE CLAVE: tree es el científico, commonName es el común
  const initialFormCensusTree = {
    tree: treeScientificName, // Nombre científico -> Columna histórica
    commonName: treeCommonName, // Nombre común -> Columna nueva
    address: address,
    neightboardhood: neighbourhood,
    leafImg: null,
    profileImg: null,
    coordinates: lat2 === undefined && lng2 === undefined ? latlng : latlng2,
    createdBy: props.createdBy, // Aquí viaja el "Test" de tu captura
  };

  const [createCensusTree, setCreateCensusTree] = useState(
    initialFormCensusTree,
  );
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleClose = () => setShow(false);

  useEffect(() => {
    setCreateCensusTree((prev) => ({
      ...prev,
      address: address,
      neightboardhood: neighbourhood,
      leafImg: imagesConverter.leafImg,
      profileImg: imagesConverter.profileImg,
    }));
  }, [imagesConverter, address, neighbourhood]);

  const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateCensusTree({ ...createCensusTree, [name]: value });
  };

  const save = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Limpiamos errores de intentos previos

    // Enviamos el FormData que ya contiene 'tree' (científico) y 'commonName' (común)
    CensusTreesServices.createCensusTrees(createFormData(createCensusTree))
      .then(() => {
        setSubmitted(true); // Muestra el mensaje de éxito local
        setShow(true); // Abre el modal de confirmación

        // AVISO AL PADRE: Esto hace que los botones 'Atras' y 'Siguiente'
        // desaparezcan en App.js para evitar líos de navegación.
        if (props.onSuccess) props.onSuccess();
      })
      .catch((err) => {
        console.error("Error al guardar en MongoDB:", err);
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Error de conexión con el servidor de Lanús Verde";
        setErrorMessage(`Error al enviar: ${errorMsg}`);
      })
      .finally(() => {
        setIsLoading(false); // Apagamos el spinner del botón
      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "Error desconocido de conexión";
        setErrorMessage(`Error al enviar: ${errorMsg}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validateStatus = () => {
    const isValid =
      createCensusTree.tree !== "" &&
      createCensusTree.address !== "" &&
      createCensusTree.neightboardhood !== "" &&
      createCensusTree.leafImg !== null &&
      createCensusTree.profileImg !== null &&
      createCensusTree.coordinates !== "";

    handleFormValidityChange(isValid);
  };

  useEffect(() => {
    validateStatus();
  }, [createCensusTree]);

  return (
    <Container className="mt-2 mb-5">
      {submitted ? (
        <div
          className="modal show"
          style={{ display: "block", position: "initial" }}
        >
          <Modal.Dialog show={show} onHide={handleClose} centered>
            <Modal.Body className="text-center p-4">
              <h4 className="text-success fw-bold mb-3">¡Excelente!</h4>
              <p>Árbol registrado correctamente en el sistema Arbin.</p>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: "center" }}>
              <Button variant="success" href="/" className="fw-bold px-4">
                Relevar otro árbol
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col xs={11} md={8} lg={6}>
            <h3 className="text-center text-success fw-bold mb-4">
              Resumen del Censo
            </h3>

            <Form encType="multipart/form-data">
              {/* VISTA PREVIA DEL ÁRBOL */}
              <div
                className="p-3 shadow-sm mb-4 text-center"
                style={{
                  backgroundColor: "#198754",
                  borderRadius: "15px",
                  color: "white",
                }}
              >
                <p
                  className="mb-1"
                  style={{ fontSize: "0.9rem", opacity: 0.8 }}
                >
                  Especie identificada:
                </p>
                <h4 className="fw-bold mb-0">{treeCommonName}</h4>
                <p
                  className="mb-0 fst-italic"
                  style={{ opacity: 0.8, fontSize: "0.9rem" }}
                >
                  {treeScientificName}
                </p>
              </div>

              {/* FOTOS */}
              <Row className="text-center mb-4 g-2">
                <Col xs={6}>
                  <p className="text-success fw-bold mb-1 small">Hoja / Flor</p>
                  {fotoHoja && (
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
                  defaultValue={address}
                  name="address"
                  onChange={handleInputChange}
                  type="text"
                  className="text-center"
                  style={{ borderRadius: "10px" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold text-muted small mb-1">
                  Barrio (Editable)
                </Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={neighbourhood}
                  onChange={handleInputChange}
                  name="neightboardhood"
                  className="text-center"
                  style={{ borderRadius: "10px" }}
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
                  variant="outline-success"
                  size="lg"
                  type="submit"
                  onClick={save}
                  disabled={!formValid || isLoading}
                  className="w-100 fw-bold shadow-sm mt-2 mb-4 d-flex justify-content-center align-items-center"

                style={{ borderRadius: "12px", padding: "14px" }} 
                >
                  {isLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      <span className="ms-2">Guardando datos...</span>
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
