import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { PageHero } from "../../components/PageHero";
import { Cta } from "../../components/Cta";
import { JsonLd } from "../../components/JsonLd";
import { SetLocation } from "../../components/LocationProvider";
import { getClasses } from "../../lib/classes";
import { EVENT_TITLES, LOCATIONS, LOCATION_KEYS, PHONE, PHONE_HREF, PROGRAMS, PROGRAM_KEYS, campPath, classesPath, eventPath, otherLocation, programPath, type EventKey, type LocationKey } from "../../lib/site";
import { breadcrumbSchema, graph, locationSchema, pageMeta } from "../../lib/seo";

export const revalidate = 600;
export const dynamicParams = false;
export function generateStaticParams() { return LOCATION_KEYS.map((loc) => ({ loc })); }

export async function generateMetadata({ params }: { params: Promise<{ loc: string }> }): Promise<Metadata> {
  const loc = (await params).loc as LocationKey;
  const l = LOCATIONS[loc];
  if (!l) return {};
  return pageMeta({ title: `Kids Gymnastics & Ninja Gym in ${l.name}, ID`, description: `The Gym Nest ${l.name}, ${l.street}: kids gymnastics, ninja, tumbling, cheer, preschool, open play and birthday parties for families in ${l.serves.join(", ")}.`, path: `/locations/${loc}` });
}

export default async function LocationPage({ params }: { params: Promise<{ loc: string }> }) {
  const loc = (await params).loc as LocationKey;
  const l = LOCATIONS[loc];
  if (!l) notFound();
  const { classes } = await getClasses();
  const here = classes.filter((c) => c.location === loc);
  const open = here.reduce((n, c) => n + (c.openings ?? 0), 0);
  const crumbs = [{ name: "Home", path: "/" }, { name: `The Gym Nest ${l.name}`, path: `/locations/${loc}` }];
  return (
    <>
      <SetLocation location={loc} />
      <JsonLd data={graph(breadcrumbSchema(crumbs), locationSchema(loc))} />
      <PageHero eyebrow={`${l.city}, Idaho`} title={`The Gym Nest ${l.name}`} intro={`Kids gymnastics, ninja, tumbling, cheer, preschool and parties at ${l.street}, ${l.city}. Families come from ${l.serves.join(", ")}.`} crumbs={crumbs}>
        <div className="flex flex-wrap gap-3">
          <Link href={classesPath(loc)} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">{open} open spots in {l.name} classes</Link>
          <a href={l.mapsUrl} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-navy px-6 font-extrabold text-navy hover:bg-white"><MapPin aria-hidden className="h-5 w-5" />Directions</a>
          <a href={PHONE_HREF} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-navy px-6 font-extrabold text-navy hover:bg-white"><Phone aria-hidden className="h-5 w-5" />{PHONE}</a>
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">Classes in {l.name}</h2>
          <ul className="mt-4 space-y-3">
            {PROGRAM_KEYS.map((p) => (
              <li key={p}><Link href={programPath(p, loc)} className="block rounded-2xl border border-line p-4 hover:border-navy"><span className="font-display text-xl font-semibold text-navy">{l.name} {PROGRAMS[p].title}</span><span className="block text-muted">{PROGRAMS[p].tagline}</span></Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">Events & more</h2>
          <ul className="mt-4 space-y-3">
            {(Object.keys(EVENT_TITLES) as EventKey[]).map((e) => (
              <li key={e}><Link href={eventPath(e, loc)} className="block rounded-2xl border border-line p-4 hover:border-navy"><span className="font-display text-xl font-semibold text-navy">{l.name} {EVENT_TITLES[e].title}</span><span className="block text-muted">{EVENT_TITLES[e].blurb}</span></Link></li>
            ))}
            <li><Link href={campPath(loc)} className="block rounded-2xl border border-line p-4 hover:border-navy"><span className="font-display text-xl font-semibold text-navy">{l.name} Summer Camp</span><span className="block text-muted">Themed weeks for ages 4–12.</span></Link></li>
            <li><Link href={`/preschool#${loc}`} className="block rounded-2xl border border-line p-4 hover:border-navy"><span className="font-display text-xl font-semibold text-navy">{l.name} Preschool</span><span className="block text-muted">Ages 3–5 with weekly gymnastics.</span></Link></li>
          </ul>
          <p className="mt-6 text-muted">Closer to {LOCATIONS[otherLocation(loc)].name}? <Link href={`/locations/${otherLocation(loc)}`} className="font-extrabold text-navy underline">Visit The Gym Nest {LOCATIONS[otherLocation(loc)].name}</Link>.</p>
        </div>
      </section>
      <Cta />
    </>
  );
}
