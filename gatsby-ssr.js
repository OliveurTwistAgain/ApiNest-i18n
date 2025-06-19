// gatsby-ssr.js : ajout du fournisseur de langue au site entier
  
const React = require('react');
const { LanguageProvider } = require('./src/utils/LanguageContext');

exports.wrapRootElement = ({ element }) => {
  return React.createElement(LanguageProvider, null, element);
};