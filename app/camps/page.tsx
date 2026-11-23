import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Faq } from "../components/Faq";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { CAMP, PARENT_PORTAL_URL } from "../lib/site";
import { breadcrumbSchema, faqSchema, graph, pageMeta, serviceSchema } from "../lib/seo";

export const metadata = pageMeta({
  title: "Kids Summer Camp in Nampa, ID",
  description: `Themed summer day camp for ages 4–12 at The Gym Nest Nampa: gym time, gymnastics and ninja, crafts and science. Half day ${CAMP.half.replace(" per half day", "")}, full day ${CAMP.full.replace(" per full day", "")}.`,
  path: "/camps",
});

const FAQS = [
  { q: "What ages is summer camp for?", a: "Ages 4–12. Campers must be potty trained." },
  { q: "What should my camper bring?", a: "A sack lunch, two snacks and a water bottle (no glass)." },
  { q: "Can we do half days?", a: "Yes. Half days run 9:00 AM–12:00 PM or 1:00–4:00 PM. Full days run 9:00 AM–4:00 PM." },
];

export default function Camps() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Summer camp", path: "/camps" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs), faqSchema(FAQS), serviceSchema({ name: "Kids Summer Camp in Nampa, ID", description: "Themed summer day camp with gym time, gymnastics and ninja lessons, crafts, science and games.", path: "/camps" }))} />
      <PageHero eyebrow="Summer camp · Ages 4–12" title="Kids Summer Camp in Nampa, Idaho" intro="Open gym, gymnastics and ninja lessons, arts and crafts, science experiments, games and a new theme every week." crumbs={crumbs}>
        <a href={PARENT_PORTAL_URL} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">Sign up in the parent portal</a>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">Weekly themes</h2>
          <ul className="mt-5 divide-y divide-line rounded-3xl border border-line">
            {CAMP.weeks.map(([d, t]) => <li key={d} className="flex justify-between gap-4 px-6 py-3"><span className="font-extrabold text-ink">{t}</span><span className="text-muted">{d}</span></li>)}
          </ul>
        </div>
        <div className="rounded-3xl bg-aqua-tint p-7 lg:self-start">
          <h2 className="font-display text-2xl font-bold text-navy">Times & prices</h2>
          <p className="mt-3 text-ink"><strong>Half day:</strong> 9:00–12:00 or 1:00–4:00 · {CAMP.half}</p>
          <p className="mt-1 text-ink"><strong>Full day:</strong> 9:00–4:00 · {CAMP.full}</p>
          <ul className="mt-4 space-y-2">{CAMP.deals.map((d) => <li key={d} className="flex gap-2 text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{d}</li>)}</ul>
          <p className="mt-4 text-sm text-muted">No refunds. Campers must be potty trained.</p>
        </div>
      </section>
      <Faq faqs={FAQS} />
      <Cta title="Questions about camp?" text="Call us or send a message and we'll help you plan your summer." href="/contact" label="Contact us" />
    </>
  );
}
