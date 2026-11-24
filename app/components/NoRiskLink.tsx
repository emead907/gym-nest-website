import Link from "next/link";

/** Where the no-risk first day is explained. */
export const NO_RISK_HREF = "/policies#no-risk-first-day";

/** "no-risk first day" as a link to the policy that explains it. */
export function NoRiskLink({ children = "no-risk first day", className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <Link href={NO_RISK_HREF} className={`underline decoration-2 underline-offset-4 hover:decoration-orchid ${className}`}>
      {children}
    </Link>
  );
}
