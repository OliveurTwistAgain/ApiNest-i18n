// src/components/common/MapSection.js
import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix icônes Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState(null);

  useEffect(() => {
    setIsClient(true);

    // Import dynamique des composants Leaflet uniquement côté client
    import("react-leaflet").then((module) => {
      setLeafletComponents({
        MapContainer: module.MapContainer,
        TileLayer: module.TileLayer,
        Marker: module.Marker,
      });
    });
  }, []);

  if (!isClient || !LeafletComponents) return null;

  const { MapContainer, TileLayer, Marker } = LeafletComponents;

  return (
    <div className="osm-map">
      <MapContainer
        center={[48.0061, 0.1996]}
        zoom={11}
        scrollWheelZoom={false}
        className="map-container"
        style={{ height: "400px", width: "100%" }}
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
