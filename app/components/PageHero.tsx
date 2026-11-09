import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Page header with breadcrumbs. The breadcrumb trail also goes into structured data on each page. */
export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: string; intro?: string; crumbs?: { name: string; path: string }[]; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-aqua-tint">
      <Decor />
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 text-sm font-bold text-muted">
            <ol className="flex flex-wrap items-center gap-1">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5" />}
                  {i < crumbs.length - 1 ? <Link href={c.path} className="hover:text-navy hover:underline">{c.name}</Link> : <span aria-current="page" className="text-navy">{c.name}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="text-sm font-extrabold uppercase tracking-widest text-orchid-dark">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-navy sm:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

/** The logo's "nest" sticks, drawn faintly in the corner. */
export function Decor() {
  return (
    <svg aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-56 w-[30rem] opacity-60 sm:right-0" viewBox="0 0 480 220">
      <path d="M20 170 L440 120 M60 120 L420 190 M120 200 L400 150 M200 95 L470 175" stroke="#97e2e3" strokeWidth="18" strokeLinecap="round" fill="none" />
      <circle cx="430" cy="60" r="10" fill="#96fa5f" />
      <circle cx="380" cy="30" r="6" fill="#da64ea" />
    </svg>
  );
}
