"use client";

import { useEffect, useState } from "react";
import { LOCATIONS, WAIVER_URL, type LocationKey } from "../lib/site";

export type TrialMode = "trial" | "waitlist" | "evaluation";

export interface TrialRequest {
  location: LocationKey;
  classId?: string;
  className: string;
  /** "Tuesdays · 5:15–6:00pm" */
  requestedTime: string;
  mode: TrialMode;
  source: "program-page" | "class-finder";
}

const SECONDS = 4;

/**
 * Free trial / waitlist / evaluation request. Sends the family to the Hub,
 * emails the gym and adds them to Jackrabbit (see /api/trial), then sends
 * the parent to Jackrabbit to sign waivers.
 */
export function TrialForm({ req, tone = "light" }: { req: TrialRequest; tone?: "light" | "dark" }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [left, setLeft] = useState(SECONDS);
  const dark = tone === "dark";
  const field = `min-h-12 w-full rounded-xl px-4 text-ink ${dark ? "border-0 bg-white" : "border-2 border-line bg-white focus:border-navy"}`;
  const label = `flex flex-col gap-1.5 text-sm font-bold ${dark ? "" : "text-ink"}`;

  useEffect(() => {
    if (state !== "sent") return;
    if (left <= 0) {
      window.location.href = WAIVER_URL;
      return;
    }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [state, left]);

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
          {req.mode === "waitlist" ? "You're on the waitlist!" : req.mode === "evaluation" ? "Evaluation requested!" : "Your free trial is requested!"}
        </p>
        <p className={`mt-2 ${dark ? "text-[#dcddf6]" : "text-muted"}`}>
          {req.mode === "waitlist"
            ? `We'll reach out as soon as a spot opens in ${req.className}.`
            : `Our ${gym} front desk will reach out within one business day to confirm ${req.className}.`}
        </p>
        <p className={`mt-4 font-bold ${dark ? "" : "text-ink"}`}>
          Next step: sign your waivers in our parent portal. Click <strong>Create Login</strong> and use the same email you just entered.
        </p>
        <a href={WAIVER_URL} className={`mt-4 inline-flex min-h-12 items-center rounded-full px-7 font-extrabold ${dark ? "bg-orchid text-navy-dark" : "bg-navy text-white hover:bg-navy-dark"}`}>
          Sign waivers now{left > 0 ? ` (${left})` : ""}
        </a>
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
        {state === "sending" ? "Sending…" : req.mode === "waitlist" ? "Add us to the waitlist" : req.mode === "evaluation" ? "Request an evaluation" : "Schedule my free trial"}
      </button>
      <p className={`text-xs sm:col-span-2 ${dark ? "text-[#dcddf6]" : "text-muted"}`}>
        After you submit, we&rsquo;ll take you to our parent portal to sign waivers.
      </p>
      {state === "error" && <p className={`text-sm font-bold sm:col-span-2 ${dark ? "text-orchid" : "text-full"}`}>Something went wrong. Please call us at 208-278-2011.</p>}
    </form>
  );
}
