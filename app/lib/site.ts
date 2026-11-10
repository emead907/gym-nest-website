/**
 * Everything the site says about The Gym Nest, in one place.
 * Edit text, prices and times here; every page reads from this file.
 */

export const SITE_URL = "https://thegymneststudio.com";
export const SITE_NAME = "The Gym Nest Activity Center";
export const PHONE = "208-278-2011";
export const PHONE_HREF = "tel:+12082782011";
export const JACKRABBIT_ORG_ID = "537979";
export const PARENT_PORTAL_URL = `https://app.jackrabbitclass.com/jr3.0/ParentPortal/Login?orgId=${JACKRABBIT_ORG_ID}`;
export const SOCIAL = {
  instagram: "https://www.instagram.com/thegymnestactivitycenter/",
  facebook: "https://www.facebook.com/thegymneststudio/",
  supernova: "https://www.instagram.com/supernova_idaho/",
};

export type LocationKey = "nampa" | "eagle";

export interface Location {
  key: LocationKey;
  name: string;
  street: string;
  city: string;
  region: "ID";
  zip: string;
  email: string;
  /** Matches Jackrabbit's location name on each class. */
  jackrabbit: string;
  /** Nearby towns families drive in from (used in page copy for local search). */
  serves: string[];
  mapsUrl: string;
}

