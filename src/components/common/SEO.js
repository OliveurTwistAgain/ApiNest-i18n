import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description, lang = "fr" }) => {
  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default SEO;
