// gatsby-browser.js

import React from "react";
import "leaflet/dist/leaflet.css"; // CSS Leaflet requis côté client
import { LanguageProvider } from "./src/utils/LanguageContext";

// Encapsulation racine dans le fournisseur de langue
export const wrapRootElement = ({ element }) => (
  <LanguageProvider>{element}</LanguageProvider>
);

// Recharge les scripts Ghost externes
export const onRouteUpdate = () => {
  const scriptNodes = document.querySelectorAll('.load-external-scripts script');

  for (let i = 0; i < scriptNodes.length; i++) {
    const node = scriptNodes[i];
    const s = document.createElement('script');
    s.type = node.type || 'text/javascript';

    if (node.attributes.src) {
      s.src = node.attributes.src.value;
    } else {
      s.innerHTML = node.innerHTML;
    }

    document.head.appendChild(s);
  }
};
