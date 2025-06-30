// src/components/common/Header.js 

import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import WeatherWidget from "./WeatherWidget";
import i18n from "../../utils/i18n-config";
import { coverList } from "./coverList";
import { localCoverList } from "./localCoverList";

// ↓↓↓ Détection de l’environnement local (localhost) ↓↓↓
const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";

// ↓↓↓ Variable pivot pour savoir si on utilise les covers locales (tests) ↓↓↓
const isUsingLocalCovers = isLocalhost && localCoverList.length > 0;

// ↓↓↓ Choix de la liste de covers selon l’environnement ↓↓↓
const coverListToUse = isUsingLocalCovers ? localCoverList : coverList;

// ↓↓↓ Clé de sessionStorage différenciée pour local/test et prod ↓↓↓
const STORAGE_KEY = isUsingLocalCovers ? "selectedCover_local" : "selectedCover";

// ↓↓↓ Chemin d'accès selon la liste réellement utilisée ↓↓↓
const coverPathPrefix = isUsingLocalCovers ? "/local-covers/" : "/covers/";

const Header = ({ currentLanguage, setLanguage, site, isHome }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localCover, setLocalCover] = useState("");

  const { siteTitle, sloganFixed } = i18n.translations[currentLanguage] || {
    siteTitle: site.title || "Site",
    sloganFixed: site.description || "",
  };

  // ↓↓↓ Liste dynamique des items de navigation selon la langue ↓↓↓
  const filteredNavItems = (site.navigation || []).filter((item) => {
    const url = item.url || "";
    const isEnglish = url.includes("/en") || url.includes("/en-");
    return currentLanguage === "en" ? isEnglish : !isEnglish;
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMenuOpen(false);
    navigate(lang === "en" ? "/en" : "/");
  };

  // ↓↓↓ Ferme le menu mobile lors du redimensionnement ↓↓↓
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  // ↓↓↓ Chargement d'une cover (aléatoire ou persistée) ↓↓↓
  useEffect(() => {
    const availableCovers = coverListToUse.length > 0 ? coverListToUse : coverList;
    const savedCover = sessionStorage.getItem(STORAGE_KEY);

    if (savedCover && availableCovers.includes(savedCover)) {
      setLocalCover(savedCover);
    } else {
      const randomCover = availableCovers[Math.floor(Math.random() * availableCovers.length)];
      setLocalCover(randomCover);
      sessionStorage.setItem(STORAGE_KEY, randomCover);
    }
  }, []);

  // ↓↓↓ Construction dynamique de l’image de fond ↓↓↓
  const coverPath = `${coverPathPrefix}${localCover}`;
  const backgroundImage = localCover
    ? `url(${coverPath})`
    : site.cover_image
    ? `url(${site.cover_image})`
    : "none";

  return (
    <header className="site-head" style={{ backgroundImage }}>
      <div className="site-mast site-mast-horizontal">
        <div className="site-branding">
          <Link to={currentLanguage === "en" ? "/en" : "/"} className="site-logo-link">
            {site.logo ? (
              <img className="site-logo" src={site.logo} alt="Logo" />
            ) : (
              <StaticImage src="../images/logo-placeholder.png" alt="Logo" height={60} />
            )}
          </Link>
          <Link to={currentLanguage === "en" ? "/en" : "/"} className="site-title-link">
            {siteTitle}
          </Link>
        </div>
      </div>

      <p className="site-slogan">{sloganFixed}</p>

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

      <div className="site-weather">
        <WeatherWidget />
      </div>

      {/* ↓↓↓ Bouton menu mobile (hamburger) ↓↓↓ */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        ☰
      </button>

      {/* ↓↓↓ Menu mobile ↓↓↓ */}
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

      {/* ↓↓↓ Sélecteur de couverture (uniquement si covers locales de test) ↓↓↓ */}
      {isUsingLocalCovers && (
        <div className="cover-selector">
          <label htmlFor="cover-select">Cover :</label>
          <select
            id="cover-select"
            value={localCover}
            onChange={(e) => {
              const newCover = e.target.value;
              setLocalCover(newCover);
              sessionStorage.setItem(STORAGE_KEY, newCover);
            }}
          >
            {localCoverList.map((cover) => (
              <option key={cover} value={cover}>
                {cover}
              </option>
            ))}
          </select>
        </div>
      )}
    </header>
  );
};

export default Header;
