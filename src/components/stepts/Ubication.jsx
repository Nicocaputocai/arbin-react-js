import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import L from 'leaflet'
import '../../../node_modules/leaflet/dist/leaflet.css';

const position =[-34.7033363,-58.3953235]

function ResetCenterView(props) {
  const { selectPosition } = props;
  const map = useMap();


  useEffect(() => {
    if (selectPosition) {
      map.setView(
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true
        }
      )
    }
  }, [selectPosition]);

  return null;
  }

export const Ubication = (props) => {
  const { selectPosition } = props;
  const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  const locationDefault = position
  
  return (
<div>
  <h2 className="m-2">
    Confirmar ubicación
  </h2>

  {locationSelection === undefined ?
  (<MapContainer 
    style={{width:"100%" }}
     center={position} 
    zoom={16} 
    scrollWheelZoom={true}
    minZoom={3}
    maxZoom={19}
    maxBounds={[[-85.06, -180], [85.06, 180]]}
  
  
  > 
    <TileLayer
    attribution='Map &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, Diseño &copy <a href="https://maiken.com.ar/" target="_blank"> Maiken </a>, Desarrollo &copy <a href="https://www.divisioncode.net.ar/" target="_blank"> The Division Code </a> & &copy <a href="https://desarrolloi.org/" target="_blank"> Desarrollo i </a>'
    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key={sk.eyJ1Ijoibmljb2NhcHV0b2NhaSIsImEiOiJja3RhazVpbzcwMzJhMndvNmZpNGJtbWhrIn0.YV17IMSMs1UQFzyqqhRIdA}"
    />
    { locationSelection !== undefined ?
      <Marker position={locationSelection}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker> : <Marker position={locationDefault}></Marker>
    }
    
    <ResetCenterView selecPosition={selectPosition }/>
  </MapContainer>) : 
  (
    <MapContainer 
  style={{width:"100%" }}
     center={selectPosition} 
    zoom={15} 
    scrollWheelZoom={true}
    minZoom={5}
    maxZoom={19}
    maxBounds={[[-85.06, -180], [85.06, 180]]} 
  
  
  > 
    <TileLayer
    attribution='Map &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, Diseño &copy <a href="https://maiken.com.ar/" target="_blank"> Maiken </a>, Desarrollo &copy <a href="https://www.divisioncode.net.ar/" target="_blank"> The Division Code </a> & &copy <a href="https://desarrolloi.org/" target="_blank"> Desarrollo i </a>'

    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key={sk.eyJ1Ijoibmljb2NhcHV0b2NhaSIsImEiOiJja3RhazVpbzcwMzJhMndvNmZpNGJtbWhrIn0.YV17IMSMs1UQFzyqqhRIdA}"
    />
    { locationSelection !== undefined ?
      <Marker position={locationSelection}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker> : <Marker position={locationDefault}></Marker>
    }
    
    <ResetCenterView selecPosition={selectPosition }/>
  </MapContainer>
  )
  }
  </div>
  )
}
