import { NextResponse, type NextRequest } from "next/server";
import { s, sendToHub } from "../../lib/hub";
import { PARTY } from "../../lib/site";

/** Birthday party requests → the Hub's Nampa party board. */
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (s(data.website)) return NextResponse.json({ ok: true }); // honeypot: a bot
  if (!s(data.parent) || (!s(data.email) && !s(data.phone))) {
    return NextResponse.json({ error: "Please add your name and how to reach you." }, { status: 422 });
  }
  const date = s(data.partyDate, 20);
  if (PARTY.blockedDates.includes(date)) return NextResponse.json({ error: "That date is booked." }, { status: 422 });

  const result = await sendToHub({
    kind: "party",
    id: `web-party-${Date.now()}`,
    parent: s(data.parent),
    email: s(data.email),
    phone: s(data.phone),
    child: s(data.child),
    child_age: s(data.childAge),
    party_date: date,
    time_slot: s(data.timeSlot),
    num_children: s(data.numChildren),
    theme: s(data.theme),
    comments: s(data.comments, 1000),
  });
  return result.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Could not send" }, { status: 502 });
}
