import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  async redirects() {
    return [
      // The old site's portal page: send families straight to Jackrabbit.
      { source: "/portal", destination: "https://app.jackrabbitclass.com/jr3.0/ParentPortal/Login?orgId=537979", permanent: false },
      { source: "/class-finder", destination: "/classes", permanent: true },
      { source: "/schedule", destination: "/classes", permanent: true },
      { source: "/camp", destination: "/camps", permanent: true },
      { source: "/parties", destination: "/events/birthday-parties", permanent: true },
      { source: "/birthday-parties", destination: "/events/birthday-parties", permanent: true },
    ];
  },
};

export default nextConfig;
