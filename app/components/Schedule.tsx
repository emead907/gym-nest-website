import Link from "next/link";
import type { SiteClass } from "../lib/classes";
import { classesPath, type LocationKey } from "../lib/site";

const ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mins = (t: string) => {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  return m ? ((Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + Number(m[2]) : 0;
};

/** Plain, crawlable list of this gym's current classes for a program, with live open spots. */
export function Schedule({ classes, location, program }: { classes: SiteClass[]; location: LocationKey; program: string }) {
  if (!classes.length) return <p className="text-muted">Call us for this season&rsquo;s schedule.</p>;
  const rows = [...classes].sort((a, b) => ORDER.indexOf(a.days[0]) - ORDER.indexOf(b.days[0]) || mins(a.start) - mins(b.start));
  return (
    <div className="overflow-x-auto rounded-3xl border border-line">
      <table className="w-full min-w-[560px] text-left">
        <thead className="bg-aqua-tint text-sm uppercase tracking-wide text-navy">
          <tr><th className="px-5 py-3">Class</th><th className="px-5 py-3">Ages</th><th className="px-5 py-3">Day & time</th><th className="px-5 py-3">Open spots</th></tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((c) => (
            <tr key={c.id}>
              <td className="px-5 py-3 font-extrabold text-ink">{c.name}</td>
              <td className="px-5 py-3 text-muted">{c.ages}</td>
              <td className="px-5 py-3 text-ink">{c.days.join(", ")} {c.start}–{c.end}</td>
              <td className={`px-5 py-3 font-extrabold ${c.openings === 0 ? "text-full" : c.openings != null && c.openings <= 2 ? "text-amber" : "text-navy"}`}>
                {c.openings == null ? "—" : c.openings === 0 ? "Waitlist" : c.openings}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-5 py-4">
        <p className="text-sm text-muted">Spots update throughout the day.</p>
        <Link href={classesPath(location, program)} className="inline-flex min-h-11 items-center rounded-full bg-navy px-5 font-extrabold text-white hover:bg-navy-dark">Try a class or register →</Link>
      </div>
    </div>
  );
}
