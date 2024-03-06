import { Button, Col, Container, Form, Row, Image } from "react-bootstrap";
import React, { useEffect, useState } from "react";
const leafExample = "./LeafExample.jpg";
const NOMINATIM_BASE_URL = "https://arbin-ia.divisioncode.net.ar/predict_image";
const NOMINATIM_BASE_URL_PLANT_ID = "https://plant.id/api/v3/identification";

import "./style/gallery.css";



export const LeafPhotoPlantId = (props) => {
  const [selectedImage, setSelectedImage] = useState(null); // Vista previa de la imagen
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const { setCheckbox, handleFormValidityChange, setfotoHoja, Checkbox } = props;
  const API_KEY = import.meta.env.VITE_KEY_PLANT_ID

  const validatePhoto = () => {
    const isValid = Checkbox !== null; // Validación básica: asegúrate de que el campo no esté vacío
    handleFormValidityChange(isValid); // Llama a la función que maneja la validez del formulario
  };
  useEffect(() => {
    validatePhoto();
  }, [Checkbox]);
  


  const handleInputFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const reader = new FileReader(); // Crear un lector de archivos
      reader.onloadend = () => {
        // Cuando la lectura del archivo se complete, actualizar el estado de la imagen con la URL de la imagen
        setShowImage(reader.result); // Mostrar la vista previa de la imagen
        setfotoHoja(reader.result); // Asignar la imagen al estado fotoHoja
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
  };

  const handleSearchPlantId = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      var raw = JSON.stringify({
        images: [showImage],
        "latitude": 49.207,
        "longitude": 16.608,
        "similar_images": true
      })
      const formData = new FormData();
      formData.append("file", selectedImage);
      var myHeaders = new Headers();
      myHeaders.append("Api-Key", API_KEY);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      const response = await fetch(
        `${NOMINATIM_BASE_URL_PLANT_ID}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();

      if (result.result && result.result.classification && result.result.classification.suggestions.length > 0) {
        // Verificar si hay sugerencias disponibles antes de acceder a ellas
        const name = result.result.classification.suggestions[0].name;
        const id = result.result.classification.suggestions[0].id;
        const photo =  result.result.classification.suggestions[0].similar_images[0].url;
        setListPlace([id,name,photo]);
        // console.log(name); // Imprime el nombre del lugar
        // console.log(listPlace);
        setCheckbox(prevCheckboxValue => {
          // Si prevCheckboxValue no está inicializado, inicialízalo como un array vacío
          if (!Array.isArray(prevCheckboxValue)) {
            prevCheckboxValue = [];
          }
          // Concatenar los nuevos valores
          return prevCheckboxValue.concat([id, name]);
        });
      
        validatePhoto()
      }
    } catch (error) {
      console.log("Error:", error.message);
      console.log("La imagen no se envió correctamente a la API");
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(Checkbox);
  return (
    <div style={{ alignItems: "center", textAlign: "center" }}>
      <h2 className="mb-3">Sacar foto de la hoja</h2>
      <Row>
        <Form>
          <Row>
            <Col md={{ offset: 4, span: 2 }}>
              <div >
                <img
                  className="h-16 w-16 object-cover rounded-full"
                  src={leafExample}
                  alt="Current profile photo"
                />
              </div>
            </Col>
            <Col>
              <label className="block">
                <input
                  type="file"
                  name="UploadFile"
                  onChange={handleInputFileChange}
                  accept="image/*"
                  className="block w-full text-sm text-slate-500
       file:py-2 
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-2"
                  // style={{ width: 100, height: "20 hv" }}
                />
              </label>
            </Col>
          </Row>
          <br />
          <div>
            <Col md={{ offset: 5, span: 2 }}>
              <img
                style={{
                  maxHeight: "50vh",
                }}
                src={showImage}
              />{" "}
            </Col>
            {/* Mostrar la vista previa de la foto */}
          </div>{" "}
          <br />
          <div>
            <Button
              onClick={handleSearchPlantId}
              variant="outline-success"
              disabled={!selectedImage || isLoading || !listPlace} // Deshabilita el botón mientras se está cargando
            >
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
                "Buscar"
              )}
            </Button>
          </div>
        </Form>
        <Container>
          <Row>
            <Col xs={{span:10, offset:1}} md={{span:6, offset:3}}>
            {Checkbox !== null ? <h1 className="mt-3">¡Árbol encontrado!</h1> : ""} <br />
          
            <h2 style={{backgroundColor:"green", color:"white", fontSize:"2em"}}>{listPlace[1]}</h2>
<br />
          
          <Image src={listPlace[2]} />
            </Col>
          </Row>
          
        </Container>
      </Row>
    </div>
  );
};
