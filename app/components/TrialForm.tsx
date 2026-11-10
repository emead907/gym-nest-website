"use client";

import { useState } from "react";
import { LOCATIONS, type LocationKey } from "../lib/site";

export type TrialMode = "trial" | "waitlist" | "evaluation";

export interface TrialRequest {
  location: LocationKey;
  classId?: string;
  className: string;
  /** "Tuesdays · 5:15–6:00pm" */
  requestedTime: string;
  mode: TrialMode;
  source: "program-page" | "class-finder";
  /** Jackrabbit registration for this class, offered after they submit. */
  regLink?: string;
}

/**
 * Waitlist, evaluation and existing-family trial requests. Goes to the Hub,
 * emails the gym and adds new families to Jackrabbit (see /api/trial).
 * New-family trials skip this and use Jackrabbit's own trial registration.
 */
export function TrialForm({ req, tone = "light" }: { req: TrialRequest; tone?: "light" | "dark" }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const dark = tone === "dark";
  const field = `min-h-12 w-full rounded-xl px-4 text-ink ${dark ? "border-0 bg-white" : "border-2 border-line bg-white focus:border-navy"}`;
  const label = `flex flex-col gap-1.5 text-sm font-bold ${dark ? "" : "text-ink"}`;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "");
    const res = await fetch("/api/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...req,
        parentFirst: v("parentFirst"), parentLast: v("parentLast"),
        email: v("email"), phone: v("phone"), zip: v("zip"),
        childFirst: v("childFirst"), childLast: v("childLast"), childBirthday: v("childBirthday"),
        smsOptIn: f.get("smsOptIn") === "on", website: v("website"),
      }),
    }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") {
    const gym = LOCATIONS[req.location].name;
    return (
      <div className={`rounded-2xl p-6 ${dark ? "bg-white/10" : "bg-aqua-tint"}`} role="status">
        <p className={`font-display text-2xl font-semibold ${dark ? "" : "text-navy"}`}>
          {req.mode === "waitlist" ? "You're on the waitlist!" : req.mode === "evaluation" ? "Evaluation requested!" : `Thanks for requesting ${req.className}!`}
        </p>
        {req.mode === "trial" && req.regLink ? (
          <>
            <p className={`mt-3 font-bold ${dark ? "" : "text-ink"}`}>Ready to get started now?</p>
            <a href={req.regLink} className={`mt-2 inline-flex min-h-12 items-center rounded-full px-7 font-extrabold ${dark ? "bg-orchid text-navy-dark hover:brightness-105" : "bg-navy text-white hover:bg-navy-dark"}`}>
              Enroll here
            </a>
            <p className={`mt-3 ${dark ? "text-[#dcddf6]" : "text-muted"}`}>
              Or our {gym} front desk will reach out soon to help you through the process. Your first day is no-risk.
            </p>
          </>
        ) : (
          <p className={`mt-2 ${dark ? "text-[#dcddf6]" : "text-muted"}`}>
            {req.mode === "waitlist"
              ? `We'll reach out as soon as a spot opens in ${req.className}.`
              : `Our ${gym} front desk will reach out within one business day to set it up.`}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className={label}>Parent first name<input name="parentFirst" required autoComplete="given-name" className={field} /></label>
      <label className={label}>Parent last name<input name="parentLast" required autoComplete="family-name" className={field} /></label>
      <label className={label}>Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
      <label className={label}>Phone<input name="phone" type="tel" required autoComplete="tel" className={field} /></label>
      <label className={label}>Child&rsquo;s first name<input name="childFirst" required className={field} /></label>
      <label className={label}>Child&rsquo;s last name<input name="childLast" placeholder="If different from yours" className={field} /></label>
      <label className={label}>Child&rsquo;s birthday<input name="childBirthday" type="date" required className={field} /></label>
      <label className={label}>Zip code<input name="zip" inputMode="numeric" required autoComplete="postal-code" className={field} /></label>
      <label className={`flex items-center gap-3 text-sm sm:col-span-2 ${dark ? "" : "text-ink"}`}>
        <input name="smsOptIn" type="checkbox" className="h-5 w-5 accent-orchid" />
        Text me about this class. Msg &amp; data rates may apply. Reply STOP to opt out.
      </label>
      {/* Bots fill every field; people never see this one. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button
        type="submit"
        disabled={state === "sending"}
        className={`min-h-12 rounded-full font-extrabold disabled:opacity-60 sm:col-span-2 ${dark ? "bg-orchid text-navy-dark hover:brightness-105" : "bg-navy text-white hover:bg-navy-dark"}`}
      >
        {state === "sending" ? "Sending…" : req.mode === "waitlist" ? "Add us to the waitlist" : req.mode === "evaluation" ? "Request an evaluation" : "Request this class"}
      </button>
      {state === "error" && <p className={`text-sm font-bold sm:col-span-2 ${dark ? "text-orchid" : "text-full"}`}>Something went wrong. Please call us at 208-278-2011.</p>}
    </form>
  );
}
