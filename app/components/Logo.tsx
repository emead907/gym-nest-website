/** Text wordmark in the brand colors. Swap for the real logo file when there's a clean version. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex flex-col leading-none">
      <span className={`font-display text-[26px] font-bold tracking-wide ${light ? "text-white" : "text-navy"}`}>
        The <span className={light ? "text-aqua" : "text-orchid-dark"}>Gym</span> Nest
      </span>
      <span className="mt-0.5 flex items-center gap-2">
        <span className={`font-display text-[13px] font-semibold ${light ? "text-aqua-tint" : "text-navy"}`}>activity center</span>
        <svg aria-hidden width="46" height="10" viewBox="0 0 46 10">
          <path d="M1 7 L44 2 M3 2 L42 8 M10 9 L38 4" stroke={light ? "#97e2e3" : "#97e2e3"} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </svg>
      </span>
    </span>
  );
}
