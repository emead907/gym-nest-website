import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { JsonLd } from "../components/JsonLd";
import { MessageForm } from "../components/MessageForm";
import { GYM, PARENT_PORTAL_URL, PHONE, PHONE_HREF, SOCIAL } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Contact The Gym Nest Nampa", description: `Call ${PHONE}, send a message, or visit The Gym Nest at ${GYM.street}, Nampa, Idaho.`, path: "/contact" });

export default function Contact() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Contact" title="We'd love to hear from you" intro="Questions about classes, parties or preschool? Call, send a message or stop by the gym." crumbs={crumbs}>
        <a href={PHONE_HREF} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark"><Phone aria-hidden className="h-5 w-5" />{PHONE}</a>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <article className="rounded-3xl border border-line p-7">
            <h2 className="font-display text-3xl font-semibold text-navy">The Gym Nest Nampa</h2>
            <p className="mt-4 flex gap-3 text-ink"><MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orchid-dark" /><a href={GYM.mapsUrl} className="hover:underline">{GYM.street}<br />{GYM.city}, ID {GYM.zip}</a></p>
            <p className="mt-3 flex gap-3 text-ink"><Mail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orchid-dark" /><a href={`mailto:${GYM.email}`} className="hover:underline">{GYM.email}</a></p>
            <p className="mt-3 flex gap-3 text-ink"><Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orchid-dark" /><a href={PHONE_HREF} className="hover:underline">{PHONE}</a></p>
            <a href={GYM.mapsUrl} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-aqua-tint px-5 font-extrabold text-navy hover:bg-navy hover:text-white">Get directions</a>
          </article>
          <iframe title="Map to The Gym Nest Nampa" src={GYM.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="mt-6 h-72 w-full rounded-3xl border border-line" />
          <p className="mt-6 text-muted">Already a member? Manage your account, payments and enrollments in the <a href={PARENT_PORTAL_URL} className="font-extrabold text-navy underline">parent portal</a>. Follow us on <a href={SOCIAL.instagram} className="font-extrabold text-navy underline">Instagram</a> and <a href={SOCIAL.facebook} className="font-extrabold text-navy underline">Facebook</a>.</p>
        </div>
        <div className="rounded-3xl bg-white p-1">
          <h2 className="font-display text-3xl font-semibold text-navy">Send us a message</h2>
          <p className="mb-6 mt-1 text-muted">We reply within one business day.</p>
          <MessageForm />
        </div>
      </section>
    </>
  );
}
