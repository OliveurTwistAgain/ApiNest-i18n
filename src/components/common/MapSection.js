// src/components/common/MapSection.js <Marker position={[48.01408, 0.244029]}>

import React, { useEffect, useRef } from 'react';
// NOTE : Ne PAS importer Leaflet en haut ici pour éviter les erreurs SSR :
// Gatsby exécute du JavaScript côté serveur lors du build (Server-Side Rendering),
// or Leaflet dépend de `window` et du DOM, donc il planterait en SSR.

// import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import traduction from '../../utils/i18n-config';
import i18n from '../../utils/i18n-config';

// Définir une fonction pour créer l'icône, appelée uniquement côté client
const createBlueIcon = () => {
  // Import dynamique de Leaflet (obligatoire côté client)
  const L = require('leaflet');

  return new L.Icon({
    iconUrl: '/images/marker-icon.png',           // Chemin public dans /static/images/
    iconRetinaUrl: '/images/marker-icon-2x.png',  // Version retina (optionnel)
    iconSize: [25, 41],    // taille classique Leaflet
    iconAnchor: [12, 41],  // point d'ancrage (pointe du marker)
    popupAnchor: [1, -34], // position du popup relatif au marker
    shadowUrl: '/images/marker-shadow.png',       // ombre classique Leaflet
    shadowSize: [41, 41],
  });
};

const MapSection = ({lang = "fr"}) => {
  const mapRef = useRef(null);
  const mapTitle = i18n.translations[lang].map.title || "Map Section";

  useEffect(() => {
    // Si on est côté serveur (build), ne rien faire, sécurité SSR
    if (typeof window === 'undefined') return;

    // Si Leaflet est déjà chargé (re-render), ne rien faire, évite de recréer la carte
    if (mapRef.current && mapRef.current._leaflet_id) return;

    // Import dynamique de Leaflet côté client seulement
    const L = require('leaflet');

    // Initialisation de la carte
    const map = L.map('osm-map').setView([48.01408, 0.244029], 11); // Le Mans
    mapRef.current = map;

    // Ajout des tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Création de l'icône bleue
    const blueIcon = createBlueIcon();

    // Ajout du marqueur (Le Mans)
    L.marker([48.01408, 0.244029], { icon: blueIcon }).addTo(map);

    // Nettoyage de la carte lors du démontage du composant
    // Cette fonction est appelée automatiquement par React
    // quand le composant est démonté (ex : navigation vers une autre page)

    return () => {
      map.remove(); // Supprimer la carte Leaflet pour éviter les fuites de mémoire
    };
  }, []);

  return (
    <section className="map-section">
      {/* Titre de la section */}
      {/* Utilisation de la traduction pour le titre de la carte */}
      <h3 className="map-title">{mapTitle}</h3>

      {/* Conteneur pour la carte Leaflet */}
      <div id="osm-map" className="map-container" />
    </section>
  );
};

export default MapSection;
