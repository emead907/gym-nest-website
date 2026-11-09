import Link from "next/link";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { LOCATIONS, LOCATION_KEYS, PROGRAMS, PROGRAM_KEYS, programPath } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Kids Programs: Gymnastics, Ninja, Tumbling, Cheer & Homeschool", description: "Every program at The Gym Nest in Nampa and Eagle, Idaho: toddler and kids gymnastics, ninja, tumbling, Supernova cheer and homeschool classes.", path: "/programs" });

export default function Programs() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Programs", path: "/programs" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Programs" title="Kids programs in Nampa & Eagle" intro="Gymnastics, ninja, tumbling, cheer and homeschool classes for boys and girls 18 months and up." crumbs={crumbs} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        {PROGRAM_KEYS.map((k) => {
          const p = PROGRAMS[k];
          return (
            <article key={k} className="rounded-3xl border border-line p-7">
              <h2 className="font-display text-3xl font-semibold text-navy"><Link href={programPath(k)} className="hover:underline">{p.title}</Link></h2>
              <p className="mt-2 text-ink">{p.tagline}</p>
              <p className="mt-3 text-sm text-muted">{p.classes.filter((c) => !c.invite).map((c) => `${c.name} (${c.ages})`).join(" · ")}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {LOCATION_KEYS.map((l) => (
                  <Link key={l} href={programPath(k, l)} className="inline-flex min-h-11 items-center rounded-full bg-aqua-tint px-5 font-extrabold text-navy hover:bg-navy hover:text-white">{LOCATIONS[l].name} {p.title.toLowerCase()}</Link>
                ))}
              </div>
            </article>
          );
        })}
      </section>
      <Cta />
    </>
  );
}
