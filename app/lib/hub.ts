/**
 * Sends website requests (class requests, waitlist, parties) to The Gym Nest – Nampa board in the Hub.
 *
 * Vercel environment variables:
 *   HUB_URL         the Hub's web address
 *   HUB_NAMPA_KEY   Hub → The Gym Nest – Nampa → Settings → website key
 */
const SLUG = "gym-nest";

export async function sendToHub(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.HUB_URL;
  const key = process.env.HUB_NAMPA_KEY;
  if (!base || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[dev] Hub not configured, request not sent:", payload);
      return { ok: true };
    }
    console.error("HUB_URL / HUB_NAMPA_KEY are not set in Vercel, so website requests have nowhere to go.");
    return { ok: false, error: "not-configured" };
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/intake/${SLUG}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-intake-key": key },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("Hub rejected the request:", res.status, await res.text().catch(() => ""));
      return { ok: false, error: `hub-${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("Could not reach the Hub:", err);
    return { ok: false, error: "unreachable" };
  }
}

/**
 * Sends a request to Zapier (ZAPIER_WEBHOOK_URL), which emails the front desk.
 * `kind` tells the Zap what it is: "trial", "waitlist", "evaluation", "contact" or "job".
 */
export async function sendToZapier(lead: Record<string, unknown>): Promise<boolean> {
  const url = process.env.ZAPIER_WEBHOOK_URL;
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[dev] ZAPIER_WEBHOOK_URL not set, so no email:", lead);
      return true;
    }
    console.error("ZAPIER_WEBHOOK_URL is not set in Vercel, so website requests aren't emailed.");
    return false;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Zapier rejected the request:", res.status);
    return res.ok;
  } catch (err) {
    console.error("Could not reach Zapier:", err);
    return false;
  }
}

export const s = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
