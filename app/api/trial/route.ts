import { NextResponse, type NextRequest } from "next/server";
import { s, sendToHub, sendToZapier } from "../../lib/hub";
import { GYM } from "../../lib/site";

/**
 * Class, waitlist and evaluation requests from the program pages and the
 * class finder. Each request goes two places at once:
 *
 *  1. The Hub: The Gym Nest – Nampa trial board.
 *  2. Zapier (ZAPIER_WEBHOOK_URL): emails the front desk and notes whether the
 *     family is already in Jackrabbit (it never creates accounts).
 *
 * The family is told it went through if either one worked, so a hiccup in one
 * never blocks a sign-up. Failures are logged in Vercel.
 */
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (s(data.website)) return NextResponse.json({ ok: true }); // honeypot: a bot

  const parentFirst = s(data.parentFirst, 80);
  const parentLast = s(data.parentLast, 80);
  const childFirst = s(data.childFirst, 80);
  const childLast = s(data.childLast, 80) || parentLast;
  const email = s(data.email, 200);
  const phone = s(data.phone, 40);
  if (!parentFirst || !parentLast || !childFirst || !email || !phone) {
    return NextResponse.json({ error: "Please fill in your name, email, phone and your child's name." }, { status: 422 });
  }

  const mode = data.mode === "waitlist" || data.mode === "evaluation" ? data.mode : "trial";
  const lead = {
    kind: mode,
    mode,
    location: GYM.name,
    gymEmail: GYM.notifyEmail,
    className: s(data.className),
    requestedTime: s(data.requestedTime),
    parentFirst,
    parentLast,
    parentName: `${parentFirst} ${parentLast}`,
    email,
    phone,
    zip: s(data.zip, 10),
    childFirst,
    childLast,
    childName: `${childFirst} ${childLast}`,
    childBirthday: s(data.childBirthday, 20),
    smsOptIn: data.smsOptIn === true ? "yes" : "no",
    source: s(data.source, 40) || "website",
    submittedAt: new Date().toISOString(),
  };

  const notes = [
    mode === "evaluation" ? "Requested an evaluation." : "",
    lead.source === "class-finder" ? "Came from the website class finder." : "Came from the website program page.",
  ].filter(Boolean).join(" ");

  const [hub, zap] = await Promise.all([
    sendToHub({
      id: `web-${s(data.classId) || "class"}-${Date.now()}`,
      class: lead.className,
      requested_time: lead.requestedTime,
      parent: lead.parentName,
      email,
      phone,
      zip: lead.zip,
      sms_opt_in: data.smsOptIn === true,
      waitlist: mode === "waitlist",
      notes,
      children: [{ name: lead.childName, birthday: lead.childBirthday }],
    }),
    sendToZapier(lead),
  ]);

  return hub.ok || zap
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Could not send" }, { status: 502 });
}
