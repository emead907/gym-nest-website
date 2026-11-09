"use client";

import { useState } from "react";
import { LOCATIONS, PARTIES, type LocationKey } from "../lib/site";

const field = "min-h-12 w-full rounded-xl border border-line bg-white px-4 text-ink";

/** Party request → the Hub's party board for that gym. Staff confirm the date and take payment. */
export function PartyForm({ location }: { location: LocationKey }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const l = LOCATIONS[location];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/party", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, location }) }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <div className="rounded-3xl bg-white p-8">
        <p className="font-display text-2xl font-semibold text-navy">Thanks! We got your party request.</p>
        <p className="mt-2 text-muted">Our {l.name} team will reach out within one business day to confirm your date. Your date is held once payment is made.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-3xl bg-white p-6 sm:grid-cols-2 sm:p-8">
      <p className="font-display text-2xl font-semibold text-navy sm:col-span-2">Request a party at {l.name}</p>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Your name<input name="parent" required autoComplete="name" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Phone<input name="phone" type="tel" required autoComplete="tel" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink sm:col-span-2">Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Birthday child&rsquo;s name<input name="child" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Turning<input name="childAge" inputMode="numeric" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Preferred Saturday<input name="partyDate" type="date" required className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Time
        <select name="timeSlot" required className={field} defaultValue="">
          <option value="" disabled>Choose a time</option>
          {PARTIES[location].slots.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">Number of kids<input name="numChildren" inputMode="numeric" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink">{location === "eagle" ? "Theme" : "Color"}<input name="theme" placeholder={location === "eagle" ? "Unicorns, ninja, dinosaurs…" : "Green, pink or blue"} className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold text-ink sm:col-span-2">Anything else?<textarea name="comments" rows={3} className="w-full rounded-xl border border-line px-4 py-3 text-ink" /></label>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-navy font-extrabold text-white hover:bg-navy-dark disabled:opacity-60 sm:col-span-2">{state === "sending" ? "Sending…" : "Request this date"}</button>
      {state === "error" && <p className="text-sm font-bold text-full sm:col-span-2">Something went wrong. Please call us at 208-278-2011.</p>}
    </form>
  );
}
