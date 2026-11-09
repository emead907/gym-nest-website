import { ChevronDown } from "lucide-react";

export function Faq({ faqs, title = "Questions parents ask" }: { faqs: { q: string; a: string }[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-bold text-navy">{title}</h2>
      <div className="mt-6 divide-y divide-line rounded-3xl border border-line">
        {faqs.map((f) => (
          <details key={f.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold text-ink">
              {f.q}
              <ChevronDown aria-hidden className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
