import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";

export const Status = (props) => {
  const { handleFormValidityChange, handleFormSubmit } = props;
  const [statusformData, setStatusFormData] = useState({
    generalStatus: "",
    fallingDanger: "",
    inclination: "",
    diameter: "",
  });
  useEffect(() => {
    // Aquí puedes realizar cualquier acción cada vez que formStatus cambie
    console.log("FormStatus ha cambiado:", statusformData);

    // Por ejemplo, podrías validar el estado del formulario aquí
    const isValid =
      statusformData.damagedTrunk !== "" &&
      statusformData.fallingDanger !== "" &&
      statusformData.brokenSidewalk !== "" &&
      statusformData.electricityCable !== "";
      statusformData.sidewalk !== "" &&
      statusformData.sidewalkWidth !== "" &&
      statusformData.cracks !== "" &&
      statusformData.sprouts !== "";      statusformData.damagedTrunk !== "" &&
      statusformData.inclination !== "" &&
      statusformData.diameter !== "" &&
      statusformData.height !== "" &&
    // Llama a la función handleFormValidityChange para actualizar la validez del formulario
    handleFormValidityChange(isValid);
  }, [statusformData, handleFormValidityChange]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (typeof handleFormSubmit === "function") {
      handleFormSubmit({ ...statusformData, [name]: value }); // Llama a la función handleFormSubmit con los datos actualizados del formulario
    }
  };

  return (
    <div>
      <Container>
        <h1>Estado del árbol</h1>
        <Form>
          <Form.Label className="m-4">Tronco dañado</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="damagedTrunk"
            value={statusformData.damagedTrunk}
            onChange={handleInputChange}
            style={{ ariaLabel: "Seleccione una opción" }}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value={true}>Si</option>
            <option value={false}>No</option>
          </Form.Select>{" "}
          <br />

          <Form.Label className="m-4">Peligro de caida</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="fallingDanger"
            value={statusformData.fallingDanger}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value={false}>No</option>
            <option value={true}>Si</option>
          </Form.Select>{" "}
          <br />

          <Form.Label className="m-4">Vereda rota</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="brokenSidewalk"
            value={statusformData.brokenSidewalk}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value={false}>No</option>
            <option value={true}>Si</option>
          </Form.Select>{" "}
          <br />

          <Form.Label className="m-4">Cable de electricidad</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="electricityCable"
            value={statusformData.electricityCable}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value={false}>No</option>
            <option value={true}>Si</option>
          </Form.Select>{" "}
          <br />

          <Form.Label className="m-4">Cazuela o vereda</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="sidewalk"
            value={statusformData.sidewalk}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value="cazuela">Cazuela</option>
            <option value="vereda">Vereda</option>
          </Form.Select>{" "}
          <br />

          <Form.Label>Ancho de vereda</Form.Label>
          <div className="bg-white my-2 p-1 flex border border-gray-200">
            <input
              type="text"
              name="sidewalkWidth"
              value={statusformData.sidewalkWidth}
              onChange={handleInputChange}
              className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
              placeholder="Solo números"
            />
          </div>
          <br />

          <Form.Label className="m-4">Grietas</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="cracks"
            value={statusformData.cracks}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
            <option value={false}>No</option>
            <option value={true}>Si</option>
          </Form.Select>{" "}
          <br />

          <Form.Label className="m-4">Brotes</Form.Label> <br />
          <Form.Select
            aria-label="Seleccione una opción"
            name="sprouts"
            value={statusformData.sprouts}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              Seleccione una opción
            </option>
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
          <br />

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
          <br />
          <Form.Label>Altura en cm</Form.Label>
          <div className="bg-white my-2 p-1 flex border border-gray-200">
            <input
              type="text"
              name="height"
              value={statusformData.height}
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
