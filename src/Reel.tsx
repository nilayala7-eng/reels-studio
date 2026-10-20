import "@fontsource/inter-tight/500.css";
import "@fontsource/inter-tight/600.css";
import "@fontsource/inter-tight/800.css";
import "@fontsource/inter-tight/900.css";
import "@fontsource/inter-tight/500-italic.css";
import "@fontsource/jetbrains-mono/500.css";
import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { Captions } from "./Captions";
import { Inserts, insertActive } from "./Inserts";
import { Pills } from "./Pills";
import { brand, FPS } from "./style";
import { Edit, Word, Zoom } from "./types";

// Punch-in suave: cada zoom se mantiene hasta el siguiente.
const zoomAt = (zooms: Zoom[], frame: number) => {
  let scale = 1;
  for (const z of zooms) {
    const f0 = z.at * FPS;
    if (frame < f0) break;
    const prev = scale;
    scale = interpolate(frame, [f0, f0 + 5], [prev, z.scale], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }
  return scale;
};

export const Reel: React.FC<Edit & { wordsData: Word[] }> = (p) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const inserts = p.inserts ?? [];
  const onInsert = insertActive(inserts, t);
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoomAt(p.zooms ?? [], frame)})` }}>
        <OffthreadVideo src={staticFile(p.video)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Inserts inserts={inserts} />
      {p.title && !onInsert && (
        <div
          style={{
            position: "absolute",
            top: 150,
            width: "100%",
            padding: "0 90px",
            textAlign: "center",
            fontFamily: brand.font,
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.15,
            color: brand.white,
            textShadow: "0 3px 14px rgba(0,0,0,.6)",
          }}
        >
          {p.title}
        </div>
      )}
      <Pills pills={p.pills ?? []} bottom={p.captionPosition === "middle" ? 900 : 620} />
      <div style={{ color: onInsert ? brand.ink : brand.white }}>
        <Captions
          words={p.wordsData}
          style={p.captionStyle}
          position={onInsert ? "bottom" : p.captionPosition ?? "middle"}
          keywords={p.keywords ?? []}
        />
      </div>
    </AbsoluteFill>
  );
};
