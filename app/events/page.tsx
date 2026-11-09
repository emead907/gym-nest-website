import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { EVENT_TITLES, LOCATIONS, LOCATION_KEYS, campPath, eventPath, type EventKey } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Birthday Parties, Open Play, Kids Night Out & Camps", description: "Kids birthday parties, drop-in open play, Kids Night Out and summer camps at The Gym Nest in Nampa and Eagle, Idaho.", path: "/events" });

export default function Events() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Events", path: "/events" }];
  const items = [...(Object.keys(EVENT_TITLES) as EventKey[]).map((e) => ({ title: EVENT_TITLES[e].title, blurb: EVENT_TITLES[e].blurb, href: (l: "nampa" | "eagle") => eventPath(e, l) })), { title: "Summer Camp", blurb: "Themed weeks of gym time, crafts, science and games for ages 4–12.", href: (l: "nampa" | "eagle") => campPath(l) }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Events" title="Parties, open play & more" intro="Fun at the Nest beyond weekly classes." crumbs={crumbs} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        {items.map((it) => (
          <article key={it.title} className="rounded-3xl border border-line p-7">
            <h2 className="font-display text-3xl font-semibold text-navy">{it.title}</h2>
            <p className="mt-2 text-ink">{it.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {LOCATION_KEYS.map((l) => <Link key={l} href={it.href(l)} className="inline-flex min-h-11 items-center rounded-full bg-orchid-tint px-5 font-extrabold text-navy hover:bg-navy hover:text-white">{LOCATIONS[l].name}</Link>)}
            </div>
          </article>
        ))}
      </section>
      <Cta />
    </>
  );
}
