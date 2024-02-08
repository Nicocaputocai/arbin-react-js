import React, { useState } from 'react'
const leafExample = '../../../public/LeafExample.jpg'
export const LeafPhoto = () => {
  const [selectedImage, setSelectedImage] = useState(); // Vista previa de la imagen
  const handleInputFileChange = (e) => {
    //Vista previa de la foto
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div>
    <h2>Sacar foto de la hoja</h2>
      <form className="flex items-center space-x-6">
  <div className="shrink-0">
    <img className="h-16 w-16 object-cover rounded-full" src={leafExample} alt="Current profile photo" />
  </div>
  <label className="block">
    <span className="sr-only">Choose profile photo</span>
    <input type="file"
    onChange={handleInputFileChange}
    className="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "/>            
    {selectedImage && (
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
            )}
  </label>
  
</form>
    </div>

    
  )
}
