import { PageHero } from "../components/PageHero";
import { LocationCards } from "../components/LocationCards";
import { Cta } from "../components/Cta";
import { CAMPS, campPath } from "../lib/site";
import { pageMeta } from "../lib/seo";
export const metadata = pageMeta({ title: "Kids Summer Camps in Nampa & Eagle, ID", description: "Themed summer day camps for ages 4–12 at The Gym Nest in Nampa and Eagle, Idaho. Half and full days.", path: "/camps" });
export default function Page() {
  return (
    <>
      <PageHero eyebrow="Summer camp" title="Kids summer camps in Nampa & Eagle" intro="A new theme every week, with gym time, lessons, crafts, science and games. Ages 4–12." crumbs={[{ name: "Home", path: "/" }, { name: "Camps", path: "/camps" }]} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6"><LocationCards href={campPath} label="Camp in" note={(k) => `${CAMPS[k].half} · ${CAMPS[k].full}`} /></section>
      <Cta />
    </>
  );
}
