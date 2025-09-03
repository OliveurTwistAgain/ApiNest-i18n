// src/components/common/Header.js

import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import WeatherWidget from "./WeatherWidget";
import i18n from "../../utils/i18n-config";
import { coverList } from "../../utils/coverList";
import { localCoverList } from "../../utils/localCoverList";

const isLocalhost =
  typeof window !== "undefined" && window.location.hostname === "localhost";
const isUsingLocalCovers = isLocalhost && localCoverList.length > 0;
const coverListToUse = isUsingLocalCovers ? localCoverList : coverList;
const STORAGE_KEY = isUsingLocalCovers ? "selectedCover_local" : "selectedCover";
const coverPathPrefix = isUsingLocalCovers ? "/local-covers/" : "/covers/";

const Header = ({ currentLanguage, setLanguage, site }) => {
  const [localCover, setLocalCover] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const { siteTitle, sloganFixed } =
    i18n.translations[currentLanguage] || {
      siteTitle: site.title || "Site",
      sloganFixed: site.description || "",
    };

  const filteredNavItems = (site.navigation || []).filter((item) => {
    const url = item.url || "";
    const isEnglish = url.includes("/en") || url.includes("/en-");
    return currentLanguage === "en" ? isEnglish : !isEnglish;
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMenuOpen(false);
    document.body.classList.remove("no-scroll");
    navigate(lang === "en" ? "/en" : "/");
  };

  useEffect(() => {
    const availableCovers = coverListToUse.length > 0 ? coverListToUse : coverList;
    const savedCover = sessionStorage.getItem(STORAGE_KEY);

    if (savedCover && availableCovers.includes(savedCover)) {
      setLocalCover(savedCover);
    } else {
      const randomCover =
        availableCovers[Math.floor(Math.random() * availableCovers.length)];
      setLocalCover(randomCover);
      sessionStorage.setItem(STORAGE_KEY, randomCover);
    }
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [menuOpen]);

  const coverPath = `${coverPathPrefix}${localCover}`;
  const backgroundImage = localCover
    ? `url(${coverPath})`
    : site.cover_image
    ? `url(${site.cover_image})`
    : "none";

  // Préparer tous les items mobiles avec type et ordre automatique
  const mobileItems = [
    ...filteredNavItems.map((item) => ({ type: "link", item })),
    ...(currentLanguage !== "fr" ? [{ type: "lang", code: "fr" }] : []),
    ...(currentLanguage !== "en" ? [{ type: "lang", code: "en" }] : []),
    { type: "weather" },
  ];

  return (
    <header className="site-head" style={{ backgroundImage }}>
      {/* Branding */}
      <div className="site-branding">
        <div className="site-branding-row">
          <Link to={currentLanguage === "en" ? "/en" : "/"} className="site-logo-link">
            {site.logo && <img src={site.logo} alt="Logo" height="60" />}
          </Link>
          <Link to={currentLanguage === "en" ? "/en" : "/"} className="site-title-link">
            {siteTitle}
          </Link>
        </div>
        <p className="site-slogan">{sloganFixed}</p>
      </div>

      {/* Desktop nav */}
      <nav className="site-nav">
        {filteredNavItems.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            className={`site-nav-item${
              typeof window !== "undefined" && window.location.pathname === item.url
                ? " active"
                : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
        <div className="site-nav-right">
          {currentLanguage !== "fr" && (
            <button onClick={() => handleLanguageChange("fr")} className="lang">FR</button>
          )}
          {currentLanguage !== "en" && (
            <button onClick={() => handleLanguageChange("en")} className="lang">EN</button>
          )}
        </div>
      </nav>

      {/* Cover selector (desktop) */}
      {isUsingLocalCovers && (
        <div className="cover-selector">
          <label htmlFor="cover-select">Cover:</label>
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
              <option key={cover} value={cover}>{cover}</option>
            ))}
          </select>
        </div>
      )}

      {/* Weather widget (desktop) */}
      <div className="site-weather"><WeatherWidget /></div>

      {/* Hamburger */}
      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile nav overlay */}
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-list">
          {mobileItems.map((entry, index) => (
            <li key={index} style={{ "--i": index + 1 }}>
              {entry.type === "link" && (
                <Link
                  to={entry.item.url}
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-nav-item${
                    typeof window !== "undefined" && window.location.pathname === entry.item.url
                      ? " active"
                      : ""
                  }`}
                >
                  {entry.item.label.toUpperCase()}
                </Link>
              )}
              {entry.type === "lang" && (
                <button
                  onClick={() => handleLanguageChange(entry.code)}
                  className="mobile-nav-item lang"
                >
                  {entry.code.toUpperCase()}
                </button>
              )}
              {entry.type === "weather" && (
                <div className="site-weather">
                  <WeatherWidget />
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
