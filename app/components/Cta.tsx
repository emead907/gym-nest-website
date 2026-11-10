import Link from "next/link";
import { PHONE, PHONE_HREF } from "../lib/site";

export function Cta({ title = "Start with a no-risk first day.", text = "Find a class that fits your schedule and enroll in a few minutes. Not the right fit? Tell us within 24 hours of the first class and you won't be charged.", href = "/classes", label = "Find a class" }: { title?: string; text?: string; href?: string; label?: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-navy px-8 py-10 text-white sm:px-12">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
          <p className="mt-2 text-lg text-[#dcddf6]">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={href} className="inline-flex min-h-12 items-center rounded-full bg-orchid px-7 font-extrabold text-navy-dark hover:brightness-105">{label}</Link>
          <a href={PHONE_HREF} className="inline-flex min-h-12 items-center rounded-full border-2 border-white/40 px-7 font-extrabold hover:bg-white/10">Call {PHONE}</a>
        </div>
      </div>
    </section>
  );
}
