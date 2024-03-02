import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
import './style/searchBar.css'
export const Address = (props) => {
  const [searchText, setSearchText] = useState("");
  const { selectPosition, setSelectPosition, handleFormValidityChange } = props;
  const [listPlace, setListPlace] = useState([]);

  const validateAddress = () => {
    const isValid = selectPosition !== null; // Validación básica: asegúrate de que el campo no esté vacío
    handleFormValidityChange(isValid); // Llama a la función que maneja la validez del formulario
  };

  const handleChange = (event) => {
    setSearchText(event.target.value);
    validateAddress();
  };

  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <h2 className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Dirección
        </h2>
        <div className="box items-center" style={{maxWidth: 'fit-content', marginLeft: 'auto', marginRight:"auto", borderStyle:"inset"}}>
          <input
            type="text"
            name="address"
            // onChange={(event) => {
            //   setSearchText(event.target.value);

            //   // console.log(event.target.value);
            // }}
            onChange={handleChange}
            value={searchText}
            className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
          />
         <Button variant="outline-success" onClick={() => {
              // Search
              const params = {
                q: searchText,
                format: "json",
                addressdetails: 1,
                polygon_geojson: 0,
              };
              const queryString = new URLSearchParams(params).toString();
              const requestOptions = {
                method: "GET",
                redirect: "follow",
              };
              fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
                .then((response) => response.text())
                .then((result) => {
                  // console.log(JSON.parse(result));
                  setListPlace(JSON.parse(result));
                })
                .catch((err) => console.log("err: ", err));
            }}>  <i className="fa fa-search" aria-hidden="true"></i></Button>
        </div>
        <div className=" flex items-center">

        </div>
        <div>
          <ul role="list" className="list-none">
            {listPlace.map((item) => (
              <li key={item?.place_id}>
                <Button
                   style={{marginBottom: "3"}}
                  active={selectPosition === item}
                  variant="light"
                  onClick={() => {
                    setSelectPosition(item ? item : null);
                    validateAddress();
                  }}
                >
                  {`${
                    item?.address.road !== undefined ? item?.address.road : ""
                  } ${
                    item?.address.house_number !== undefined
                      ? item?.address.house_number
                      : ""
                  }${(item.address.houeseNumber =
                    !!undefined || item?.address.road !== undefined
                      ? ","
                      : "")} ${
                    item?.address.neighbourhood !== undefined
                      ? item?.address.neighbourhood + ","
                      : ""
                  } ${
                    item?.address.city !== undefined
                      ? item?.address.city + ","
                      : ""
                  } ${
                    item?.address.town !== undefined ? item?.address.town : ""
                  }  ${item?.address.town !== undefined ? "," : ""} ${
                    item?.address.state !== undefined
                      ? item?.address.state + ","
                      : ""
                  } ${
                    item?.address.country !== undefined
                      ? item?.address.country
                      : ""
                  }`}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
