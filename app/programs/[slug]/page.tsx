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
import { ProgramClasses, type ProgramCard, type Slot } from "../../components/ProgramClasses";
import { getClasses, type SiteClass } from "../../lib/classes";
import { LOCATIONS, LOCATION_KEYS, PHONE, POLICIES, PROGRAMS, PROGRAM_KEYS, classesPath, otherLocation, programPath, type LocationKey, type ProgramKey } from "../../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta, serviceSchema } from "../../lib/seo";

export const revalidate = 600;
export const dynamicParams = false;

function parse(slug: string): { loc?: LocationKey; program: ProgramKey } | null {
  const m = slug.match(/^(?:(nampa|eagle)-)?(.+)$/);
  if (!m || !PROGRAM_KEYS.includes(m[2] as ProgramKey)) return null;
  return { loc: m[1] as LocationKey | undefined, program: m[2] as ProgramKey };
}

export function generateStaticParams() {
  return PROGRAM_KEYS.flatMap((p) => [{ slug: p }, ...LOCATION_KEYS.map((l) => ({ slug: `${l}-${p}` }))]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const parsed = parse((await params).slug);
  if (!parsed) return {};
  const p = PROGRAMS[parsed.program];
  if (!parsed.loc) {
    return pageMeta({ title: `${p.seoTitle} in Nampa & Eagle, ID`, description: `${p.tagline} Classes at The Gym Nest in Nampa and Eagle, Idaho. No-risk first day.`, path: programPath(p.key) });
  }
  const l = LOCATIONS[parsed.loc];
  return pageMeta({
    title: `${p.seoTitle} in ${l.name}, ID`,
    description: `${p.tagline} At The Gym Nest ${l.name}, ${l.street}. Serving ${l.serves.slice(0, 4).join(", ")} and nearby. No-risk first day. See live open spots.`,
    path: programPath(p.key, parsed.loc),
  });
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const parsed = parse((await params).slug);
  if (!parsed) notFound();
  const p = PROGRAMS[parsed.program];
  const loc = parsed.loc;

  if (!loc) {
    const crumbs = [{ name: "Home", path: "/" }, { name: "Programs", path: "/programs" }, { name: p.title, path: programPath(p.key) }];
    return (
      <>
        <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(p.faqs))} />
        <PageHero eyebrow={`${p.title} · Nampa & Eagle`} title={`${p.seoTitle} in Nampa & Eagle, Idaho`} intro={p.intro} crumbs={crumbs} />
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-navy">Pick your gym</h2>
          <div className="mt-6"><LocationCards href={(k) => programPath(p.key, k)} label={`${p.title} in`} /></div>
        </section>
        <ClassList program={p.key} />
        <Faq faqs={p.faqs} />
        <Cta />
      </>
    );
  }

  const l = LOCATIONS[loc];
  const { classes } = await getClasses();
  const here = classes.filter((c) => c.location === loc && c.program === p.finder);
  const path = programPath(p.key, loc);
  const crumbs = [{ name: "Home", path: "/" }, { name: `The Gym Nest ${l.name}`, path: `/locations/${loc}` }, { name: `${l.name} ${p.title}`, path }];
  const faqs = [
    ...p.faqs,
    { q: `Where is The Gym Nest ${l.name}?`, a: `${l.street}, ${l.city}, ID ${l.zip}. Families come from ${l.serves.join(", ")}.` },
    { q: "How much are classes?", a: `Tuition is billed monthly and varies by class. Call ${PHONE} for current ${l.name} rates. New families pay a one-time $50 registration fee, and every new student starts with a no-risk first day.` },
  ];

  return (
    <>
      <SetLocation location={loc} />
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), serviceSchema({ name: `${p.seoTitle} in ${l.name}, ID`, description: p.intro, path, loc }))} />
      <PageHero eyebrow={`The Gym Nest ${l.name}`} title={`${p.seoTitle} in ${l.name}, Idaho`} intro={p.tagline} crumbs={crumbs}>
        <div className="flex flex-wrap gap-3">
          <a href="#classes" className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">See {l.name} class times</a>
          <Link href={programPath(p.key, otherLocation(loc))} className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-white">Switch to {LOCATIONS[otherLocation(loc)].name}</Link>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">About the program</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">{p.title} at The Gym Nest {l.name}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink">{p.intro}</p>
        </div>
        <ul className="grid gap-3 rounded-3xl bg-aqua-tint p-6 sm:p-7">
          {[
            "No-risk first day",
            "Month-to-month, no long contract",
            "Small classes with coaches who know every kid",
            `${l.street}, ${l.city}`,
          ].map((t) => (
            <li key={t} className="flex gap-3 font-bold text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{t}</li>
          ))}
        </ul>
      </section>

      <section id="classes" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-14 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">{l.name} {p.title.toLowerCase()} classes</h2>
            <p className="mt-2 max-w-2xl text-muted">Pick a day and time and request the class. Your first day is no-risk: if it isn&rsquo;t the right fit, tell us within 24 hours of that class and you won&rsquo;t be charged. Open spots update throughout the day.</p>
          </div>
          <Link href={classesPath(loc, p.finder)} className="font-extrabold text-navy underline">Compare every class in the class finder →</Link>
        </div>
        <ProgramClasses location={loc} cards={buildCards(p.classes, here)} otherHref={programPath(p.key, otherLocation(loc))} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="rounded-3xl bg-orchid-tint p-8">
          <h2 className="font-display text-2xl font-bold text-navy">Tuition & policies</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {POLICIES.map((t) => <li key={t} className="flex gap-2 text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{t}</li>)}
          </ul>
          <p className="mt-4 text-muted">Tuition varies by class. Call <a href="tel:+12082782011" className="font-extrabold text-navy">{PHONE}</a> for {l.name} rates.</p>
        </div>
      </section>

      <Faq faqs={faqs} />
      <Cta title={`Start ${p.title.toLowerCase()} in ${l.name} with a no-risk first day.`} href="#classes" label="See class times" />
    </>
  );
}

