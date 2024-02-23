import { useState } from "react";
import { Container, Form } from "react-bootstrap";

export const Status = (props ) => {
  const { handleFormValidityChange, handleFormSubmit } = props;
  const [statusformData, setStatusFormData] = useState({
    generalStatus: '',
    fallingDanger: '',
    inclination: '',
    diameter: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData((prevFormData) =>({
      ...prevFormData,
      [name]: value
    }));
    
    if (typeof handleFormSubmit === 'function') {
      handleFormSubmit({...statusformData, [name]: value}); // Llama a la función handleFormSubmit con los datos actualizados del formulario
    }
  };


  return (
    <div>
      <Container>
        <h1>Estado del árbol</h1>
        <Form>
          
          <Form.Label className="m-4">Estado general</Form.Label> <br />
          <Form.Select aria-label="Seleccione una opción"  
          name="generalStatus"      
          value={statusformData.generalStatus}
          onChange={handleInputChange}
          style={{ariaLabel:"Seleccione una opción"}}>
            <option value="" disabled>Seleccione una opción</option>
            <option  value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option   value="5">5</option>
          </Form.Select>{" "}
          <br />
          <Form.Label className="m-4">Peligro de caida</Form.Label> <br />
          <Form.Select aria-label="Seleccione una opción"  
                name="fallingDanger"
                  value={statusformData.fallingDanger}
                  onChange={handleInputChange}>
            <option value="" disabled>Seleccione una opción</option>
            <option value={false}>No</option>
            <option value={true}>Si</option>
          </Form.Select>{" "}
          <br />

          <Form.Label>Inclinación</Form.Label>
          <div className="bg-white my-2 p-1 flex border border-gray-200">
            <input
              type="text"
              name="inclination"
              value={statusformData.inclination}
              onChange={handleInputChange}
              className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
              placeholder="Solo números"
            />
          </div>
          <Form.Label>Diámetro en cm</Form.Label>
          <div className="bg-white my-2 p-1 flex border border-gray-200">
            <input
              type="text"
              name="diameter"
              value={statusformData.diameter}
              onChange={handleInputChange}
              className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
              placeholder="Solo números"
            />
          </div>
                  </Form>
      </Container>
    </div>
  );
};
