import { NextResponse, type NextRequest } from "next/server";
import { isLocation, s, sendToHub } from "../../lib/hub";

/** Birthday party requests → that gym's Hub party board. */
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  if (s(data.website)) return NextResponse.json({ ok: true });
  if (!isLocation(data.location)) return NextResponse.json({ error: "Pick a gym." }, { status: 422 });
  if (!s(data.parent) || (!s(data.email) && !s(data.phone))) {
    return NextResponse.json({ error: "Please add your name and how to reach you." }, { status: 422 });
  }
  const result = await sendToHub(data.location, {
    kind: "party",
    id: `web-party-${Date.now()}`,
    parent: s(data.parent),
    email: s(data.email),
    phone: s(data.phone),
    child: s(data.child),
    child_age: s(data.childAge),
    party_date: s(data.partyDate),
    time_slot: s(data.timeSlot),
    num_children: s(data.numChildren),
    theme: s(data.theme),
    comments: s(data.comments, 1000),
  });
  return result.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Could not send" }, { status: 502 });
}
