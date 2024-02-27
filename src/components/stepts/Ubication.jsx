import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import L from 'leaflet'
import '../../../node_modules/leaflet/dist/leaflet.css';

const positionCenter =[-34.7033363,-58.3953235]


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
    const { position, setPosition, selectPosition } = props;
    const locationSelection = [selectPosition?.lat, selectPosition?.lon];
  
    function DraggableMarker() {
      const markerRef = useRef(null);
  
      const eventHandlers = useMemo(
        () => ({
          dragend() {
            const marker = markerRef.current;
            if (marker != null) {
              setPosition(marker.getLatLng());
            }
          },
        }),
        [setPosition]
      );
  
      return (
        <Marker
          draggable
          eventHandlers={eventHandlers}
          position={position !== null ? position : selectPosition}
          ref={markerRef}
        />
      );
    }
  
    return (
      <div className="map-container" style={{}}>
        <h2 className="m-2">Confirmar ubicación</h2>
        <div>
          {locationSelection === undefined ? (
            <MapContainer
              style={{ height: "20vh" }}
              center={positionCenter}
              zoom={16}
              scrollWheelZoom={true}
              minZoom={3}
              maxZoom={19}
              maxBounds={[[-85.06, -180], [85.06, 180]]}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key={sk.eyJ1Ijoibmljb2NhcHV0b2NhaSIsImEiOiJja3RhazVpbzcwMzJhMndvNmZpNGJtbWhrIn0.YV17IMSMs1UQFzyqqhRIdA}"
              />
              {locationSelection !== undefined && <DraggableMarker />}
              <ResetCenterView selectPosition={selectPosition} />
            </MapContainer>
          ) : (
            <MapContainer
              style={{ width: "100%" }}
              center={selectPosition}
              zoom={15}
              scrollWheelZoom={true}
              minZoom={5}
              maxZoom={19}
              maxBounds={[[-85.06, -180], [85.06, 180]]}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key={sk.eyJ1Ijoibmljb2NhcHV0b2NhaSIsImEiOiJja3RhazVpbzcwMzJhMndvNmZpNGJtbWhrIn0.YV17IMSMs1UQFzyqqhRIdA}"
              />
              {locationSelection !== undefined && <DraggableMarker />}
              <ResetCenterView selectPosition={selectPosition} />
            </MapContainer>
          )}
        </div>
      </div>
    );
  };
  
