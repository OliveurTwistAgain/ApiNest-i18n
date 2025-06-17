import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Link, StaticQuery, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { Navigation } from ".";
import config from "../../utils/siteConfig";
import WeatherWidget from "../common/WeatherWidget";
import Footer from "../common/Footer";

import { useLanguage } from "../../utils/LanguageContext";
import i18n from "../../utils/i18n-config";

import "../../styles/app.css";

const DefaultLayout = ({ data, children, bodyClass, isHome }) => {
    const site = data.allGhostSettings?.edges[0]?.node || {};
    const { language, setLanguage } = useLanguage();
    const slogan = i18n.translations[language]?.sloganFixed || "";
    const coverImage = site.cover_image || "/images/miel.jpg";

    React.useEffect(() => {
        const handleScroll = () => {
            const button = document.getElementById("scrollToTop");
            if (window.scrollY > 300) {
                button?.classList.add("visible");
            } else {
                button?.classList.remove("visible");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Helmet>
                <html lang={site.lang || "en"} />
                <style type="text/css">{site.codeinjection_styles || ""}</style>
                <body className={bodyClass || ""} />
                <title>{site.title || config.siteTitle}</title>
            </Helmet>

            <div className="viewport">
                <div className="viewport-top">
                    <header
                        className={`site-head ${coverImage ? "with-cover" : "no-cover"}`}
                        data-cover-image={coverImage}
                        style={{ backgroundImage: coverImage ? `url(${coverImage})` : "none" , backgroundSize: "cover", backgroundPosition: "center" }}
                    >
                        <div className="container">
                            <div className="site-mast">
                                <div className="site-mast-left">
                                    <Link to={language === "fr" ? "/" : "/en"}>
                                        {site.logo ? (
                                            <img
                                                className="site-logo"
                                                src={site.logo}
                                                alt={site.title}
                                            />
                                        ) : (
                                            data.file && (
                                                <GatsbyImage
                                                    image={data.file.childImageSharp.gatsbyImageData}
                                                    alt={site.title}
                                                />
                                            )
                                        )}
                                    </Link>
                                    <p className="site-slogan">
                                        {slogan}
                                    </p>
                                </div>
                            </div>

                            {isHome && (
                                <div className="site-banner">
                                    <h1 className="site-banner-title">
                                        <Link to={language === "fr" ? "/" : "/en"} className="site-title-link">
                                            {site.title}
                                        </Link>
                                    </h1>
                                    <p className="site-banner-desc">{site.description}</p>
                                </div>
                            )}


                            <nav className="site-nav">
                                <div className="site-nav-left">
                                    <Navigation
                                        data={site.navigation || []}
                                        navClass="site-nav-item"
                                    />
                                </div>

                                <div className="site-nav-right">
                                    <div className="site-nav-langmeteo">
                                        <div className="lang-buttons">
                                            <Link
                                                className="site-nav-button lang"
                                                to="/"
                                                onClick={() => setLanguage("fr")}
                                            >
                                                FR
                                            </Link>
                                            <Link
                                                className="site-nav-button lang"
                                                to="/en"
                                                onClick={() => setLanguage("en")}
                                            >
                                                EN
                                            </Link>
                                        </div>
                                        <div className="weather-widget-wrapper">
                                            <WeatherWidget />
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </header>

                    <main className="site-main">{children}</main>

                    <button
                        id="scrollToTop"
                        className="scroll-to-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
    bodyClass: PropTypes.string,
    isHome: PropTypes.bool,
    data: PropTypes.shape({
        file: PropTypes.object,
        allGhostSettings: PropTypes.shape({
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.object,
                })
            ),
        }).isRequired,
    }).isRequired,
};

const DefaultLayoutSettingsQuery = (props) => (
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
        render={(data) => <DefaultLayout data={data} {...props} />}
    />
);

export default DefaultLayoutSettingsQuery;
