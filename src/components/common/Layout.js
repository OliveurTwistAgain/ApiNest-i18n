// src/components/common/Layout.js

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { StaticQuery, graphql } from "gatsby";

import config from "../../utils/siteConfig";
import Header from "./Header";
import Footer from "./Footer";
import { useLanguage } from "../../utils/languageContext";

import "../../styles/app.css";

const Layout = ({ data, children, bodyClass = "", location }) => {
    const site = data.allGhostSettings?.edges[0]?.node || {};

    // ⚠️ Fallback de sécurité si useLanguage() retourne undefined
    const langContext = useLanguage() || {};
    const language = langContext.language || site.lang || "fr";
    const setLanguage = langContext.setLanguage || (() => {});

    // Détection de la homepage (fr ou en)
    const isHome =
        location?.pathname === "/" ||
        location?.pathname === "/en/" ||
        location?.pathname === "/en";

    // Affichage du bouton retour en haut au scroll
    useEffect(() => {
        const handleScroll = () => {
            const button = document.getElementById("scrollToTop");
            if (button) {
                if (window.scrollY > 300) {
                    button.classList.add("visible");
                } else {
                    button.classList.remove("visible");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Helmet>
                <html lang={site.lang || "fr"} />
                <body className={bodyClass} />
                <style type="text/css">{site.codeinjection_styles || ""}</style>
                <title>{site.title || config.siteTitle}</title>
            </Helmet>

            <div className="viewport">
                <div className="viewport-top">
                    <Header
                        site={site}
                        currentLanguage={language}
                        setLanguage={setLanguage}
                        isHome={isHome}
                        defaultLogo={data.file?.childImageSharp?.gatsbyImageData}
                    />

                    <main className="site-main">{children}</main>

                    <button
                        id="scrollToTop"
                        className="scroll-to-top"
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        aria-label="Scroll to top"
                    >
                        ↑
                    </button>
                </div>

                <div className="viewport-bottom">
                    <Footer
                        navigation={site.secondary_navigation || []}
                        siteTitle={site.title || config.siteTitle}
                    />
                </div>
            </div>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
    bodyClass: PropTypes.string,
    location: PropTypes.object.isRequired,
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.shape({
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.shape({
                        title: PropTypes.string,
                        description: PropTypes.string,
                        lang: PropTypes.string,
                        logo: PropTypes.string,
                        cover_image: PropTypes.string,
                        codeinjection_styles: PropTypes.string,
                        navigation: PropTypes.array,
                        secondary_navigation: PropTypes.array,
                    }),
                })
            ),
        }).isRequired,
    }).isRequired,
};

const LayoutWithQuery = (props) => (
    <StaticQuery
        query={graphql`
            query GhostSettings {
                allGhostSettings {
                    edges {
                        node {
                            title
                            description
                            lang
                            logo
                            cover_image
                            codeinjection_styles
                            navigation {
                                label
                                url
                            }
                            secondary_navigation {
                                label
                                url
                            }
                        }
                    }
                }
                file(relativePath: { eq: "ghost-icon.png" }) {
                    childImageSharp {
                        gatsbyImageData(width: 30, height: 30, layout: FIXED)
                    }
                }
            }
        `}
        render={(data) => <Layout data={data} {...props} />}
    />
);

export default LayoutWithQuery;
