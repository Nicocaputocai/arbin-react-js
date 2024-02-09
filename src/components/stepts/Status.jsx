import React from "react";
import { Container, Form } from "react-bootstrap";

export const Status = () => {
  return (
    <div>
      <Container>
        <h2>Estado del árbol</h2>
        <Form>
          <Form.Label className="m-3">Estado general</Form.Label> <br />
          <Form.Select aria-label="Default select example">
            <option disabled>Seleccione una opción</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </Form.Select>{" "}
          <br />
          <Form.Label className="m-3">Peligro de caida</Form.Label> <br />
          <Form.Select aria-label="Default select example">
            <option disabled>Seleccione una opción</option>
            <option value={1}>Si</option>
            <option value={0}>No</option>
          </Form.Select>{" "}
          <br />

          <Form.Label>Inclinación</Form.Label>
          <div className="bg-white my-2 p-1 flex border border-gray-200">
            <input
              type="text"
              name="address"
              className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
            />
          </div>
          <Form.Label>Diámetro en cm</Form.Label>
          <div className="bg-white my-2 p-1 flex border border-gray-200">
            <input
              type="text"
              name="address"
              className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
            />
          </div>
                  </Form>
      </Container>
    </div>
  );
};
{
  /* <div className="bg-white my-2 p-1 flex border border-gray-200">
<input
  type="text"
  name="address"
  onChange={(event) => {
    setSearchText(event.target.value);

    // console.log(event.target.value);
  }}
  value={searchText}
  className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
/>
</div> */
}
