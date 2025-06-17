import React from "react";
import PropTypes from "prop-types";
import { Link, useStaticQuery, graphql } from "gatsby";
import { useLanguage } from "../../utils/LanguageContext";

const Footer = ({ navigation }) => {
    const { language } = useLanguage();
    const year = new Date().getFullYear();
    // Si lang non défini, on force FR par défaut
    const currentLang = language || "fr";
    
        // Requête GraphQL pour récupérer le titre du site Ghost
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

    return (
        <footer className="site-foot">
            <div className="site-foot-nav container">
                {/* Zone gauche */}
                <div className="site-foot-nav-left">
                    <Link to="/" className="site-foot-nav-item">
                        {siteTitle} 
                    </Link>
                    &copy; {year}
                </div>

                {/* Zone centre */}
                <div className="site-foot-nav-center">
                    <div className="site-foot-nav-item">
                        <a
                            href="https://github.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="site-foot-nav-item"
                        >
                            GitHub
                        </a>
                        <Link
                            to={
                                currentLang === "fr"
                                    ? "/mentions-legales/"
                                    : "/en-legal-notice/"
                            }
                            className="site-foot-nav-item"
                        >
                            {currentLang === "fr"
                                ? "Mentions légales"
                                : "Legal notice"}
                        </Link>
                    </div>
                </div>

                {/* Zone droite */}
                <div className="site-foot-nav-right">
                    <span className="site-foot-nav-item">
                        Bee ApiNest {year} – LM.72
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
