import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";
import './style/searchBar.css'
export const Address = (props) => {
  const [searchText, setSearchText] = useState("");
  const { selectPosition, setSelectPosition, handleFormValidityChange } = props;
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (event) => {
    setSearchText(event.target.value);
  };
  const validateAddress = () => {
    const isValid = selectPosition !== null; // Validación básica: asegúrate de que el campo no esté vacío
    handleFormValidityChange(isValid); // Llama a la función que maneja la validez del formulario

    // Falta useEffect()
  };
  useEffect(() =>{
    validateAddress()
  },[selectPosition])

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
            onChange={handleChange}
            value={searchText}
            className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
          />
         <Button variant="outline-success" disabled={searchText.length === 0 || isLoading ? true: false} onClick={() => {
          setIsLoading(true)
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
                .catch((err) => console.log("err: ", err))
                .finally(()=>setIsLoading(false));
            }}> 
            {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-green"
                  xmlns="https://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.004 8.004 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM12 20c4.418 0 8-3.582 8-8h-4c0 2.168-.837 4.154-2.191 5.657l-3.384-3.384A5.967 5.967 0 0012 14v6zm6.758-6.758l-3.38 3.382A5.969 5.969 0 0014 18h6c0-3.038-1.129-5.825-2.242-7.938z"
                  ></path>
                </svg>
              ) : (
                <i className="fa fa-search" aria-hidden="true"></i>
              )} </Button>
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
                    validateAddress()
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
