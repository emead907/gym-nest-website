import { ImageResponse } from "next/og";
export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#2c3070", borderRadius: 96, color: "white", fontSize: 260, fontWeight: 800 }}>
        N
      </div>
    ),
    size,
  );
}
