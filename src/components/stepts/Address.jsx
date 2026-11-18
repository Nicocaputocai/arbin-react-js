import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import "./style/searchBar.css";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search?";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse?";

export const Address = (props) => {
  const {
    selectPosition,
    setSelectPosition,
    setPosition,
    handleFormValidityChange,
  } = props;

  // Modo: 'address' (búsqueda escrita) | 'gps' (alta precisión)
  const [mode, setMode] = useState("gps");
  const [searchText, setSearchText] = useState("");
  const [listPlace, setListPlace] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Estados específicos de GPS de alta precisión
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null); // { lat, lng, accuracy }
  const [gpsError, setGpsError] = useState(null);
  const watchIdRef = useRef(null);
  const bestFixRef = useRef(null);

  useEffect(() => {
    const isValid = selectPosition !== null;
    handleFormValidityChange(isValid);
  }, [selectPosition]);

  // Limpiamos cualquier watcher activo si el usuario cambia de paso o de modo
  const stopWatching = async () => {
    if (watchIdRef.current !== null) {
      try {
        if (Capacitor.isNativePlatform()) {
          await Geolocation.clearWatch({ id: watchIdRef.current });
        } else if (navigator.geolocation) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
      } catch (e) {
        console.warn("Error limpiando watch GPS:", e);
      }
      watchIdRef.current = null;
    }
    setIsLocating(false);
  };

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, []);

  const formatAddress = (item) => {
    if (!item?.address) return "Dirección desconocida";
    const {
      road,
      house_number,
      neighbourhood,
      suburb,
      city_district,
      quarter,
      city,
      town,
      state,
    } = item.address;

    const barrio = neighbourhood || suburb || city_district || quarter;
    const parts = [
      road && house_number ? `${road} ${house_number}` : road,
      barrio,
      city || town,
      state,
    ].filter(Boolean);

    return parts.join(", ");
  };

  // Geocodificación inversa: convierte lat/lng exactos en calle y barrio sin perder las coordenadas reales
  const resolveCoordinatesToPlace = async (lat, lng, accuracy) => {
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lon: String(lng),
        format: "json",
        addressdetails: "1",
      }).toString();

      const res = await fetch(`${NOMINATIM_REVERSE_URL}${params}`);
      const data = await res.json();

      const placeObject = {
        place_id: data?.place_id || `gps-${Date.now()}`,
        lat: String(lat),
        lon: String(lng),
        accuracy: Math.round(accuracy),
        display_name: data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        address: data?.address || {
          road: "Ubicación GPS",
          neighbourhood: "Lanús",
        },
      };

      setSelectPosition(placeObject);
      if (setPosition) {
        setPosition({ lat, lng });
      }
    } catch (err) {
      // Si falla Nominatim por red, igual guardamos las coordenadas exactas
      const fallbackPlace = {
        place_id: `gps-${Date.now()}`,
        lat: String(lat),
        lon: String(lng),
        accuracy: Math.round(accuracy),
        display_name: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        address: {
          road: "Ubicación GPS",
          neighbourhood: "Lanús",
        },
      };
      setSelectPosition(fallbackPlace);
      if (setPosition) {
        setPosition({ lat, lng });
      }
    }
  };

  // Captura GPS de alta precisión (compatible con Android APK Capacitor y Safari iOS)
  const handleGetHighAccuracyGPS = async () => {
    await stopWatching();
    setGpsError(null);
    setIsLocating(true);
    bestFixRef.current = null;

    try {
      // 1. En Android/iOS nativo (APK), pedimos permisos explícitos primero
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.requestPermissions();
        if (perm.location !== "granted") {
          setGpsError(
            "Permiso de ubicación denegado. Habilitá el GPS preciso en los ajustes de la app."
          );
          setIsLocating(false);
          return;
        }
      } else if (!("geolocation" in navigator)) {
        setGpsError("Este navegador no soporta geolocalización.");
        setIsLocating(false);
        return;
      }

      const onPositionUpdate = async (pos, err) => {
        if (err) {
          let msg = "No se pudo obtener la ubicación GPS.";
          if (err.code === 1) {
            msg =
              "Permiso denegado. En iPhone revisá Ajustes > Safari > Ubicación (Precisa).";
          } else if (err.code === 2) {
            msg = "Señal GPS no disponible. Probá alejarte de techos o edificios altos.";
          } else if (err.code === 3) {
            msg = "Tiempo de espera agotado buscando satélites. Reintentá.";
          }
          setGpsError(msg);
          await stopWatching();
          return;
        }

        if (!pos?.coords) return;

        const { latitude, longitude, accuracy } = pos.coords;
        const currentFix = { lat: latitude, lng: longitude, accuracy };
        setGpsStatus(currentFix);

        // Guardamos siempre la lectura con menor margen de error (más precisa)
        if (!bestFixRef.current || accuracy < bestFixRef.current.accuracy) {
          bestFixRef.current = currentFix;
        }

        // Si logramos precisión de vereda (<= 12 metros), fijamos automáticamente
        if (accuracy <= 12) {
          await stopWatching();
          await resolveCoordinatesToPlace(latitude, longitude, accuracy);
        }
      };

      // 2. Iniciamos escucha continua de alta precisión
      if (Capacitor.isNativePlatform()) {
        watchIdRef.current = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          },
          onPositionUpdate
        );
      } else {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => onPositionUpdate(pos, null),
          (err) => onPositionUpdate(null, err),
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      }

      // 3. Salvaguarda a los 8 segundos: si bajo árboles densos quedó en ~15-25m, toma la mejor lectura obtenida
      setTimeout(async () => {
        if (watchIdRef.current !== null && bestFixRef.current) {
          const { lat, lng, accuracy } = bestFixRef.current;
          await stopWatching();
          await resolveCoordinatesToPlace(lat, lng, accuracy);
        }
      }, 8000);
    } catch (error) {
      setGpsError(error?.message || "Error al iniciar el GPS.");
      setIsLocating(false);
    }
  };

  // Permite aceptar manualmente la lectura actual si ya está en pantalla
  const handleLockCurrentFix = async () => {
    if (!bestFixRef.current) return;
    const { lat, lng, accuracy } = bestFixRef.current;
    await stopWatching();
    await resolveCoordinatesToPlace(lat, lng, accuracy);
  };

  // Búsqueda por dirección escrita
  const handleSearch = () => {
    if (searchText.trim().length === 0) return;

    setIsLoading(true);
    const params = {
      q: searchText,
      format: "json",
      addressdetails: 1,
      polygon_geojson: 0,
      countrycodes: "ar",
    };

    const queryString = new URLSearchParams(params).toString();
    fetch(`${NOMINATIM_SEARCH_URL}${queryString}`)
      .then((response) => response.json())
      .then((result) => setListPlace(result))
      .catch((err) => console.log("Error buscando dirección: ", err))
      .finally(() => setIsLoading(false));
  };

  const handleSelectAddressItem = (item) => {
    setSelectPosition(item);
    if (setPosition && item?.lat && item?.lon) {
      setPosition({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      });
    }
  };

  return (
    <div className="mt-3 mb-4 text-center">
      <h3 className="mb-3 text-success fw-bold">Ubicación del árbol</h3>

      {/* SELECTOR DE MODO */}
      <ButtonGroup className="mb-4 shadow-sm w-100" style={{ maxWidth: "420px" }}>
        <Button
          variant={mode === "gps" ? "success" : "outline-success"}
          onClick={() => {
            setMode("gps");
            setGpsError(null);
          }}
          className="fw-bold py-2"
        >
          📡 Por Ubicación GPS
        </Button>
        <Button
          variant={mode === "address" ? "success" : "outline-success"}
          onClick={() => {
            stopWatching();
            setMode("address");
          }}
          className="fw-bold py-2"
        >
          🏠 Por Dirección
        </Button>
      </ButtonGroup>

      {/* MODO 1: GPS ALTA PRECISIÓN */}
      {mode === "gps" && (
        <Card
          className="mx-auto shadow-sm border-success"
          style={{ maxWidth: "480px", borderRadius: "12px" }}
        >
          <Card.Body className="p-4">
            <p className="text-muted small mb-3">
              Parate junto al tronco del árbol y presioná el botón para capturar
              las coordenadas satelitales exactas.
            </p>

            <Button
              variant="success"
              size="lg"
              onClick={handleGetHighAccuracyGPS}
              disabled={isLocating}
              className="w-100 fw-bold mb-3"
              style={{ borderRadius: "10px" }}
            >
              {isLocating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Calibrando satélites...
                </>
              ) : selectPosition ? (
                "🔄 Recapturar ubicación GPS"
              ) : (
                "📍 Obtener ubicación exacta"
              )}
            </Button>

            {gpsStatus && (
              <div className="mb-2">
                <Badge
                  bg={
                    gpsStatus.accuracy <= 12
                      ? "success"
                      : gpsStatus.accuracy <= 25
                      ? "warning"
                      : "secondary"
                  }
                  text={
                    gpsStatus.accuracy > 12 && gpsStatus.accuracy <= 25
                      ? "dark"
                      : "light"
                  }
                  className="px-3 py-2"
                >
                  Precisión actual: ± {Math.round(gpsStatus.accuracy)} metros
                </Badge>

                {isLocating && (
                  <div className="mt-2">
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={handleLockCurrentFix}
                    >
                      Usar esta lectura ahora
                    </Button>
                  </div>
                )}
              </div>
            )}

            {gpsError && (
              <Alert variant="danger" className="small text-start mt-3 mb-0">
                {gpsError}
              </Alert>
            )}

            {selectPosition && !isLocating && (
              <Alert variant="success" className="text-start mt-3 mb-0">
                <div className="fw-bold mb-1">✅ Ubicación capturada:</div>
                <div className="small">{formatAddress(selectPosition)}</div>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Lat: {Number(selectPosition.lat).toFixed(6)} | Lng:{" "}
                  {Number(selectPosition.lon).toFixed(6)}
                  {selectPosition.accuracy
                    ? ` (± ${selectPosition.accuracy}m)`
                    : ""}
                </div>
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* MODO 2: BÚSQUEDA POR DIRECCIÓN */}
      {mode === "address" && (
        <>
          <InputGroup
            className="mb-3 shadow-sm"
            style={{ borderRadius: "10px", overflow: "hidden" }}
          >
            <Form.Control
              placeholder="Ej: Av. Hipólito Yrigoyen 4500, Lanús..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{ border: "1px solid #198754" }}
            />
            <Button
              variant="success"
              onClick={handleSearch}
              disabled={searchText.trim().length === 0 || isLoading}
              style={{ width: "60px" }}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <span style={{ fontSize: "1.2rem" }}>🔍</span>
              )}
            </Button>
          </InputGroup>

          {listPlace.length > 0 && (
            <ListGroup
              className="shadow-sm text-start mb-4"
              style={{ borderRadius: "10px" }}
            >
              {listPlace.map((item) => {
                const isSelected = selectPosition?.place_id === item.place_id;
                return (
                  <ListGroup.Item
                    action
                    key={item.place_id}
                    active={isSelected}
                    onClick={() => handleSelectAddressItem(item)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#198754" : "white",
                      borderColor: "#e9ecef",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <span
                        className="me-3"
                        style={{
                          fontSize: "1.2rem",
                          opacity: isSelected ? 1 : 0.5,
                        }}
                      >
                        📍
                      </span>
                      <span
                        className={
                          isSelected ? "fw-bold text-white" : "text-dark"
                        }
                      >
                        {formatAddress(item)}
                      </span>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </>
      )}
    </div>
  );
};