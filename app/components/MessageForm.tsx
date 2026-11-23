"use client";

import { useState } from "react";
import { PHONE } from "../lib/site";
import { Honeypot } from "./Honeypot";

const field = "min-h-12 w-full rounded-xl border-2 border-line bg-white px-4 text-ink focus:border-navy";
const label = "flex flex-col gap-1.5 text-sm font-bold text-ink";

/** Contact-us form, or (kind="job") the careers application. Both post to /api/contact. */
export function MessageForm({ kind = "contact" }: { kind?: "contact" | "job" }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const job = kind === "job";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const f = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, kind }) }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <div className="rounded-3xl bg-aqua-tint p-8" role="status">
        <p className="font-display text-2xl font-semibold text-navy">{job ? "Thanks for applying!" : "Thanks! We got your message."}</p>
        <p className="mt-2 text-muted">{job ? "We'll reach out if it looks like a fit." : "Our front desk will get back to you within one business day."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="relative grid gap-4 sm:grid-cols-2">
      <label className={label}>Your name<input name="name" required autoComplete="name" className={field} /></label>
      <label className={label}>Phone<input name="phone" type="tel" autoComplete="tel" className={field} /></label>
      <label className={`${label} sm:col-span-2`}>Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
      {job ? (
        <>
          <label className={label}>Position
            <select name="position" className={field} defaultValue="">
              <option value="">Any</option>
              <option>Gymnastics coach</option>
              <option>Ninja coach</option>
              <option>Preschool teacher</option>
              <option>Front desk</option>
              <option>Camp / Kids Night Out staff</option>
            </select>
          </label>
          <label className={label}>Age<input name="age" inputMode="numeric" className={field} /></label>
          <label className={`${label} sm:col-span-2`}>Days and times you&rsquo;re available<input name="availability" className={field} placeholder="e.g. weekdays after 3, Saturdays" /></label>
          <label className={`${label} sm:col-span-2`}>Experience<textarea name="experience" rows={3} className="w-full rounded-xl border-2 border-line px-4 py-3 text-ink focus:border-navy" placeholder="Gymnastics, cheer, coaching, working with kids…" /></label>
        </>
      ) : (
        <label className={`${label} sm:col-span-2`}>What&rsquo;s it about?
          <select name="topic" className={field} defaultValue="Classes">
            <option>Classes</option>
            <option>Birthday parties</option>
            <option>Preschool</option>
            <option>Camps</option>
            <option>Kids Night Out / Open play</option>
            <option>My account</option>
            <option>Something else</option>
          </select>
        </label>
      )}
      <label className={`${label} sm:col-span-2`}>{job ? "Anything else?" : "Message"}<textarea name="message" rows={4} required={!job} className="w-full rounded-xl border-2 border-line px-4 py-3 text-ink focus:border-navy" /></label>
      <Honeypot />
      <button type="submit" disabled={state === "sending"} className="min-h-12 rounded-full bg-navy font-extrabold text-white hover:bg-navy-dark disabled:opacity-60 sm:col-span-2">
        {state === "sending" ? "Sending…" : job ? "Send my application" : "Send message"}
      </button>
      {state === "error" && <p className="text-sm font-bold text-full sm:col-span-2">Something went wrong. Please call us at {PHONE}.</p>}
    </form>
  );
}
