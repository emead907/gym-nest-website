import { ImageResponse } from "next/og";
export const alt = "The Gym Nest Activity Center – kids gymnastics, ninja and cheer in Nampa and Eagle, Idaho";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#e3f6f6", color: "#2c3070" }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#9c2fae" }}>THE GYM NEST · ACTIVITY CENTER</div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 20 }}>Kids gymnastics, ninja &amp; cheer</div>
        <div style={{ fontSize: 44, marginTop: 24 }}>Nampa &amp; Eagle, Idaho · First class free</div>
      </div>
    ),
    size,
  );
}
