"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, DollarSign, UserRound, X } from "lucide-react";
import type { AgeBand, FinderProgram, SiteClass } from "../lib/classes";
import { COMMITMENT, REGISTRATION_FEE, commitmentPrice } from "../lib/site";
import { TrialForm } from "./TrialForm";
import { NoRiskLink } from "./NoRiskLink";

const AGES: { key: AgeBand | "all"; label: string; hint?: string }[] = [
  { key: "all", label: "Any" },
  { key: "tot", label: "18–36 mo", hint: "with a parent" },
  { key: "3", label: "3" },
  { key: "45", label: "4–5" },
  { key: "612", label: "6–12" },
];
const PROGRAMS: (FinderProgram | "All")[] = ["All", "Gymnastics", "Ninja", "Tumbling", "Cheer", "Homeschool"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL: Record<string, string> = { Mon: "Mondays", Tue: "Tuesdays", Wed: "Wednesdays", Thu: "Thursdays", Fri: "Fridays", Sat: "Saturdays", Sun: "Sundays" };

const mins = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  return ((Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m[2]);
};
export const when = (c: SiteClass) => {
  const days = c.days.length === 1 ? DAY_FULL[c.days[0]] ?? c.days[0] : c.days.join(" & ");
  const sameHalf = c.start.slice(-2) === c.end.slice(-2);
  return `${days} · ${sameHalf ? c.start.slice(0, -3) : c.start}–${c.end}`.replace(/ (AM|PM)/g, (m) => m.trim().toLowerCase()).replace(/\s+/g, " ");
};

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-11 rounded-full border-2 px-4 text-sm font-extrabold transition ${on ? "border-navy bg-navy text-white" : "border-white bg-white text-navy shadow-[0_0_0_1px_#cbeaea] hover:border-aqua"}`}
    >
      {children}
    </button>
  );
}

/** Only speaks up when a class is full or almost full (1–2 spots left). */
function Spots({ c }: { c: SiteClass }) {
  if (c.openings == null || c.openings > 2) return null;
  const full = c.openings === 0;
  return (
    <p className={`mt-4 rounded-xl px-3 py-2 text-sm font-extrabold ${full ? "bg-[#fff4ee] text-full" : "bg-[#fff8e6] text-amber"}`}>
      {full ? "Full – join the waitlist" : c.openings === 1 ? "Only 1 spot left!" : "Only 2 spots left!"}
    </p>
  );
}

export function ClassFinder({ classes, live }: { classes: SiteClass[]; live: boolean }) {
  const params = useSearchParams();
  // ?program=Ninja from links around the site
  const [program, setProgramRaw] = useState<FinderProgram | "All">(() => {
    const p = params.get("program");
    return p && (PROGRAMS as string[]).includes(p) ? (p as FinderProgram) : "All";
  });
  // ?age=45 from the home page age buttons
  const [age, setAgeRaw] = useState<AgeBand | "all">(() => {
    const a = params.get("age");
    return AGES.some((x) => x.key === a) ? (a as AgeBand) : "all";
  });
  const [day, setDayRaw] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  // Changing a filter closes any open request form.
  const setProgram = (p: FinderProgram | "All") => { setProgramRaw(p); setOpen(null); };
  const setAge = (a: AgeBand | "all") => { setAgeRaw(a); setOpen(null); };
  const setDay = (d: string) => { setDayRaw(d); setOpen(null); };

  const results = useMemo(
    () =>
      classes
        .filter((c) => (age === "all" || c.bands.includes(age)) && (program === "All" || c.program === program) && (day === "all" || c.days.includes(day)))
        .sort((a, b) => DAYS.indexOf(a.days[0]) - DAYS.indexOf(b.days[0]) || mins(a.start) - mins(b.start) || a.name.localeCompare(b.name)),
    [classes, age, program, day],
  );
  const filtered = age !== "all" || program !== "All" || day !== "all";

  return (
    <div>
      <div className="divide-y divide-line rounded-3xl border border-line bg-aqua-tint px-5 sm:px-7">
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
          <div className="w-40 shrink-0">
            <p className="font-extrabold text-ink">Child&rsquo;s age</p>
            <p className="text-xs text-muted">18–36 mo classes are with a parent</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {AGES.map((a) => (
              <Pill key={a.key} on={age === a.key} onClick={() => setAge(a.key)}>
                {a.label}{a.hint && <span className="ml-1 text-[11px] font-bold opacity-80">{a.hint}</span>}
              </Pill>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
          <p className="w-40 shrink-0 font-extrabold text-ink">Program</p>
          <div className="flex flex-wrap gap-2">
            {PROGRAMS.map((p) => <Pill key={p} on={program === p} onClick={() => setProgram(p)}>{p}</Pill>)}
          </div>
        </div>
        <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
          <p className="w-40 shrink-0 font-extrabold text-ink">Day</p>
          <div className="flex flex-wrap gap-2">
            <Pill on={day === "all"} onClick={() => setDay("all")}>Any</Pill>
            {DAYS.map((d) => <Pill key={d} on={day === d} onClick={() => setDay(d)}>{d}</Pill>)}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-3xl font-bold text-navy" aria-live="polite">
          {results.length === 1 ? "1 class to explore" : `${results.length} classes to explore`}
        </h2>
        {filtered && (
          <button type="button" onClick={() => { setAge("all"); setProgram("All"); setDay("all"); }} className="min-h-11 border-b-2 border-navy font-extrabold text-navy">
            Clear filters
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">
        Every new student starts with a <NoRiskLink className="font-bold text-navy" />. Tuition is monthly, plus a one-time {REGISTRATION_FEE} registration fee for new families.{" "}
        {live ? "Times and prices update live from our schedule." : "Times and prices are updated throughout the day."}
      </p>

      {results.length === 0 && (
        <div className="mt-6 rounded-3xl bg-orchid-tint p-8 text-center">
          <p className="text-lg font-extrabold text-ink">No classes match those filters.</p>
          <p className="mt-2 text-muted">Try another day or program, or call us and we&rsquo;ll help you find a fit.</p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => {
          const isOpen = open === c.id;
          const full = c.openings === 0;
          return (
            <FinderCard key={c.id} c={c} isOpen={isOpen} full={full} onRequest={() => setOpen(c.id)}>
              {isOpen && (
                <div className="col-span-full rounded-3xl bg-navy p-6 text-white sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-widest text-aqua">{full ? "Join the waitlist" : "Request info"}</p>
                      <h3 className="mt-2 font-display text-3xl font-semibold">{c.name}</h3>
                      <p className="mt-1 text-[#dcddf6]">{when(c)} · {c.ages}</p>
                    </div>
                    <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 hover:bg-white/10"><X aria-hidden className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-6 max-w-3xl">
                    <TrialForm tone="dark" req={{ classId: c.id, className: c.name, requestedTime: when(c), mode: full ? "waitlist" : "trial", source: "class-finder", regLink: c.regLink }} />
                  </div>
                </div>
              )}
            </FinderCard>
          );
        })}
      </div>
    </div>
  );
}

function FinderCard({ c, isOpen, full, onRequest, children }: { c: SiteClass; isOpen: boolean; full: boolean; onRequest: () => void; children: React.ReactNode }) {
  return (
    <>
      <article className={`flex flex-col rounded-3xl border-2 bg-white p-6 transition ${isOpen ? "border-navy shadow-lg" : "border-line"}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-aqua-tint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-navy">{c.program}</span>
          {c.tuition != null && <span className="rounded-full bg-orchid-tint px-3 py-1 text-xs font-extrabold text-orchid-dark">${c.tuition}/month</span>}
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-navy">{c.name}</h3>
        <p className="text-muted">Ages {c.ages}{c.parentAndMe ? " · Parent & me" : ""}</p>
        <div className="my-4 border-t border-line" />
        <p className="flex items-center gap-2 font-bold text-ink"><CalendarDays aria-hidden className="h-4 w-4 text-navy" />{when(c)}</p>
        <p className="mt-1.5 flex items-center gap-2 text-muted"><UserRound aria-hidden className="h-4 w-4" />{c.coach ? `Coach ${c.coach}` : "Coach to be announced"}</p>
        {c.tuition != null && <p className="mt-1.5 flex items-center gap-2 text-muted"><DollarSign aria-hidden className="h-4 w-4" />${c.tuition} a month, billed monthly</p>}
        {commitmentPrice(c.tuition) != null && (
          <p className="mt-1.5 rounded-xl bg-aqua-tint px-3 py-2 text-sm font-bold text-navy">Save: ${commitmentPrice(c.tuition)}/month with a {COMMITMENT.months}-month commitment</p>
        )}
        <Spots c={c} />
        <div className="mt-auto pt-5">
          {full ? (
            <button type="button" onClick={onRequest} className="min-h-12 w-full rounded-full border-2 border-navy font-extrabold text-navy hover:bg-aqua-tint">Join waitlist</button>
          ) : (
            <>
              <button type="button" onClick={onRequest} className="min-h-12 w-full rounded-full bg-navy font-extrabold text-white hover:bg-navy-dark">Request info on this class</button>
              <a href={c.regLink} className="mt-2 block text-center text-sm font-extrabold text-navy underline-offset-4 hover:underline">or enroll now in our registration system →</a>
            </>
          )}
        </div>
      </article>
      {children}
    </>
  );
}