function ClassList({ program }: { program: ProgramKey }) {
  const p = PROGRAMS[program];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
      <h2 className="font-display text-3xl font-bold text-navy">{p.title} classes</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {p.classes.map((c) => (
          <article key={c.name} className="rounded-3xl border border-line bg-white p-6">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-2xl font-semibold text-navy">{c.name}</h3>
              {c.invite && <span className="rounded-full bg-orchid-tint px-3 py-1 text-xs font-extrabold text-orchid-dark">Invite only</span>}
            </div>
            <p className="mt-1 font-bold text-muted">{c.ages} · {c.length}</p>
            <p className="mt-3 leading-relaxed text-ink">{c.about}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Live Jackrabbit times grouped under each class ─────────────────────────

const DAY_NAMES: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const norm = (n: string) => n.toLowerCase().replace(/[^a-z ]/g, "").replace(/s\b/g, "").replace(/\s+/g, " ").trim();
const mins = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  return m ? ((Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m[2]) : 0;
};
/** "4:30 PM", "5:15 PM" → "4:30–5:15 PM" */
const span = (a: string, b: string) => (a.slice(-2) === b.slice(-2) ? `${a.slice(0, -3)}–${b}` : `${a}–${b}`);

function toSlots(list: SiteClass[]): Slot[] {
  const byTime = new Map<string, Slot & { sort: number }>();
  for (const c of list) {
    const day = c.days.length === 1 ? DAY_NAMES[c.days[0]] ?? c.days[0] : c.days.join(" & ");
    const time = span(c.start, c.end);
    const key = `${day}|${time}`;
    const prev = byTime.get(key);
    if (prev) {
      // two sections at the same time: show once, add their open spots together
      prev.openings = prev.openings == null || c.openings == null ? prev.openings ?? c.openings : prev.openings + c.openings;
      continue;
    }
    const plural = c.days.length === 1 ? `${day}s` : day;
    byTime.set(key, { id: c.id, day, time, when: `${plural} · ${time}`, openings: c.openings, regLink: c.regLink, sort: DAY_ORDER.indexOf(c.days[0]) * 1440 + mins(c.start) });
  }
  return [...byTime.values()].sort((a, b) => a.sort - b.sort).map((s) => ({ id: s.id, day: s.day, time: s.time, when: s.when, openings: s.openings, regLink: s.regLink }));
}

function buildCards(catalog: { name: string; ages: string; length: string; about: string; invite?: boolean }[], live: SiteClass[]): ProgramCard[] {
  const used = new Set<string>();
  const cards: ProgramCard[] = catalog.map((c) => {
    const mine = live.filter((x) => norm(x.name) === norm(c.name));
    mine.forEach((x) => used.add(x.id));
    return { name: c.name, ages: c.ages, length: c.length, about: c.about, invite: !!c.invite, slots: c.invite ? [] : toSlots(mine) };
  });
  // Jackrabbit classes we don't describe yet still get a card, so no time is ever hidden.
  const extra = new Map<string, SiteClass[]>();
  for (const x of live) if (!used.has(x.id)) extra.set(x.name, [...(extra.get(x.name) ?? []), x]);
  for (const [name, list] of extra) {
    const m = mins(list[0].end) - mins(list[0].start);
    cards.push({ name, ages: list[0].ages, length: m > 0 ? `${m} min` : "", about: "", invite: false, slots: toSlots(list) });
  }
  // Classes with times first, invite-only last
  return cards.sort((a, b) => Number(a.invite) - Number(b.invite));
}
