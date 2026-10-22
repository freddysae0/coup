import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Coup — the bluffing card game, online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CARDS = [
  new URL("../public/cards/Duque.png", import.meta.url),
  new URL("../public/cards/Assasin.png", import.meta.url),
  new URL("../public/cards/Capitan.png", import.meta.url),
  new URL("../public/cards/Embajador.png", import.meta.url),
  new URL("../public/cards/Condesa.png", import.meta.url),
];

/** Share card: the headline next to a fan of the five characters. */
export default async function OpengraphImage() {
  const images = await Promise.all(
    CARDS.map(async (url) => {
      const buffer = await (await fetch(url)).arrayBuffer();
      let binary = "";

      new Uint8Array(buffer).forEach((b) => (binary += String.fromCharCode(b)));

      return `data:image/png;base64,${btoa(binary)}`;
    }),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#16252C",
          color: "#EEF2EF",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 560,
          }}
        >
          <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: 4 }}>
            COUP
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 0.95,
              marginTop: 24,
            }}
          >
            LIE YOUR WAY TO POWER.
          </div>
          <div style={{ fontSize: 28, marginTop: 28, color: "#A9DCCB" }}>
            The bluffing card game, online. 2–10 players.
          </div>
        </div>
        <div style={{ display: "flex", position: "relative", flex: 1 }}>
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src.slice(-20)}
              alt=""
              src={src}
              style={{
                position: "absolute",
                left: 60 + i * 62,
                top: 70 + Math.abs(i - 2) * 18,
                width: 200,
                height: 342,
                transform: `rotate(${(i - 2) * 9}deg)`,
              }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
