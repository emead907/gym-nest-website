"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, MapPin, UserRound, X } from "lucide-react";
import type { AgeBand, FinderProgram, SiteClass } from "../lib/classes";
import { LOCATIONS, LOCATION_KEYS, type LocationKey } from "../lib/site";
import { useLocation } from "./LocationProvider";
import { LocationSwitch } from "./LocationSwitch";
import { TrialForm } from "./TrialForm";

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
const when = (c: SiteClass) => {
  const days = c.days.length === 1 ? DAY_FULL[c.days[0]] ?? c.days[0] : c.days.join(" & ");
  const sameHalf = c.start.slice(-2) === c.end.slice(-2);
  return `${days} · ${sameHalf ? c.start.slice(0, -3) : c.start}–${c.end}`.replace(/ (AM|PM)/g, (m) => m.trim().toLowerCase()).replace("·", " · ").replace(/\s+/g, " ");
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

function Spots({ c }: { c: SiteClass }) {
  if (c.openings == null) return null;
  const full = c.openings === 0;
  const few = !full && c.openings <= 2;
  const max = Math.max(c.max ?? 6, c.openings);
  const pct = Math.round(((max - c.openings) / max) * 100);
  return (
    <div className="mt-4">
      <div className="h-2 overflow-hidden rounded-full bg-aqua-tint">
        <div className={`h-full rounded-full ${full ? "bg-[#c2410c]" : few ? "bg-[#d48a00]" : "bg-navy"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className={`mt-2 text-sm font-extrabold ${full ? "text-full" : few ? "text-amber" : "text-navy"}`}>
        {full ? "Full – join the waitlist" : c.openings === 1 ? "Only 1 spot left" : `${c.openings} spots open`}
      </p>
    </div>
  );
}

export function ClassFinder({ classes, live }: { classes: SiteClass[]; live: boolean }) {
  const params = useSearchParams();
  const { location, setLocation } = useLocation();
  const [age, setAge] = useState<AgeBand | "all">("all");
  const [program, setProgram] = useState<FinderProgram | "All">("All");
  const [day, setDay] = useState<string>("all");
  const [open, setOpen] = useState<{ id: string; mode: "trial" | "register" } | null>(null);

  // ?location=eagle&program=Ninja from links around the site
  useEffect(() => {
    const l = params.get("location");
    if (l === "nampa" || l === "eagle") setLocation(l);
    const p = params.get("program");
    if (p && (PROGRAMS as string[]).includes(p)) setProgram(p as FinderProgram);
  }, [params, setLocation]);

  useEffect(() => setOpen(null), [location, age, program, day]);

  const results = useMemo(
    () =>
      classes
        .filter((c) => (!location || c.location === location) && (age === "all" || c.bands.includes(age)) && (program === "All" || c.program === program) && (day === "all" || c.days.includes(day)))
        .sort((a, b) => (a.location === b.location ? 0 : a.location === "nampa" ? -1 : 1) || DAYS.indexOf(a.days[0]) - DAYS.indexOf(b.days[0]) || mins(a.start) - mins(b.start) || a.name.localeCompare(b.name)),
    [classes, location, age, program, day],
  );
  const filtered = age !== "all" || program !== "All" || day !== "all";
  const loc = location ? LOCATIONS[location] : null;
  const otherCount = location ? classes.filter((c) => c.location !== location && (age === "all" || c.bands.includes(age)) && (program === "All" || c.program === program) && (day === "all" || c.days.includes(day))).length : 0;

  return (
    <div>
      {/* Which gym: always visible, one tap to switch */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-navy bg-white p-5 sm:p-6">
        {loc ? (
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">Showing classes at</p>
            <p className="mt-1 font-display text-3xl font-bold text-navy">The Gym Nest {loc.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-muted"><MapPin aria-hidden className="h-4 w-4" />{loc.street}, {loc.city}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">Step 1</p>
            <p className="mt-1 font-display text-3xl font-bold text-navy">Which gym works for you?</p>
            <p className="mt-1 text-muted">Showing both gyms until you pick one.</p>
          </div>
        )}
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <LocationSwitch size="lg" />
          {loc && <span className="px-2 text-sm text-muted">Tap to switch gyms</span>}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-aqua-tint px-5 sm:px-7">
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
          {loc && <span className="text-muted"> in {loc.name}</span>}
        </h2>
        {filtered && (
          <button type="button" onClick={() => { setAge("all"); setProgram("All"); setDay("all"); }} className="min-h-11 border-b-2 border-navy font-extrabold text-navy">
            Clear filters
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">Every new student starts with a no-risk first day. {live ? "Open spots update live from our schedule." : "Open spots are updated throughout the day."}</p>

      {results.length === 0 && (
        <div className="mt-6 rounded-3xl bg-orchid-tint p-8 text-center">
          <p className="text-lg font-extrabold text-ink">No classes match those filters{loc ? ` in ${loc.name}` : ""}.</p>
          <p className="mt-2 text-muted">
            Try another day{location && otherCount > 0 ? <>, or <button type="button" className="font-extrabold text-navy underline" onClick={() => setLocation(location === "nampa" ? "eagle" : "nampa")}>see {otherCount} at our {LOCATIONS[location === "nampa" ? "eagle" : "nampa"].name} gym</button></> : ""}.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => {
          const isOpen = open?.id === c.id;
          const full = c.openings === 0;
          return (
            <FinderCard key={c.id} c={c} isOpen={isOpen} full={full} onTrial={() => setOpen({ id: c.id, mode: "trial" })} onRegister={() => setOpen({ id: c.id, mode: "register" })}>
              {isOpen && (
                <div className="col-span-full rounded-3xl bg-navy p-6 text-white sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-widest text-aqua">
                        {open.mode === "register" ? "Enroll" : "Join the waitlist"} · The Gym Nest {LOCATIONS[c.location].name}
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-semibold">{c.name}</h3>
                      <p className="mt-1 text-[#dcddf6]">{when(c)} · {c.ages}</p>
                    </div>
                    <button type="button" onClick={() => setOpen(null)} aria-label="Close" className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/30 hover:bg-white/10"><X aria-hidden className="h-5 w-5" /></button>
                  </div>
                  {open.mode === "trial" ? (
                    <div className="mt-6 max-w-3xl">
                      <TrialForm tone="dark" req={{ location: c.location, classId: c.id, className: c.name, requestedTime: when(c), mode: full ? "waitlist" : "trial", source: "class-finder" }} />
                    </div>
                  ) : (
                    <div className="mt-6 max-w-2xl rounded-2xl bg-white/10 p-6">
                      <p className="font-display text-2xl font-semibold">Enroll with a no-risk first day</p>
                      <p className="mt-2 text-[#dcddf6]">You&rsquo;ll finish in our secure registration system with this class picked. It takes about 3 minutes:</p>
                      <ol className="mt-3 list-decimal space-y-1 pl-5 text-[#dcddf6]">
                        <li>Your family and child&rsquo;s info</li>
                        <li>Policies and waiver</li>
                        <li>Payment method ($50 registration fee for new families)</li>
                      </ol>
                      <a href={c.regLink} className="mt-5 inline-flex min-h-12 items-center rounded-full bg-orchid px-7 font-extrabold text-navy-dark hover:brightness-105">Continue to secure registration</a>
                    </div>
                  )}
                </div>
              )}
            </FinderCard>
          );
        })}
      </div>

      {!location && (
        <p className="mt-8 text-center text-muted">
          Not sure which gym? {LOCATION_KEYS.map((k, i) => <span key={k}>{i ? " · " : ""}<strong className="text-ink">{LOCATIONS[k].name}</strong>: {LOCATIONS[k].street}</span>)}
        </p>
      )}
    </div>
  );
}

function FinderCard({ c, isOpen, full, onTrial, onRegister, children }: { c: SiteClass; isOpen: boolean; full: boolean; onTrial: () => void; onRegister: () => void; children: React.ReactNode }) {
  return (
    <>
      <article className={`flex flex-col rounded-3xl border-2 bg-white p-6 transition ${isOpen ? "border-navy shadow-lg" : "border-line"}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-aqua-tint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-navy">{c.program}</span>
          <span className="flex items-center gap-1 rounded-full bg-orchid-tint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-orchid-dark">
            <MapPin aria-hidden className="h-3 w-3" />{LOCATIONS[c.location].name}
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-navy">{c.name}</h3>
        <p className="text-muted">Ages {c.ages}{c.parentAndMe ? " · Parent & me" : ""}</p>
        <div className="my-4 border-t border-line" />
        <p className="flex items-center gap-2 font-bold text-ink"><CalendarDays aria-hidden className="h-4 w-4 text-navy" />{when(c)}</p>
        <p className="mt-1.5 flex items-center gap-2 text-muted"><UserRound aria-hidden className="h-4 w-4" />{c.coach ? `Coach ${c.coach}` : "Coach to be announced"}</p>
        <Spots c={c} />
        <div className="mt-5 flex gap-3">
          {full ? (
            <button type="button" onClick={onTrial} className="min-h-12 flex-1 rounded-full border-2 border-navy font-extrabold text-navy hover:bg-aqua-tint">Join waitlist</button>
          ) : (
            <button type="button" onClick={onRegister} className="min-h-12 flex-1 rounded-full bg-navy font-extrabold text-white hover:bg-navy-dark">Enroll</button>
          )}
        </div>
      </article>
      {children}
    </>
  );
}
