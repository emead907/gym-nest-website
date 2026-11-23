# The Gym Nest Nampa website

Next.js site for The Gym Nest Activity Center in Nampa, ID.

## Jackrabbit integration
- Class times, coaches, open spots **and monthly tuition** come live from Jackrabbit's public openings feed (no key), refreshed every 10 minutes. Only Nampa classes are shown.
- "Enroll" links open Jackrabbit registration with that class already picked (`&preLoadClassID=`).
- The Pricing page and the Open Play monthly pass read their prices from the same feed.
- If Jackrabbit is down, the site uses a saved copy: `app/lib/fallback-classes.json`. Refresh it any time with `npm run save-schedule`.

## Editing content
All text, prices (parties, camp, preschool, open play, KNO), party times and blocked party dates live in `app/lib/site.ts`.

## Where form submissions go
- **Class / waitlist / evaluation requests** → the Hub (The Gym Nest – Nampa) + Zapier email.
- **Birthday party requests** → the Hub party board. Saturdays only; blocked dates are in `PARTY.blockedDates`.
- **Contact messages and job applications** → Zapier, with `kind` = `contact` or `job`, plus ready-made `subject` and `summary` fields.

## Vercel environment variables
- `HUB_URL` — the Hub's web address
- `HUB_NAMPA_KEY` — Hub → The Gym Nest – Nampa → Settings → key
- `ZAPIER_WEBHOOK_URL` — the Zap that emails the front desk

## SEO
- Old Wix URLs (`/programs/nampa-gymnastics`, `/events/nampa-birthday-parties`, `/nampa-camp`…) redirect to the new pages, so existing Google rankings carry over.
- Every page has its own title, description, canonical URL and Open Graph tags.
- Structured data: the gym as a LocalBusiness, Services, Courses with live prices, FAQ and breadcrumbs.
- `sitemap.xml` and `robots.txt` are generated automatically.
