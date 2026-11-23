import Link from "next/link";
import { BadgeCheck, HeartHandshake, Smile, Sparkles } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { GYM, SOCIAL } from "../lib/site";
import { breadcrumbSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "About Us", description: `The Gym Nest Nampa is a kids activity center at ${GYM.street} offering gymnastics, ninja, tumbling, cheer, preschool, camps and parties for kids 18 months and up.`, path: "/about" });

const VALUES = [
  { icon: Smile, title: "Happiness first", text: "Creating happiness through fitness, movement and positivity is why we open the doors every day." },
  { icon: BadgeCheck, title: "Real skills", text: "Coaches teach proper technique on floor, bars, beam, trampoline and ninja obstacles, with progressions that fit each kid." },
  { icon: HeartHandshake, title: "Every kid, by name", text: "Small classes mean every child gets turns, attention and encouragement." },
  { icon: Sparkles, title: "Better athletes, better humans", text: "Through Supernova Athletics, our cheer program, kids learn teamwork, confidence and grit." },
];

export default function About() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "About us", path: "/about" }];
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(crumbs))} />
      <PageHero eyebrow="About us" title="A happy place to move, learn and grow" intro={`The Gym Nest Activity Center in Nampa is home to gymnastics, ninja, tumbling, cheer, preschool, camps, open play and birthday parties, for boys and girls 18 months and up.`} crumbs={crumbs} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-aqua-tint p-6">
              <Icon aria-hidden className="h-8 w-8 text-orchid-dark" />
              <h2 className="mt-3 font-display text-xl font-semibold text-navy">{title}</h2>
              <p className="mt-1 text-ink">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 sm:px-6 md:grid-cols-2">
        <div className="rounded-3xl border border-line p-7">
          <h2 className="font-display text-2xl font-bold text-navy">Visit the Nest</h2>
          <p className="mt-2 text-ink">{GYM.street}, {GYM.city}, ID {GYM.zip}. Families come to us from {GYM.serves.join(", ")}.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/classes" className="inline-flex min-h-11 items-center rounded-full bg-navy px-5 font-extrabold text-white hover:bg-navy-dark">Find a class</Link>
            <a href={GYM.mapsUrl} className="inline-flex min-h-11 items-center rounded-full border-2 border-navy px-5 font-extrabold text-navy hover:bg-aqua-tint">Directions</a>
          </div>
        </div>
        <div className="rounded-3xl border border-line p-7">
          <h2 className="font-display text-2xl font-bold text-navy">Join the team</h2>
          <p className="mt-2 text-ink">Love working with kids? We&rsquo;re always looking for energetic coaches, teachers and front desk staff.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/careers" className="inline-flex min-h-11 items-center rounded-full bg-orchid px-5 font-extrabold text-navy-dark hover:brightness-105">See jobs</Link>
            <a href={SOCIAL.instagram} className="inline-flex min-h-11 items-center rounded-full border-2 border-navy px-5 font-extrabold text-navy hover:bg-aqua-tint">Follow us on Instagram</a>
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
