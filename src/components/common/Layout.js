// src/components/common/Layout.js

import * as React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Link, StaticQuery, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import config from "../../utils/siteConfig";
import Header from "../common/Header";
import Footer from "../common/Footer";

import { useLanguage } from "../../utils/LanguageContext";
import "../../styles/app.css";

const DefaultLayout = ({ data, children, bodyClass, isHome }) => {
    const site = data.allGhostSettings?.edges[0]?.node || {};
    const { language, setLanguage } = useLanguage();

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
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
