import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "../../components/PageHero";
import { Faq } from "../../components/Faq";
import { Cta } from "../../components/Cta";
import { JsonLd } from "../../components/JsonLd";
import { PartyForm } from "../../components/PartyForm";
import { getPasses } from "../../lib/classes";
import { EVENT_TITLES, GYM, KNO, OPEN_PLAY, PARENT_PORTAL_URL, PARTY, PHONE, eventPath, type EventKey } from "../../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta, serviceSchema } from "../../lib/seo";

export const revalidate = 600;
export const dynamicParams = false;
const EVENTS = Object.keys(EVENT_TITLES) as EventKey[];
const isEvent = (slug: string): slug is EventKey => (EVENTS as string[]).includes(slug);

export function generateStaticParams() {
  return EVENTS.map((slug) => ({ slug }));
}

function summary(event: EventKey) {
  if (event === "birthday-parties") return `Saturday birthday parties: ${PARTY.price}.`;
  if (event === "open-play") return `${OPEN_PLAY.when}. ${OPEN_PLAY.ages}. ${OPEN_PLAY.price}.`;
  return `${KNO.time}, ages 4–12. ${KNO.price}.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isEvent(slug)) return {};
  const e = EVENT_TITLES[slug];
  return pageMeta({ title: `${e.seo} in Nampa, ID`, description: `${e.blurb} ${summary(slug)} The Gym Nest, ${GYM.street}, Nampa.`, path: eventPath(slug) });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isEvent(slug)) notFound();
  const event = slug;
  const e = EVENT_TITLES[event];
  const path = eventPath(event);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: e.title, path }];
  const faqs = FAQS[event];
  // The Open Play monthly pass is sold in Jackrabbit; link straight to it with the price.
  const openPlayPass = event === "open-play" ? (await getPasses()).find((p) => /open play/i.test(p.name)) : undefined;

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), serviceSchema({ name: `${e.seo} in Nampa, ID`, description: e.blurb, path }))} />
      <PageHero eyebrow="The Gym Nest Nampa" title={`${e.seo} in Nampa, Idaho`} intro={e.blurb} crumbs={crumbs}>
        {event === "birthday-parties" && <a href="#book" className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">Request a date</a>}
      </PageHero>

      {event === "birthday-parties" && (
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy">The party package</h2>
            <p className="mt-3 text-xl font-extrabold text-orchid-dark">{PARTY.price}</p>
            <ul className="mt-5 space-y-3">
              {PARTY.includes.map((t) => <li key={t} className="flex gap-3 text-lg text-ink"><Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-orchid-dark" />{t}</li>)}
            </ul>
            <h3 className="mt-8 font-display text-2xl font-semibold text-navy">Saturday party times</h3>
            <div className="mt-3 flex flex-wrap gap-2">{PARTY.slots.map((t) => <span key={t} className="rounded-full bg-aqua-tint px-4 py-2 font-extrabold text-navy">{t}</span>)}</div>
            <p className="mt-6 text-muted">Advance reservations required. Payment is due up front to hold your date. Questions? Call <a href="tel:+12082782011" className="font-extrabold text-navy">{PHONE}</a>.</p>
          </div>
          <div id="book" className="scroll-mt-28 rounded-[2rem] bg-orchid-tint p-3 sm:p-5"><PartyForm /></div>
        </section>
      )}

      {event === "open-play" && (
        <section className="mx-auto max-w-4xl px-4 pt-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy">Fun for parents and kids</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">Open play is fun for parents and children! Adults supervise while kids play and explore in the gym. It&rsquo;s a great opportunity to meet other parents and children. We set up obstacles for the kids to play on.</p>
          <p className="mt-4 text-lg leading-relaxed text-ink">Our open play is drop-in friendly, so come on by and let your kids go wild. No food or drinks are allowed in the gym area. Bare feet and athletic clothing are encouraged.</p>
        </section>
      )}

      {event === "open-play" && (
        <Details
          rows={[
            ["When", OPEN_PLAY.when],
            ["Ages", OPEN_PLAY.ages],
            ["Drop-in", OPEN_PLAY.price],
            ["Pass", `${OPEN_PLAY.pass} (non-refundable)`],
            ...(openPlayPass ? [["Monthly pass", `$${openPlayPass.tuition} a month for unlimited open play`] as [string, string]] : []),
          ]}
          actions={[
            ...(openPlayPass ? [{ href: openPlayPass.regLink, label: "Sign up for the monthly pass" }] : []),
            { href: PARENT_PORTAL_URL, label: "Buy a punch pass in the parent portal" },
          ]}
        />
      )}

      {event === "kids-night-out" && (
        <Details
          rows={[["When", KNO.when], ["Time", KNO.time], ["Ages", "4–12, potty trained"], ["Price", `${KNO.price}. Register ahead of time.`], ["Includes", KNO.includes], ["Food", "Kids with food sensitivities can bring their own food and drinks."]]}
          actions={[{ href: PARENT_PORTAL_URL, label: "Register in the parent portal" }]}
        />
      )}

      <Faq faqs={faqs} />
      <Cta />
    </>
  );
}

function Details({ rows, actions }: { rows: [string, string][]; actions: { href: string; label: string }[] }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <dl className="divide-y divide-line rounded-3xl border border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[10rem_1fr]">
            <dt className="font-extrabold text-navy">{k}</dt>
            <dd className="text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        {actions.map((a, i) => (
          <a key={a.href} href={a.href} className={`inline-flex min-h-12 items-center rounded-full px-7 font-extrabold ${i === 0 ? "bg-navy text-white hover:bg-navy-dark" : "border-2 border-navy text-navy hover:bg-aqua-tint"}`}>{a.label}</a>
        ))}
      </div>
    </section>
  );
}

const FAQS: Record<EventKey, { q: string; a: string }[]> = {
  "birthday-parties": [
    { q: "How long is a party?", a: "An hour and a half: one hour of games and play in the gym, then 30 minutes in the party room." },
    { q: "Can we bring our own food and cake?", a: "Yes. Outside food and drinks are welcome, and we handle the cleanup." },
    { q: "How do I hold a date?", a: `Send a request on this page or call ${PHONE}. Payment is due up front to secure your date.` },
    { q: "What ages are parties for?", a: "Our parties work great for toddlers through age 12. Coaches run age-appropriate games and obstacle courses." },
  ],
  "open-play": [
    { q: "Do I need to sign up for open play?", a: "No. Open play is drop-in. A punch pass or monthly pass saves money if you come often." },
    { q: "Do parents stay?", a: "Yes. Adults supervise their kids during open play." },
  ],
  "kids-night-out": [
    { q: "Who supervises Kids Night Out?", a: "Our gym coaches run and supervise the whole night." },
    { q: "Do I need to register ahead?", a: "Yes. Kids must be registered in advance so we can plan staff and pizza." },
  ],
};
