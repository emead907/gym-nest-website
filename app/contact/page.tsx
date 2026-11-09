import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { LOCATIONS, LOCATION_KEYS, PARENT_PORTAL_URL, PHONE, PHONE_HREF, SOCIAL } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Contact The Gym Nest Nampa & Eagle", description: `Call ${PHONE} or visit The Gym Nest at 849 S. Rising Sun Dr, Nampa or 17 N Fisher Park Way, Eagle, Idaho.`, path: "/contact" });

export default function Contact() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Contact" title="We'd love to hear from you" intro="Questions about classes, parties or preschool? Call, email or stop by either gym." crumbs={crumbs}>
        <a href={PHONE_HREF} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark"><Phone aria-hidden className="h-5 w-5" />{PHONE}</a>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        {LOCATION_KEYS.map((k) => {
          const l = LOCATIONS[k];
          return (
            <article key={k} className="rounded-3xl border border-line p-7">
              <h2 className="font-display text-3xl font-semibold text-navy">The Gym Nest {l.name}</h2>
              <p className="mt-4 flex gap-3 text-ink"><MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orchid-dark" /><a href={l.mapsUrl} className="hover:underline">{l.street}<br />{l.city}, ID {l.zip}</a></p>
              <p className="mt-3 flex gap-3 text-ink"><Mail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orchid-dark" /><a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a></p>
              <p className="mt-3 flex gap-3 text-ink"><Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orchid-dark" /><a href={PHONE_HREF} className="hover:underline">{PHONE}</a></p>
              <a href={l.mapsUrl} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-aqua-tint px-5 font-extrabold text-navy hover:bg-navy hover:text-white">Get directions</a>
            </article>
          );
        })}
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <p className="text-muted">Already a member? Manage your account, payments and enrollments in the <a href={PARENT_PORTAL_URL} className="font-extrabold text-navy underline">parent portal</a>. Follow us on <a href={SOCIAL.instagram} className="font-extrabold text-navy underline">Instagram</a> and <a href={SOCIAL.facebook} className="font-extrabold text-navy underline">Facebook</a>.</p>
      </section>
    </>
  );
}
