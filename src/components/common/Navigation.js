import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { useLanguage } from "../../utils/LanguageContext";

/**
 * Composant Navigation (depuis Ghost)
 * - Affiche les liens de la langue active (fr/en)
 * - Garde toujours visibles les liens externes
 * - Affiche toujours les liens "fr" et "en" pour changer de langue
 */

const Navigation = ({ data, navClass }) => {
    const { language } = useLanguage();

    if (!data || !Array.isArray(data)) {
        console.error("Navigation data is not valid");
        return null;
    }

    const filteredNav = data.filter((navItem) => {
        if (!navItem || !navItem.url) return false;

        const isExternal = /^https?:\/\//i.test(navItem.url);
        if (isExternal) return true;

        // Langue FR : inclut /, /about, /contact mais pas /en/*
        if (language === "fr") {
            return !navItem.url.startsWith("/en");
        }

        // Langue EN : inclut uniquement /en/*
        if (language === "en") {
            return navItem.url.startsWith("/en");
        }

        return false;
    });

    return (
        <>
            {filteredNav.map((navItem, i) => {
                if (!navItem.label || !navItem.url) return null;

                const isExternal = /^https?:\/\//i.test(navItem.url);

                return isExternal ? (
                    <a
                        className={navClass}
                        href={navItem.url}
                        key={i}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {navItem.label}
                    </a>
                ) : (
                    <Link className={navClass} to={navItem.url} key={i}>
                        {navItem.label}
                    </Link>
                );
            })}
        </>
    );
};

Navigation.defaultProps = {
    navClass: "site-nav-item",
};

Navigation.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        })
    ).isRequired,
    navClass: PropTypes.string,
};

export default Navigation;