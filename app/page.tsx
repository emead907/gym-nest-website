import Link from "next/link";
import { BadgeCheck, Cake, CalendarHeart, CalendarRange, GraduationCap, HeartHandshake, MapPin, Moon, Phone, Sparkles, Sun, Users } from "lucide-react";
import { Decor } from "./components/PageHero";
import { Faq } from "./components/Faq";
import { Cta } from "./components/Cta";
import { JsonLd } from "./components/JsonLd";
import { NO_RISK_HREF, NoRiskLink } from "./components/NoRiskLink";
import { GYM, PHONE, PHONE_HREF, PROGRAMS, PROGRAM_KEYS, programPath } from "./lib/site";
import { faqSchema, graph, pageMeta } from "./lib/seo";

export const revalidate = 600;

const TITLE = "The Gym Nest Nampa | Kids Gymnastics, Ninja & Cheer in Nampa, ID";
export const metadata = {
  ...pageMeta({
    title: TITLE,
    description: "Kids gymnastics, ninja, tumbling and cheer classes, preschool, open play, camps and birthday parties at The Gym Nest in Nampa, Idaho. Ages 18 months and up. No-risk first day.",
    path: "/",
  }),
  title: { absolute: TITLE },
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

const WHY: { icon: typeof BadgeCheck; title: string; text: string; href?: string }[] = [
  { icon: BadgeCheck, title: "No-risk first day", text: "Not the right fit? Tell us within 24 hours of the first class and you won't be charged.", href: NO_RISK_HREF },
  { icon: CalendarRange, title: "Month to month", text: "No long contracts. Switch classes or days whenever life changes." },
  { icon: Users, title: "Small classes", text: "Every kid gets turns, attention and a coach who knows their name." },
  { icon: HeartHandshake, title: "Happy, confident kids", text: "Creating happiness through fitness, movement and positivity." },
];

/** Hero age buttons → the class finder filtered to that age. Keys match the finder's age filters. */
const AGE_PICKS = [
  { age: "tot", label: "18–36 mo", note: "Parent & me" },
  { age: "3", label: "3 years", note: "Tiny Tumblers, Mini Ninjas" },
  { age: "45", label: "4–5 years", note: "Gymnastics & ninja" },
  { age: "612", label: "6–12 years", note: "Gym, ninja, tumbling, cheer" },
];

const FAQS = [
  { q: "What ages does The Gym Nest teach?", a: "Kids 18 months and up. Toddlers start in Happy Hoppers with a parent, and classes go up through age 12, plus preschool for ages 3–5." },
  { q: "What is a no-risk first day?", a: "Enroll in a class and come to your first day. If it isn't the right fit, let us know within 24 hours of that first class and you won't be charged. If we don't hear from you, after 24 hours prorated tuition for the rest of the month and the $50 registration fee are charged to your account, and tuition bills automatically on the 1st after that." },
  { q: "How much are classes?", a: "Tuition is monthly and depends on the class. Every class in our class finder shows its monthly price, and our pricing page lists them all. New families pay a one-time $50 registration fee." },
  { q: "Where is the gym?", a: `${GYM.street}, ${GYM.city}, ID ${GYM.zip}. Families come from ${GYM.serves.join(", ")}.` },
  { q: "Do you have boys' classes?", a: "Yes. Every class is for boys and girls, and ninja classes are a favorite with lots of boys." },
];

export default async function Home() {
  return (
    <>
      <JsonLd data={graph(faqSchema(FAQS))} />
      <section className="relative overflow-hidden bg-aqua-tint">
        <Decor />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">Gymnastics · Ninja · Cheer · Preschool</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-[1.02] text-navy sm:text-7xl">Kids gymnastics in Nampa, Idaho</h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">Creating happiness through fitness, movement and positivity, for boys and girls 18 months and up. Every new student starts with a <NoRiskLink className="text-navy" />.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/classes" className="inline-flex min-h-14 items-center rounded-full bg-navy px-8 text-lg font-extrabold text-white hover:bg-navy-dark">Find a class</Link>
              <Link href="/events/birthday-parties" className="inline-flex min-h-14 items-center rounded-full bg-orchid px-8 text-lg font-extrabold text-navy-dark hover:brightness-105">Book a birthday party</Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-7 shadow-sm">
            <p className="font-display text-3xl font-bold text-navy">How old is your child?</p>
            <p className="mt-1 text-muted">We&rsquo;ll show the classes that fit.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {AGE_PICKS.map((a, i) => (
                <Link key={a.age} href={`/classes?age=${a.age}`} className={`group rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-md ${i % 3 === 0 ? "bg-aqua-tint" : "bg-orchid-tint"}`}>
                  <span className="block font-display text-2xl font-bold text-navy">{a.label}</span>
                  <span className="mt-0.5 block text-sm font-bold text-muted">{a.note}</span>
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm font-extrabold text-muted">
              <a href={GYM.mapsUrl} className="flex items-center gap-1.5 hover:text-navy"><MapPin aria-hidden className="h-4 w-4" />{GYM.street}</a>
              <a href={PHONE_HREF} className="flex items-center gap-1.5 hover:text-navy"><Phone aria-hidden className="h-4 w-4" />{PHONE}</a>
            </div>
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
              <p className="mt-2 text-[#dcddf6]">Tell us your child&rsquo;s age and the days that work. We&rsquo;ll show what&rsquo;s open and what it costs.</p>
              <span className="mt-5 inline-block font-extrabold group-hover:underline">Open the class finder →</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-4xl font-bold">Why Nampa families choose the Nest</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, text, href }) => (
              <div key={title} className="rounded-3xl bg-white/10 p-6">
                <Icon aria-hidden className="h-8 w-8 text-aqua" />
                <h3 className="mt-3 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-1 text-[#dcddf6]">{text}</p>
                {href && <Link href={href} className="mt-3 inline-block font-extrabold text-aqua underline-offset-4 hover:underline">How it works →</Link>}
              </div>
            ))}
          </div>
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

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-4xl font-bold text-navy">Come see the gym</h2>
          <p className="mt-3 text-lg text-muted">We&rsquo;re at {GYM.street} in Nampa, an easy drive from {GYM.serves.filter((c) => c !== "Nampa").join(", ")}.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={GYM.mapsUrl} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-navy px-7 font-extrabold text-white hover:bg-navy-dark"><MapPin aria-hidden className="h-5 w-5" />Directions</a>
            <a href={PHONE_HREF} className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-navy px-7 font-extrabold text-navy hover:bg-aqua-tint"><Phone aria-hidden className="h-5 w-5" />{PHONE}</a>
          </div>
        </div>
        <iframe title="Map to The Gym Nest Nampa" src={GYM.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-80 w-full rounded-3xl border border-line" />
      </section>

      <Faq faqs={FAQS} />
      <Cta />
    </>
  );
}
