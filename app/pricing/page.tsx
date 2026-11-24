import Link from "next/link";
import { Check } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { NoRiskLink } from "../components/NoRiskLink";
import { getClasses, getPasses, type SiteClass } from "../lib/classes";
import { CAMP, COMMITMENT, KNO, OPEN_PLAY, commitmentPrice, PARTY, POLICIES, PRESCHOOL, PROGRAMS, PROGRAM_KEYS, REGISTRATION_FEE, programPath } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const revalidate = 600;

export const metadata = pageMeta({
  title: "Pricing & Fees",
  description: `Monthly class tuition, the ${REGISTRATION_FEE} registration fee, and prices for parties, open play, Kids Night Out, camp and preschool at The Gym Nest Nampa.`,
  path: "/pricing",
});

/** One row per class name: "$88" or "$88–$106" a month. */
function tuitionRows(classes: SiteClass[]) {
  const by = new Map<string, { name: string; ages: string; program: string; prices: Set<number> }>();
  for (const c of classes) {
    if (c.tuition == null) continue;
    const row = by.get(c.name) ?? { name: c.name, ages: c.ages, program: c.program, prices: new Set<number>() };
    row.prices.add(c.tuition);
    by.set(c.name, row);
  }
  return [...by.values()].map((r) => {
    const p = [...r.prices].sort((a, b) => a - b);
    const committed = [...new Set(p.map(commitmentPrice).filter((x): x is number => x != null))];
    return { ...r, price: p.length === 1 ? `$${p[0]}` : `$${p[0]}–$${p[p.length - 1]}`, low: p[0], committed: committed.length === 1 ? committed[0] : null };
  });
}

export default async function Pricing() {
  const [{ classes, live }, passes] = await Promise.all([getClasses(), getPasses()]);
  const rows = tuitionRows(classes);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Pricing", path: "/pricing" }];
  const programOrder = PROGRAM_KEYS.map((k) => PROGRAMS[k].finder) as string[];
  const groups = programOrder
    .map((finder) => ({ finder, key: PROGRAM_KEYS.find((k) => PROGRAMS[k].finder === finder)!, rows: rows.filter((r) => r.program === finder).sort((a, b) => a.low - b.low) }))
    .filter((g) => g.rows.length);

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="Tuition" title="Pricing & fees" intro="Straightforward monthly tuition, a one-time registration fee, and no long contracts. Class prices on this page come straight from our registration system." crumbs={crumbs} />

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl bg-aqua-tint p-6">
            <p className="font-display text-4xl font-bold text-navy">{REGISTRATION_FEE}</p>
            <p className="mt-1 font-bold text-muted">One-time registration fee for new families</p>
          </div>
          <div className="rounded-3xl bg-orchid-tint p-6">
            <p className="font-display text-4xl font-bold text-navy">Monthly</p>
            <p className="mt-1 font-bold text-muted">Tuition bills on the 1st. Month to month.</p>
          </div>
          <div className="rounded-3xl bg-aqua-tint p-6">
            <p className="font-display text-4xl font-bold text-navy">$0 risk</p>
            <p className="mt-1 font-bold text-muted">Not the right fit? Tell us within 24 hours of the first class.</p>
            <NoRiskLink className="mt-2 inline-block text-sm font-extrabold text-navy">How the no-risk first day works →</NoRiskLink>
          </div>
        </div>

        <h2 className="mt-14 font-display text-3xl font-bold text-navy">Class tuition</h2>
        <p className="mt-1 text-muted">Per child, per month, for one class a week.{!live && " Prices are from our most recent schedule."}</p>
        <p className="mt-4 rounded-2xl bg-orchid-tint px-5 py-4 font-bold text-ink">
          Save with a {COMMITMENT.months}-month commitment: {Object.entries(COMMITMENT.prices).map(([from, to]) => `$${from} one-hour classes are $${to}/month`).join(", ")}.
        </p>
        <div className="mt-6 space-y-6">
          {groups.map((g) => (
            <div key={g.finder} className="overflow-hidden rounded-3xl border border-line">
              <div className="flex items-center justify-between gap-3 bg-[#f6f7fb] px-6 py-3">
                <h3 className="font-display text-xl font-semibold text-navy">{PROGRAMS[g.key].title}</h3>
                <Link href={programPath(g.key)} className="text-sm font-extrabold text-navy underline-offset-4 hover:underline">See times →</Link>
              </div>
              <ul className="divide-y divide-line">
                {g.rows.map((r) => (
                  <li key={r.name} className="flex items-center justify-between gap-4 px-6 py-3">
                    <span><span className="font-extrabold text-ink">{r.name}</span> <span className="text-sm text-muted">· {r.ages}</span></span>
                    <span className="shrink-0 text-right">
                      <span className="font-display text-xl font-semibold text-navy">{r.price}<span className="text-sm font-bold text-muted">/mo</span></span>
                      {r.committed != null && <span className="block text-xs font-extrabold text-orchid-dark">${r.committed}/mo with {COMMITMENT.months}-month commitment</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className="text-sm text-muted">Intermediate, Advanced and team classes are placed by coaches; ask the front desk for those rates.</p>
        </div>

        <h2 className="mt-14 font-display text-3xl font-bold text-navy">Events, camps & preschool</h2>
        <dl className="mt-6 divide-y divide-line rounded-3xl border border-line">
          {[
            ["Open play", `${OPEN_PLAY.price} drop-in · ${OPEN_PLAY.pass}${passes.filter((p) => /open play/i.test(p.name)).map((p) => ` · Monthly pass $${p.tuition}`).join("")}`, "/events/open-play"],
            ["Kids Night Out", `${KNO.price} · ${KNO.time}`, "/events/kids-night-out"],
            ["Birthday parties", PARTY.price, "/events/birthday-parties"],
            ["Summer camp", `${CAMP.half} · ${CAMP.full}`, "/camps"],
            ...PRESCHOOL.options.map((o) => [`Preschool ${o.label} (${o.ages})`, o.price, "/preschool"]),
          ].map(([k, v, href]) => (
            <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[14rem_1fr_auto] sm:items-center">
              <dt className="font-extrabold text-navy">{k}</dt>
              <dd className="text-ink">{v}</dd>
              <Link href={href} className="text-sm font-extrabold text-navy underline-offset-4 hover:underline">Details →</Link>
            </div>
          ))}
        </dl>

        <h2 className="mt-14 font-display text-3xl font-bold text-navy">Billing policies</h2>
        <ul className="mt-4 space-y-3">{POLICIES.map((p) => <li key={p} className="flex gap-3 text-ink"><Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-orchid-dark" />{p}</li>)}</ul>
      </section>
      <Cta />
    </>
  );
}