export const LOCATIONS: Record<LocationKey, Location> = {
  nampa: {
    key: "nampa",
    name: "Nampa",
    street: "849 S. Rising Sun Dr",
    city: "Nampa",
    region: "ID",
    zip: "83686",
    email: "thegymnestnampa@gmail.com",
    jackrabbit: "Nampa",
    serves: ["Nampa", "Caldwell", "Kuna", "Middleton", "Meridian"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Gym+Nest+849+S+Rising+Sun+Dr+Nampa+ID+83686",
  },
  eagle: {
    key: "eagle",
    name: "Eagle",
    street: "17 N Fisher Park Way",
    city: "Eagle",
    region: "ID",
    zip: "83616",
    email: "info@thegymneststudio.com",
    jackrabbit: "Eagle",
    serves: ["Eagle", "Star", "Meridian", "Boise", "Garden City"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Gym+Nest+17+N+Fisher+Park+Way+Eagle+ID+83616",
  },
};
export const LOCATION_KEYS: LocationKey[] = ["nampa", "eagle"];
export const otherLocation = (k: LocationKey): LocationKey => (k === "nampa" ? "eagle" : "nampa");

export const POLICIES = [
  "Every new student starts with a no-risk first day. Not the right fit? Tell us within 24 hours of the first class and you won't be charged.",
  "A one-time $50 registration fee for new families.",
  "Month-to-month memberships. Tuition bills on the 1st.",
  "To cancel, give written notice by the 15th to stop the next month's charge.",
  "Missed a class? Schedule a make-up within 30 days.",
];

// ─── Programs ────────────────────────────────────────────────────────────────

export type ProgramKey = "gymnastics" | "ninjas" | "tumbling" | "homeschoolers" | "cheer";

export interface ClassInfo { name: string; ages: string; length: string; about: string; invite?: boolean }

export interface Program {
  key: ProgramKey;
  title: string;
  /** Word used in page titles: "Kids Gymnastics Classes in Nampa, ID" */
  seoTitle: string;
  tagline: string;
  intro: string;
  classes: ClassInfo[];
  /** Class finder program filter this maps to. */
  finder: "Gymnastics" | "Ninja" | "Tumbling" | "Cheer" | "Homeschool";
  faqs: { q: string; a: string }[];
}

export const PROGRAMS: Record<ProgramKey, Program> = {
  gymnastics: {
    key: "gymnastics",
    title: "Gymnastics",
    seoTitle: "Kids Gymnastics Classes",
    tagline: "Toddler, preschool and recreational gymnastics for boys and girls 18 months and up.",
    intro:
      "From parent-and-me Happy Hoppers to Kids Rec, our gymnastics classes build strength, balance, coordination and confidence. Coaches teach real skills on floor, bars, beam and trampoline, in small classes where every kid gets turns and attention.",
    classes: [
      { name: "Happy Hoppers", ages: "18–36 months", length: "45 min", about: "A parent-participation class. Tumbling, climbing and swinging build coordination, balance and flexibility, with you right there to help." },
      { name: "Tiny Tumblers", ages: "3 years", length: "45 min", about: "Obstacle courses, rolls and jumps that build coordination and balance, plus life skills like following directions and taking turns." },
      { name: "Rockin' Rollers", ages: "4–5 years", length: "60 min", about: "A structured class teaching basic gymnastics skills while building strength, coordination and balance." },
      { name: "Kids Rec", ages: "6–12 years", length: "60 min", about: "Floor, trampoline, bars and beam, with coaches teaching proper technique as kids learn new skills." },
      { name: "Intermediate", ages: "By invitation", length: "75 min", about: "For gymnasts who have mastered the basics and are ready for more challenge.", invite: true },
      { name: "Advanced", ages: "By invitation", length: "90 min", about: "A non-competitive class for gymnasts with a strong skill background.", invite: true },
    ],
    finder: "Gymnastics",
    faqs: [
      { q: "What age can my child start gymnastics?", a: "As young as 18 months in Happy Hoppers, a parent-and-me class. Kids 3 and up take classes on their own." },
      { q: "What is a no-risk first day?", a: "Enroll in a class and come to your first day. If it isn't the right fit, let us know within 24 hours of that first class and you won't be charged. If we don't hear from you, your membership continues and tuition bills automatically." },
      { q: "What should my child wear?", a: "Comfortable athletic clothes or a leotard, bare feet, and hair pulled back. Please leave jewelry at home." },
      { q: "Do you have competitive gymnastics?", a: "Our gymnastics classes are recreational and non-competitive. For competition, check out Supernova Athletics, our all-star cheer program." },
    ],
  },
  ninjas: {
    key: "ninjas",
    title: "Ninja",
    seoTitle: "Kids Ninja Classes",
    tagline: "Obstacle courses, climbing and nonstop movement for kids 3 and up.",
    intro:
      "Sitting still isn't for ninjas. Kids work their way through obstacles and skill progressions that build strength, endurance, balance and confidence, while burning off a whole lot of energy.",
    classes: [
      { name: "Mini Ninja Turtles", ages: "3–4 years", length: "45 min", about: "Nonstop moving, tumbling, jumping and ninja-ing for the youngest ninjas." },
      { name: "Ninja Turtles", ages: "5–6 years", length: "60 min", about: "Running, jumping, rolling and climbing for kids bursting with energy." },
      { name: "Ninjas", ages: "6–12 years", length: "75 min", about: "Obstacles and skill progressions that build strength, endurance, balance and confidence." },
    ],
    finder: "Ninja",
    faqs: [
      { q: "What is a ninja class?", a: "Ninja classes are obstacle-course training inspired by ninja warrior: climbing, swinging, jumping, balance and agility, taught by coaches in a safe gym." },
      { q: "Is ninja good for kids who don't like gymnastics?", a: "Yes. Ninja builds the same strength and coordination with a more adventurous, obstacle-based style that many kids love." },
    ],
  },
  tumbling: {
    key: "tumbling",
    title: "Tumbling",
    seoTitle: "Kids Tumbling Classes",
    tagline: "Trampoline and floor tumbling, from first cartwheels to back handsprings.",
    intro:
      "Tumbling classes focus on trampoline and floor skills. Beginners work on cartwheels, front walkovers and back walkovers. Advanced tumblers move on to front and back handsprings and more.",
    classes: [
      { name: "Beginning Tumbling", ages: "6 and up", length: "60 min", about: "Trampoline and floor tumbling. Kids learn cartwheels, front walkovers, back walkovers and more." },
      { name: "Advanced Tumbling", ages: "By invitation", length: "60 min", about: "Trampoline and floor tumbling for kids ready for front and back handsprings and beyond.", invite: true },
    ],
    finder: "Tumbling",
    faqs: [
      { q: "Is tumbling good for cheer?", a: "Yes. Tumbling is the foundation for cheer skills, and many of our Supernova cheer athletes take tumbling too." },
    ],
  },
  homeschoolers: {
    key: "homeschoolers",
    title: "Homeschool",
    seoTitle: "Homeschool Gymnastics & Ninja Classes",
    tagline: "Daytime gymnastics and ninja classes for homeschool families.",
    intro:
      "Our homeschool classes mix physical education, gymnastics and ninja in a fun learning environment, during the school day while the gym is quiet. Classes run September through May, once a week.",
    classes: [
      { name: "Homeschool Gymnastics", ages: "4–12 years", length: "60 min", about: "Physical education and gymnastics skills for homeschool students." },
      { name: "Homeschool Ninja", ages: "4–12 years", length: "60 min", about: "Physical education, gymnastics and ninja obstacles for homeschool students." },
    ],
    finder: "Homeschool",
    faqs: [
      { q: "When do homeschool classes run?", a: "Once a week, September through May, with a summer break." },
    ],
  },
  cheer: {
    key: "cheer",
    title: "Cheer",
    seoTitle: "Kids Cheer Classes & All-Star Cheer",
    tagline: "Supernova Athletics: recreational cheer and all-star cheer teams.",
    intro:
      "Supernova Athletics builds better athletes and better humans. Rec cheer teaches the fundamentals: jumps, motions, tumbling basics and stunting. Our all-star teams combine dance, tumbling, stunting and jumps, compete against local teams and travel to out-of-state events.",
    classes: [
      { name: "Cheer Rec", ages: "6 and up", length: "60 min", about: "The basics of cheer: jumps, motions, tumbling and stunting, in a fun, positive class." },
      { name: "Supernova Tumbling", ages: "By invitation", length: "60–90 min", about: "Trampoline and floor tumbling for Supernova cheer athletes.", invite: true },
      { name: "All-star teams", ages: "By tryout", length: "2 practices a week", about: "Competitive all-star cheer teams at each location. Tryouts are held each spring.", invite: true },
    ],
    finder: "Cheer",
    faqs: [
      { q: "How do I join a Supernova all-star team?", a: `Teams are formed at spring tryouts. Call ${PHONE} or email info@thegymneststudio.com to sign up for tryouts.` },
      { q: "Does my child need cheer experience for rec cheer?", a: "No. Rec cheer is for beginners and teaches the fundamentals." },
    ],
  },
};
export const PROGRAM_KEYS = Object.keys(PROGRAMS) as ProgramKey[];

// ─── Events ──────────────────────────────────────────────────────────────────

export type EventKey = "birthday-parties" | "open-play" | "kids-night-out";

export interface PartyDetails {
  price: string;
  includes: string[];
  slots: string[];
}

export const PARTIES: Record<LocationKey, PartyDetails> = {
  nampa: {
    price: "$265 for up to 10 kids · $10 each additional child · add 30 minutes for $50",
    includes: [
      "1.5 hours: an hour in the gym, 30 minutes in the party room",
      "A party host for up to 20 kids",
      "Tableware and decorations in your color: green, pink or blue",
      "Bring your own food and drinks. We clean up.",
    ],
    slots: ["12:30 – 2:00 PM", "2:30 – 4:00 PM", "4:30 – 6:00 PM"],
  },
  eagle: {
    price: "$285 for 1–12 kids · $385 for 13–20 kids",
    includes: [
      "1.5 hours: an hour in the gym, 30 minutes in the party room",
      "Two hosts for up to 12 kids, three hosts for 13–20",
      "Themed decorations: gymnastics, unicorns, dinosaurs, ninja, kitties, Super Mario, superheroes, pink or blue",
      "Tableware included. Bring your own food and drinks. We clean up.",
    ],
    slots: ["11:30 AM – 1:00 PM", "1:30 – 3:00 PM", "3:30 – 5:00 PM"],
  },
};

export const OPEN_PLAY: Record<LocationKey, { when: string; ages: string; price: string; pass: string }> = {
  nampa: { when: "Monday – Wednesday, 9:30 AM – 12:30 PM", ages: "Ages 6 and under", price: "$13 per child", pass: "10-visit punch pass: $110" },
  eagle: { when: "Monday – Thursday, 9:30 AM – 12:00 PM", ages: "Ages 5 and under", price: "$12 per child", pass: "10-visit pass: $100" },
};

export const KNO: Record<LocationKey, { when: string; time: string; price: string; includes: string }> = {
  nampa: { when: "Fridays (see the event calendar for dates)", time: "5:30 – 8:00 PM", price: "$25 per child", includes: "A monthly theme, gym time, a raffle and a pizza party. Dress in the theme to enter the prize raffle!" },
  eagle: { when: "Every other Friday (see the event calendar for dates)", time: "6:00 – 9:00 PM", price: "$45 per child", includes: "Gym time, pizza and a movie. Bring a blanket and pillow for the movie." },
};

// ─── Camps & preschool ───────────────────────────────────────────────────────

export const CAMPS: Record<LocationKey, { weeks: [string, string][]; half: string; full: string; deals: string[] }> = {
  nampa: {
    weeks: [["June 1–5", "Beach Week"], ["June 8–12", "Safari Week"], ["June 15–19", "Space Week"], ["June 22–26", "Sports Week"], ["June 29–July 3", "Camping & Nature Week"], ["July 6–10", "Around the World Week"], ["July 13–17", "STEAM Week"], ["July 20–24", "Christmas in July"], ["July 27–31", "Pirate Week"], ["Aug 3–7", "Circus Week"]],
    half: "$25 per half day", full: "$45 per full day",
    deals: ["Book 10 days, get one free ($405 for 10 days)", "10% sibling discount"],
  },
  eagle: {
    weeks: [["May 26–29", "Sports Week"], ["June 1–5", "Science Week"], ["June 8–12", "Art Week"], ["June 15–19", "Lego Week"], ["June 22–26", "Around the World Week"], ["June 29–July 3", "Disney Week"], ["July 6–10", "Magic Week"], ["July 13–17", "Ninja & Cheer Week"], ["July 20–24", "Gaming Week"], ["July 27–31", "Animal Week"], ["Aug 3–7", "Circus Week"]],
    half: "$35 per half day", full: "$60 per full day",
    deals: ["Summer bundle: 10 full days for $540", "10% off when you sign up for the whole summer", "10% sibling discount"],
  },
};

export const PRESCHOOL: Record<LocationKey, { options: { label: string; ages: string; days: string; time: string; price: string }[]; note: string }> = {
  eagle: {
    options: [
      { label: "3-year-old class", ages: "Age 3 (potty trained)", days: "Mon / Wed", time: "9:15 AM – 12:00 PM", price: "$225 / month" },
      { label: "2-day", ages: "Ages 4–5", days: "Tue / Thu", time: "9:15 AM – 1:15 PM", price: "$325 / month" },
      { label: "3-day", ages: "Ages 4–5", days: "Mon / Wed / Fri", time: "9:15 AM – 1:15 PM", price: "$460 / month" },
      { label: "5-day", ages: "Ages 4–5", days: "Mon – Fri", time: "9:15 AM – 1:15 PM", price: "$590 / month" },
    ],
    note: "A one-time supply fee is due at registration.",
  },
  nampa: {
    options: [
      { label: "2-day", ages: "Age 3", days: "Tue / Thu", time: "9:00 AM – 12:30 PM", price: "$250 / month + $125 supply fee" },
      { label: "3-day", ages: "Ages 3–5", days: "Mon / Wed / Fri", time: "9:00 AM – 12:00 PM", price: "$340 / month + $75 supply fee" },
    ],
    note: "Our Nampa 4–5 class is full for this school year. Ask about the waitlist.",
  },
};

// ─── URL helpers (match the old site's URLs so search rankings carry over) ──

export const programPath = (p: ProgramKey, loc?: LocationKey) => `/programs/${loc ? `${loc}-` : ""}${p}`;
export const eventPath = (e: EventKey, loc?: LocationKey) => `/events/${loc ? `${loc}-` : ""}${e}`;
export const campPath = (loc: LocationKey) => `/${loc}-camp`;
export const classesPath = (loc?: LocationKey, program?: string) => {
  const q = new URLSearchParams();
  if (loc) q.set("location", loc);
  if (program) q.set("program", program);
  const s = q.toString();
  return `/classes${s ? `?${s}` : ""}`;
};

export const EVENT_TITLES: Record<EventKey, { title: string; seo: string; blurb: string }> = {
  "birthday-parties": { title: "Birthday Parties", seo: "Kids Birthday Parties", blurb: "Saturday gym parties with an hour of play, a party room and a host. We clean up." },
  "open-play": { title: "Open Play", seo: "Open Play & Indoor Playground", blurb: "Drop-in morning play for little ones on obstacles our staff set up." },
  "kids-night-out": { title: "Kids Night Out", seo: "Kids Night Out", blurb: "A Friday night of gym games, pizza and fun while you get a night off." },
};
