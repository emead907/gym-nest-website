import Link from "next/link";
import { Logo } from "./Logo";
import { EVENT_TITLES, LOCATION_KEYS, LOCATIONS, PARENT_PORTAL_URL, PHONE, PHONE_HREF, PROGRAMS, PROGRAM_KEYS, SOCIAL, campPath, eventPath, programPath, type EventKey } from "../lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-[#dcddf6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs">Gymnastics, ninja, tumbling, cheer, preschool, open play and birthday parties for kids 18 months and up.</p>
          <a href={PHONE_HREF} className="mt-4 inline-block text-lg font-extrabold text-white">{PHONE}</a>
          <div className="mt-3 flex gap-4 text-sm font-bold">
            <a href={SOCIAL.instagram} className="text-white underline-offset-4 hover:underline">Instagram</a>
            <a href={SOCIAL.facebook} className="text-white underline-offset-4 hover:underline">Facebook</a>
            <a href={SOCIAL.supernova} className="text-white underline-offset-4 hover:underline">Supernova</a>
          </div>
        </div>

        {LOCATION_KEYS.map((k) => {
          const l = LOCATIONS[k];
          return (
            <div key={k}>
              <h2 className="font-display text-xl font-semibold text-white">
                <Link href={`/locations/${k}`} className="hover:underline">The Gym Nest {l.name}</Link>
              </h2>
              <address className="mt-2 not-italic">
                <a href={l.mapsUrl} className="hover:underline">{l.street}<br />{l.city}, {l.region} {l.zip}</a>
                <br />
                <a href={`mailto:${l.email}`} className="hover:underline">{l.email}</a>
              </address>
              <ul className="mt-3 space-y-1 text-sm">
                {PROGRAM_KEYS.map((p) => (
                  <li key={p}><Link href={programPath(p, k)} className="hover:underline">{l.name} {PROGRAMS[p].title}</Link></li>
                ))}
                {(Object.keys(EVENT_TITLES) as EventKey[]).map((e) => (
                  <li key={e}><Link href={eventPath(e, k)} className="hover:underline">{l.name} {EVENT_TITLES[e].title}</Link></li>
                ))}
                <li><Link href={campPath(k)} className="hover:underline">{l.name} Summer Camp</Link></li>
              </ul>
            </div>
          );
        })}

        <div>
          <h2 className="font-display text-xl font-semibold text-white">Families</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/classes" className="hover:underline">Find a class</Link></li>
            <li><Link href="/preschool" className="hover:underline">Preschool</Link></li>
            <li><Link href="/policies" className="hover:underline">Policies & tuition</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><a href={PARENT_PORTAL_URL} className="hover:underline">Parent portal</a></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-sm">© {new Date().getFullYear()} The Gym Nest Activity Center · Nampa & Eagle, Idaho</p>
    </footer>
  );
}
