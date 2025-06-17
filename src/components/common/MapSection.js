// src/components/common/MapSection.js
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix icône marker local
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Ne s'exécute que dans le navigateur
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Ou <p>Chargement de la carte...</p>

  return (
    <div className="osm-map">
      <MapContainer
        center={[48.0061, 0.1996]}
        zoom={11}
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[48.01408, 0.244029]} />
      </MapContainer>
    </div>
  );
};

export default MapSection;
