import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Componentes del Stepper
import { Stepper } from "./components/Stepper";
import { StepperControl } from "./components/StepperControl";
import { Address } from "./components/stepts/Address";
import { Ubication } from "./components/stepts/Ubication";
import { ProfilePhoto } from "./components/stepts/ProfilePhoto";
import { StrepperContext } from "./components/contexts/StepperContext";
import { Finish } from "./components/stepts/Finish";
import { LeafPhotoPlantId } from "./components/stepts/LeafPhotoPlantId";

// Componentes de Autenticación
import { Login } from "./components/Login";
import AuthService from "./Services/AuthService";

import { Col, Container, Image, Row, Button } from "react-bootstrap";

const logo = "./arbin-high-resolution-logo-transparent.png";

function App() {
  // --- ESTADOS DEL FORMULARIO ---
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState("");
  const [finalData, setFinalData] = useState([]);
  const [selectPosition, setSelectPosition] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [Checkbox, setCheckbox] = useState(null);
  const [fotoHoja, setfotoHoja] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [position, setPosition] = useState(null);
  const currentUser = localStorage.getItem("username") || "Anónimo";
  // Nuevo estado para saber si el árbol ya se guardó
  const [isFinalized, setIsFinalized] = useState(false);

  // --- LÓGICA DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // --- FUNCIÓN DE LIMPIEZA TOTAL (RESET) ---
  const handleReset = () => {
    // 1. Limpiamos estados
    setSelectPosition(null);
    setCheckbox(null);
    setfotoHoja(null);
    setFotoPerfil(null);
    setPosition(null);
    setIsFinalized(false);
    setFormValid(false);
    setCurrentStep(1); // Volvemos al inicio

    // 2. Limpiamos localStorage de fotos para que no aparezcan imágenes viejas
    localStorage.removeItem("selectedImageProfile");
    localStorage.removeItem("selectedImageLeaf"); 
  };

  const handleLogout = () => {
    AuthService.logout();
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    handleReset(); // Al salir limpiamos todo por seguridad
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const steps = [
    "Dirección",
    "Ubicación",
    "Foto de la hoja",
    "Foto del perfil",
    "Finalizar",
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <Address
            selectPosition={selectPosition}
            setSelectPosition={setSelectPosition}
            handleFormValidityChange={handleFormValidityChange}
          />
        );
      case 2:
        return (
          <Ubication
            selectPosition={selectPosition}
            setSelectPosition={setSelectPosition}
            handleFormValidityChange={handleFormValidityChange}
            position={position}
            setPosition={setPosition}
          />
        );
      case 3:
        return (
          <LeafPhotoPlantId
            handleFormValidityChange={handleFormValidityChange}
            Checkbox={Checkbox}
            setCheckbox={setCheckbox}
            setfotoHoja={setfotoHoja}
            fotoHoja={fotoHoja}
          />
        );
      case 4:
        return (
          <ProfilePhoto
            handleFormValidityChange={handleFormValidityChange}
            fotoPerfil={fotoPerfil}
            setFotoPerfil={setFotoPerfil}
          />
        );
      case 5:
        return (
          <Finish
            selectPosition={selectPosition}
            Checkbox={Checkbox}
            fotoHoja={fotoHoja}
            fotoPerfil={fotoPerfil}
            position={position}
            handleFormValidityChange={handleFormValidityChange}
            formValid={formValid}
            createdBy={localStorage.getItem("username") || "Sin registro"}
            onSuccess={() => setIsFinalized(true)} // Avisa que ya se guardó
            onReset={handleReset} // Pasa la función de limpieza al botón del modal
          />
        );
      default:
        return null;
    }
  };

  const handleClick = (direction) => {
    let newStep = currentStep;
    if (direction === "Siguiente" && formValid !== false) {
      newStep++;
    } else {
      newStep--;
    }
    if (newStep > 0 && newStep <= steps.length) {
      setCurrentStep(newStep);
    }
  };

  const handleFormValidityChange = (isValid) => {
    setFormValid(isValid);
  };

  return (
    <Container>
      <div className="d-flex justify-content-end mt-3 mb-2">
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>

      <Image
        style={{
          height: "15vh",
          maxWidth: "fit-content",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          borderStyle: "inset",
        }}
        src={logo}
      />
      <Row>
        <div className="mt-4">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        <Col>
          <div className="my-10">
            <StrepperContext.Provider
              value={{
                userData,
                setUserData,
                finalData,
                setFinalData,
                handleFormValidityChange,
              }}
            >
              {displayStep(currentStep)}
            </StrepperContext.Provider>
          </div>

          <div>
            <StepperControl
              handleClick={handleClick}
              currentStep={currentStep}
              steps={steps}
              formValid={formValid}
              submitted={isFinalized} // Pasa el estado de éxito para ocultar botones
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;