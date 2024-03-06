import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

export const ProfilePhoto = (props) => {
  const [selectedImageProfile, setSelectedImageProfile] = useState(null); // Vista previa de la imagen
  const { handleFormValidityChange, setFotoPerfil } = props;
  const handleChange = (event) => {
    setSearchText(event.target.value);
  };
  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImageProfile");
    if (storedImage) {
      setSelectedImageProfile(storedImage);
    }
  }, []);
  const validatePhoto = () => {
    const isValid = selectedImageProfile !== null; // Validación básica: asegúrate de que el campo no esté vacío
    handleFormValidityChange(isValid); // Llama a la función que maneja la validez del formulario
  };
  useEffect(() => {
    validatePhoto();
  }, [selectedImageProfile]);
  const handleInputFileChange = (event) => {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      const reader = new FileReader(); // Crear un lector de archivos
      reader.onloadend = () => {
        // Cuando la lectura del archivo se complete, actualizar el estado de la imagen con la URL de la imagen
        setSelectedImageProfile(reader.result);
        setFotoPerfil(reader.result); // Asignar la imagen al estado fotoHoja
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
  };
  return (
    <Container>
      <Row>
        <h2>Sacar foto del arbol completo</h2>
        <Col md={{ span: 3, offset: 3 }}>
          <form className="flex items-center space-x-6">
            <label className="block" style={{ marginLeft: "120px" }}>
              <input
                type="file"
                name="file"
                onChange={handleInputFileChange}
                accept="image/*"
                className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-2
    "
                style={{ width: "20vw", height: "10 hv" }}
              />
            </label>
          </form>
        </Col>
      </Row>
      <Row>
        <Col xs={{ span: 2, offset: 5 }}>
            <Image src={selectedImageProfile} />
        </Col>
      </Row>
    </Container>
  );
};
