import type { Metadata } from "next";
import { LOCATIONS, PHONE, SITE_NAME, SITE_URL, SOCIAL, type LocationKey } from "./site";

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

/** schema.org data for one gym location (Google Business / local search). */
export function locationSchema(k: LocationKey) {
  const l = LOCATIONS[k];
  return {
    "@type": ["SportsActivityLocation", "LocalBusiness"],
    "@id": `${SITE_URL}/#${k}`,
    name: `${SITE_NAME} – ${l.name}`,
    url: `${SITE_URL}/locations/${k}`,
    telephone: PHONE,
    email: l.email,
    image: `${SITE_URL}/opengraph-image`,
    priceRange: "$$",
    address: { "@type": "PostalAddress", streetAddress: l.street, addressLocality: l.city, addressRegion: l.region, postalCode: l.zip, addressCountry: "US" },
    areaServed: l.serves.map((c) => ({ "@type": "City", name: `${c}, ID` })),
    hasMap: l.mapsUrl,
    parentOrganization: { "@id": `${SITE_URL}/#org` },
    sameAs: [SOCIAL.instagram, SOCIAL.facebook],
  };
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: SITE_NAME,
    alternateName: ["The Gym Nest", "Gym Nest", "Supernova Athletics"],
    url: SITE_URL,
    telephone: PHONE,
    logo: `${SITE_URL}/icon`,
    sameAs: [SOCIAL.instagram, SOCIAL.facebook, SOCIAL.supernova],
    department: [{ "@id": `${SITE_URL}/#nampa` }, { "@id": `${SITE_URL}/#eagle` }],
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

/** A program offered at one location, as a schema.org Service. */
export function serviceSchema({ name, description, path, loc }: { name: string; description: string; path: string; loc: LocationKey }) {
  return {
    "@type": "Service",
    name,
    description,
    url: `${SITE_URL}${path}`,
    serviceType: name,
    audience: { "@type": "PeopleAudience", suggestedMinAge: 1.5, suggestedMaxAge: 12 },
    provider: { "@id": `${SITE_URL}/#${loc}` },
    areaServed: LOCATIONS[loc].serves.map((c) => ({ "@type": "City", name: `${c}, ID` })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
