import React, { useState } from 'react'
import CensusTreesServices from '../../Services/CensusTreeService';
import { Form, Image } from 'react-bootstrap';

export const Finish = (props) => {
  const { selectPosition, Checkbox, fotoHoja, fotoPerfil, formStatus, position } = props;
  console.log(position);
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

console.log(latlng2);
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
      <input value={address} type="text" />
      {/* {address}
      </input> */}
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Coordenadas:</h3>
        {/* {latlng} */}
        <input value={latlng2 !== null || latlng2 !== undefined ? latlng2 : latlng} type="text" />
      </Form.Label> 
      </Form.Group>
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Barrio:</h3> 
     <input type="text"value= {neighbourhood} />
      </Form.Label> 
      </Form.Group> 
      <Form.Group className='m-2'>
      <Form.Label >
      <h3>Arbol censado:</h3> 
<input type="text" value={Checkbox} />
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
      {fotoPerfil && <Image src={fotoPerfil} alt="Foto de la hoja" />}
      </Form.Label> 
    </Form.Group>
    <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Estado General:</h3> 
      <input type="text" value={formStatus?.generalStatus}/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Peligro de caida:</h3> 
      <input type="boolean" value={formStatus?.fallingDanger}/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <h3>Inclinación:</h3> 
      <input type="text" value={formStatus?.fallingDanger}/>
      </Form.Label> 
      </Form.Group> 
      <Form.Group  className='m-2'>
      <Form.Label >
      <input type="text" value={formStatus?.diameter}/>
      <h3>Diámetro:</h3> 
      </Form.Label> 
      </Form.Group> 
      

    </Form>
    </div>
  )
}
