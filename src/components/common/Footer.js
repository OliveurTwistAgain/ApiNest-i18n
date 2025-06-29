// src/components/common/Footer.js

import React from "react";
import PropTypes from "prop-types";
import { Link, useStaticQuery, graphql } from "gatsby";
import { useLanguage } from "../../utils/LanguageContext";

// Composant Footer
const Footer = ({ navigation }) => {
    const { language } = useLanguage();
    const year = new Date().getFullYear();
    const currentLang = language || "fr";

    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            allGhostSettings {
                edges {
                    node {
                        title
                    }
                }
            }
        }
    `);
    // Récupération du titre du site depuis Ghost
    const siteTitle = data.allGhostSettings.edges[0].node.title;
    // Filtrage des liens de navigation selon la langue    
    const filteredNavigation = navigation.filter(item => {
        try {
            const path = new URL(item.url, "https://dummy.base").pathname;
            if (currentLang === "en") {
                return path.startsWith("/en-") || item.url.startsWith("http");
            } else {
                return !path.startsWith("/en-") || item.url.startsWith("http");
            }
        } catch (e) {
            return true;
        }
    });

    // URL des archives selon la langue
    const archivePath = currentLang === "en" ? "/en-archives/" : "/archives/";
    const archiveLabel = currentLang === "en" ? "Archives" : "Archives";

    return (
        <footer className="site-foot">
            <div className="site-foot-nav container">
                
                {/* Zone gauche : titre du site + année */}
                <div className="site-foot-nav-left">
                <Link to={currentLang === "en" ? "/en/" : "/"} className="site-foot-nav-item">
                        {siteTitle}
                    </Link>
                    &copy; {year}
                </div>

                {/* Zone centrale : liens + archives */}
                <div className="site-foot-nav-center">
                    {filteredNavigation.map((item, index) => {
                        const isExternal = item.url.startsWith("http");
                        const path = new URL(item.url, "https://dummy.base").pathname;

                        return (
                            <div key={index} className="site-foot-nav-line">
                                {isExternal ? (
                                    <a
                                        href={item.url}
                                        className="site-foot-nav-item"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <Link
                                        to={path}
                                        className="site-foot-nav-item"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        );
                    })}

                    {/* Lien Archives */}
                    <div className="site-foot-nav-line">
                        <Link to={archivePath} className="site-foot-nav-item">
                            {archiveLabel}
                        </Link>
                    </div>
                </div>

                {/* Zone droite : Crédit */}
                <div className="site-foot-nav-right">
                    <span className="site-foot-nav-item">
                        Bee ApiNest – LM.72
                    </span>
                </div>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    navigation: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Footer;
