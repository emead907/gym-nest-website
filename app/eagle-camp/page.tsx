import { CampPage } from "../components/CampPage";
import { pageMeta } from "../lib/seo";
export const metadata = pageMeta({ title: "Kids Summer Camp in Eagle, ID", description: "Themed summer day camp for ages 4–12 at The Gym Nest Eagle: gym time, gymnastics and ninja, crafts and science. Half day $35, full day $60.", path: "/eagle-camp" });
export default function Page() { return <CampPage loc="eagle" />; }
