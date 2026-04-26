import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import './style/searchBar.css';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

export const Address = (props) => {
  const [searchText, setSearchText] = useState("");
  const { selectPosition, setSelectPosition, handleFormValidityChange } = props;
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setSearchText(event.target.value);
  };

  const validateAddress = () => {
    const isValid = selectPosition !== null;
    handleFormValidityChange(isValid);
  };

  useEffect(() => {
    validateAddress();
  }, [selectPosition]);

  // Función separada para que el botón y el Enter hagan lo mismo
  const handleSearch = () => {
    if (searchText.trim().length === 0) return;
    
    setIsLoading(true);
    const params = {
      q: searchText,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
      countrycodes: "ar" // ¡Filtro clave! Limita las búsquedas a Argentina
    };
    
    const queryString = new URLSearchParams(params).toString();
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
      .then((response) => response.json()) // Cambiado directo a .json()
      .then((result) => {
        setListPlace(result);
      })
      .catch((err) => console.log("Error buscando dirección: ", err))
      .finally(() => setIsLoading(false));
  };

  // Función para limpiar la concatenación de la dirección y evitar comas vacías
  const formatAddress = (item) => {
    if (!item?.address) return "Dirección desconocida";
    
    const { road, house_number, neighbourhood, city, town, state } = item.address;
    
    // Armamos un arreglo solo con los datos que existen
    const parts = [
      road && house_number ? `${road} ${house_number}` : road,
      neighbourhood,
      city || town, // Usa city, si no hay, usa town
      state
    ].filter(Boolean); // Esto elimina los undefined, null o strings vacíos mágicamente
    
    // Los unimos con una coma prolija
    return parts.join(", ");
  };

  return (
    <div className="mt-3 mb-4 text-center">
      <h3 className="mb-3 text-success fw-bold">Ubicación del árbol</h3>
      
      {/* BARRA DE BÚSQUEDA MODERNA */}
      <InputGroup className="mb-3 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden' }}>
        <Form.Control
          placeholder="Ej: Av. 9 de Julio 1000..."
          value={searchText}
          onChange={handleChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()} // Permite buscar apretando Enter
          style={{ border: '1px solid #198754' }}
        />
        <Button 
          variant="success" 
          onClick={handleSearch} 
          disabled={searchText.length === 0 || isLoading}
          style={{ width: '60px' }}
        >
          {isLoading ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <span style={{ fontSize: '1.2rem' }}>🔍</span> 
          )}
        </Button>
      </InputGroup>

      {/* LISTA DE RESULTADOS */}
      {listPlace.length > 0 && (
        <ListGroup className="shadow-sm text-start mb-4" style={{ borderRadius: '10px' }}>
          {listPlace.map((item) => {
            const isSelected = selectPosition?.place_id === item.place_id;
            return (
              <ListGroup.Item
                action
                key={item.place_id}
                active={isSelected}
                onClick={() => setSelectPosition(item)}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#198754' : 'white',
                  borderColor: '#e9ecef'
                }}
              >
                <div className="d-flex align-items-center">
                  <span className="me-3" style={{ fontSize: '1.2rem', opacity: isSelected ? 1 : 0.5 }}>
                    📍
                  </span>
                  <span className={isSelected ? "fw-bold text-white" : "text-dark"}>
                    {formatAddress(item)}
                  </span>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
};