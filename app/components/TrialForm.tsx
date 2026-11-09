"use client";

import { useState } from "react";
import type { SiteClass } from "../lib/classes";
import { LOCATIONS } from "../lib/site";

const field = "min-h-12 w-full rounded-xl border-0 bg-white px-4 text-ink";

/** "Try a class" / waitlist request. Goes to that gym's trial board in the Hub. */
export function TrialForm({ c, full, when }: { c: SiteClass; full: boolean; when: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: c.location, classId: c.id, className: c.name, requestedTime: when, waitlist: full,
        parent: f.get("parent"), email: f.get("email"), phone: f.get("phone"),
        childName: f.get("childName"), childBirthday: f.get("childBirthday"),
        smsOptIn: f.get("smsOptIn") === "on", website: f.get("website"),
      }),
    }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <div className="mt-6 max-w-2xl rounded-2xl bg-white/10 p-6">
        <p className="font-display text-2xl font-semibold">Thanks! You&rsquo;re all set.</p>
        <p className="mt-2 text-[#dcddf6]">
          {full
            ? "You're on the waitlist. We'll reach out as soon as a spot opens."
            : `Our ${LOCATIONS[c.location].name} front desk will reach out within one business day to confirm your child's first class.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5 text-sm font-bold">Parent name<input name="parent" required autoComplete="name" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold">Phone<input name="phone" type="tel" required autoComplete="tel" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold sm:col-span-2">Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold">Child&rsquo;s name<input name="childName" required className={field} /></label>
      <label className="flex flex-col gap-1.5 text-sm font-bold">Child&rsquo;s birthday<input name="childBirthday" type="date" required className={field} /></label>
      <label className="flex items-center gap-3 text-sm sm:col-span-2">
        <input name="smsOptIn" type="checkbox" className="h-5 w-5 accent-orchid" />
        Text me about this class. Msg &amp; data rates may apply. Reply STOP to opt out.
      </label>
      {/* Bots fill every field; people never see this one. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-orchid font-extrabold text-navy-dark hover:brightness-105 disabled:opacity-60 sm:col-span-2">
        {state === "sending" ? "Sending…" : full ? "Add us to the waitlist" : "Request this class"}
      </button>
      {state === "error" && <p className="text-sm font-bold text-orchid sm:col-span-2">Something went wrong. Please call us at 208-278-2011.</p>}
    </form>
  );
}
