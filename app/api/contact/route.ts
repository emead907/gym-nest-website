import { NextResponse, type NextRequest } from "next/server";
import { s, sendToZapier } from "../../lib/hub";
import { GYM } from "../../lib/site";

/**
 * Contact-us messages and job applications → Zapier, which emails the front desk.
 * Zapier gets `kind` ("contact" or "job"), a ready-to-use `subject` and a plain-text
 * `summary`, so one email step can handle both.
 */
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (s(data.website)) return NextResponse.json({ ok: true }); // honeypot: a bot

  const kind = data.kind === "job" ? "job" : "contact";
  const name = s(data.name, 120);
  const email = s(data.email, 200);
  const phone = s(data.phone, 40);
  const message = s(data.message, 3000);
  if (!name || (!email && !phone)) return NextResponse.json({ error: "Please add your name and how to reach you." }, { status: 422 });

  const extra = kind === "job" ? { position: s(data.position, 120), age: s(data.age, 10), availability: s(data.availability, 500), experience: s(data.experience, 2000) } : { topic: s(data.topic, 80) };
  const subject = kind === "job" ? `Job application: ${name} (${extra.position || "any position"})` : `Website message from ${name}${"topic" in extra && extra.topic ? ` about ${extra.topic}` : ""}`;
  const summary = [
    `Name: ${name}`,
    email && `Email: ${email}`,
    phone && `Phone: ${phone}`,
    ...Object.entries(extra).filter(([, v]) => v).map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`),
    message && `\n${message}`,
  ].filter(Boolean).join("\n");

  const ok = await sendToZapier({ kind, subject, summary, name, email, phone, message, ...extra, location: GYM.name, gymEmail: GYM.notifyEmail, submittedAt: new Date().toISOString() });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Could not send" }, { status: 502 });
}
