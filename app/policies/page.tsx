import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { PHONE, POLICIES } from "../lib/site";
import { pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Tuition & Policies", description: "Tuition, registration fee, cancellation and make-up class policies at The Gym Nest in Nampa and Eagle, Idaho.", path: "/policies" });

export default function Policies() {
  return (
    <>
      <PageHero eyebrow="Families" title="Tuition & policies" intro="Simple, month-to-month memberships." crumbs={[{ name: "Home", path: "/" }, { name: "Policies", path: "/policies" }]} />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ul className="space-y-4">{POLICIES.map((p) => <li key={p} className="flex gap-3 text-lg text-ink"><Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-orchid-dark" />{p}</li>)}</ul>
        <p className="mt-8 text-muted">Classes meet once a week. Tuition varies by class and location. Call {PHONE} for current rates. Make-up classes are for active members and must be used within 30 days; they don&rsquo;t carry over if you unenroll.</p>
      </section>
      <Cta />
    </>
  );
}
