import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { EVENT_TITLES, eventPath, type EventKey } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Birthday Parties, Open Play, Kids Night Out & Camps", description: "Kids birthday parties, drop-in open play, Kids Night Out and summer camp at The Gym Nest in Nampa, Idaho.", path: "/events" });

export default function Events() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Events", path: "/events" }];
  const items = [
    ...(Object.keys(EVENT_TITLES) as EventKey[]).map((e) => ({ title: EVENT_TITLES[e].title, blurb: EVENT_TITLES[e].blurb, href: eventPath(e) })),
    { title: "Summer Camp", blurb: "Themed weeks of gym time, crafts, science and games for ages 4–12.", href: "/camps" },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Events" title="Parties, open play & more" intro="Fun at the Nest beyond weekly classes." crumbs={crumbs} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        {items.map((it) => (
          <Link key={it.title} href={it.href} className="group rounded-3xl border border-line p-7 transition hover:border-navy hover:shadow-lg">
            <h2 className="font-display text-3xl font-semibold text-navy">{it.title}</h2>
            <p className="mt-2 text-ink">{it.blurb}</p>
            <span className="mt-5 inline-block font-extrabold text-navy group-hover:underline">Details →</span>
          </Link>
        ))}
      </section>
      <Cta />
    </>
  );
}
