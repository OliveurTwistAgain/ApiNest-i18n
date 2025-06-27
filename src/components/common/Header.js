// src/components/common/Header.js

import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import WeatherWidget from "./WeatherWidget";
import i18n from "../../utils/i18n-config";
import { coverList } from "./coverList";

const STORAGE_KEY = "localCoverSession";

const Header = ({ currentLanguage, setLanguage, site, isHome }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localCover, setLocalCover] = useState("");

  const { siteTitle, sloganFixed } = i18n.translations[currentLanguage] || {
    siteTitle: site.title || "Site",
    sloganFixed: site.description || "",
  };

  // Filtre navigation selon langue
  const filteredNavItems = (site.navigation || []).filter((item) => {
    const url = item.url || "";
    const isEnglish = url.includes("/en") || url.includes("/en-");
    return currentLanguage === "en" ? isEnglish : !isEnglish;
  });

  // Changement de langue + navigation + fermeture menu mobile
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMenuOpen(false);
    navigate(lang === "en" ? "/en" : "/");
  };

  // Ferme menu mobile au resize écran
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  // Gestion cover aléatoire persistée en sessionStorage
  useEffect(() => {
    const savedCover = sessionStorage.getItem(STORAGE_KEY);
    if (savedCover && coverList.includes(savedCover)) {
      setLocalCover(savedCover);
    } else {
      const randomCover = coverList[Math.floor(Math.random() * coverList.length)];
      setLocalCover(randomCover);
      sessionStorage.setItem(STORAGE_KEY, randomCover);
    }
  }, []);

  // Le fond d'écran
  const backgroundImage =
    localCover && localCover !== ""
      ? `url(/covers/${localCover})`
      : site.cover_image
      ? `url(${site.cover_image})`
      : "none";

  return (
    <header className="site-head" style={{ backgroundImage }}>
      {/* Couche haute : logo + titre regroupés dans .site-branding */}
      <div className="site-mast site-mast-horizontal">
        <div className="site-branding">
          <Link to={currentLanguage === "en" ? "/en" : "/"} className="site-logo-link">
            {site.logo ? (
              <img className="site-logo" src={site.logo} alt={siteTitle} />
            ) : (
              <StaticImage src="../images/logo-placeholder.png" alt="Logo" height={60} />
            )}
          </Link>
          <Link to={currentLanguage === "en" ? "/en" : "/"} className="site-title-link">
            {siteTitle}
          </Link>
        </div>
      </div>

      {/* Slogan */}
      <p className="site-slogan">{sloganFixed}</p>

      {/* Navigation principale */}
      <nav className="site-nav">
        {filteredNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            activeClassName="active"
            className="site-nav-item"
          >
            {item.label}
          </Link>
        ))}
        <div className="site-nav-right">
          {currentLanguage !== "fr" && (
            <Link
              to="/"
              onClick={() => handleLanguageChange("fr")}
              className="site-nav-item lang"
              activeClassName="active"
            >
              FR
            </Link>
          )}
          {currentLanguage !== "en" && (
            <Link
              to="/en"
              onClick={() => handleLanguageChange("en")}
              className="site-nav-item lang"
              activeClassName="active"
            >
              EN
            </Link>
          )}
        </div>
      </nav>

      {/* Météo visible en permanence (desktop + mobile) */}
      <div className="site-weather">
        <WeatherWidget />
      </div>

      {/* Burger menu mobile */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        ☰
      </button>

      {/* Menu mobile */}
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        {filteredNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            onClick={() => setMenuOpen(false)}
            activeClassName="active"
          >
            {item.label}
          </Link>
        ))}
        <div className="mobile-lang-buttons">
          {currentLanguage !== "fr" && (
            <Link
              to="/"
              onClick={() => handleLanguageChange("fr")}
              className="site-nav-item lang"
              activeClassName="active"
            >
              FR
            </Link>
          )}
          {currentLanguage !== "en" && (
            <Link
              to="/en"
              onClick={() => handleLanguageChange("en")}
              className="site-nav-item lang"
              activeClassName="active"
            >
              EN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
