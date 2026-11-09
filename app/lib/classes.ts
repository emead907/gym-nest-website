import fallback from "./fallback-classes.json";
import { JACKRABBIT_ORG_ID, type LocationKey } from "./site";

/**
 * Live classes from Jackrabbit's public "openings" feed: the same data
 * Jackrabbit's own online registration page shows. No login or API key.
 * Refreshed every 10 minutes. If Jackrabbit can't be reached, the site falls
 * back to a saved copy of the schedule so the class finder never breaks.
 */

export type FinderProgram = "Gymnastics" | "Ninja" | "Tumbling" | "Cheer" | "Homeschool";
export type AgeBand = "tot" | "3" | "45" | "612";

export interface SiteClass {
  id: string;
  name: string;
  location: LocationKey;
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
  regLink: string;
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
const HIDE = /advanced|intermediate|supernova|team|idaho arts|preschool|open play|jungle gym|commitment|waitlist|camp|party|kno|night out/i;

function programOf(name: string, category: string): FinderProgram {
  if (/homeschool/i.test(name)) return "Homeschool";
  if (/tumbling/i.test(name)) return "Tumbling";
  if (/cheer/i.test(name) || /cheer/i.test(category)) return "Cheer";
  if (/ninja/i.test(name) || /ninja/i.test(category)) return "Ninja";
  return "Gymnastics";
}

function locationOf(s: string): LocationKey | null {
  if (/nampa/i.test(s)) return "nampa";
  if (/eagle/i.test(s)) return "eagle";
  return null;
}

const REG_FALLBACK = `https://app.jackrabbitclass.com/regv2.asp?id=${JACKRABBIT_ORG_ID}`;

function toSiteClass(c: { id: string; name: string; category: string; location: string; days: string[]; start: string; end: string; coach: string; openings: number | null; max: number | null; regLink: string | null }): SiteClass | null {
  const name = c.name.replace(/\s+/g, " ").replace(/\.$/, "").replace(/^Beg\. /i, "Beginning ").replace(/^Mini Ninja Turtle$/i, "Mini Ninja Turtles").trim();
  if (HIDE.test(name)) return null;
  const loc = locationOf(c.location);
  const cat = CATALOG.find((x) => x.match.test(name));
  if (!loc || !cat) return null;
  return {
    id: c.id, name, location: loc, program: programOf(name, c.category),
    days: c.days, start: c.start, end: c.end, ages: cat.ages, bands: cat.bands, parentAndMe: !!cat.parentAndMe,
    coach: c.coach.replace(/\s+/g, " ").trim(),
    openings: c.openings == null ? null : Math.max(0, c.openings), max: c.max, regLink: c.regLink || REG_FALLBACK,
  };
}

function fromFeed(r: Raw) {
  const md = (r.meeting_days ?? {}) as Raw;
  const op = (r.openings ?? {}) as Raw;
  const ins = Array.isArray(r.instructors) ? (r.instructors as unknown[]).map(str).filter(Boolean) : [str(r.instructors)].filter(Boolean);
  return toSiteClass({
    id: str(r.id), name: str(r.name), category: str(r.category1), location: str(r.location_name) || str(r.location),
    days: DAY_KEYS.filter(([k]) => md[k] === true || md[k] === "true" || md[k] === 1).map(([, l]) => l),
    start: clock(r.start_time), end: clock(r.end_time), coach: ins[0] ?? "",
    openings: num(op.calculated_openings ?? r.openings), max: num(r.max_size), regLink: str(r.online_reg_link) || null,
  });
}

function fromFallback() {
  return (fallback as { id: string; name: string; category: string; location: string; days: string[]; start: string; end: string; instructors: string[]; openings: number; max: number }[])
    .map((c) => toSiteClass({ ...c, coach: c.instructors[0] ?? "", regLink: null }))
    .filter((c): c is SiteClass => !!c);
}

export async function getClasses(): Promise<{ classes: SiteClass[]; live: boolean }> {
  const tries: [string, RequestInit][] = [
    ["https://app.jackrabbitclass.com/jr4.0/Openings/OpeningsJson", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ OrgId: JACKRABBIT_ORG_ID }) }],
    [`https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJson?OrgID=${JACKRABBIT_ORG_ID}`, { method: "GET" }],
  ];
  for (const [url, init] of tries) {
    try {
      const res = await fetch(url, { ...init, next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const json = (await res.json()) as Raw;
      const rows = Array.isArray(json.rows) ? json.rows : Array.isArray(json) ? json : null;
      if (!rows) continue;
      const classes = (rows as Raw[]).map(fromFeed).filter((c): c is SiteClass => !!c);
      if (classes.length) return { classes, live: true };
    } catch {
      // try the next address, then the saved schedule
    }
  }
  return { classes: fromFallback(), live: false };
}
