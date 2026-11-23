"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { PARENT_PORTAL_URL, PHONE, PHONE_HREF } from "../lib/site";

type Item = { label: string; href?: string; children?: { label: string; href: string; note?: string }[] };

const NAV: Item[] = [
  {
    label: "Classes",
    children: [
      { label: "Find a class", href: "/classes", note: "Live times and open spots" },
      { label: "Gymnastics", href: "/programs/gymnastics", note: "18 months – 12 years" },
      { label: "Ninja", href: "/programs/ninjas", note: "Ages 3 – 12" },
      { label: "Tumbling", href: "/programs/tumbling", note: "Ages 6 and up" },
      { label: "Cheer & Supernova", href: "/programs/cheer", note: "Rec cheer and all-star teams" },
      { label: "Homeschool", href: "/programs/homeschoolers", note: "Daytime PE classes" },
    ],
  },
  {
    label: "Preschool & Camps",
    children: [
      { label: "Preschool", href: "/preschool", note: "Ages 3 – 5" },
      { label: "Summer camp", href: "/camps", note: "Themed weeks, ages 4 – 12" },
    ],
  },
  {
    label: "Events",
    children: [
      { label: "Birthday parties", href: "/events/birthday-parties", note: "Saturdays, we clean up" },
      { label: "Kids Night Out", href: "/events/kids-night-out", note: "Friday nights" },
      { label: "Open play", href: "/events/open-play", note: "Drop-in mornings, 6 and under" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  {
    label: "About",
    children: [
      { label: "About us", href: "/about" },
      { label: "Policies", href: "/policies" },
      { label: "FAQ", href: "/faq" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Close menus on outside click or Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  const close = () => { setOpen(null); setMobile(false); };

  return (
    <header ref={ref} className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="hidden bg-navy text-sm text-[#dcddf6] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6">
          <p>849 S. Rising Sun Dr, Nampa · Every new student starts with a no-risk first day</p>
          <a href={PHONE_HREF} className="flex items-center gap-1.5 font-extrabold text-white hover:underline"><Phone aria-hidden className="h-3.5 w-3.5" />{PHONE}</a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="The Gym Nest Nampa home" className="mr-auto lg:mr-2" onClick={close}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 text-[15px] font-extrabold text-ink lg:flex">
          {NAV.map((n) =>
            n.href ? (
              <Link key={n.label} href={n.href} onClick={close} className="rounded-full px-3 py-2 hover:bg-aqua-tint hover:text-navy">{n.label}</Link>
            ) : (
              <div key={n.label} className="relative">
                <button
                  type="button"
                  aria-expanded={open === n.label}
                  onClick={() => setOpen(open === n.label ? null : n.label)}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 hover:bg-aqua-tint hover:text-navy ${open === n.label ? "bg-aqua-tint text-navy" : ""}`}
                >
                  {n.label}
                  <ChevronDown aria-hidden className={`h-4 w-4 transition ${open === n.label ? "rotate-180" : ""}`} />
                </button>
                {open === n.label && (
                  <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-line bg-white p-2 shadow-xl">
                    {n.children!.map((c) => (
                      <Link key={c.href} href={c.href} onClick={close} className="block rounded-xl px-4 py-2.5 hover:bg-aqua-tint">
                        <span className="block text-navy">{c.label}</span>
                        {c.note && <span className="block text-xs font-bold text-muted">{c.note}</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a href={PARENT_PORTAL_URL} className="hidden min-h-11 items-center rounded-full border-2 border-navy px-4 text-sm font-extrabold text-navy hover:bg-navy hover:text-white xl:inline-flex">
            Parent Portal
          </a>
          <Link href="/classes" onClick={close} className="hidden min-h-11 items-center rounded-full bg-orchid px-5 text-sm font-extrabold text-navy-dark hover:brightness-105 sm:inline-flex">
            Enroll
          </Link>
          <button
            type="button"
            onClick={() => setMobile(!mobile)}
            aria-expanded={mobile}
            aria-label={mobile ? "Close menu" : "Menu"}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-line text-navy lg:hidden"
          >
            {mobile ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav aria-label="Mobile" className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-2 lg:hidden">
          {NAV.map((n) =>
            n.href ? (
              <Link key={n.label} href={n.href} onClick={close} className="block rounded-xl px-3 py-3 text-lg font-extrabold text-ink hover:bg-aqua-tint">{n.label}</Link>
            ) : (
              <div key={n.label}>
                <button type="button" onClick={() => setOpen(open === n.label ? null : n.label)} aria-expanded={open === n.label} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-lg font-extrabold text-ink hover:bg-aqua-tint">
                  {n.label}
                  <ChevronDown aria-hidden className={`h-5 w-5 transition ${open === n.label ? "rotate-180" : ""}`} />
                </button>
                {open === n.label && (
                  <div className="mb-2 ml-3 border-l-2 border-line pl-3">
                    {n.children!.map((c) => (
                      <Link key={c.href} href={c.href} onClick={close} className="block rounded-xl px-3 py-2.5 font-bold text-navy hover:bg-aqua-tint">{c.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
          <div className="mt-4 grid gap-2">
            <Link href="/classes" onClick={close} className="flex min-h-12 items-center justify-center rounded-full bg-orchid font-extrabold text-navy-dark">Enroll</Link>
            <a href={PARENT_PORTAL_URL} className="flex min-h-12 items-center justify-center rounded-full border-2 border-navy font-extrabold text-navy">Parent Portal</a>
            <a href={PHONE_HREF} className="flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-line font-extrabold text-navy"><Phone aria-hidden className="h-4 w-4" />{PHONE}</a>
          </div>
        </nav>
      )}
    </header>
  );
}
