import Link from "next/link";
import { MapPin } from "lucide-react";
import { LOCATIONS, LOCATION_KEYS, type LocationKey } from "../lib/site";

/** Two big "pick your gym" cards. `href` builds the link for each gym. */
export function LocationCards({ href, label = "View", note }: { href: (k: LocationKey) => string; label?: string; note?: (k: LocationKey) => string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {LOCATION_KEYS.map((k) => {
        const l = LOCATIONS[k];
        return (
          <Link key={k} href={href(k)} className="group rounded-3xl border-2 border-line bg-white p-7 transition hover:border-navy hover:shadow-lg">
            <p className="flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-widest text-orchid-dark"><MapPin aria-hidden className="h-4 w-4" />{l.name}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-navy">The Gym Nest {l.name}</p>
            <p className="mt-1 text-muted">{l.street}, {l.city}, ID {l.zip}</p>
            {note && <p className="mt-3 text-ink">{note(k)}</p>}
            <span className="mt-5 inline-flex min-h-11 items-center rounded-full bg-navy px-5 font-extrabold text-white group-hover:bg-navy-dark">{label} {l.name} →</span>
          </Link>
        );
      })}
    </div>
  );
}
