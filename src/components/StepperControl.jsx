import React from 'react'

export const StepperControl = ({handleClick, currentStep, steps}) => {

  return (
    <div className='container flex justify-between mt-4 mb-8 '
    >
        <button onClick={()=>{handleClick("Atras")}} className={`bg-blue-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>Atras</button> 
        <button onClick={ () => {handleClick("Siguiente")}}  
        className='bg-green-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out '>
            {currentStep === steps.length? "Finalizar" : "Siguiente"} 
        </button> 
    </div>
  )
}
