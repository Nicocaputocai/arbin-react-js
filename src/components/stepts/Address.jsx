import React, { useContext, useState } from "react";
const NOMINATIM_BASE_URL = "http://nominatim.openstreetmap.org/search?";

export const Address = (props) => {
  const [searchText, setSearchText] = useState("");
  const { setSelectPosition } = props;
  const [listPlace, setListPlace] = useState([]);

  // const handleChange= (e) =>{
  //   const {name, value} = e.target;
  //   setAddressData({...addressData, [name]:value})
  // }
  return (
    <div className="flex flex-col">
      <div className="w-full mx-2 flex-1">
        <div className="font-bold h-6 mt-3 text-gray-500 text-xs leading-8 uppercase">
          Dirección
        </div>
        <div className="bg-white my-2 p-1 flex border border-gray-200">
          <input
            type="text"
            name="address"
            onChange={(event) => {
              setSearchText(event.target.value);

              // console.log(event.target.value);
            }}
            value={searchText}
            className="p-1 px-2 apprearance-none outline-none w-full text-gray-800"
          />
        </div>
        <div className="flex items-center">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
            style={{ flex: 1 }}
            onClick={() => {
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
            }}
          >
            Success
          </button>
        </div>
        <div>
          <ul className="list-none">
            {listPlace.map((item) => (
              <li key={item?.place_id}>
                 <button
            onClick={() => {
              setSelectPosition(item ? item : null);
            }}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow text-gray-500"
          >
            {item?.display_name}
          </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
