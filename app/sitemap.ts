import type { MetadataRoute } from "next";
import { EVENT_TITLES, PROGRAM_KEYS, SITE_URL, eventPath, programPath, type EventKey } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly") => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });
  return [
    page("/", 1, "daily"),
    page("/classes", 0.95, "daily"),
    page("/programs", 0.8),
    ...PROGRAM_KEYS.map((p) => page(programPath(p), 0.9, "daily")),
    page("/pricing", 0.85, "daily"),
    page("/events", 0.7),
    ...(Object.keys(EVENT_TITLES) as EventKey[]).map((e) => page(eventPath(e), 0.8)),
    page("/camps", 0.75),
    page("/preschool", 0.85),
    page("/about", 0.6, "monthly"),
    page("/contact", 0.6, "monthly"),
    page("/parent-portal", 0.5, "monthly"),
    page("/careers", 0.5, "monthly"),
    page("/policies", 0.4, "monthly"),
    page("/faq", 0.5, "monthly"),
  ];
}
