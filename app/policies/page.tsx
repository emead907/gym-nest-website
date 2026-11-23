import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { POLICIES } from "../lib/site";
import { pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Policies", description: "Registration fee, billing, cancellation and make-up class policies at The Gym Nest in Nampa, Idaho.", path: "/policies" });

export default function Policies() {
  return (
    <>
      <PageHero eyebrow="Families" title="Policies" intro="Simple, month-to-month memberships." crumbs={[{ name: "Home", path: "/" }, { name: "Policies", path: "/policies" }]} />
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ul className="space-y-4">{POLICIES.map((p) => <li key={p} className="flex gap-3 text-lg text-ink"><Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-orchid-dark" />{p}</li>)}</ul>
        <p className="mt-8 text-muted">Classes meet once a week. Make-up classes are for active members and must be used within 30 days; they don&rsquo;t carry over if you unenroll. See every class&rsquo;s monthly tuition on our <Link href="/pricing" className="font-extrabold text-navy underline">pricing page</Link>.</p>
      </section>
      <Cta />
    </>
  );
}
