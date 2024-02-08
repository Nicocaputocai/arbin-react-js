import { useState } from 'react'
import './App.css'
import { Stepper } from './components/stepper'
import { StepperControl } from './components/StepperControl'
import { Address } from './components/stepts/Address'
import { Ubication } from './components/stepts/Ubication'
import { LeafPhoto } from './components/stepts/LeafPhoto'
import { ProfilePhoto } from './components/stepts/ProfilePhoto'
import { Status } from './components/stepts/Status'
import { StrepperContext } from './components/contexts/StepperContext'
import { TreeOptions } from './components/stepts/TreeOptions'

const position = [-34.7033363, -58.3953235];

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState('')
  const [finalData, setFinalData] = useState([])

  const [selectPosition, setSelectPosition] = useState(null);

  const steps =[
    "Dirección",
    "Ubicación",
    "Foto de la hoja",
    "Seleccionar arbol",
    "Foto del perfil",
    "Estado",
    "Finalizar"
  ]
  const displayStep = (step) =>{
    switch(step){
      case 1: return <Address  selectPosition={selectPosition} setSelectPosition={setSelectPosition} />;
      case 2: return <Ubication selectPosition={selectPosition} />;
      case 3: return <LeafPhoto />
      case 4: return <TreeOptions />
      case 5: return <ProfilePhoto />
      case 6: return <Status />

    }
  }

  const handleClick = (direction)=>{
    let newStep = currentStep
    direction === "Siguiente" ? newStep++ : newStep--;
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
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
      <StrepperContext.Provider value={{
        userData,
        setUserData,
        finalData,
        setFinalData
      }}>
        {displayStep(currentStep)}  
      </StrepperContext.Provider>  
    </div>  

      <div>
      <StepperControl 
      handleClick ={handleClick}
      currentStep={currentStep}
      steps={steps}
      />
      </div>


    </div>
  )
}

export default App
