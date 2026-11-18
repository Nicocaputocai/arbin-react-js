import React, { useEffect, useMemo, useRef } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "../../../node_modules/leaflet/dist/leaflet.css";
import treeMarker from "../../assets/marker/Espacio_verde.svg";
import { Col, Row } from "react-bootstrap";

const API_MAP_KEY = import.meta.env.VITE_KEY_STADIA_MAP;

const myIcon = new L.Icon({
  iconUrl: treeMarker,
  iconRetinaUrl: treeMarker,
  popupAnchor: [0, 0],
  iconSize: [40, 40],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
  iconAnchor: [20, 40],
});

const defaultCenter = [-34.7033363, -58.3953235];

function ResetCenterView({ centerCoords }) {
  const map = useMap();

  useEffect(() => {
    if (centerCoords) {
      map.setView(centerCoords, 18, { animate: true });
    }
  }, [centerCoords, map]);

  return null;
}

export const Ubication = (props) => {
  const { position, setPosition, selectPosition } = props;

  // Normalizamos coordenadas a [lat, lng] numérico
  const baseCoords = useMemo(() => {
    if (position?.lat && position?.lng) {
      return [Number(position.lat), Number(position.lng)];
    }
    if (selectPosition?.lat && selectPosition?.lon) {
      return [Number(selectPosition.lat), Number(selectPosition.lon)];
    }
    return defaultCenter;
  }, [position, selectPosition]);

  // Aseguramos que position quede inicializado incluso si el censista no arrastra el pin
  useEffect(() => {
    if (!position && selectPosition?.lat && selectPosition?.lon) {
      setPosition({
        lat: Number(selectPosition.lat),
        lng: Number(selectPosition.lon),
      });
    }
  }, [position, selectPosition, setPosition]);

  function DraggableMarker() {
    const markerRef = useRef(null);

    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setPosition({ lat, lng });
          }
        },
      }),
      [setPosition]
    );

    return (
      <Marker
        draggable
        eventHandlers={eventHandlers}
        position={baseCoords}
        ref={markerRef}
        icon={myIcon}
      />
    );
  }

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={10}>
        <div className="text-center mb-3">
          <h5 className="text-success fw-bold mb-1">Ajuste fino en el mapa</h5>
          <p className="text-muted small mb-0">
            Si el árbol está unos metros más allá sobre la vereda, arrastrá el
            ícono hasta su ubicación exacta.
          </p>
        </div>

        <div
          className="shadow-sm border"
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <MapContainer
            style={{ height: "52vh", width: "100%" }}
            center={baseCoords}
            zoom={18}
            scrollWheelZoom={true}
            minZoom={5}
            maxZoom={19}
          >
            <TileLayer
              url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${API_MAP_KEY}`}
            />

            {selectPosition?.accuracy && (
              <Circle
                center={[
                  Number(selectPosition.lat),
                  Number(selectPosition.lon),
                ]}
                radius={selectPosition.accuracy}
                pathOptions={{
                  color: "#198754",
                  fillColor: "#198754",
                  fillOpacity: 0.12,
                  weight: 1,
                }}
              />
            )}

            <DraggableMarker />
            <ResetCenterView centerCoords={baseCoords} />
          </MapContainer>
        </div>
      </Col>
    </Row>
  );
};