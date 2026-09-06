import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const alt = "Marcio Barrios ⋅ Design Engineer. I move pixels.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const [font, photo] = await Promise.all([
    readFile(join(process.cwd(), "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf")),
    readFile(join(process.cwd(), "public/media/marcio.jpg")),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "66px 80px",
        background: "#f7f8f5",
        color: "#272c26",
        fontFamily: "Geist Mono",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
        <span>mb.</span>
        <span style={{ color: "#61685f", fontSize: 20 }}>Barcelona, ES</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
        <img
          src={`data:image/jpeg;base64,${photo.toString("base64")}`}
          width={156}
          height={156}
          alt="Marcio Barrios"
          style={{ borderRadius: 18 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 38 }}>Marcio Barrios</span>
          <span style={{ fontSize: 24, color: "#61685f" }}>Design Engineer</span>
          <span style={{ fontSize: 54, color: "#52664a", marginTop: 8 }}>I move pixels.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #dde2d8",
          paddingTop: 24,
          fontSize: 18,
          color: "#61685f",
        }}
      >
        <span>Design, code & the details in between.</span>
        <span>Currently at MITO AI</span>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Geist Mono", data: font, weight: 400, style: "normal" }] },
  );
}
