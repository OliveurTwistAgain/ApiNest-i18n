import * as React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import { Layout } from "../components/common";
import { MetaData } from "../components/common/meta";

const Page = ({ data, location, pageContext }) => {
    if (!data || !data.ghostPage) {
        console.error("Page data is not valid");
        return (
            <Layout lang={pageContext?.lang || "fr"}>
                <div className="container">
                    <h1>Page introuvable</h1>
                    <p>Vérifiez que le slug et la langue dans l’URL sont corrects.</p>
                </div>
            </Layout>
        );
    }

    const page = data.ghostPage;
    const lang = pageContext?.lang || "fr"; // fallback si jamais

    return (
        <>
            <MetaData data={data} location={location} type="website" />
            <Helmet>
                <style type="text/css">{page.codeinjection_styles || ""}</style>
                <html lang={lang} />
            </Helmet>
            <Layout lang={lang}>
                <div className="container">
                    <article className="content">
                        <h1 className="content-title">{page.title}</h1>
                        {page.feature_image && (
                            <img className="page-feature-image" src={page.feature_image} alt={page.title} />
                        )}
                        <section
                            className="content-body load-external-scripts"
                            dangerouslySetInnerHTML={{ __html: page.html }}
                        />
                    </article>
                </div>
            </Layout>
        </>
    );
};

Page.propTypes = {
    data: PropTypes.shape({
        ghostPage: PropTypes.shape({
            codeinjection_styles: PropTypes.string,
            title: PropTypes.string.isRequired,
            html: PropTypes.string.isRequired,
            feature_image: PropTypes.string, // attention ici : c'est une string URL
        }).isRequired,
    }).isRequired,
    location: PropTypes.object.isRequired,
    pageContext: PropTypes.shape({
        lang: PropTypes.string,
    }),
};

export default Page;

export const pageQuery = graphql`
    query GhostPageBySlug($slug: String!) {
        ghostPage(slug: { eq: $slug }) {
            ...GhostPageFields
        }
    }
`;
