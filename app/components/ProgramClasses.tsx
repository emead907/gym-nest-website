"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MapPin, X } from "lucide-react";
import { LOCATIONS, PARENT_PORTAL_URL, type LocationKey } from "../lib/site";
import { TrialForm, type TrialMode } from "./TrialForm";

export interface Slot { id: string; day: string; time: string; when: string; openings: number | null; regLink: string }
export interface ProgramCard { name: string; ages: string; length: string; about: string; invite: boolean; slots: Slot[] }

type Picked = { className: string; classId?: string; requestedTime: string; label: string; mode: TrialMode };

const ACCENTS = [
  { pill: "bg-aqua-tint text-navy", bar: "bg-aqua" },
  { pill: "bg-orchid-tint text-orchid-dark", bar: "bg-orchid" },
];

/** Gym Stars–style class list: one card per class, every time listed under it, each with its own button. */
export function ProgramClasses({ location, cards, otherHref }: { location: LocationKey; cards: ProgramCard[]; otherHref: string }) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const gym = LOCATIONS[location];
  const other = LOCATIONS[location === "nampa" ? "eagle" : "nampa"];

  return (
    <>
      <div className="flex flex-col gap-6">
        {cards.map((c, i) => {
          const a = ACCENTS[i % ACCENTS.length];
          return (
            <article key={c.name} className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 sm:p-8">
              <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${a.bar}`} />
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="mr-1 font-display text-3xl font-semibold text-navy">{c.name}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${a.pill}`}>{c.ages}</span>
                <span className="flex items-center gap-1 rounded-full bg-[#f1f2f8] px-3 py-1 text-xs font-extrabold text-muted"><Clock aria-hidden className="h-3 w-3" />{c.length}</span>
                {c.invite && <span className="rounded-full bg-navy px-3 py-1 text-xs font-extrabold text-white">Invite / evaluation</span>}
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink">{c.about}</p>

              {c.invite ? (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-navy/30 px-5 py-4">
                  <p className="text-muted">Coaches place athletes in this class. Request an evaluation and we&rsquo;ll find the right fit.</p>
                  <button type="button" onClick={() => setPicked({ className: c.name, requestedTime: "", label: "Evaluation", mode: "evaluation" })} className="min-h-11 shrink-0 rounded-full border-2 border-navy px-5 text-sm font-extrabold text-navy hover:bg-aqua-tint">
                    Request an evaluation
                  </button>
                </div>
              ) : c.slots.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-aqua-tint px-5 py-4 text-muted">
                  No {gym.name} times this season. <Link href={otherHref} className="font-extrabold text-navy underline">See {other.name}&rsquo;s times</Link> or call us to join the interest list.
                </p>
              ) : (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {c.slots.map((s) => {
                    const full = s.openings === 0;
                    const few = !full && s.openings != null && s.openings <= 2;
                    return (
                      <li key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
                        <div>
                          <p className="font-extrabold text-navy">{s.day}</p>
                          <p className="text-muted">{s.time}</p>
                          {s.openings != null && (
                            <p className={`mt-0.5 text-xs font-extrabold ${full ? "text-full" : few ? "text-amber" : "text-navy/70"}`}>
                              {full ? "Full – waitlist open" : s.openings === 1 ? "Only 1 spot left" : `${s.openings} spots open`}
                            </p>
                          )}
                        </div>
                        {full ? (
                          <button
                            type="button"
                            onClick={() => setPicked({ className: c.name, classId: s.id, requestedTime: s.when, label: `${s.day} · ${s.time}`, mode: "waitlist" })}
                            className="min-h-11 shrink-0 rounded-full border-2 border-full/40 bg-white px-4 text-sm font-extrabold text-full hover:bg-[#fff4ee]"
                          >
                            Join waitlist
                          </button>
                        ) : (
                          <a href={s.regLink} className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-navy px-4 text-sm font-extrabold text-white hover:bg-navy-dark">
                            Enroll
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-orchid-tint px-6 py-5">
        <div>
          <p className="font-extrabold text-ink">Already a Gym Nest family?</p>
          <p className="text-muted">Log in to your parent portal to add a class for another child or a new day.</p>
        </div>
        <a href={PARENT_PORTAL_URL} className="inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-navy bg-white px-5 text-sm font-extrabold text-navy hover:bg-aqua-tint">
          Go to the parent portal
        </a>
      </div>
      {picked && <TrialDialog location={location} picked={picked} onClose={() => setPicked(null)} />}
    </>
  );
}

function TrialDialog({ location, picked, onClose }: { location: LocationKey; picked: Picked; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const gym = LOCATIONS[location];

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const heading = picked.mode === "waitlist" ? "Join the waitlist" : picked.mode === "evaluation" ? "Request an evaluation" : "Request this class";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-dark/60 p-0 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="trial-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">{heading}</p>
            <h2 id="trial-title" className="mt-1 font-display text-3xl font-bold text-navy">{picked.className}</h2>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-muted">
              {picked.label && <span className="flex items-center gap-1.5"><CalendarDays aria-hidden className="h-4 w-4" />{picked.label}</span>}
              <span className="flex items-center gap-1.5"><MapPin aria-hidden className="h-4 w-4" />The Gym Nest {gym.name}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-line text-navy hover:bg-aqua-tint">
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6">
          <TrialForm req={{ location, classId: picked.classId, className: picked.className, requestedTime: picked.requestedTime, mode: picked.mode, source: "program-page" }} />
        </div>
      </div>
    </div>
  );
}
