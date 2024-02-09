import { Container, Form } from "react-bootstrap";
import React, { useState } from "react";
const leafExample = "./LeafExample.jpg"
const NOMINATIM_BASE_URL = "http://arbolado-ilfqxfroaq-uc.a.run.app/predict_image";
export const LeafPhoto = () => {
  const [selectedImage, setSelectedImage] = useState(); // Vista previa de la imagen

  const [listPlace, setListPlace] = useState([]);
  const handleInputFileChange = (e) => {
    //Vista previa de la foto
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div>
      <h2>Sacar foto de la hoja</h2>
      <form className="flex items-center space-x-6" >
        <div className="shrink-0">
          <img
            className="h-16 w-16 object-cover rounded-full"
            src={leafExample}
            alt="Current profile photo"
          />
        </div>
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            name="file"
            onChange={handleInputFileChange}
            className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-2
    "
          />

          <div className="flex items-center">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-4"
              style={{ flex: 1 }}
              onClick={(e) => {
                e.preventDefault()
                const formData = new FormData();
                formData.append("file", selectedImage);
                // Search

                const requestOptions = {
                  method: "POST",
                  body: formData,
                  // headers: {
                  //     'Content-Type': 'multipart/form-data'
                  // }
                };
                fetch(`${NOMINATIM_BASE_URL}`, requestOptions)
                  .then((response) => response.text())
                  .then((result) => {
                    // console.log(selectedImage);
                    console.log(JSON.parse(result));
                    // console.log(typeof listPlace)
                    setListPlace(JSON.parse(result));
                  })
                  .catch((err) => console.log("err: ", err));
              }}
            >
              Success
            </button>
          </div>
        </label>
      </form>
      <Container>
  <h1 className="mt-3">Seleccionar qué árbol corresponde</h1>
  <Form>
    {Object.values(listPlace).map((array, index) => {
      const filteredArray = array.filter(item => item[1] > 0.2);
      const uniqueTreeNames = new Set();
      const renderedElements = [];
      let renderedCount = 0;
      for (const item of filteredArray) {
        if (!uniqueTreeNames.has(item[0]) && renderedCount < 6) {
          uniqueTreeNames.add(item[0]);
          renderedElements.push(item);
          renderedCount++;
        }
      }
      return renderedElements.map((item, subIndex) => (
        <Form.Check 
          type="radio"
          id={`${item[0]}-${index}-${subIndex}`}
          label={`${item[0]}`}
          name="tree"
          key={`${item[0]}-${index}-${subIndex}`}
        />
      ));
    }).flat()}
  </Form>
</Container>

     
    

    </div>
  );
};
