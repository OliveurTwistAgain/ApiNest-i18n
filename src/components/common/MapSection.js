import React, { useState, useEffect } from "react";

const MapSection = () => {
  const [isClient, setIsClient] = useState(false);
  const [Map, setMap] = useState(null);
  const [TileLayer, setTileLayer] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [L, setL] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      // Import dynamique uniquement côté client
      import("leaflet").then((Lmod) => {
        import("leaflet/dist/leaflet.css");
        // Fix icône marker local
        Lmod.Icon.Default.mergeOptions({
          iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
        });
        setL(Lmod);
      });
      import("react-leaflet").then(({ MapContainer, TileLayer, Marker }) => {
        setMap(() => MapContainer);
        setTileLayer(() => TileLayer);
        setMarker(() => Marker);
      });
    }
  }, [isClient]);

  if (!isClient || !Map || !TileLayer || !Marker) return null;

  return (
    <div className="osm-map" style={{ height: "400px" }}>
      <Map center={[48.0061, 0.1996]} zoom={11} scrollWheelZoom={false} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[48.01408, 0.244029]} />
      </Map>
    </div>
  );
};

export default MapSection;
