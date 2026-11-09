# The Gym Nest website

Next.js site for The Gym Nest Activity Center (Nampa & Eagle, ID).

- Class finder reads Jackrabbit's public openings feed (no key) every 10 minutes, with a saved schedule as a fallback.
- "Try a class" and party requests go to the Gym Stars Hub boards for Nampa or Eagle.
- All text, prices and times live in `app/lib/site.ts`.

## Vercel environment variables
- `HUB_URL` — https://hub.gymstarsidaho.com
- `HUB_NAMPA_KEY` — Hub → The Gym Nest – Nampa → Settings → key
- `HUB_EAGLE_KEY` — Hub → The Gym Nest – Eagle → Settings → key

## SEO
- URLs match the old Wix site (`/programs/eagle-gymnastics`, `/events/nampa-birthday-parties`, `/eagle-camp`…), so existing Google rankings carry over.
- Every page has its own title, description, canonical URL and Open Graph tags.
- Structured data: Organization, two LocalBusiness locations, Services, Courses (live class list), FAQ and breadcrumbs.
- `sitemap.xml` and `robots.txt` are generated automatically.
