import React, { useState } from 'react'
import CensusTreesServices from '../../Services/CensusTreeService';
import { Button, Form, Image, Modal } from 'react-bootstrap';

export const Finish = (props) => {
  const { selectPosition, Checkbox, fotoHoja, fotoPerfil, formStatus, position } = props;
  const street = selectPosition?.address.road
const houeseNumber = selectPosition?.address.house_number


const address = `${street} ${houeseNumber}`
const neighbourhood =selectPosition?.address.neighbourhood
const lat = selectPosition?.lat
const lng = selectPosition?.lon

const lat2 = position?.lat
const lng2 = position?.lng

const latlng = `${lng}, ${lat}`
const latlng2 = `${lng2}, ${lat2}`

  const initialFormCensusTree ={
    idTree: Checkbox[0],
    address: address,
    neightboardhood:neighbourhood,
    leafImg:fotoHoja,
    profileImg: fotoPerfil,
    generalStatus: formStatus?.generalStatus,
    fallingDanger:formStatus?.fallingDanger,
    inclination: formStatus?.inclination,
    diameter: formStatus?.diameter,
    coordinates: lat2 === undefined && lng2 === undefined  ? latlng : latlng2
  };


  const createFormData = (data) =>{
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    return formData;
  }

  const [createCensusTree, setCreateCensusTree] = useState(initialFormCensusTree)
  const [submitted, setSubmitted] = useState();
  const [show, setShow] = useState(false);
  const [handleShow] = useState(true);
  const handleClose = () => setShow(false); //Modal de confirmación

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateCensusTree({ ...createCensusTree, [name]: value });
  };

  const save = (e) => {
    e.preventDefault()
    let data = {
      idTree: createCensusTree.idTree,
      address: createCensusTree.address,
      neightboardhood: createCensusTree.neightboardhood,
      leafImg:createCensusTree.leafImg,
      profileImg:createCensusTree.profileImg,
      generalStatus:createCensusTree.generalStatus,
      fallingDanger:createCensusTree.fallingDanger,
      coordinates:createCensusTree.coordinates,
    };
//  console.log(data);
 CensusTreesServices
 .createCensusTrees(createFormData(data))
 .then((response) => {
   setCreateCensusTree({
      idTree: response.data.idTree,
      address: response.data.address,
      neightboardhood: response.data.neightboardhood,
      leafImg:response.data.leafImg,
      profileImg:response.data.profileImg,
      generalStatus:response.data.generalStatus,
      fallingDanger:response.data.fallingDanger,
      coordinates:response.data.coordinates,
   });

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
    <Form>
      <Form.Group  className='m-2'>

      <Form.Label >

      <h3>Dirección (si no es correcta, modifíquela):</h3> 
      <input defaultValue={address} name='address'  onChange={handleInputChange} type="text" style={{ textAlign:"center",margin:1}}/>
      {/* {address}
      </input> */}
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Coordenadas:</h3>
        {/* {latlng} */}
        <input defaultValue={lat2 === undefined && lng2 === undefined  ? latlng : latlng2} onChange={handleInputChange} name='coordinates' type="text" style={{textAlign:"center",margin:1}} disabled/>
      </Form.Label> 
      </Form.Group>
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Barrio (si no es correcta, modifíquelo):</h3> 
     <input type="text"defaultValue= {neighbourhood} onChange={handleInputChange} style={{ textAlign:"center",margin:1}}  name='neighbourhood'/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group className='m-2'>
      <Form.Label >
      <h3>Arbol censado:</h3> 
<input type="text" defaultValue={Checkbox[1]} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='idTree'/>
      </Form.Label> 
    </Form.Group>
    <Form.Group className='m-2'>
      <Form.Label >
      <h3>Foto de la hoja:</h3> 
      {fotoHoja && <Image src={fotoHoja} onChange={handleInputChange} alt="Foto de la hoja" style={{ textAlign:"center",margin:1}}  name='leafImg'/>}
      </Form.Label> 
    </Form.Group>

    <Form.Group className='m-2'>
      <Form.Label >
      <h3>Foto de la hoja:</h3> 
      {fotoPerfil && <Image src={fotoPerfil} alt="Foto de perfil" onChange={handleInputChange} style={{ textAlign:"center",margin:1}}  name='profileImg'/>}
      </Form.Label> 
    </Form.Group>
    <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Estado General:</h3> 
      <input type="text" defaultValue={formStatus?.generalStatus} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='generalStatus'/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Peligro de caida:</h3> 
      <input type="boolean" defaultValue={formStatus?.fallingDanger} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='fallingDanger'/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Inclinación:</h3> 
      <input type="text" defaultValue={formStatus?.inclination} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='inclination'/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Diámetro:</h3> 
      <input type="text" defaultValue={formStatus?.diameter} onChange={handleInputChange} style={{ textAlign:"center",margin:1}} disabled name='diameter'/>
      </Form.Label> 
      </Form.Group> 
      
      <Button variant='outline-success' type='submit' onClick={save}> Enviar Formulio</Button>
    </Form>
     )}
    </div>
  )
}
