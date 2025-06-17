/* eslint-disable */
/**
 * Autoriser tous les scripts
 *
 * Ce petit script parcourt tous les éléments <script> injectés dans les contenus Ghost
 * (via la classe .load-external-scripts) et les ajoute dynamiquement dans le <head> du document.
 *
 * Cela permet d’exécuter des scripts personnalisés intégrés dans les articles/pages Ghost.
 */

var trustAllScripts = function () {
    var scriptNodes = document.querySelectorAll('.load-external-scripts script');
  
    for (var i = 0; i < scriptNodes.length; i += 1) {
      var node = scriptNodes[i];
      var s = document.createElement('script');
      s.type = node.type || 'text/javascript';
  
      if (node.attributes.src) {
        s.src = node.attributes.src.value;
      } else {
        s.innerHTML = node.innerHTML;
      }
  
      document.getElementsByTagName('head')[0].appendChild(s);
    }
  };
  
  exports.onRouteUpdate = function () {
    trustAllScripts();
  };
  
  /* ---------------------------------------------------
     Ajout du fournisseur de langue autour du site entier
  --------------------------------------------------- */
  
  const React = require('react');
  const { LanguageProvider } = require('./src/utils/LanguageContext');
  
  exports.wrapRootElement = ({ element }) => {
    return React.createElement(LanguageProvider, null, element);
  };
  