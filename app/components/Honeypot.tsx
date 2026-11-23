/** Bots fill every field; people never see this one. A filled-in "website" means spam. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>Leave this blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}
