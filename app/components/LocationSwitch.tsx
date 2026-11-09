"use client";

import { usePathname, useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { LOCATIONS, LOCATION_KEYS, type LocationKey } from "../lib/site";
import { useLocation } from "./LocationProvider";

/** Swaps "nampa" ↔ "eagle" in a location page's URL, e.g. /programs/nampa-ninjas → /programs/eagle-ninjas. */
function swapPath(path: string, to: LocationKey): string | null {
  const re = /(^|\/)(nampa|eagle)(?=-|\/|$)/;
  if (!re.test(path)) return null;
  return path.replace(re, `$1${to}`);
}

/** Nampa | Eagle toggle. On a location page it jumps to the same page at the other gym. */
export function LocationSwitch({ size = "md" }: { size?: "md" | "lg" }) {
  const { location, setLocation } = useLocation();
  const pathname = usePathname();
  const router = useRouter();

  const pick = (l: LocationKey) => {
    setLocation(l);
    const next = swapPath(pathname, l);
    if (next && next !== pathname) router.push(next);
  };

  const pad = size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  return (
    <div role="group" aria-label="Choose your gym" className="inline-flex items-center gap-1 rounded-full bg-aqua-tint p-1">
      <MapPin aria-hidden className="ml-2 h-4 w-4 text-navy" />
      {LOCATION_KEYS.map((k) => {
        const on = location === k;
        return (
          <button
            key={k}
            type="button"
            aria-pressed={on}
            onClick={() => pick(k)}
            className={`min-h-11 rounded-full font-extrabold transition ${pad} ${on ? "bg-navy text-white shadow-sm" : "text-navy hover:bg-white"}`}
          >
            {LOCATIONS[k].name}
          </button>
        );
      })}
    </div>
  );
}
