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
    setStatusFormData({
      ...statusformData,
      [name]: value
    });
    
    if (typeof handleFormSubmit === 'function') {
      handleFormSubmit(statusformData); // Llama a la función handleFormSubmit con los datos actualizados del formulario
    }
  };


  return (
    <div>
      <Container>
        <h2>Estado del árbol</h2>
        <Form>
          <Form.Label className="m-3">Estado general</Form.Label> <br />
          <Form.Select aria-label="Default select example"  
          name="generalStatus"      
          value={statusformData.generalStatus}
          onChange={handleInputChange}>
            <option disabled>Seleccione una opción</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Form.Select>{" "}
          <br />
          <Form.Label className="m-3">Peligro de caida</Form.Label> <br />
          <Form.Select aria-label="Default select example"
                name="fallingDanger"
                  value={statusformData.fallingDanger}
                  onChange={handleInputChange}>
            <option disabled>Seleccione una opción</option>
            <option value={true}>Si</option>
            <option value={false}>No</option>
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
            />
          </div>
                  </Form>
      </Container>
    </div>
  );
};
