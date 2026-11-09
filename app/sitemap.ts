import type { MetadataRoute } from "next";
import { EVENT_TITLES, LOCATION_KEYS, PROGRAM_KEYS, SITE_URL, campPath, eventPath, programPath, type EventKey } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "daily"),
    page("/classes", 0.95, "daily"),
    ...LOCATION_KEYS.map((l) => page(`/locations/${l}`, 0.9)),
    page("/programs", 0.8),
    ...PROGRAM_KEYS.flatMap((p) => [page(programPath(p), 0.7), ...LOCATION_KEYS.map((l) => page(programPath(p, l), 0.85, "daily"))]),
    page("/events", 0.7),
    ...(Object.keys(EVENT_TITLES) as EventKey[]).flatMap((e) => [page(eventPath(e), 0.7), ...LOCATION_KEYS.map((l) => page(eventPath(e, l), 0.8))]),
    page("/camps", 0.7),
    ...LOCATION_KEYS.map((l) => page(campPath(l), 0.75)),
    page("/preschool", 0.85),
    page("/contact", 0.6, "monthly"),
    page("/policies", 0.4, "monthly"),
    page("/faq", 0.5, "monthly"),
  ];
}
