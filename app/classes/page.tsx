import { Suspense } from "react";
import { PageHero } from "../components/PageHero";
import { ClassFinder } from "../components/ClassFinder";
import { JsonLd } from "../components/JsonLd";
import { Cta } from "../components/Cta";
import { getClasses } from "../lib/classes";
import { LOCATIONS, SITE_URL } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const revalidate = 600;

export const metadata = pageMeta({
  title: "Find a Class: Kids Gymnastics, Ninja & Cheer Schedule (Nampa & Eagle)",
  description: "See every kids gymnastics, ninja, tumbling and cheer class at The Gym Nest in Nampa and Eagle, Idaho, with live open spots. Filter by age and day, then request a free first class.",
  path: "/classes",
});

export default async function ClassesPage() {
  const { classes, live } = await getClasses();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Find a class", path: "/classes" }];
  // Each class as a schema.org Course offering, so search engines see the real schedule.
  const courses = classes.slice(0, 120).map((c) => ({
    "@type": "Course",
    name: `${c.name} (${LOCATIONS[c.location].name})`,
    description: `Kids ${c.program.toLowerCase()} class for ages ${c.ages} at The Gym Nest ${LOCATIONS[c.location].name}.`,
    provider: { "@id": `${SITE_URL}/#${c.location}` },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", courseSchedule: { "@type": "Schedule", byDay: c.days.map((d) => `https://schema.org/${{ Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" }[d] ?? d}`), repeatFrequency: "P1W" }, location: { "@id": `${SITE_URL}/#${c.location}` } },
  }));
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), { "@type": "ItemList", name: "Kids classes at The Gym Nest", itemListElement: courses.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })) })} />
      <PageHero eyebrow="Class finder" title="What works for your family?" intro="Pick your gym, your child's age and the days that work. You'll see real open spots and can request a free first class or register right here." crumbs={crumbs} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Suspense fallback={<p className="text-muted">Loading classes…</p>}>
          <ClassFinder classes={classes} live={live} />
        </Suspense>
      </section>
      <Cta title="Not sure which class fits?" text="Call us and we'll help you pick the right class for your child's age and experience." href="/contact" label="Contact us" />
    </>
  );
}
