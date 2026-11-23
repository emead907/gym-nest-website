import type { NextConfig } from "next";
import path from "path";

const PORTAL = "https://app.jackrabbitclass.com/jr3.0/ParentPortal/Login?orgId=537979";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  async redirects() {
    return [
      { source: "/portal", destination: PORTAL, permanent: false },
      // Old Wix URLs (and the earlier two-gym version of this site) → the Nampa pages, so search rankings carry over.
      { source: "/programs/nampa-:program", destination: "/programs/:program", permanent: true },
      { source: "/events/nampa-:event", destination: "/events/:event", permanent: true },
      { source: "/nampa-camp", destination: "/camps", permanent: true },
      { source: "/locations/nampa", destination: "/", permanent: true },
      // Short links
      { source: "/class-finder", destination: "/classes", permanent: true },
      { source: "/schedule", destination: "/classes", permanent: true },
      { source: "/camp", destination: "/camps", permanent: true },
      { source: "/parties", destination: "/events/birthday-parties", permanent: true },
      { source: "/birthday-parties", destination: "/events/birthday-parties", permanent: true },
      { source: "/kno", destination: "/events/kids-night-out", permanent: true },
      { source: "/open-play", destination: "/events/open-play", permanent: true },
      { source: "/open-gym", destination: "/events/open-play", permanent: true },
      { source: "/jobs", destination: "/careers", permanent: true },
    ];
  },
};

export default nextConfig;
