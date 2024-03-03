import React, { useState, useEffect } from 'react'
import CensusTreesServices from '../../Services/CensusTreeService';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { ProfilePhoto } from './ProfilePhoto';

export const Finish = (props) => {
  const { selectPosition, Checkbox, fotoHoja, fotoPerfil, formStatus, position } = props;
  const street = selectPosition?.address.road;
const houeseNumber = selectPosition?.address.house_number;
const [imagesConverter, setImagesConverter] = useState({})
const address = `${street} ${houeseNumber}`;
const neighbourhood =selectPosition?.address.neighbourhood;
const lat = selectPosition?.lat;
const lng = selectPosition?.lon;

const lat2 = position?.lat;
const lng2 = position?.lng;

const latlng = `${lng}, ${lat}`;
const latlng2 = `${lng2}, ${lat2}`;

useEffect( () => {
  
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  const leafImgFile = dataURLtoFile(fotoHoja, 'leafImage.jpg');
const profileImgFile = dataURLtoFile(fotoPerfil, 'profileImage.jpg'); 
  setImagesConverter({
    leafImg :leafImgFile,
    profileImg:profileImgFile

  })
},[])

useEffect(() =>{
  setCreateCensusTree({
    ...createCensusTree,
    address: address,
    neightboardhood: neighbourhood,
    leafImg: imagesConverter.leafImg,
    profileImg:imagesConverter.profileImg,
 });
},[imagesConverter])



  

  const initialFormCensusTree ={
    idTree: Checkbox[0],
    address: address,
    neightboardhood:neighbourhood,
    leafImg:null,
    profileImg: null,
    generalStatus: formStatus?.generalStatus,
    fallingDanger:formStatus?.fallingDanger,
    inclination: formStatus?.inclination,
    diameter: formStatus?.diameter,
    coordinates: lat2 === undefined && lng2 === undefined  ? latlng : latlng2
  };


  const createFormData = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'leafImg' || key === 'profileImg') {
        // Si la clave es una imagen, la agregamos al formData como un archivo
        if (data[key]) {
          formData.append(key, data[key]);
        }
      } else {
        // Si no es una imagen, la agregamos normalmente
        formData.append(key, data[key]);
      }
    });
    return formData;
  };
  const [createCensusTree, setCreateCensusTree] = useState(initialFormCensusTree)
  const [submitted, setSubmitted] = useState();
  const [show, setShow] = useState(false);
  const [handleShow] = useState(true);
  const handleClose = () => setShow(false); //Modal de confirmación
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateCensusTree
    ({...createCensusTree, 
      [name]: value
    });
  };

  const save = (e) => {
    e.preventDefault()
    // let data = {
    //   idTree: createCensusTree.idTree,
    //   address: createCensusTree.address,
    //   neightboardhood: createCensusTree.neightboardhood,
    //   generalStatus:createCensusTree.generalStatus,
    //   fallingDanger:createCensusTree.fallingDanger,
    //   inclination: createCensusTree.inclination,
    //   diameter:createCensusTree.diameter,
    //   coordinates:createCensusTree.coordinates,
    //   leafImg:imagesConverter.leafImg,
    //   profileImg:imagesConverter.profileImg,
    // };
    // console.log(data);


  console.log(createFormData(createCensusTree).getAll("leafImg"));
 CensusTreesServices
 .createCensusTrees(createFormData(createCensusTree))
 .then(() => {
  //  setCreateCensusTree({
  //     idTree: response.data.idTree,
  //     address: response.data.address,
  //     neightboardhood: response.data.neightboardhood,
  //     leafImg:response.data.leafImg,
  //     profileImg:response.data.profileImg,
  //     generalStatus:response.data.generalStatus,
  //     fallingDanger:response.data.fallingDanger,
  //     inclination: response.data.inclination,
  //     diameter: response.data.diameter,
  //     coordinates:response.data.coordinates,
  //  });
   console.log(createCensusTree);
   setSubmitted(true);
   handleShow(true);
 })
 .catch((err) => console.log(err));
}

  return (
    <div>
       {submitted ? (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Actividad creada correctamente</Modal.Body>
          <Modal.Footer>
            <Button variant="info" href="/">
              Home
            </Button>
            <Button variant="success" href="/admin">
              Volver al administrador
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
    <form encType='multipart/form-data'>
      



      <h3>Dirección (si no es correcta, modifíquela):</h3> 
      <input defaultValue={address} name='address'  onChange={handleInputChange} type="text" style={{ textAlign:"center",margin:1}}/>
      {/* {address}
      </input> */}



      <h3>Coordenadas:</h3>
        {/* {latlng} */}
        <input defaultValue={lat2 === undefined && lng2 === undefined  ? latlng : latlng2} onChange={handleInputChange} name='coordinates' type="text" style={{textAlign:"center",margin:1}} disabled/>


      <h3>Barrio (si no es correcta, modifíquelo):</h3> 
     <input type="text"defaultValue= {neighbourhood} onChange={handleInputChange} style={{ textAlign:"center",margin:1}}  name='neighbourhood'/>

      <h3>Arbol censado:</h3> 
<input type="text" defaultValue={Checkbox[1]} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='idTree'/>


      <h3>Foto de la hoja:</h3> 
     {/* <input type="file" onChange={handleInputChange}  name='fotoHoja' disabled/>  */}
     {fotoHoja && <Image src={fotoHoja}  alt="Foto de la hoja" style={{ textAlign:"center",margin:1}}/>}


      <h3>Foto de la hoja:</h3> 
      {/* <input type="file" onChange={handleInputChange} name='fotoPerfil' disabled/> */}
      {fotoPerfil && <Image src={fotoPerfil} alt="Foto de perfil" style={{ textAlign:"center",margin:1}} />}

      <h3>Estado General:</h3> 
      <input type="text" defaultValue={formStatus?.generalStatus} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='generalStatus'/>

     
      <h3>Peligro de caida:</h3> 
      <input type="boolean" defaultValue={formStatus?.fallingDanger} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='fallingDanger'/>

     
      <h3>Inclinación:</h3> 
      <input type="text" defaultValue={formStatus?.inclination} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='inclination'/>

     
      <h3>Diámetro:</h3> 
      <input type="text" defaultValue={formStatus?.diameter} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='diameter'/>

      
      <Button variant='outline-success' type='submit' onClick={save}> Enviar Formulio</Button>
    </form>
     )}
    </div>
  )
}
