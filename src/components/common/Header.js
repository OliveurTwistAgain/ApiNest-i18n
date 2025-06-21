// src/components/common/Header.js

import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import WeatherWidget from "./WeatherWidget";
import i18n from "../../utils/i18n-config";

const Header = ({ currentLanguage, setLanguage, site, isHome }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const { siteTitle, sloganFixed } = i18n.translations[currentLanguage] || {
        siteTitle: site.title || "Site",
        sloganFixed: site.description || "",
    };

    // Filtrage des liens de navigation selon la langue
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

    useEffect(() => {
        const closeMenu = () => setMenuOpen(false);
        window.addEventListener("resize", closeMenu);
        return () => window.removeEventListener("resize", closeMenu);
    }, []);

    return (
        <header
            className="site-head"
            style={{
                backgroundImage: site.cover_image
                    ? `url(${site.cover_image})`
                    : "none",
            }}
        >
            <div className="site-mast site-mast-horizontal">
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

                <p className="site-slogan">{sloganFixed}</p>
            </div>

            <nav className="site-nav">
                {filteredNavItems.map((item, index) => (
                    <Link key={index} to={item.url} className="site-nav-item">
                        {item.label}
                    </Link>
                ))}
                <div className="site-nav-right">
                    {/* Liens de langue réutilisent .site-nav-button lang */}
                    {currentLanguage !== "fr" && (
                        <Link
                            to="/"
                            onClick={() => setLanguage("fr")}
                            className="site-nav-button lang"
                        >
                            FR
                        </Link>
                    )}
                    {currentLanguage !== "en" && (
                        <Link
                            to="/en"
                            onClick={() => setLanguage("en")}
                            className="site-nav-button lang"
                        >
                            EN
                        </Link>
                    )}
                    <WeatherWidget />
                </div>
            </nav>

            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </button>

            <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
                {filteredNavItems.map((item, index) => (
                    <Link key={index} to={item.url} onClick={() => setMenuOpen(false)}>
                        {item.label}
                    </Link>
                ))}
                {/* Version mobile des boutons de langue, même classe */}
                <div className="mobile-lang-buttons">
                    {currentLanguage !== "fr" && (
                        <Link
                            to="/"
                            onClick={() => setLanguage("fr")}
                            className="site-nav-button lang"
                        >
                            FR
                        </Link>
                    )}
                    {currentLanguage !== "en" && (
                        <Link
                            to="/en"
                            onClick={() => setLanguage("en")}
                            className="site-nav-button lang"
                        >
                            EN
                        </Link>
                    )}
                </div>
                <div className="weather-mobile">
                    <WeatherWidget />
                </div>
            </div>
        </header>
    );
};

export default Header;
