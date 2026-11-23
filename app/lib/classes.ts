import fallback from "./fallback-classes.json";
import { JACKRABBIT_ORG_ID, REGISTER_URL } from "./site";

/**
 * Live classes from Jackrabbit's public "openings" feed: the same data
 * Jackrabbit's own online registration page shows (times, coaches, open spots
 * and monthly tuition). No login or API key. Refreshed every 10 minutes.
 * If Jackrabbit can't be reached, the site uses a saved copy of the schedule
 * (fallback-classes.json; refresh it with `npm run save-schedule`).
 *
 * Only The Gym Nest Nampa's classes are shown. The org also has Eagle classes.
 */

export type FinderProgram = "Gymnastics" | "Ninja" | "Tumbling" | "Cheer" | "Homeschool";
export type AgeBand = "tot" | "3" | "45" | "612";

export interface SiteClass {
  id: string;
  name: string;
  program: FinderProgram;
  days: string[];
  start: string;
  end: string;
  ages: string;
  bands: AgeBand[];
  parentAndMe: boolean;
  coach: string;
  openings: number | null;
  max: number | null;
  /** Monthly tuition in dollars, from Jackrabbit. */
  tuition: number | null;
  regLink: string;
}

/** The trimmed shape saved in fallback-classes.json. */
export interface FeedClass {
  id: string;
  name: string;
  category: string;
  location: string;
  days: string[];
  start: string;
  end: string;
  instructors: string[];
  openings: number | null;
  max: number | null;
  tuition: number | null;
}

type Raw = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(str(v));
  return Number.isFinite(n) ? n : null;
};
const DAY_KEYS: [string, string][] = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];

/** "16:30" / "4:30 PM" → "4:30 PM" */
function clock(v: unknown) {
  const s = str(v);
  const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?$/) ?? s.match(/T(\d{2}):(\d{2})/);
  if (!m) return s;
  let h = Number(m[1]);
  if (m[3]) return `${h}:${m[2]} ${m[3].toUpperCase()}`;
  const pm = h >= 12;
  h = h % 12 || 12;
  return `${h}:${m[2]} ${pm ? "PM" : "AM"}`;
}

/** Classes we list publicly, matched by name. Ages follow the program pages. */
const CATALOG: { match: RegExp; ages: string; bands: AgeBand[]; parentAndMe?: boolean }[] = [
  { match: /happy hoppers/i, ages: "18–36 months", bands: ["tot"], parentAndMe: true },
  { match: /tiny tumblers/i, ages: "3 years", bands: ["3"] },
  { match: /mini ninja/i, ages: "3–4 years", bands: ["3", "45"] },
  { match: /rockin/i, ages: "4–5 years", bands: ["45"] },
  { match: /ninja turtles/i, ages: "5–6 years", bands: ["45", "612"] },
  { match: /ninja rec/i, ages: "5–12 years", bands: ["45", "612"] },
  { match: /homeschool/i, ages: "4–12 years", bands: ["45", "612"] },
  { match: /^ninjas?$/i, ages: "6–12 years", bands: ["612"] },
  { match: /kids rec/i, ages: "6–12 years", bands: ["612"] },
  { match: /^beg(\.|inning)? tumbling/i, ages: "6 and up", bands: ["612"] },
  { match: /cheer rec/i, ages: "6 and up", bands: ["612"] },
];
/** Invite-only, team, preschool and other classes that aren't for new sign-ups. */
const HIDE = /advanced|intermediate|supernova|team|idaho arts|preschool|open play|jungle gym|commitment|waitlist|camp|party|kno|night out|pass/i;

function programOf(name: string, category: string): FinderProgram {
  if (/homeschool/i.test(name)) return "Homeschool";
  if (/tumbling/i.test(name)) return "Tumbling";
  if (/cheer/i.test(name) || /cheer/i.test(category)) return "Cheer";
  if (/ninja/i.test(name) || /ninja/i.test(category)) return "Ninja";
  return "Gymnastics";
}

const isNampa = (location: string) => /nampa/i.test(location);
export const regLinkFor = (id: string) => (id ? `${REGISTER_URL}&preLoadClassID=${id}` : REGISTER_URL);

function cleanName(n: string) {
  return n.replace(/\s+/g, " ").replace(/\.$/, "").replace(/^Beg\. /i, "Beginning ").replace(/^Mini Ninja Turtle$/i, "Mini Ninja Turtles").trim();
}

function toSiteClass(c: FeedClass): SiteClass | null {
  const name = cleanName(c.name);
  if (HIDE.test(name) || !isNampa(c.location) || !c.days.length) return null;
  const cat = CATALOG.find((x) => x.match.test(name));
  if (!cat) return null;
  return {
    id: c.id, name, program: programOf(name, c.category),
    days: c.days, start: c.start, end: c.end, ages: cat.ages, bands: cat.bands, parentAndMe: !!cat.parentAndMe,
    coach: (c.instructors[0] ?? "").replace(/\s+/g, " ").trim(),
    openings: c.openings == null ? null : Math.max(0, c.openings), max: c.max,
    tuition: c.tuition && c.tuition > 0 ? c.tuition : null,
    regLink: regLinkFor(c.id),
  };
}

/** One Jackrabbit row → the trimmed shape we use (and save as the fallback). */
function fromFeed(r: Raw): FeedClass {
  const md = (r.meeting_days ?? {}) as Raw;
  const op = (r.openings ?? {}) as Raw;
  const tu = (r.tuition ?? {}) as Raw;
  const ins = Array.isArray(r.instructors) ? (r.instructors as unknown[]).map(str).filter(Boolean) : [str(r.instructors)].filter(Boolean);
  return {
    id: str(r.id), name: str(r.name), category: str(r.category1), location: str(r.location_name) || str(r.location),
    days: DAY_KEYS.filter(([k]) => md[k] === true || md[k] === "true" || md[k] === 1).map(([, l]) => l),
    start: clock(r.start_time), end: clock(r.end_time), instructors: ins,
    openings: num(op.calculated_openings ?? r.openings), max: num(r.max_size), tuition: num(tu.fee ?? r.tuition),
  };
}

const FEED_URL = `https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJson?OrgID=${JACKRABBIT_ORG_ID}`;
const saved = fallback as FeedClass[];

/** Every row in the feed (both gyms, all classes), or null if Jackrabbit can't be reached. */
async function feed(): Promise<FeedClass[] | null> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const json = (await res.json()) as Raw;
    const rows = Array.isArray(json.rows) ? json.rows : Array.isArray(json) ? json : null;
    return rows && rows.length ? (rows as Raw[]).map(fromFeed) : null;
  } catch {
    return null;
  }
}

const toClasses = (rows: FeedClass[]) => rows.map(toSiteClass).filter((c): c is SiteClass => !!c);

export async function getClasses(): Promise<{ classes: SiteClass[]; live: boolean }> {
  const rows = await feed();
  const classes = rows ? toClasses(rows) : [];
  return classes.length ? { classes, live: true } : { classes: toClasses(saved), live: false };
}

/** Nampa memberships sold in Jackrabbit that aren't weekly classes (e.g. the Open Play monthly pass). */
export async function getPasses(): Promise<{ id: string; name: string; tuition: number; regLink: string }[]> {
  const rows = (await feed()) ?? saved;
  return rows
    .filter((r) => isNampa(r.location) && /pass/i.test(r.name) && r.tuition)
    .map((r) => ({ id: r.id, name: cleanName(r.name), tuition: r.tuition as number, regLink: regLinkFor(r.id) }));
}

/** "$88" */
export const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
