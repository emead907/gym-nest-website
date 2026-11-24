import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { GYM, PHONE, PHONE_HREF, POLICIES } from "../lib/site";
import { pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Policies", description: "How the no-risk first day works, plus registration fee, billing, cancellation and make-up class policies at The Gym Nest in Nampa, Idaho.", path: "/policies" });

const NO_RISK_STEPS = [
  { title: "Enroll in a class", text: "Request info or enroll online for the class and time that fits your family." },
  { title: "Come to your first class", text: "Your child tries the class with a coach, and you get to see how they like it." },
  { title: "Not the right fit? Let us know within 24 hours", text: `Call ${PHONE} or email ${GYM.email} within 24 hours of that first class and you won't be charged.` },
  { title: "Loved it? You're all set", text: "If we don't hear from you, the membership continues and tuition bills automatically on the 1st of each month." },
];

export default function Policies() {
  return (
    <>
      <PageHero eyebrow="Families" title="Policies" intro="Simple, month-to-month memberships, starting with a no-risk first day." crumbs={[{ name: "Home", path: "/" }, { name: "Policies", path: "/policies" }]} />

      <section id="no-risk-first-day" className="mx-auto max-w-3xl scroll-mt-32 px-4 pt-14 sm:px-6">
        <div className="rounded-3xl bg-aqua-tint p-7 sm:p-9">
          <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">Every new student</p>
          <h2 className="mt-1 font-display text-3xl font-bold text-navy sm:text-4xl">How the no-risk first day works</h2>
          <p className="mt-3 text-lg text-ink">Trying something new should be easy. Every new student gets a no-risk first day, so you can see if a class is the right fit before you pay for it.</p>
          <ol className="mt-6 space-y-4">
            {NO_RISK_STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">{i + 1}</span>
                <div>
                  <p className="font-extrabold text-navy">{s.title}</p>
                  <p className="text-ink">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <a href={PHONE_HREF} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-navy px-6 font-extrabold text-white hover:bg-navy-dark">Questions? Call {PHONE}</a>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">Billing & membership</h2>
        <ul className="mt-6 space-y-4">{POLICIES.map((p) => <li key={p} className="flex gap-3 text-lg text-ink"><Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-orchid-dark" />{p}</li>)}</ul>
        <p className="mt-8 text-muted">Classes meet once a week. Make-up classes are for active members and must be used within 30 days; they don&rsquo;t carry over if you unenroll. See every class&rsquo;s monthly tuition on our <Link href="/pricing" className="font-extrabold text-navy underline">pricing page</Link>.</p>
      </section>
      <Cta />
    </>
  );
}
