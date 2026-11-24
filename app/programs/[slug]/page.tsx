import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { PageHero } from "../../components/PageHero";
import { Faq } from "../../components/Faq";
import { Cta } from "../../components/Cta";
import { JsonLd } from "../../components/JsonLd";
import { NoRiskLink } from "../../components/NoRiskLink";
import { ProgramClasses, type ProgramCard, type Slot } from "../../components/ProgramClasses";
import { getClasses, type SiteClass } from "../../lib/classes";
import { GYM, PHONE, POLICIES, PROGRAMS, PROGRAM_KEYS, REGISTRATION_FEE, classesPath, programPath, type ProgramKey } from "../../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta, serviceSchema } from "../../lib/seo";

export const revalidate = 600;
export const dynamicParams = false;

const isProgram = (slug: string): slug is ProgramKey => (PROGRAM_KEYS as string[]).includes(slug);

export function generateStaticParams() {
  return PROGRAM_KEYS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isProgram(slug)) return {};
  const p = PROGRAMS[slug];
  return pageMeta({
    title: `${p.seoTitle} in Nampa, ID`,
    description: `${p.tagline} At The Gym Nest, ${GYM.street}, Nampa. Serving ${GYM.serves.slice(0, 4).join(", ")} and nearby. No-risk first day. See live class times and tuition.`,
    path: programPath(slug),
  });
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isProgram(slug)) notFound();
  const p = PROGRAMS[slug];
  const { classes } = await getClasses();
  const here = classes.filter((c) => c.program === p.finder);
  const path = programPath(slug);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Programs", path: "/programs" }, { name: p.title, path }];
  const faqs = [
    ...p.faqs,
    { q: "Where is The Gym Nest Nampa?", a: `${GYM.street}, ${GYM.city}, ID ${GYM.zip}. Families come from ${GYM.serves.join(", ")}.` },
    { q: "How much are classes?", a: `Tuition is billed monthly and depends on the class; each class time on this page shows its monthly price. New families pay a one-time ${REGISTRATION_FEE} registration fee, and every new student starts with a no-risk first day.` },
  ];

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), serviceSchema({ name: `${p.seoTitle} in Nampa, ID`, description: p.intro, path }))} />
      <PageHero eyebrow={`${p.title} · The Gym Nest Nampa`} title={`${p.seoTitle} in Nampa, Idaho`} intro={p.tagline} crumbs={crumbs}>
        <div className="flex flex-wrap gap-3">
          <a href="#classes" className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">See class times & prices</a>
          <Link href={classesPath(p.finder)} className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-white">Open the class finder</Link>
        </div>
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">About the program</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">{p.title} at The Gym Nest</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink">{p.intro}</p>
        </div>
        <ul className="grid gap-3 rounded-3xl bg-aqua-tint p-6 sm:p-7">
          <li className="flex gap-3 font-bold text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" /><NoRiskLink className="text-navy">No-risk first day</NoRiskLink></li>
          {["Month-to-month, no long contract", "Small classes with coaches who know every kid", `${GYM.street}, ${GYM.city}`].map((t) => (
            <li key={t} className="flex gap-3 font-bold text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{t}</li>
          ))}
        </ul>
      </section>

      <section id="classes" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-14 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">{p.title} classes</h2>
            <p className="mt-2 max-w-2xl text-muted">Pick a day and time and request the class. Your first day is <NoRiskLink className="text-navy">no-risk</NoRiskLink>: if it isn&rsquo;t the right fit, tell us within 24 hours of that class and you won&rsquo;t be charged. Times and prices come straight from our schedule.</p>
          </div>
          <Link href={classesPath(p.finder)} className="font-extrabold text-navy underline">Compare every class in the class finder →</Link>
        </div>
        <ProgramClasses cards={buildCards(p.classes, here)} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="rounded-3xl bg-orchid-tint p-8">
          <h2 className="font-display text-2xl font-bold text-navy">Tuition & policies</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {POLICIES.map((t) => <li key={t} className="flex gap-2 text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{t}</li>)}
          </ul>
          <p className="mt-4 text-muted">See every class price on our <Link href="/pricing" className="font-extrabold text-navy underline">pricing page</Link>, or call <a href="tel:+12082782011" className="font-extrabold text-navy">{PHONE}</a>.</p>
        </div>
      </section>

      <Faq faqs={faqs} />
      <Cta title={`Start ${p.title.toLowerCase()} with a no-risk first day.`} href="#classes" label="See class times" />
    </>
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
    byTime.set(key, { id: c.id, day, time, when: `${plural} · ${time}`, openings: c.openings, tuition: c.tuition, regLink: c.regLink, sort: DAY_ORDER.indexOf(c.days[0]) * 1440 + mins(c.start) });
  }
  return [...byTime.values()].sort((a, b) => a.sort - b.sort).map((s) => ({ id: s.id, day: s.day, time: s.time, when: s.when, openings: s.openings, tuition: s.tuition, regLink: s.regLink }));
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
  // Classes with times first, then ones with no times this season, invite-only last
  return cards.sort((a, b) => Number(a.invite) - Number(b.invite) || Number(!a.slots.length) - Number(!b.slots.length));
}
