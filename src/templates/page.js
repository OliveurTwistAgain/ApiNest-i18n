// src/templates/page.js

import * as React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import { Layout } from "../components/common";
import { MetaData } from "../components/common/meta";

const encode = (data) => {
    return Object.keys(data)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
};

const Page = ({ data, location, pageContext }) => {
    const [submitted, setSubmitted] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

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
    const lang = pageContext?.lang || "fr";
    const slug = page.slug;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const form = e.target;
        const formData = new FormData(form);

        try {
            await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: encode(Object.fromEntries(formData)),
            });
            setSubmitted(true);
            form.reset();
        } catch (err) {
            console.error("Form submission error:", err);
            alert(lang === "fr" ? "Erreur lors de l'envoi" : "Error submitting the form");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <MetaData data={data} location={location} type="website" />
            <Helmet>
                <style type="text/css">{page.codeinjection_styles || ""}</style>
                <html lang={lang} />
            </Helmet>
            <Layout lang={lang}>
                <div className="container">
                    <article className="content page">
                        <h1 className="content-title">{page.title}</h1>
                        {page.feature_image && (
                            <img
                                className="page-feature-image"
                                src={page.feature_image}
                                alt={page.title}
                            />
                        )}
                        <section
                            className="content-body load-external-scripts"
                            dangerouslySetInnerHTML={{ __html: page.html }}
                        />

                        {(slug === "contact" || slug === "en-contact") && (
                            <>
                                {submitted ? (
                                    <p className="message-success">
                                         {lang === "fr"
                                            ? "Merci, votre message a bien été envoyé !"
                                            : "Thank you, your message has been sent!"}
                                    </p>
                                ) : (
                                    <form
                                        name={slug === "contact" ? "contact-fr" : "contact-en"}
                                        method="POST"
                                        data-netlify="true"
                                        data-netlify-honeypot="bot-field"
                                        onSubmit={handleSubmit}
                                        className="space-y-4 mt-8"
                                    >
                                        <input
                                            type="hidden"
                                            name="form-name"
                                            value={slug === "contact" ? "contact-fr" : "contact-en"}
                                        />
                                        <p hidden>
                                            <label>
                                                {lang === "fr" ? "Ne pas remplir :" : "Don’t fill this out:"}{" "}
                                                <input name="bot-field" />
                                            </label>
                                        </p>

                                        <div>
                                            <label className="block">
                                                {lang === "fr" ? "Nom" : "Name"}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block">
                                                {lang === "fr" ? "Message" : "Message"}
                                            </label>
                                            <textarea
                                                name="message"
                                                required
                                                className="w-full border p-2 rounded h-32"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-4 py-2 rounded bg-blue-600 text-white"
                                        >
                                            {submitting
                                                ? lang === "fr" ? "Envoi..." : "Sending..."
                                                : lang === "fr" ? "Envoyer" : "Send"}
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
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
            feature_image: PropTypes.string,
            slug: PropTypes.string.isRequired,
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
            slug
        }
    }
`;
