import { CampPage } from "../components/CampPage";
import { pageMeta } from "../lib/seo";
export const metadata = pageMeta({ title: "Kids Summer Camp in Nampa, ID", description: "Themed summer day camp for ages 4–12 at The Gym Nest Nampa: gym time, gymnastics and ninja, crafts and science. Half day $25, full day $45.", path: "/nampa-camp" });
export default function Page() { return <CampPage loc="nampa" />; }
