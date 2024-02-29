import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

export const StepperControl = ({handleClick, currentStep, steps, formValid, save }) => {
  return (
    <Container>
      <Row>
        <Col xs={6}>
          <Button style={{}} variant="outline-primary" onClick={() => {handleClick("Atras")}} disabled={currentStep === 1 ? true : false}>Atras</Button>
        </Col>
        <Col xs={6}>
          {currentStep !== steps.length ? (<Button  variant="outline-success" disabled={!formValid} onClick={() => {
            if (currentStep === steps.length) {
              save(); // Llama a la función save si el usuario está en el último paso
            } else {
              handleClick("Siguiente");
            }
          }}>
            {currentStep !== steps.length && "Siguiente"}
          </Button>): ("")}
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