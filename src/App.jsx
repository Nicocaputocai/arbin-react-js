import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Capacitor nativo
import { Capacitor } from "@capacitor/core";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { triggerSuccessHaptic } from "./utils/haptics";

// Componentes del Stepper
import { Stepper } from "./components/Stepper";
import { StepperControl } from "./components/StepperControl";
import { Address } from "./components/stepts/Address";
import { Ubication } from "./components/stepts/Ubication";
import { ProfilePhoto } from "./components/stepts/ProfilePhoto";
import { StrepperContext } from "./components/contexts/StepperContext";
import { Finish } from "./components/stepts/Finish";
import { LeafPhotoPlantId } from "./components/stepts/LeafPhotoPlantId";
import { TreeCondition } from "./components/stepts/TreeCondition";

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

  // Estados para Paso 3 (Duda sobre IA y observaciones)
  const [needsReview, setNeedsReview] = useState(false);
  const [observations, setObservations] = useState("");

  // Estado para Paso 5 (Origen, Altura relativa y Estado visible)
  const [treeDetails, setTreeDetails] = useState({
    origin: "",
    relativeHeight: "",
    visibleState: "",
  });

  // Marca de tiempo inicial para calcular la duración total del relevamiento
  const [startTime, setStartTime] = useState(() => Date.now());

  // Estado para saber si el árbol ya se guardó
  const [isFinalized, setIsFinalized] = useState(false);

  // --- LÓGICA DE AUTENTICACIÓN ---
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // Mantener pantalla encendida en Android/iOS mientras el censista está logueado
  useEffect(() => {
    if (!isAuthenticated || !Capacitor.isNativePlatform()) return;

    KeepAwake.keepAwake().catch((err) =>
      console.warn("No se pudo activar KeepAwake:", err)
    );

    return () => {
      KeepAwake.allowSleep().catch(() => {});
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setStartTime(Date.now());
  };

  // --- FUNCIÓN DE LIMPIEZA TOTAL (RESET) ---
  const handleReset = () => {
    setSelectPosition(null);
    setCheckbox(null);
    setfotoHoja(null);
    setFotoPerfil(null);
    setPosition(null);
    setNeedsReview(false);
    setObservations("");
    setTreeDetails({
      origin: "",
      relativeHeight: "",
      visibleState: "",
    });
    setIsFinalized(false);
    setFormValid(false);
    setCurrentStep(1);
    setStartTime(Date.now());

    localStorage.removeItem("selectedImageProfile");
    localStorage.removeItem("selectedImageLeaf");
  };

  const handleLogout = () => {
    AuthService.logout();
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    handleReset();
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const steps = [
    "Dirección",
    "Ubicación",
    "Foto de la hoja",
    "Foto del perfil",
    "Altura y Estado",
    "Finalizar",
  ];

  const handleFormValidityChange = (isValid) => {
    setFormValid(isValid);
  };

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return (
          <Address
            selectPosition={selectPosition}
            setSelectPosition={setSelectPosition}
            setPosition={setPosition}
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
            needsReview={needsReview}
            setNeedsReview={setNeedsReview}
            observations={observations}
            setObservations={setObservations}
            selectPosition={selectPosition}
            position={position}
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
          <TreeCondition
            treeDetails={treeDetails}
            setTreeDetails={setTreeDetails}
            handleFormValidityChange={handleFormValidityChange}
            Checkbox={Checkbox}
          />
        );
      case 6:
        return (
          <Finish
            selectPosition={selectPosition}
            Checkbox={Checkbox}
            fotoHoja={fotoHoja}
            fotoPerfil={fotoPerfil}
            position={position}
            treeDetails={treeDetails}
            needsReview={needsReview}
            observations={observations}
            startTime={startTime}
            handleFormValidityChange={handleFormValidityChange}
            formValid={formValid}
            createdBy={localStorage.getItem("username") || "Sin registro"}
            onSuccess={async () => {
              await triggerSuccessHaptic();
              setIsFinalized(true);
            }}
            onReset={handleReset}
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
              submitted={isFinalized}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;