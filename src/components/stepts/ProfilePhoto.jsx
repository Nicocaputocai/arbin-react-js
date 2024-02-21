import { useState } from "react";


export const ProfilePhoto = (props) => {
  const [selectedImageProfile, setSelectedImageProfile] = useState(null); // Vista previa de la imagen
  const  {handleFormValidityChange, setFotoPerfil } = props
  const handleInputFileChange = (event) => {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      const reader = new FileReader(); // Crear un lector de archivos
      reader.onloadend = () => {
        // Cuando la lectura del archivo se complete, actualizar el estado de la imagen con la URL de la imagen
        setSelectedImageProfile(reader.result);
        setFotoPerfil(reader.result); // Asignar la imagen al estado fotoHoja
      };
      reader.readAsDataURL(file); // Leer el archivo como una URL de datos
    }
  };
  return (
    <div>
      <div>
        <h2>Sacar foto del arbol completo</h2>
        <form className="flex items-center space-x-6">
          {/* <div className="shrink-0">
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
              className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-2
    "
            />
          </label> */}
          <label className="block">
          <input
            type="file"
            name="file"
            onChange={handleInputFileChange}
            accept="image/*"
            className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-2
    "
    style={{width: 100, height: "20 hv"}}
          />
          <div style={{width: "15vw", height: "30 hv", alignItem:"center" }}>
            <img src={selectedImageProfile}     />{" "}
          </div>
        </label>
        </form>
      </div>
    </div>
  );
};
