import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onChange }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
        const res = await fetch(url);
        const data = await res.json();

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          "";

        onChange({ lat, lng, city });
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        onChange({ lat, lng, city: "" });
      }
    },
  });

  return null;
}

export default function LocationPicker({ position, onChange }) {
  const defaultCenter = [52.2297, 21.0122]; 

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Wybierz lokalizację na mapie</h3>

      <div className="h-72 rounded overflow-hidden border">
        <MapContainer
          center={position ? [position.lat, position.lng] : defaultCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <ClickHandler onChange={onChange} />

          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={markerIcon}
            />
          )}
        </MapContainer>
      </div>

      {}
      {position && (
        <p className="mt-2 text-gray-200">
          📍 Wybrana lokalizacja:  
          <strong> {position.city || "Nieznane miasto"} </strong><br />
          (lat: {position.lat.toFixed(5)}, lng: {position.lng.toFixed(5)})
        </p>
      )}
    </div>
  );
}
