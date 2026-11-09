import { NextResponse, type NextRequest } from "next/server";
import { isLocation, s, sendToHub } from "../../lib/hub";

/** Class finder "Try a class" / waitlist requests → that gym's Hub trial board. */
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (s(data.website)) return NextResponse.json({ ok: true }); // honeypot: a bot
  if (!isLocation(data.location)) return NextResponse.json({ error: "Pick a gym." }, { status: 422 });
  if (!s(data.childName) || !s(data.parent) || (!s(data.email) && !s(data.phone))) {
    return NextResponse.json({ error: "Please fill in your name, contact info and your child's name." }, { status: 422 });
  }
  const result = await sendToHub(data.location, {
    id: `web-${s(data.classId)}-${Date.now()}`,
    class: s(data.className),
    requested_time: s(data.requestedTime),
    parent: s(data.parent),
    email: s(data.email),
    phone: s(data.phone),
    sms_opt_in: data.smsOptIn === true,
    waitlist: data.waitlist === true,
    notes: "Came from the website class finder.",
    children: [{ name: s(data.childName, 120), birthday: s(data.childBirthday, 20) }],
  });
  return result.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Could not send" }, { status: 502 });
}
