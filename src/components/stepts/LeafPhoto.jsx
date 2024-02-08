import React, { useState } from "react";
const leafExample = "c/LeafExample.jpg"
const NOMINATIM_BASE_URL = " http://arbolado-ilfqxfroaq-uc.a.run.app/predict_knn_clip";
export const LeafPhoto = () => {
  const [selectedImage, setSelectedImage] = useState(); // Vista previa de la imagen
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);
  const handleInputFileChange = (e) => {
    //Vista previa de la foto
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const handleSubmit = async event => {
    event.preventDefault();
    try {
        await fetch(` ${NOMINATIM_BASE_URL}`, {
            method: 'post',
           
        })
        .then((response) => response.text())
        .then((result) => {
          console.log(JSON.parse(result));
          setListPlace(JSON.parse(result));
        })
            .catch(err => console.log(err));
    } catch (error) {
        console.log(error);
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
    //         className="block w-full text-sm text-slate-500
    //   file:mr-4 file:py-2 file:px-4
    //   file:rounded-full file:border-0
    //   file:text-sm file:font-semibold
    //   file:bg-violet-50 file:text-violet-700
    //   hover:file:bg-violet-100
    // "
          />
          {/* {selectedImage && (
              <div
                style={{
                  marginTop: 50,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <image
                  style={{ maxWidth: "100%", maxHeight: 320 }}
                  src={selectedImage}
                  alt="Thumb"
                />
              </div>
            )} */}

          <div className="flex items-center">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-4"
              style={{ flex: 1 }}
              // onClick={handleSubmit}
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
                    console.log(selectedImage);
                    console.log(JSON.parse(result));
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
    </div>
  );
};
