import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { LocationSwitch } from "./LocationSwitch";
import { PARENT_PORTAL_URL } from "../lib/site";

const NAV = [
  { href: "/classes", label: "Find a Class" },
  { href: "/programs", label: "Programs" },
  { href: "/events/birthday-parties", label: "Parties" },
  { href: "/events", label: "Events" },
  { href: "/camps", label: "Camps" },
  { href: "/preschool", label: "Preschool" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="The Gym Nest home" className="mr-auto lg:mr-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-5 text-[15px] font-extrabold text-ink lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="py-2 hover:text-orchid-dark">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocationSwitch />
          <a href={PARENT_PORTAL_URL} className="hidden min-h-11 items-center rounded-full border-2 border-navy px-4 text-sm font-extrabold text-navy hover:bg-navy hover:text-white xl:inline-flex">
            Parent Portal
          </a>
          <details className="relative lg:hidden">
            <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border-2 border-line text-navy" aria-label="Menu">
              <Menu aria-hidden className="h-5 w-5" />
            </summary>
            <nav aria-label="Mobile" className="absolute right-0 mt-2 w-60 rounded-2xl border border-line bg-white p-2 shadow-xl">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 font-extrabold text-ink hover:bg-aqua-tint">
                  {n.label}
                </Link>
              ))}
              <a href={PARENT_PORTAL_URL} className="block rounded-xl px-4 py-3 font-extrabold text-ink hover:bg-aqua-tint">
                Parent Portal
              </a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
