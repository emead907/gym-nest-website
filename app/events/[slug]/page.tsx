import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "../../components/PageHero";
import { Faq } from "../../components/Faq";
import { Cta } from "../../components/Cta";
import { JsonLd } from "../../components/JsonLd";
import { LocationCards } from "../../components/LocationCards";
import { SetLocation } from "../../components/LocationProvider";
import { PartyForm } from "../../components/PartyForm";
import { EVENT_TITLES, KNO, LOCATIONS, LOCATION_KEYS, OPEN_PLAY, PARENT_PORTAL_URL, PARTIES, PHONE, eventPath, otherLocation, type EventKey, type LocationKey } from "../../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta, serviceSchema } from "../../lib/seo";

export const dynamicParams = false;
const EVENTS = Object.keys(EVENT_TITLES) as EventKey[];

function parse(slug: string): { loc?: LocationKey; event: EventKey } | null {
  const m = slug.match(/^(?:(nampa|eagle)-)?(.+)$/);
  if (!m || !EVENTS.includes(m[2] as EventKey)) return null;
  return { loc: m[1] as LocationKey | undefined, event: m[2] as EventKey };
}

export function generateStaticParams() {
  return EVENTS.flatMap((e) => [{ slug: e }, ...LOCATION_KEYS.map((l) => ({ slug: `${l}-${e}` }))]);
}

function summary(event: EventKey, loc: LocationKey) {
  if (event === "birthday-parties") return `Saturday birthday parties: ${PARTIES[loc].price}.`;
  if (event === "open-play") return `${OPEN_PLAY[loc].when}. ${OPEN_PLAY[loc].ages}. ${OPEN_PLAY[loc].price}.`;
  return `${KNO[loc].time}, ages 4–12. ${KNO[loc].price}.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const parsed = parse((await params).slug);
  if (!parsed) return {};
  const e = EVENT_TITLES[parsed.event];
  if (!parsed.loc) return pageMeta({ title: `${e.seo} in Nampa & Eagle, ID`, description: `${e.blurb} At The Gym Nest in Nampa and Eagle, Idaho.`, path: eventPath(parsed.event) });
  const l = LOCATIONS[parsed.loc];
  return pageMeta({ title: `${e.seo} in ${l.name}, ID`, description: `${e.blurb} ${summary(parsed.event, parsed.loc)} The Gym Nest ${l.name}, ${l.street}.`, path: eventPath(parsed.event, parsed.loc) });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const parsed = parse((await params).slug);
  if (!parsed) notFound();
  const { event, loc } = parsed;
  const e = EVENT_TITLES[event];

  if (!loc) {
    const crumbs = [{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: e.title, path: eventPath(event) }];
    return (
      <>
        <JsonLd data={graph(breadcrumbSchema(crumbs))} />
        <PageHero eyebrow="Nampa & Eagle" title={`${e.seo} in Nampa & Eagle, Idaho`} intro={e.blurb} crumbs={crumbs} />
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy">Pick your gym</h2>
          <div className="mt-6"><LocationCards href={(k) => eventPath(event, k)} label={`${e.title} in`} note={(k) => summary(event, k)} /></div>
        </section>
        <Cta />
      </>
    );
  }

  const l = LOCATIONS[loc];
  const path = eventPath(event, loc);
  const crumbs = [{ name: "Home", path: "/" }, { name: `The Gym Nest ${l.name}`, path: `/locations/${loc}` }, { name: `${l.name} ${e.title}`, path }];
  const faqs = FAQS[event](loc);

  return (
    <>
      <SetLocation location={loc} />
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), serviceSchema({ name: `${e.seo} in ${l.name}, ID`, description: e.blurb, path, loc }))} />
      <PageHero eyebrow={`The Gym Nest ${l.name}`} title={`${e.seo} in ${l.name}, Idaho`} intro={e.blurb} crumbs={crumbs}>
        <Link href={eventPath(event, otherLocation(loc))} className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-white">Switch to {LOCATIONS[otherLocation(loc)].name}</Link>
      </PageHero>

      {event === "birthday-parties" && (
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy">The party package</h2>
            <p className="mt-3 text-xl font-extrabold text-orchid-dark">{PARTIES[loc].price}</p>
            <ul className="mt-5 space-y-3">
              {PARTIES[loc].includes.map((t) => <li key={t} className="flex gap-3 text-lg text-ink"><Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-orchid-dark" />{t}</li>)}
            </ul>
            <h3 className="mt-8 font-display text-2xl font-semibold text-navy">Saturday party times</h3>
            <div className="mt-3 flex flex-wrap gap-2">{PARTIES[loc].slots.map((s) => <span key={s} className="rounded-full bg-aqua-tint px-4 py-2 font-extrabold text-navy">{s}</span>)}</div>
            <p className="mt-6 text-muted">Advance reservations required. Payment is due up front to hold your date. Questions? Call <a href="tel:+12082782011" className="font-extrabold text-navy">{PHONE}</a>.</p>
          </div>
          <div className="rounded-[2rem] bg-orchid-tint p-3 sm:p-5"><PartyForm location={loc} /></div>
        </section>
      )}

      {event === "open-play" && (
        <Details rows={[["When", OPEN_PLAY[loc].when], ["Ages", OPEN_PLAY[loc].ages], ["Drop-in", OPEN_PLAY[loc].price], ["Pass", `${OPEN_PLAY[loc].pass} (non-refundable)`], ["Good to know", "Adults stay and supervise. No food or drinks in the gym. Bare feet and athletic clothes are best."]]} cta="Buy a pass in the parent portal" />
      )}

      {event === "kids-night-out" && (
        <Details rows={[["When", KNO[loc].when], ["Time", KNO[loc].time], ["Ages", "4–12, potty trained"], ["Price", `${KNO[loc].price}. Register ahead of time.`], ["Includes", KNO[loc].includes], ["Food", "Kids with food sensitivities can bring their own food and drinks."]]} cta="Register in the parent portal" />
      )}

      <Faq faqs={faqs} />
      <Cta />
    </>
  );
}

function Details({ rows, cta }: { rows: [string, string][]; cta: string }) {
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
      <a href={PARENT_PORTAL_URL} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">{cta}</a>
    </section>
  );
}

const FAQS: Record<EventKey, (loc: LocationKey) => { q: string; a: string }[]> = {
  "birthday-parties": (loc) => [
    { q: "How long is a party?", a: "An hour and a half: one hour of games and play in the gym, then 30 minutes in the party room." },
    { q: "Can we bring our own food and cake?", a: "Yes. Outside food and drinks are welcome, and we handle the cleanup." },
    { q: "How do I hold a date?", a: `Send a request on this page or call ${PHONE}. Payment is due up front to secure your date.` },
    { q: `What ages are ${LOCATIONS[loc].name} parties for?`, a: "Our parties work great for toddlers through age 12. Coaches run age-appropriate games and obstacle courses." },
  ],
  "open-play": (loc) => [
    { q: "Do I need to sign up for open play?", a: "No. Open play is drop-in. A punch pass saves money if you come often." },
    { q: "Do parents stay?", a: `Yes. Adults supervise their kids during open play at ${LOCATIONS[loc].name}.` },
  ],
  "kids-night-out": () => [
    { q: "Who supervises Kids Night Out?", a: "Our gym coaches run and supervise the whole night." },
    { q: "Do I need to register ahead?", a: "Yes. Kids must be registered in advance so we can plan staff and pizza." },
  ],
};
