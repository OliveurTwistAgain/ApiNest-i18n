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
      const firstFocusable = document.querySelector(
        ".mobile-list a, .mobile-list button.lang"
      );
      firstFocusable?.focus();
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [menuOpen]);

  const coverPath = `${coverPathPrefix}${localCover}`;
  const backgroundImage = localCover
    ? `url(${coverPath})`
    : site.cover_image
    ? `url(${site.cover_image})`
    : "none";

  const mobileItems = [
    ...filteredNavItems.map((item) => ({ type: "link", item })),
    { type: "lang-switch" },
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
      </nav>

      {/* Weather séparé */}
      <div className="site-weather-wrapper">
        <div className="site-weather">
          <WeatherWidget />
        </div>
      </div>

      {/* Langues top-right */}
      <div className="lang-top-right">
        <button
          onClick={() => handleLanguageChange("fr")}
          className={`lang${currentLanguage === "fr" ? " active" : ""}`}
          disabled={currentLanguage === "fr"}
        >
          FR
        </button>
        <span className="lang-separator">|</span>
        <button
          onClick={() => handleLanguageChange("en")}
          className={`lang${currentLanguage === "en" ? " active" : ""}`}
          disabled={currentLanguage === "en"}
        >
          EN
        </button>
      </div>

      {/* Cover selector (localhost only) */}
      {isUsingLocalCovers && (
        <div className="cover-selector">
          <label htmlFor="cover-select">Pour test (localhost only) : </label>
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

      {/* Hamburger */}
      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile nav overlay */}
      <nav
        id="mobile-menu"
        className={`mobile-nav ${menuOpen ? "open" : ""}`}
        role="navigation"
        aria-hidden={!menuOpen}
      >
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
                  {entry.item.label}
                </Link>
              )}

              {entry.type === "lang-switch" && (
                <div className="mobile-lang-switch">
                  <button
                    onClick={() => handleLanguageChange("fr")}
                    className={`mobile-nav-item lang${currentLanguage === "fr" ? " active" : ""}`}
                    disabled={currentLanguage === "fr"}
                  >
                    FR
                  </button>
                  <span className="lang-separator">|</span>
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={`mobile-nav-item lang${currentLanguage === "en" ? " active" : ""}`}
                    disabled={currentLanguage === "en"}
                  >
                    EN
                  </button>
                </div>
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
