import React, { useState, useEffect } from "react";
import CensusTreesServices from "../../Services/CensusTreeService";
import { Button, Form, Image, Modal, Row, Col } from "react-bootstrap";

export const Finish = (props) => {
  const {
    selectPosition,
    Checkbox,
    fotoHoja,
    fotoPerfil,
    formStatus,
    position,
    handleFormValidityChange,
    formValid 
  } = props;
  // console.log(formStatus);
  const [isLoading, setIsLoading] = useState(false);
  const street = selectPosition?.address.road;
  const houeseNumber = selectPosition?.address.house_number;
  const [imagesConverter, setImagesConverter] = useState({});
  const address = `${street} ${houeseNumber}`;
  const neighbourhood = selectPosition?.address.neighbourhood;
  const lat = selectPosition?.lat;
  const lng = selectPosition?.lon;

  const lat2 = position?.lat;
  const lng2 = position?.lng;

  const latlng = `${lng}, ${lat}`;
  const latlng2 = `${lng2}, ${lat2}`;

  const treeName= Checkbox[1]

  useEffect(() => {
    const dataURLtoFile = (dataUrl, filename) => {
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
    const leafImgFile = dataURLtoFile(fotoHoja, "leafImage.jpg");
    const profileImgFile = dataURLtoFile(fotoPerfil, "profileImage.jpg");
    setImagesConverter({
      leafImg: leafImgFile,
      profileImg: profileImgFile,
    });
  }, []);

  useEffect(() => {
    setCreateCensusTree({
      ...createCensusTree,
      address: address,
      neightboardhood: neighbourhood,
      leafImg: imagesConverter.leafImg,
      profileImg: imagesConverter.profileImg,
    });
  }, [imagesConverter]);
// console.log(Checkbox);
const initialFormCensusTree = {
  tree: treeName,
  address: address,
  neightboardhood: neighbourhood,
  leafImg: null,
  profileImg: null,
  brokenSidewalk: formStatus?.brokenSidewalk,
  fallingDanger: formStatus?.fallingDanger, // Booleano
  damagedTrunk: formStatus?.damagedTrunk, // Booleano
  cracks: formStatus?.cracks , // Asegúrate de que no sea una cadena vacía si es null
  diameter: parseInt(formStatus?.diameter), // Convertir a número
  electricityCable: formStatus?.electricityCable,// Booleano
  height: parseInt(formStatus?.height), // Convertir a número
  inclination: parseInt(formStatus?.inclination), // Convertir a número
  sidewalk: formStatus?.sidewalk , // Asegurar que se asigna correctamente
  sidewalkWidth: parseInt(formStatus?.sidewalkWidth), // Convertir a número
  sprouts: formStatus?.sprouts , // Booleano
  coordinates: lat2 === undefined && lng2 === undefined ? latlng : latlng2,
};




const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "leafImg" || key === "profileImg") {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    } else {
      formData.append(key, data[key]);
    }
  });
  console.log(formData); // Verificar que el FormData esté correcto
  return formData;
};
  const [createCensusTree, setCreateCensusTree] = useState(
    initialFormCensusTree
  );
  const [submitted, setSubmitted] = useState();
  const [show, setShow] = useState(false);
  const [handleShow] = useState(true);
  const handleClose = () => setShow(false); //Modal de confirmación

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateCensusTree({ ...createCensusTree, [name]: value });
  };

  const save = (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(createFormData(createCensusTree).getAll("leafImg"));
    CensusTreesServices.createCensusTrees(createFormData(createCensusTree))
      .then(() => {
        // console.log(createCensusTree);
        setSubmitted(true);
        handleShow(true);
      })
      .catch((err) => console.log(err))
      .finally(()=>{setIsLoading(false);});
  };
  const validateStatus = () => {
    const isValid =
      createCensusTree.tree !== "" &&
      createCensusTree.address !== "" &&
      createCensusTree.neightboardhood !== "" &&
      createCensusTree.leafImg !== null &&
      createCensusTree.profileImg !== null &&
      createCensusTree.damagedTrunk !== "" &&
      createCensusTree.fallingDanger !== "" &&
      createCensusTree.brokenSidewalk !== "" &&
      createCensusTree.electricityCable !== "" &&
      createCensusTree.sidewalk !== "" &&
      createCensusTree.sidewalkWidth !== "" &&
      createCensusTree.cracks !== "" &&
      createCensusTree.sprouts !== "" &&
      createCensusTree.inclination !== "" &&
      createCensusTree.diameter !== "" &&
      createCensusTree.height !== "" &&
      createCensusTree.coordinates !== "";
    
    handleFormValidityChange(isValid);
  };
  useEffect(() => {
    validateStatus();
  }, [createCensusTree]);
  return (
    <div>
      {submitted ? (
        <div
        className="modal show"
        style={{ display: 'block', position: 'initial'}}
      >
        <Modal.Dialog show={show} onHide={handleClose}>
          
          <Modal.Body>Árbol registrado correctamente</Modal.Body>
          {/* <Modal.Footer style={{ justifyContent: 'space-between' }}> */}
          <Modal.Footer style={{ justifyContent: 'center' }}>
            {/* <Button variant="info" href="/" size="sm">
              Censar árbol
            </Button> */}
            <Button variant="success" href="/" size="sm">
              Volver al home
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
        </div>
      ) : (
        <Row>
          <Col xs={{span:10, offset:1}} md={{span:6, offset:3}}>
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
            name="neighbourhood"
          />
          <h3>Arbol censado:</h3>
          {treeName}
          <h3>Foto de la hoja:</h3>
          {fotoHoja && (
            <Image
              src={fotoHoja}
              alt="Foto de la hoja"
              style={{ textAlign: "center", margin: 1 }}
            />
          )}
          <h3>Foto de la hoja:</h3>
          {fotoPerfil && (
            <Image
              src={fotoPerfil}
              alt="Foto de perfil"
              style={{ textAlign: "center", margin: 1 }}
            />
          )}


          <h3>Tronco dañado:</h3>
          <input
            type="text"
            defaultValue={formStatus?.damagedTrunk == "1" ? "Si" : "No"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="damagedTrunk"
          />

          <h3>Peligro de caida:</h3>
          <input
            type="boolean"
            defaultValue={formStatus?.fallingDanger =="1" ? "Si" : "No"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="fallingDanger"
          />

          <h3>Vereda rota:</h3>
          <input
            type="text"
            defaultValue={formStatus?.brokenSidewalk == "1" ? "Si" : "No"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="brokenSidewalk"
          />
          <h3>Cable de electricidad:</h3>
          <input
            type="text"
            defaultValue={formStatus?.electricityCable == "1" ? "Si" : "No"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="electricityCable"
          />{" "}
          <br />
          <h3>Cazuela o vereda</h3>
          <input
            type="text"
            defaultValue={formStatus?.sidewalk=== "cazuela" ? "cazuela":"Vereda"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="sidewalk"
          />
          <h3>Ancho de vereda:</h3>
          <input
            type="boolean"
            defaultValue={formStatus?.sidewalkWidth}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="sidewalkWidth"
          />
          <h3>Grietas:</h3>
          <input
            type="text"
            defaultValue={formStatus?.cracks == "1" ? "Si" : "No"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="cracks"
          />
          <h3>Brotes:</h3>
          <input
            type="text"
            defaultValue={formStatus?.sprouts == "1" ? "Si" : "No"}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="sprouts"
          />{" "}
          <br />
          <h3>Inclinación:</h3>
          <input
            type="text"
            defaultValue={formStatus?.inclination}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="inclination"
          />
          <h3>Diámetro:</h3>
          <input
            type="boolean"
            defaultValue={formStatus?.diameter}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="diameter"
          />
          <h3>Altura:</h3>
          <input
            type="text"
            defaultValue={formStatus?.height}
            onChange={handleInputChange}
            style={{ textAlign: "center", margin: 1 }}
            disabled
            name="height"
          />
          <br />
          <Button variant="outline-success" type="submit" onClick={save} disabled={!formValid ||isLoading}>
          {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-green"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
