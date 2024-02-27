import { useState } from 'react'
import './App.css'
import { Stepper } from './components/Stepper'
import { StepperControl } from './components/StepperControl'
import { Address } from './components/stepts/Address'
import { Ubication } from './components/stepts/Ubication'
import { LeafPhoto } from './components/stepts/LeafPhoto'
import { ProfilePhoto } from './components/stepts/ProfilePhoto'
import { Status } from './components/stepts/Status'
import { StrepperContext } from './components/contexts/StepperContext'
import { Finish } from './components/stepts/Finish'
import { Container } from 'react-bootstrap'
{
  /* The following line can be included in your src/index.js or App.js file */
}
import 'bootstrap/dist/css/bootstrap.min.css';

// const position = [-34.7033363, -58.3953235];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState('');
  const [finalData, setFinalData] = useState([]);
  const [selectPosition, setSelectPosition] = useState(null);
  const [formValid, setFormValid] = useState(false); // Estado para rastrear la validez del formulario
  const [Checkbox, setCheckbox] = useState(null);
  const [fotoHoja, setfotoHoja] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [formStatus, setFormStatus] = useState(null);
  const [position, setPosition] = useState(null);
  const handleFormSubmit = (data) => {
    setFormStatus(data);
  };

  const steps = [
    "Dirección",
    "Ubicación",
    "Foto de la hoja",
    "Foto del perfil",
    "Estado",
    "Finalizar"
  ];

console.log(position);
  // Función para manejar el cambio en la validez del formulario

  const displayStep = (step) => {
    switch (step) {
      case 1: return <Address selectPosition={selectPosition} setSelectPosition={setSelectPosition} handleFormValidityChange={handleFormValidityChange} />;
      case 2: return <Ubication 
      selectPosition={selectPosition} 
      setSelectPosition={setSelectPosition} 
      handleFormValidityChange={handleFormValidityChange}  
      position={position} 
      setPosition={setPosition}
    />
      case 3: return <LeafPhoto handleFormValidityChange={handleFormValidityChange} Checkbox={Checkbox} setCheckbox={setCheckbox} setfotoHoja={setfotoHoja}  fotoHoja={fotoHoja}/>
      case 4: return <ProfilePhoto handleFormValidityChange={handleFormValidityChange} fotoPerfil={fotoPerfil}  setFotoPerfil={setFotoPerfil} />
      case 5: return <Status handleFormValidityChange={handleFormValidityChange} handleFormSubmit={handleFormSubmit}/>
      case 6:  
      return <Finish 
      selectPosition={selectPosition} 
      Checkbox={Checkbox} 
      fotoHoja={fotoHoja} 
      fotoPerfil={fotoPerfil} 
      formStatus={formStatus} 
      position={position}
    />;
    };
  }

  const enviarFormulario = () => {
    // Aquí puedes agregar la lógica para enviar el formulario
    alert("¡El formulario ha sido enviado!");
    // Puedes acceder a los datos finales del formulario desde finalData si lo necesitas
  };
  // const handleClick = (direction) => {
  //   let newStep = currentStep
  //   direction === "Siguiente" && formValid ==! "" ? newStep++ : newStep--;
    
  //   newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  // };
  const handleClick = (direction) => {
    let newStep = currentStep;
  
    // Verificar si el usuario intenta avanzar
    if (direction === "Siguiente" && formValid !== false) {
      newStep++;
    } else {
      newStep--;
    }
  
    // Verificar si se llega al último paso y la dirección es "Siguiente"
    if (currentStep === steps.length && direction === "Siguiente") {
      // Lógica para enviar el formulario
      enviarFormulario(); // Esta es la función para enviar el formulario
    } else {
      // Asegurarse de que el nuevo paso esté dentro del rango de pasos
      if (newStep > 0 && newStep <= steps.length) {
        setCurrentStep(newStep);
      }
    }
  };
  

  const handleFormValidityChange = (isValid) => {
    setFormValid(isValid);
  }


  return (
    <Container>
      <div className='mt-5'>
        <Stepper
          steps={steps}
          currentStep={currentStep}
        />
      </div>

      <div className='my-10 p-10'>
        {/* Paso el manejador de cambio de validez del formulario a cada paso */}
        <StrepperContext.Provider value={{
          userData,
          setUserData,
          finalData,
          setFinalData,
          handleFormValidityChange
        }}>
          {displayStep(currentStep)}
        </StrepperContext.Provider>
      </div>

      <div>
        {/* Deshabilito el botón "Siguiente" si el formulario no es válido */}
        <StepperControl
          handleClick={handleClick}
          currentStep={currentStep}
          steps={steps}
          formValid={formValid}
          enviarFormulario={enviarFormulario} 
        />
      </div>
    </Container>
  );
}

export default App;
