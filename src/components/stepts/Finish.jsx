import React from 'react'
import { Form } from 'react-bootstrap'

export const Finish = (props) => {
  const { selectPosition } = props;
const street = selectPosition?.address.road
const houeseNumber = selectPosition?.address.house_number

const address = `${street} ${houeseNumber}`

const lat = selectPosition?.lat
const lng = selectPosition?.lon

const latlng = `${lng}, ${lat}`

  return (
    <div>
      <Form>
        <Form.Group>
          <Form.Label>Dirección</Form.Label> <br />
          <Form.Control 
            name='address'
            type="text"
            defaultValue={address}
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800 center text-center" //
          />
          <Form.Label>Coordenadas</Form.Label> <br />
          <Form.Control 
            name='address'
            type="text"
            defaultValue={latlng}
            className="p-1 px-2 appearance-none outline-none w-full text-gray-800 center text-center" //
          />
        </Form.Group>
      </Form>
    </div>
  )
}
