import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { MessageForm } from "../components/MessageForm";
import { pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Careers: Coaching & Gym Jobs in Nampa", description: "Work at The Gym Nest Nampa: gymnastics and ninja coaches, preschool teachers, front desk and event staff. Apply online.", path: "/careers" });

const ROLES = [
  { title: "Gymnastics & ninja coaches", text: "Teach recreational classes for kids 18 months to 12 years. Gymnastics, cheer or coaching experience is a plus." },
  { title: "Preschool teachers", text: "Lead a small class of 3–5 year olds through kindergarten readiness, with gym time every week." },
  { title: "Front desk", text: "Be the friendly face families see first: check-ins, questions, enrollments and parties." },
  { title: "Camp, party & Kids Night Out staff", text: "Run games and obstacle courses at parties, Kids Night Out and summer camp." },
];

export default function Careers() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Love working with kids? Join the Nest." intro="We're always looking for positive, energetic people to coach, teach and help families at our Nampa gym." crumbs={[{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }]} />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy">Roles we hire for</h2>
          <ul className="mt-6 space-y-4">
            {ROLES.map((r) => (
              <li key={r.title} className="rounded-3xl border border-line p-6">
                <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-navy"><Check aria-hidden className="h-5 w-5 text-orchid-dark" />{r.title}</h3>
                <p className="mt-1 text-ink">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-aqua-tint p-6 sm:p-8">
          <h2 className="font-display text-3xl font-bold text-navy">Apply</h2>
          <p className="mb-6 mt-1 text-muted">Tell us a little about yourself and we&rsquo;ll be in touch.</p>
          <MessageForm kind="job" />
        </div>
      </section>
    </>
  );
}
