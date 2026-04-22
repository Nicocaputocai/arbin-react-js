import React, { useState, useEffect } from "react";
import CensusTreesServices from "../../Services/CensusTreeService";
import { Button, Form, Image, Modal, Row, Col } from "react-bootstrap";

export const Finish = (props) => {
  const {
    selectPosition,
    Checkbox,
    fotoHoja,
    fotoPerfil,
    position,
    handleFormValidityChange,
    formValid,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const street = selectPosition?.address?.road || "";
  const houeseNumber = selectPosition?.address?.house_number || "";
  const address = `${street} ${houeseNumber}`.trim();
  const neighbourhood = selectPosition?.address?.neighbourhood || "";
  const lat = selectPosition?.lat;
  const lng = selectPosition?.lon;

  const lat2 = position?.lat;
  const lng2 = position?.lng;

  const latlng = `${lng}, ${lat}`;
  const latlng2 = `${lng2}, ${lat2}`;

  // Aseguramos que Checkbox exista antes de pedir la posición 1
  const treeName = Checkbox ? Checkbox[1] : "";

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

    const leafImgFile = fotoHoja ? dataURLtoFile(fotoHoja, "leafImage.jpg") : null;
    const profileImgFile = fotoPerfil ? dataURLtoFile(fotoPerfil, "profileImage.jpg") : null;
    
    setImagesConverter({
      leafImg: leafImgFile,
      profileImg: profileImgFile,
    });
  }, [fotoHoja, fotoPerfil]);

  const initialFormCensusTree = {
    tree: treeName,
    address: address,
    neightboardhood: neighbourhood,
    leafImg: null,
    profileImg: null,
    coordinates: lat2 === undefined && lng2 === undefined ? latlng : latlng2,
  };

  const [createCensusTree, setCreateCensusTree] = useState(initialFormCensusTree);
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false); //Modal de confirmación

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
    CensusTreesServices.createCensusTrees(createFormData(createCensusTree))
      .then(() => {
        setSubmitted(true);
        setShow(true); // Corregido: antes decía handleShow(true)
      })
      .catch((err) => console.log(err))
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
    <div>
      {submitted ? (
        <div className="modal show" style={{ display: "block", position: "initial" }}>
          <Modal.Dialog show={show} onHide={handleClose}>
            <Modal.Body>Árbol registrado correctamente</Modal.Body>
            <Modal.Footer style={{ justifyContent: "space-between" }}>
              <Button variant="info" href="/" size="sm">
                Censar árbol
              </Button>
              <Button variant="success" href="/" size="sm">
                Volver al home
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      ) : (
        <Row>
          <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }}>
            <form encType="multipart/form-data">
              <h3>Dirección (si no es correcta, modifíquela):</h3>
              <input
                defaultValue={address}
                name="address"
                onChange={handleInputChange}
                type="text"
                style={{ textAlign: "center", margin: 1 }}
              />
              <h3>Coordenadas:</h3>
              <input
                defaultValue={
                  lat2 === undefined && lng2 === undefined ? latlng : latlng2
                }
                onChange={handleInputChange}
                name="coordinates"
                type="text"
                style={{ textAlign: "center", margin: 1 }}
                disabled
              />
              <h3>Barrio (si no es correcta, modifíquelo):</h3>
              <input
                type="text"
                defaultValue={neighbourhood}
                onChange={handleInputChange}
                style={{ textAlign: "center", margin: 1 }}
                name="neightboardhood" 
              />
              <h3>Árbol censado:</h3>
              <p style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>{treeName}</p>
              
              <h3>Foto de la hoja:</h3>
              {fotoHoja && (
                <Image
                  src={fotoHoja}
                  alt="Foto de la hoja"
                  style={{ textAlign: "center", margin: 1, maxWidth: "100%" }}
                />
              )}
              <h3>Foto del perfil:</h3>
              {fotoPerfil && (
                <Image
                  src={fotoPerfil}
                  alt="Foto de perfil"
                  style={{ textAlign: "center", margin: 1, maxWidth: "100%" }}
                />
              )}

              <br />
              <br />
              
              <Button
                variant="outline-success"
                type="submit"
                onClick={save}
                disabled={!formValid || isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-green"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    style={{ display: "inline-block" }}
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c4.418 0 8-3.582 8-8h-4c0 2.168-.837 4.154-2.191 5.657l-3.384-3.384A5.967 5.967 0 0012 14v6zm6.758-6.758l-3.38 3.382A5.969 5.969 0 0014 18h6c0-3.038-1.129-5.825-2.242-7.938z"
                    ></path>
                  </svg>
                ) : (
                  "Enviar formulario"
                )}
              </Button>
            </form>
          </Col>
        </Row>
      )}
    </div>
  );
};