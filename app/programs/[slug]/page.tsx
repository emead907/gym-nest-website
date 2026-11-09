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
import { Schedule } from "../../components/Schedule";
import { getClasses } from "../../lib/classes";
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
    return pageMeta({ title: `${p.seoTitle} in Nampa & Eagle, ID`, description: `${p.tagline} Classes at The Gym Nest in Nampa and Eagle, Idaho. First class free.`, path: programPath(p.key) });
  }
  const l = LOCATIONS[parsed.loc];
  return pageMeta({
    title: `${p.seoTitle} in ${l.name}, ID`,
    description: `${p.tagline} At The Gym Nest ${l.name}, ${l.street}. Serving ${l.serves.slice(0, 4).join(", ")} and nearby. First class free. See live open spots.`,
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
    { q: "How much are classes?", a: `Tuition is billed monthly and varies by class. Call ${PHONE} for current ${l.name} rates. New families pay a one-time $50 registration fee, and the first class is free.` },
  ];

  return (
    <>
      <SetLocation location={loc} />
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), serviceSchema({ name: `${p.seoTitle} in ${l.name}, ID`, description: p.intro, path, loc }))} />
      <PageHero eyebrow={`The Gym Nest ${l.name}`} title={`${p.seoTitle} in ${l.name}, Idaho`} intro={p.tagline} crumbs={crumbs}>
        <div className="flex flex-wrap gap-3">
          <Link href={classesPath(loc, p.finder)} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">See open spots in {l.name}</Link>
          <Link href={programPath(p.key, otherLocation(loc))} className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-white">Switch to {LOCATIONS[otherLocation(loc)].name}</Link>
        </div>
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-ink">{p.intro}</p>
      </section>
      <ClassList program={p.key} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">{l.name} {p.title.toLowerCase()} schedule</h2>
        <p className="mt-2 text-muted">Current classes at {l.street}, {l.city}.</p>
        <div className="mt-6"><Schedule classes={here} location={loc} program={p.finder} /></div>
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
      <Cta title={`Try ${p.title.toLowerCase()} in ${l.name}, free.`} href={classesPath(loc, p.finder)} />
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
