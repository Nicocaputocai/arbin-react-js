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


const position = [-34.7033363, -58.3953235];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState('');
  const [finalData, setFinalData] = useState([]);
  const [selectPosition, setSelectPosition] = useState(null);
  const [formValid, setFormValid] = useState(false); // Estado para rastrear la validez del formulario
  const [Checkbox, setCheckbox] = useState(null);
  const [fotoHoja, setfotoHoja] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [formData, setFormData] = useState(null);
  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  const steps = [
    "Dirección",
    "Ubicación",
    "Foto de la hoja",
    "Foto del perfil",
    "Estado",
    "Finalizar"
  ];

  // Función para manejar el cambio en la validez del formulario

  const displayStep = (step) => {
    switch (step) {
      case 1: return <Address selectPosition={selectPosition} setSelectPosition={setSelectPosition} handleFormValidityChange={handleFormValidityChange} />;
      case 2: return <Ubication selectPosition={selectPosition} handleFormValidityChange={handleFormValidityChange}  />;
      case 3: return <LeafPhoto handleFormValidityChange={handleFormValidityChange} Checkbox={Checkbox} setCheckbox={setCheckbox} setfotoHoja={setfotoHoja}  fotoHoja={fotoHoja}/>
      case 4: return <ProfilePhoto handleFormValidityChange={handleFormValidityChange} fotoPerfil={fotoPerfil}  setFotoPerfil={setFotoPerfil} />
      case 5: return <Status handleFormValidityChange={handleFormValidityChange}  onSubmit={handleFormSubmit}/>
      case 6:  
       return < Finish selectPosition={selectPosition} Checkbox={Checkbox} fotoHoja={fotoHoja} fotoPerfil={fotoPerfil}  formData={formData}/>;
    };
  }

  const handleClick = (direction) => {
    let newStep = currentStep
    direction === "Siguiente" && formValid ==! "" ? newStep++ : newStep--;
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  const handleFormValidityChange = (isValid) => {
    setFormValid(isValid);
  }

  return (
    <div className='md:w1-/2 mx-auto shadow-xl rounded-2xl pb-2 bg-white '>
      <div className='container horizontal mt-5'>
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
        />
      </div>
    </div>
  );
}

export default App;
