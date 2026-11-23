import type { Metadata } from "next";
import { GYM, PHONE, SITE_NAME, SITE_URL, SOCIAL } from "./site";

/** Page metadata with canonical URL, Open Graph and Twitter cards. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: `${SITE_URL}${path}`, siteName: SITE_NAME, title, description, locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const GYM_ID = `${SITE_URL}/#gym`;

/** schema.org data for the gym (Google Business / local search). */
export function gymSchema() {
  return {
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    "@id": GYM_ID,
    name: SITE_NAME,
    alternateName: ["The Gym Nest", "Gym Nest Nampa", "The Gym Nest Activity Center", "Supernova Athletics"],
    url: SITE_URL,
    telephone: PHONE,
    email: GYM.email,
    logo: `${SITE_URL}/icon`,
    image: `${SITE_URL}/opengraph-image`,
    priceRange: "$$",
    address: { "@type": "PostalAddress", streetAddress: GYM.street, addressLocality: GYM.city, addressRegion: GYM.region, postalCode: GYM.zip, addressCountry: "US" },
    areaServed: GYM.serves.map((c) => ({ "@type": "City", name: `${c}, ID` })),
    hasMap: GYM.mapsUrl,
    sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.supernova],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** A program offered at the gym, as a schema.org Service. */
export function serviceSchema({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    serviceType: name,
    audience: { "@type": "PeopleAudience", suggestedMinAge: 1.5, suggestedMaxAge: 12 },
    provider: { "@id": GYM_ID },
    areaServed: GYM.serves.map((c) => ({ "@type": "City", name: `${c}, ID` })),
  };
}

export const providerRef = { "@id": GYM_ID };

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
