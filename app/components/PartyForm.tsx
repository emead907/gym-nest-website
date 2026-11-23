"use client";

import { useState } from "react";
import { PARTY, PHONE } from "../lib/site";
import { Honeypot } from "./Honeypot";

const field = "min-h-12 w-full rounded-xl border border-line bg-white px-4 text-ink";

/** Why a date can't be booked, or null if it's fine. Parties are Saturdays only. */
function dateProblem(date: string): string | null {
  if (!date) return null;
  const d = new Date(`${date}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d < today) return "Pick a date in the future.";
  if (d.getDay() !== 6) return "Parties are on Saturdays. Please pick a Saturday.";
  if (PARTY.blockedDates.includes(date)) return "That Saturday is already booked. Please pick another.";
  return null;
}

/** Party request → the Hub's Nampa party board. Staff confirm the date and take payment. */
export function PartyForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [date, setDate] = useState("");
  const problem = dateProblem(date);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (problem) return;
    setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/party", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <div className="rounded-3xl bg-white p-8" role="status">
        <p className="font-display text-2xl font-semibold text-navy">Thanks! We got your party request.</p>
        <p className="mt-2 text-muted">Our team will reach out within one business day to confirm your date. Your date is held once payment is made.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2 sm:p-8">
      <p className="font-display text-2xl font-semibold text-navy sm:col-span-2">Request a party date</p>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Your name<input name="parent" required autoComplete="name" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Phone<input name="phone" type="tel" required autoComplete="tel" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink sm:col-span-2">Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Birthday child&rsquo;s name<input name="child" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Turning<input name="childAge" inputMode="numeric" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Saturday
        <input name="partyDate" type="date" required value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={!!problem} aria-describedby="party-date-msg" className={`${field} ${problem ? "border-full" : ""}`} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Time
        <select name="timeSlot" required className={field} defaultValue="">
          <option value="" disabled>Choose a time</option>
          {PARTY.slots.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      {problem && <p id="party-date-msg" className="-mt-2 text-sm font-bold text-full sm:col-span-2">{problem}</p>}
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Number of kids<input name="numChildren" inputMode="numeric" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Color
        <select name="theme" className={field} defaultValue="">
          <option value="">No preference</option>
          <option>Green</option>
          <option>Pink</option>
          <option>Blue</option>
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink sm:col-span-2">Anything else?<textarea name="comments" rows={3} className="w-full rounded-xl border border-line px-4 py-3 text-ink" /></label>
      <Honeypot />
      <button type="submit" disabled={state === "sending" || !!problem} className="min-h-12 rounded-full bg-navy font-extrabold text-white hover:bg-navy-dark disabled:opacity-60 sm:col-span-2">{state === "sending" ? "Sending…" : "Request this date"}</button>
      {state === "error" && <p className="text-sm font-bold text-full sm:col-span-2">Something went wrong. Please call us at {PHONE}.</p>}
    </form>
  );
}
