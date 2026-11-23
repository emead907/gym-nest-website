import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Faq } from "../components/Faq";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { GYM, PARENT_PORTAL_URL, PRESCHOOL, SITE_URL } from "../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta, providerRef } from "../lib/seo";

export const metadata = pageMeta({ title: "Preschool in Nampa, ID with Gymnastics", description: "Educational preschool for ages 3–5 at The Gym Nest in Nampa, Idaho. Kindergarten readiness plus a gymnastics lesson every week. 2 and 3 day options.", path: "/preschool" });

const FAQS = [
  { q: "Does my child need to be potty trained?", a: "Yes. Preschoolers need to be potty trained." },
  { q: "What do preschoolers learn?", a: "Kindergarten readiness, social and emotional skills and early learning, plus a weekly gymnastics lesson and recess in the gym." },
  { q: "Is there a supply fee?", a: "Yes, a one-time supply fee is due at registration. The amount depends on the class and is listed with each option." },
];

export default function Preschool() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Preschool", path: "/preschool" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(FAQS), { "@type": "Preschool", name: "The Gym Nest Preschool – Nampa", url: `${SITE_URL}/preschool`, address: { "@type": "PostalAddress", streetAddress: GYM.street, addressLocality: GYM.city, addressRegion: "ID", postalCode: GYM.zip, addressCountry: "US" }, parentOrganization: providerRef })} />
      <PageHero eyebrow="Ages 3–5 · Nampa" title="Preschool with a gymnastics twist" intro="An educational curriculum built for kindergarten readiness, social and emotional growth and early learning, with a gymnastics lesson every week. Enrollment is open for the 2026–27 school year." crumbs={crumbs}>
        <a href={PARENT_PORTAL_URL} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">Enroll in the parent portal</a>
      </PageHero>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">Preschool options</h2>
        <p className="mt-1 text-muted">{GYM.street}, {GYM.city}</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRESCHOOL.options.map((o) => (
            <article key={o.label + o.days} className="rounded-3xl border border-line p-6">
              <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">{o.ages}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-navy">{o.label}</h3>
              <p className="mt-2 text-ink">{o.days}<br />{o.time}</p>
              <p className="mt-3 font-extrabold text-navy">{o.price}</p>
            </article>
          ))}
        </div>
        <p className="mt-4 flex gap-2 text-muted"><Check aria-hidden className="mt-1 h-4 w-4 text-orchid-dark" />{PRESCHOOL.note}</p>
      </section>
      <Faq faqs={FAQS} />
      <Cta title="Come see the preschool." text="Schedule a tour or ask about openings." href="/contact" label="Schedule a tour" />
    </>
  );
}
