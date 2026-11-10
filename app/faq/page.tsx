import { PageHero } from "../components/PageHero";
import { Faq } from "../components/Faq";
import { Cta } from "../components/Cta";
import { JsonLd } from "../components/JsonLd";
import { PHONE, PROGRAMS, PROGRAM_KEYS } from "../lib/site";
import { faqSchema, graph, pageMeta } from "../lib/seo";

export const metadata = pageMeta({ title: "FAQ", description: "Answers to common questions about classes, ages, tuition, parties and preschool at The Gym Nest in Nampa and Eagle, Idaho.", path: "/faq" });

const GENERAL = [
  { q: "What is a no-risk first day?", a: "Enroll in a class and come to your first day. If it isn't the right fit, let us know within 24 hours of that first class and you won't be charged. If we don't hear from you, your membership continues and tuition bills automatically." },
  { q: "Is there a registration fee?", a: "A one-time $50 registration fee for new families." },
  { q: "How do I cancel?", a: "Give written notice by the 15th of the month to stop the next month's charge." },
  { q: "How do I make up a missed class?", a: "Schedule a make-up within 30 days of the missed class." },
  { q: "How do I reach you?", a: `Call ${PHONE}, or email info@thegymneststudio.com (Eagle) or thegymnestnampa@gmail.com (Nampa).` },
];

export default function FaqPage() {
  const all = [...GENERAL, ...PROGRAM_KEYS.flatMap((k) => PROGRAMS[k].faqs)];
  return (
    <>
      <JsonLd data={graph(faqSchema(all))} />
      <PageHero eyebrow="Help" title="Frequently asked questions" crumbs={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <Faq faqs={all} title="Everything parents ask" />
      <Cta />
    </>
  );
}
