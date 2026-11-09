import type { LocationKey } from "./site";

/**
 * Sends website requests to the right Gym Nest hub board (Nampa or Eagle).
 *
 * Vercel environment variables:
 *   HUB_URL         https://hub.gymstarsidaho.com
 *   HUB_NAMPA_KEY   Hub → The Gym Nest – Nampa → Settings → website key
 *   HUB_EAGLE_KEY   Hub → The Gym Nest – Eagle → Settings → website key
 */
const SLUG: Record<LocationKey, string> = { nampa: "gym-nest", eagle: "gym-nest-eagle" };

export async function sendToHub(location: LocationKey, payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const base = process.env.HUB_URL;
  const key = location === "nampa" ? process.env.HUB_NAMPA_KEY : process.env.HUB_EAGLE_KEY;
  if (!base || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[dev] Hub not configured, ${location} request not sent:`, payload);
      return { ok: true };
    }
    console.error("HUB_URL / HUB_*_KEY are not set in Vercel, so website requests have nowhere to go.");
    return { ok: false, error: "not-configured" };
  }
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/api/intake/${SLUG[location]}`, {
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

export const s = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const isLocation = (v: unknown): v is LocationKey => v === "nampa" || v === "eagle";
