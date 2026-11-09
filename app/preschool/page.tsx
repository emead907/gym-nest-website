import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Faq } from "../components/Faq";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { LOCATIONS, LOCATION_KEYS, PARENT_PORTAL_URL, PRESCHOOL, SITE_URL } from "../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Preschool in Eagle & Nampa, ID with Gymnastics", description: "Educational preschool for ages 3–5 at The Gym Nest in Eagle and Nampa, Idaho. Kindergarten readiness plus a gymnastics lesson every week. 2, 3 and 5 day options.", path: "/preschool" });

const FAQS = [
  { q: "Does my child need to be potty trained?", a: "Yes. Preschoolers need to be potty trained." },
  { q: "What do preschoolers learn?", a: "Kindergarten readiness, social and emotional skills and early learning, plus a weekly gymnastics lesson and recess in the gym." },
  { q: "Is there a registration fee?", a: "A one-time supply fee is due at registration." },
];

export default function Preschool() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Preschool", path: "/preschool" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(FAQS), ...LOCATION_KEYS.map((k) => ({ "@type": "Preschool", name: `The Gym Nest Preschool – ${LOCATIONS[k].name}`, url: `${SITE_URL}/preschool`, address: { "@type": "PostalAddress", streetAddress: LOCATIONS[k].street, addressLocality: LOCATIONS[k].city, addressRegion: "ID", postalCode: LOCATIONS[k].zip, addressCountry: "US" }, parentOrganization: { "@id": `${SITE_URL}/#org` } })))} />
      <PageHero eyebrow="Ages 3–5 · Eagle & Nampa" title="Preschool with a gymnastics twist" intro="An educational curriculum built for kindergarten readiness, social and emotional growth and early learning, with a gymnastics lesson every week. Enrollment is open for the 2026–27 school year." crumbs={crumbs}>
        <a href={PARENT_PORTAL_URL} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">Enroll in the parent portal</a>
      </PageHero>
      {LOCATION_KEYS.slice().reverse().map((k) => (
        <section key={k} id={k} className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy">{LOCATIONS[k].name} preschool</h2>
          <p className="mt-1 text-muted">{LOCATIONS[k].street}, {LOCATIONS[k].city}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRESCHOOL[k].options.map((o) => (
              <article key={o.label + o.days} className="rounded-3xl border border-line p-6">
                <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">{o.ages}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-navy">{o.label}</h3>
                <p className="mt-2 text-ink">{o.days}<br />{o.time}</p>
                <p className="mt-3 font-extrabold text-navy">{o.price}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 flex gap-2 text-muted"><Check aria-hidden className="mt-1 h-4 w-4 text-orchid-dark" />{PRESCHOOL[k].note}</p>
        </section>
      ))}
      <Faq faqs={FAQS} />
      <Cta title="Come see the preschool." text="Schedule a tour or ask about openings at either location." href="/contact" label="Schedule a tour" />
    </>
  );
}
