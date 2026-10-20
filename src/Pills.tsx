import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeOut, pop, sec } from "./anim";
import { brand, FPS } from "./style";
import { Pill } from "./types";

const variants = {
  white: { background: brand.white, color: brand.ink, fontFamily: brand.font, border: "none" },
  accent: { background: brand.accent, color: brand.white, fontFamily: brand.font, border: "none" },
  pixel: { background: "#2E7D32", color: "#E8FFE8", fontFamily: brand.mono, border: "4px solid #E8FFE8" },
};

// Etiquetas apiladas encima de los subtítulos; las que se solapan en el tiempo se apilan.
export const Pills: React.FC<{ pills: Pill[]; bottom: number }> = ({ pills, bottom }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const live = pills.filter((p) => t >= p.at && t < p.until);
  return (
    <div style={{ position: "absolute", bottom, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {live.map((p, i) => {
        const v = variants[p.variant ?? "white"];
        const s = pop(frame, sec(p.at));
        return (
          <div
            key={i}
            style={{
              ...v,
              transform: `scale(${s})`,
              opacity: fadeOut(frame, sec(p.until)),
              padding: "10px 26px",
              borderRadius: 14,
              fontSize: 52,
              fontWeight: 800,
              boxShadow: "0 8px 30px rgba(0,0,0,.25)",
            }}
          >
            {p.text}
          </div>
        );
      })}
    </div>
  );
};
