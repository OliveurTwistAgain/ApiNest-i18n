// src/components/common/Footer.js

import React from "react";
import PropTypes from "prop-types";
import { Link, useStaticQuery, graphql } from "gatsby";
import { useLanguage } from "../../utils/LanguageContext";

const Footer = ({ navigation }) => {
    const { language } = useLanguage();
    const year = new Date().getFullYear();

    // Langue courante avec fallback en français
    const currentLang = language || "fr";

    // Requête pour récupérer dynamiquement le nom du site depuis Ghost
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
    const siteTitle = data.allGhostSettings.edges[0].node.title;

    // Filtrage dynamique des liens en fonction de la langue
    const filteredNavigation = navigation.filter(item => {
        try {
            const path = new URL(item.url, "https://dummy.base").pathname;

            // Lien FR : on exclut les "/en-"
            // Lien EN : on ne garde que les "/en-"
            if (currentLang === "en") {
                return path.startsWith("/en-") || item.url.startsWith("http");
            } else {
                return !path.startsWith("/en-") || item.url.startsWith("http");
            }
        } catch (e) {
            // Lien externe sans path valide : on le garde
            return true;
        }
    });

    return (
        <footer className="site-foot">
            <div className="site-foot-nav container">
                
                {/* 📍 Zone gauche : titre du site + année */}
                <div className="site-foot-nav-left">
                    <Link to="/" className="site-foot-nav-item">
                        {siteTitle}
                    </Link>
                    &copy; {year}
                </div>

                {/* Zone centrale : liens filtrés, 1 par ligne */}
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
                </div>

                {/* Zone droite : crédit custom */}
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
