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
          <label className="block" style={{ marginLeft:"120px"}}>
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
    style={{width:"100vw", height: "20 hv", }}
          />
          <div style={{width: "15vw", height: "30 hv", alignItem:"center"}}>
            <img src={selectedImageProfile}     />{" "}
          </div>
        </label>
        </form>
      </div>
    </div>
  );
};
