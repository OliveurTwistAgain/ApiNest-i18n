// src/components/common/MapSection.js <Marker position={[48.01408, 0.244029]}>

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Définir les icônes Leaflet
const blueIcon = new L.Icon({
  iconUrl: '/images/marker-icon.png',        // Chemin public dans /static/images/
  iconRetinaUrl: '/images/marker-icon-2x.png', // Si tu as une version retina (optionnel)
  iconSize: [25, 41],    // taille classique Leaflet
  iconAnchor: [12, 41],  // point d'ancrage (pointe du marker)
  popupAnchor: [1, -34], // position du popup relatif au marker
  shadowUrl: '/images/marker-shadow.png',  // si tu veux garder l'ombre classique Leaflet
  shadowSize: [41, 41],
});

const MapSection = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Si on est côté serveur (build), ne rien faire
    if (typeof window === 'undefined') return;

    // Si Leaflet est déjà chargé (re-render), ne rien faire
    if (mapRef.current && mapRef.current._leaflet_id) return;

    // Import dynamique de Leaflet (pas au build)
    const L = require('leaflet');

    // Initialisation de la carte
    const map = L.map('osm-map').setView([48.01408, 0.244029], 11); // Le Mans
    mapRef.current = map;

    // Ajout des tuiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Marqueur (Le Mans)
    L.marker([48.01408, 0.244029], { icon: blueIcon }).addTo(map);
  }, []);

  return (
    <section className="osm-map">
      {/* classe map-container ici */}
      <div id="osm-map" className="map-container" />
    </section>
  );
};

export default MapSection;