import Link from "next/link";
import { Logo } from "./Logo";
import { EVENT_TITLES, GYM, PHONE, PHONE_HREF, PROGRAMS, PROGRAM_KEYS, SOCIAL, eventPath, programPath, type EventKey } from "../lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-[#dcddf6]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs">Gymnastics, ninja, tumbling, cheer, preschool, open play and birthday parties for kids 18 months and up.</p>
          <address className="mt-4 not-italic">
            <a href={GYM.mapsUrl} className="hover:underline">{GYM.street}<br />{GYM.city}, {GYM.region} {GYM.zip}</a>
            <br />
            <a href={PHONE_HREF} className="mt-2 inline-block text-lg font-extrabold text-white">{PHONE}</a>
            <br />
            <a href={`mailto:${GYM.email}`} className="hover:underline">{GYM.email}</a>
          </address>
          <div className="mt-3 flex gap-4 text-sm font-bold">
            <a href={SOCIAL.instagram} className="text-white underline-offset-4 hover:underline">Instagram</a>
            <a href={SOCIAL.facebook} className="text-white underline-offset-4 hover:underline">Facebook</a>
            <a href={SOCIAL.supernova} className="text-white underline-offset-4 hover:underline">Supernova</a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-white">Classes</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/classes" className="hover:underline">Find a class</Link></li>
            {PROGRAM_KEYS.map((p) => (
              <li key={p}><Link href={programPath(p)} className="hover:underline">{PROGRAMS[p].title}</Link></li>
            ))}
            <li><Link href="/preschool" className="hover:underline">Preschool</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-white">Events</h2>
          <ul className="mt-2 space-y-1">
            {(Object.keys(EVENT_TITLES) as EventKey[]).map((e) => (
              <li key={e}><Link href={eventPath(e)} className="hover:underline">{EVENT_TITLES[e].title}</Link></li>
            ))}
            <li><Link href="/camps" className="hover:underline">Summer camp</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-white">Families</h2>
          <ul className="mt-2 space-y-1">
            <li><Link href="/pricing" className="hover:underline">Pricing & fees</Link></li>
            <li><Link href="/policies" className="hover:underline">Policies</Link></li>
            <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
            <li><Link href="/parent-portal" className="hover:underline">Parent portal</Link></li>
            <li><Link href="/about" className="hover:underline">About us</Link></li>
            <li><Link href="/careers" className="hover:underline">Careers</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-sm">© {new Date().getFullYear()} The Gym Nest Activity Center · Nampa, Idaho</p>
    </footer>
  );
}
