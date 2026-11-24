import { Suspense } from "react";
import { PageHero } from "../components/PageHero";
import { ClassFinder } from "../components/ClassFinder";
import { JsonLd } from "../components/JsonLd";
import { Cta } from "../components/Cta";
import { NoRiskLink } from "../components/NoRiskLink";
import { getClasses } from "../lib/classes";
import { breadcrumbSchema, graph, pageMeta, providerRef } from "../lib/seo";

export const revalidate = 600;

export const metadata = pageMeta({
  title: "Find a Class: Kids Gymnastics, Ninja & Cheer Schedule in Nampa",
  description: "See every kids gymnastics, ninja, tumbling and cheer class at The Gym Nest in Nampa, Idaho, with live times and monthly tuition. Filter by age and day, then enroll with a no-risk first day.",
  path: "/classes",
});

const DAY_NAMES: Record<string, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

export default async function ClassesPage() {
  const { classes, live } = await getClasses();
  const crumbs = [{ name: "Home", path: "/" }, { name: "Find a class", path: "/classes" }];
  // Each class as a schema.org Course offering, so search engines see the real schedule and price.
  const courses = classes.map((c) => ({
    "@type": "Course",
    name: c.name,
    description: `Kids ${c.program.toLowerCase()} class for ages ${c.ages} at The Gym Nest Nampa.`,
    provider: providerRef,
    ...(c.tuition != null ? { offers: { "@type": "Offer", category: "Monthly tuition", price: c.tuition, priceCurrency: "USD" } } : {}),
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", courseSchedule: { "@type": "Schedule", byDay: c.days.map((d) => `https://schema.org/${DAY_NAMES[d] ?? d}`), repeatFrequency: "P1W" }, location: providerRef },
  }));
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), { "@type": "ItemList", name: "Kids classes at The Gym Nest Nampa", itemListElement: courses.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })) })} />
      <PageHero eyebrow="Class finder" title="What works for your family?" intro={<>Pick your child&rsquo;s age and the days that work. You&rsquo;ll see real class times and monthly prices, and can request or enroll right here with a <NoRiskLink className="text-navy" />.</>} crumbs={crumbs} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Suspense fallback={<p className="text-muted">Loading classes…</p>}>
          <ClassFinder classes={classes} live={live} />
        </Suspense>
      </section>
      <Cta title="Not sure which class fits?" text="Call or message us and we'll help you pick the right class for your child's age and experience." href="/contact" label="Contact us" />
    </>
  );
}
