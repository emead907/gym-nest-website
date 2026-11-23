import { CalendarCheck, CreditCard, Receipt, UserPlus } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { GYM, PARENT_PORTAL_URL, PHONE, PHONE_HREF, REGISTER_URL } from "../lib/site";
import { pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "Parent Portal", description: "Log in to The Gym Nest Nampa parent portal to see your classes, pay your balance, register for events and more.", path: "/parent-portal" });

const CAN = [
  { icon: CalendarCheck, text: "See your kids' classes and schedule make-ups" },
  { icon: CreditCard, text: "Pay your balance and update your card" },
  { icon: Receipt, text: "View statements and past payments" },
  { icon: UserPlus, text: "Add a child, a class, Kids Night Out or camp days" },
];

export default function ParentPortal() {
  return (
    <>
      <PageHero eyebrow="For families" title="Parent Portal" intro="Welcome, Gym Nest families! Log in to manage your account." crumbs={[{ name: "Home", path: "/" }, { name: "Parent portal", path: "/parent-portal" }]}>
        <div className="flex flex-wrap gap-3">
          <a href={PARENT_PORTAL_URL} className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark">Log in to the parent portal</a>
          <a href={REGISTER_URL} className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-white">New family? Register</a>
        </div>
      </PageHero>
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-navy">In the portal you can</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {CAN.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-4 rounded-3xl border border-line p-5 font-bold text-ink"><Icon aria-hidden className="h-7 w-7 shrink-0 text-orchid-dark" />{text}</li>
          ))}
        </ul>
        <p className="mt-8 text-muted">Trouble logging in? Call the front desk at <a href={PHONE_HREF} className="font-extrabold text-navy underline">{PHONE}</a> or email <a href={`mailto:${GYM.email}`} className="font-extrabold text-navy underline">{GYM.email}</a>.</p>
      </section>
    </>
  );
}
