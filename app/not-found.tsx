import Link from "next/link";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl font-bold text-navy">Oops, that page flipped away.</h1>
      <p className="mt-4 text-lg text-muted">Let&rsquo;s get you back on the mat.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-navy px-7 font-extrabold text-white">Home</Link>
        <Link href="/classes" className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-7 font-extrabold text-navy">Find a class</Link>
      </div>
    </section>
  );
}
