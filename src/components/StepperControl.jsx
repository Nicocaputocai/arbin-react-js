import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

export const StepperControl = ({ handleClick, currentStep, steps, formValid, submitted }) => {
  return (
    <Container className="mt-4">
      <Row className="align-items-center">
        <Col xs={6} className="text-start">
          {/* CONDICIÓN: Solo mostramos 'Atras' si:
              1. NO estamos en el paso 1
              2. NO se ha enviado el formulario todavía (submitted)
          */}
          {(currentStep > 1 && !submitted) && (
            <Button 
              variant="outline-primary" 
              onClick={() => handleClick("Atras")} 
              style={{ borderRadius: '10px', padding: '8px 25px' }}
            >
              Atras
            </Button>
          )}
        </Col>
        
        <Col xs={6} className="text-end">
          {/* CONDICIÓN: Solo mostramos 'Siguiente' si:
              1. No es el último paso
              2. No se ha enviado el formulario
          */}
          {(currentStep !== steps.length && !submitted) && (
            <Button  
              variant="outline-success" 
              disabled={!formValid} 
              onClick={() => handleClick("Siguiente")}
              style={{ borderRadius: '10px', padding: '8px 25px' }}
            >
              Siguiente
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

{/* <button onClick={()=>{handleClick("Atras")}} className={`bg-blue-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ${currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>Atras</button>  */}
        {/* <button onClick={ () => {handleClick("Siguiente")} } disabled={!formValid} 
        className={formValid === true ? 'bg-green-500 text-white uppercase py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-slate-300 hover:bg-slate-700 hover:text-white transition duration-200 ease-in-out ' : "opacity-50 cursor-not-allowed"} >
            {currentStep === steps.length? "Finalizar" : "Siguiente"} 
            
        </button>  */}