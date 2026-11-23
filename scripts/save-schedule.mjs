// Saves today's Jackrabbit schedule as the site's backup copy (app/lib/fallback-classes.json).
// The site only uses the backup when Jackrabbit can't be reached.
// Run: npm run save-schedule
import { writeFileSync } from "node:fs";

const FEED = "https://app.jackrabbitclass.com/jr3.0/Openings/OpeningsJson?OrgID=537979";
const DAYS = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
const clock = (s = "") => {
  const m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return s;
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? "PM" : "AM"}`;
};

const json = await (await fetch(FEED)).json();
const rows = json.rows
  .filter((r) => /nampa/i.test(r.location_name || r.location))
  .map((r) => ({
    id: String(r.id),
    name: r.name.trim(),
    category: r.category1 ?? "",
    location: r.location_name || r.location,
    days: DAYS.filter(([k]) => r.meeting_days?.[k]).map(([, l]) => l),
    start: clock(r.start_time),
    end: clock(r.end_time),
    instructors: r.instructors ?? [],
    openings: r.openings?.calculated_openings ?? null,
    max: r.max_size ? Number(r.max_size) : null,
    tuition: r.tuition?.fee ?? null,
  }));
writeFileSync(new URL("../app/lib/fallback-classes.json", import.meta.url), JSON.stringify(rows, null, 1) + "\n");
console.log(`Saved ${rows.length} Nampa classes.`);
