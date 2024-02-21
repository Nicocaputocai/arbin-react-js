import React, { useState } from 'react'
import CensusTreesServices from '../../Services/CensusTreeService';
import { Form, Image } from 'react-bootstrap';

export const Finish = (props) => {
  const { selectPosition, Checkbox, fotoHoja, fotoPerfil, formData} = props;
  console.log(formData);
  const street = selectPosition?.address.road
const houeseNumber = selectPosition?.address.house_number

const address = `${street} ${houeseNumber}`
const neighbourhood =selectPosition?.address.neighbourhood
const lat = selectPosition?.lat
const lng = selectPosition?.lon

const latlng = `${lng}, ${lat}`
  // console.log(Checkbox);
  const initialFormCensusTree ={
    idTree:"",
    address:"",
    neightboardhood:"",
    leafImg:"",
    profileImg: "",
    generalStatus: "",
    fallingDanger:"",
    inclination: "",
    diameter: "",
    coordinates: ""
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
  const [handleShow] = useState(true);
  const handleClose = () => setShow(false); //Modal de confirmación

  const handleInputChange = (e) =>{
    const { name, value } = e.target;
    setCreateCensusTree({ ...createCensusTree, [name]: value });
  }

  const save = () => {
    let data = {
      idTree: createArticle.idTree,
      address: createArticle.iaddressg,
      neightboardhood: createArticle.neightboardhood,
      leafImg:createArticle.leafImg,
      profileImg:createArticle.profileImg,
      generalStatus:createArticle.generalStatus,
      fallingDanger:createArticle.fallingDanger,
      coordinates:createArticle.coordinates,
    };
 // console.log(data);
 CensusTreesServices
 .createCensusTrees(createFormData(data))
 .then((response) => {
   setCreateCensusTree({
      idTree: response.data.idTree,
      address: response.data.iaddressg,
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
    <Form>
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Dirección:</h3> 
      {address}
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label className='m-2'>
      <h3>Coordenadas:</h3>
        {latlng}
      </Form.Label> 
      </Form.Group>
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Barrio:</h3> 
      {neighbourhood}
      </Form.Label> 
      </Form.Group> 
      <Form.Group className='m-2'>
      <Form.Label >
      <h3>Arbol censado:</h3> 
        {Checkbox}
      </Form.Label> 
    </Form.Group>
    <Form.Group className='m-2'>
      <Form.Label >
      <h3>Foto de la hoja:</h3> 
      {fotoHoja && <Image src={fotoHoja} alt="Foto de la hoja" />}
      </Form.Label> 
    </Form.Group>

    <Form.Group className='m-2'>
      <Form.Label >
      <h3>Foto de la hoja:</h3> 
      {fotoHoja && <Image src={fotoPerfil} alt="Foto de la hoja" style={{width:"50vw", height:"50vh"}}/>}
      </Form.Label> 
    </Form.Group>

    </Form>
    </div>
  )
}
