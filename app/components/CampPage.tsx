import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "./PageHero";
import { Faq } from "./Faq";
import { Cta } from "./Cta";
import { JsonLd } from "./JsonLd";
import { SetLocation } from "./LocationProvider";
import { CAMPS, LOCATIONS, PARENT_PORTAL_URL, campPath, otherLocation, type LocationKey } from "../lib/site";
import { breadcrumbSchema, faqSchema, graph, serviceSchema } from "../lib/seo";

export function CampPage({ loc }: { loc: LocationKey }) {
  const l = LOCATIONS[loc];
  const c = CAMPS[loc];
  const path = campPath(loc);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Camps", path: "/camps" }, { name: `${l.name} Summer Camp`, path }];
  const faqs = [
    { q: "What ages is summer camp for?", a: "Ages 4–12. Campers must be potty trained." },
    { q: "What should my camper bring?", a: "A sack lunch, two snacks and a water bottle (no glass)." },
    { q: "Can we do half days?", a: "Yes. Half days run 9:00 AM–12:00 PM or 1:00–4:00 PM. Full days run 9:00 AM–4:00 PM." },
  ];
  return (
    <>
      <SetLocation location={loc} />
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(faqs), serviceSchema({ name: `Kids Summer Camp in ${l.name}, ID`, description: "Themed summer day camp with gym time, gymnastics and ninja lessons, crafts, science and games.", path, loc }))} />
      <PageHero eyebrow={`The Gym Nest ${l.name}`} title={`Kids Summer Camp in ${l.name}, Idaho`} intro="Open gym, gymnastics and ninja lessons, arts and crafts, science experiments, games and a new theme every week. Ages 4–12." crumbs={crumbs}>
        <div className="flex flex-wrap gap-3">
          <a href={PARENT_PORTAL_URL} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">Sign up in the parent portal</a>
          <Link href={campPath(otherLocation(loc))} className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-white">Switch to {LOCATIONS[otherLocation(loc)].name}</Link>
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">Weekly themes</h2>
          <ul className="mt-5 divide-y divide-line rounded-3xl border border-line">
            {c.weeks.map(([d, t]) => <li key={d} className="flex justify-between gap-4 px-6 py-3"><span className="font-extrabold text-ink">{t}</span><span className="text-muted">{d}</span></li>)}
          </ul>
        </div>
        <div className="space-y-5">
          <div className="rounded-3xl bg-aqua-tint p-7">
            <h2 className="font-display text-2xl font-bold text-navy">Times & prices</h2>
            <p className="mt-3 text-ink"><strong>Half day:</strong> 9:00–12:00 or 1:00–4:00 · {c.half}</p>
            <p className="mt-1 text-ink"><strong>Full day:</strong> 9:00–4:00 · {c.full}</p>
            <ul className="mt-4 space-y-2">{c.deals.map((d) => <li key={d} className="flex gap-2 text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{d}</li>)}</ul>
            <p className="mt-4 text-sm text-muted">No refunds. Campers must be potty trained.</p>
          </div>
        </div>
      </section>
      <Faq faqs={faqs} />
      <Cta title="Questions about camp?" text="Call us or schedule a tour of the gym." href="/contact" label="Contact us" />
    </>
  );
}
