import { Container, Form } from "react-bootstrap";
import React, { useState } from "react";
const leafExample = "./LeafExample.jpg";
const NOMINATIM_BASE_URL ="https://arbin-ia.divisioncode.net.ar/predict_image";


export const LeafPhoto = (props) => {
  const [selectedImage, setSelectedImage] = useState(null); // Vista previa de la imagen
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImage, setShowImage] = useState(null)
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const  {setCheckbox, handleFormValidityChange, setfotoHoja, Checkbox,  } = props

  const validateAddress = () => {
    const isValid = Checkbox !== ''; // Validación básica: asegúrate de que el campo no esté vacío
    handleFormValidityChange(isValid); // Llama a la función que maneja la validez del formulario
  }
  


  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event.target.value);
    setCheckbox(event.target.value)
    validateAddress();
  };


  const handleInputFileChange = (event) => {

    const file = event.target.files[0];
    setSelectedImage(file)



        if (file) {
      const reader = new FileReader(); // Crear un lector de archivos
      reader.onloadend = () => {
        // Cuando la lectura del archivo se complete, actualizar el estado de la imagen con la URL de la imagen
        setShowImage(reader.result); // Mostrar la vista previa de la imagen
        setfotoHoja(reader.result); // Asignar la imagen al estado fotoHoja
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }

  }


  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
 

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      const response = await fetch(`${NOMINATIM_BASE_URL}`, requestOptions);
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setListPlace(result);
      console.log(result);
    } catch (error) {
      console.log("Error:", error.message);
      console.log("La imagen no se envió correctamente a la API");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style= {{alignItems:"center", textAlign: "center"}}>
      <h2>Sacar foto de la hoja</h2>
      <form className="flex items-center space-x-6">
        <div className="shrink-0">
          <img
            className="h-16 w-16 object-cover rounded-full"
            src={leafExample}
            alt="Current profile photo"
            
          />
        </div>
        <label className="block">
          <input
            type="file"
            name="UploadFile"
            onChange={handleInputFileChange}
            accept="image/*"
            className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-2"
    style={{width: 100, height: "20 hv"}}
          />
        </label>
          <div style={{width: "15vw", height: "30 hv", alignItem:"center" }}>

            <img src={showImage}     />{" "}
            {/* Mostrar la vista previa de la foto */}
          </div>

          <div className="flex items-center">
          <button
            onClick={handleSearch}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
            style={{ flex: 1 }}
            disabled={isLoading || handleSearch == ""} // Deshabilita el botón mientras se está cargando
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
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
          </button>
        </div>

      </form>
      <Container>
        <h1 className="mt-3">Seleccionar qué árbol corresponde</h1>
        <Form>
          {Object.values(listPlace)

            .map((array, index) => {
              if(Array.isArray(array)) {
              const filteredArray = array.filter((item) => item);
              const uniqueTreeNames = new Set();
              const renderedElements = [];
              let renderedCount = 0;
              for (const item of filteredArray) {
                if (!uniqueTreeNames.has(item[0]) && renderedCount < 6) {
                  uniqueTreeNames.add(item[0]);
                  renderedElements.push(item);
                  renderedCount++;
                }
              }
              return renderedElements.map((item, subIndex) => (
                <Form.Check
                  type="radio"
                  id={`${item[0]}-${index}-${subIndex}`}
                  label={`${item[0]}`}
                  name="tree"
                  key={`${item[0]}-${index}-${subIndex}`}
                  value={item[0]}
                  // checked={selectedCheckbox === `${item[0]}`} // Comprueba si este checkbox está seleccionado
                  onChange={handleCheckboxChange} // Maneja el cambio de estado del checkbox
                />
              ));
              }
            })
            .flat()
            
            }
        </Form>
      </Container>
    </div>
  );
};
