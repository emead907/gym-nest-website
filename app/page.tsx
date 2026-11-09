import Link from "next/link";
import { Cake, CalendarHeart, GraduationCap, MapPin, Moon, Sparkles, Sun } from "lucide-react";
import { Decor } from "./components/PageHero";
import { Faq } from "./components/Faq";
import { Cta } from "./components/Cta";
import { JsonLd } from "./components/JsonLd";
import { LocationCards } from "./components/LocationCards";
import { LocationSwitch } from "./components/LocationSwitch";
import { getClasses } from "./lib/classes";
import { PROGRAMS, PROGRAM_KEYS, programPath } from "./lib/site";
import { faqSchema, graph, pageMeta } from "./lib/seo";

export const revalidate = 600;

export const metadata = {
  ...pageMeta({
    title: "The Gym Nest | Kids Gymnastics, Ninja & Cheer in Nampa and Eagle, ID",
    description: "Kids gymnastics, ninja, tumbling and cheer classes, preschool, open play, camps and birthday parties at The Gym Nest in Nampa and Eagle, Idaho. Ages 18 months and up. First class free.",
    path: "/",
  }),
  title: { absolute: "The Gym Nest | Kids Gymnastics, Ninja & Cheer in Nampa and Eagle, ID" },
};

const TILES: { key: (typeof PROGRAM_KEYS)[number]; ages: string; color: string }[] = [
  { key: "gymnastics", ages: "18 months – 12 years", color: "bg-aqua-tint" },
  { key: "ninjas", ages: "3 – 12 years", color: "bg-orchid-tint" },
  { key: "tumbling", ages: "6 and up", color: "bg-aqua-tint" },
  { key: "cheer", ages: "6 and up", color: "bg-orchid-tint" },
  { key: "homeschoolers", ages: "4 – 12 years", color: "bg-aqua-tint" },
];

const MORE = [
  { href: "/preschool", icon: GraduationCap, title: "Preschool", text: "Kindergarten readiness with a gymnastics lesson every week. Ages 3–5." },
  { href: "/events/birthday-parties", icon: Cake, title: "Birthday parties", text: "Saturday gym parties with a host and party room. We clean up." },
  { href: "/events/open-play", icon: Sun, title: "Open play", text: "Drop-in morning play on obstacle courses for little ones." },
  { href: "/events/kids-night-out", icon: Moon, title: "Kids Night Out", text: "Friday night gym games and pizza while you get a night off." },
  { href: "/camps", icon: CalendarHeart, title: "Summer camp", text: "Themed half and full days of gym, crafts, science and games. Ages 4–12." },
];

const FAQS = [
  { q: "What ages does The Gym Nest teach?", a: "Kids 18 months and up. Toddlers start in Happy Hoppers with a parent, and classes go up through age 12, plus preschool for ages 3–5." },
  { q: "Is the first class free?", a: "Yes. New students get their first class free. Pick a class in the class finder and request your free first class." },
  { q: "Where are your gyms?", a: "The Gym Nest Nampa is at 849 S. Rising Sun Dr, Nampa, ID 83686. The Gym Nest Eagle is at 17 N Fisher Park Way, Eagle, ID 83616." },
  { q: "Do you have boys' classes?", a: "Yes. Every class is for boys and girls, and ninja classes are a favorite with lots of boys." },
];

export default async function Home() {
  const { classes } = await getClasses();
  const openSpots = classes.reduce((n, c) => n + (c.openings ?? 0), 0);

  return (
    <>
      <JsonLd data={graph(faqSchema(FAQS))} />
      <section className="relative overflow-hidden bg-aqua-tint">
        <Decor />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">Gymnastics · Ninja · Cheer · Preschool</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-[1.02] text-navy sm:text-7xl">Kids gymnastics in Nampa &amp; Eagle, Idaho</h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">Creating happiness through fitness, movement and positivity, for boys and girls 18 months and up. Your child&rsquo;s first class is free.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/classes" className="inline-flex min-h-14 items-center rounded-full bg-navy px-8 text-lg font-extrabold text-white hover:bg-navy-dark">Find a class</Link>
              <Link href="/events/birthday-parties" className="inline-flex min-h-14 items-center rounded-full bg-orchid px-8 text-lg font-extrabold text-navy-dark hover:brightness-105">Book a birthday party</Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="flex items-center gap-2 font-extrabold text-navy"><MapPin aria-hidden className="h-5 w-5" />Choose your gym</p>
            <p className="mt-1 text-muted">We&rsquo;ll show classes, parties and events for that location.</p>
            <div className="mt-5"><LocationSwitch size="lg" /></div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-aqua-tint p-4">
                <p className="font-display text-4xl font-bold text-navy">{openSpots}</p>
                <p className="text-sm font-bold text-muted">open class spots right now</p>
              </div>
              <div className="rounded-2xl bg-orchid-tint p-4">
                <p className="font-display text-4xl font-bold text-navy">2</p>
                <p className="text-sm font-bold text-muted">gyms: Nampa &amp; Eagle</p>
              </div>
            </div>
            <Link href="/classes" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full border-2 border-navy font-extrabold text-navy hover:bg-aqua-tint">See live open spots →</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-4xl font-bold text-navy">Classes for every kid</h2>
        <p className="mt-2 max-w-2xl text-lg text-muted">Small classes, real skills and coaches who know every kid by name. Classes meet once a week, month to month.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => {
            const p = PROGRAMS[t.key];
            return (
              <Link key={t.key} href={programPath(t.key)} className={`group rounded-3xl ${t.color} p-7 transition hover:-translate-y-0.5 hover:shadow-lg`}>
                <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">{t.ages}</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-navy">{p.title}</h3>
                <p className="mt-2 text-ink">{p.tagline}</p>
                <span className="mt-5 inline-block font-extrabold text-navy group-hover:underline">Explore {p.title.toLowerCase()} →</span>
              </Link>
            );
          })}
          <Link href="/classes" className="group flex flex-col justify-between rounded-3xl bg-navy p-7 text-white">
            <Sparkles aria-hidden className="h-8 w-8 text-lime" />
            <div>
              <h3 className="mt-4 font-display text-3xl font-semibold">Not sure where to start?</h3>
              <p className="mt-2 text-[#dcddf6]">Tell us your child&rsquo;s age and the days that work. We&rsquo;ll show what&rsquo;s open.</p>
              <span className="mt-5 inline-block font-extrabold group-hover:underline">Open the class finder →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-orchid-tint">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-bold text-navy">More at the Nest</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {MORE.map(({ href, icon: Icon, title, text }) => (
              <Link key={href} href={href} className="rounded-3xl bg-white p-6 transition hover:shadow-lg">
                <Icon aria-hidden className="h-7 w-7 text-orchid-dark" />
                <h3 className="mt-3 font-display text-xl font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-4xl font-bold text-navy">Two gyms in the Treasure Valley</h2>
        <p className="mt-2 text-lg text-muted">Same great classes, two convenient spots.</p>
        <div className="mt-8"><LocationCards href={(k) => `/locations/${k}`} label="Visit" note={(k) => (k === "nampa" ? "Serving Nampa, Caldwell, Kuna and Middleton." : "Serving Eagle, Star, Meridian and northwest Boise.")} /></div>
      </section>

      <Faq faqs={FAQS} />
      <Cta />
    </>
  );
}
