import React from "react";
import { useCurrentFrame } from "remotion";
import { blurIn, pop } from "./anim";
import { brand, FPS } from "./style";
import { Word } from "./types";

const MAX_WORDS = 3;
const GAP_BREAK = 0.35;

const norm = (w: string) => w.toLowerCase().replace(/[.,!?¿¡:;"]/g, "");

// Agrupa palabras en bloques cortos: corta en puntuación, pausas o cada MAX_WORDS.
export const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const brk = /[.,!?:;]$/.test(w.w) || cur.length >= MAX_WORDS || !next || next.s - w.e > GAP_BREAK;
    if (brk) {
      chunks.push(cur);
      cur = [];
    }
  });
  return chunks;
};

const posY = { top: 330, middle: 1080, bottom: 1350 };

export const Captions: React.FC<{
  words: Word[];
  style: "clean" | "kinetic";
  position: "top" | "middle" | "bottom";
  keywords: string[];
}> = ({ words, style, position, keywords }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const chunks = chunkWords(words);
  const idx = chunks.findIndex((c, i) => {
    const end = chunks[i + 1] ? chunks[i + 1][0].s : c[c.length - 1].e + 0.4;
    return t >= c[0].s && t < end;
  });
  if (idx < 0) return null;
  const chunk = chunks[idx];
  const start = Math.round(chunk[0].s * FPS);
  const kw = new Set(keywords.map(norm));

  if (style === "clean") {
    const p = pop(frame, start);
    return (
      <div style={{ position: "absolute", top: posY[position], width: "100%", textAlign: "center", padding: "0 80px" }}>
        <span
          style={{
            display: "inline-block",
            transform: `scale(${0.85 + 0.15 * p})`,
            fontFamily: brand.font,
            fontWeight: 800,
            fontSize: 64,
            color: brand.white,
            textShadow: "0 4px 18px rgba(0,0,0,.55), 0 2px 4px rgba(0,0,0,.6)",
          }}
        >
          {chunk.map((w, i) => (
            <span key={i} style={{ color: kw.has(norm(w.w)) ? "#FFE14D" : undefined }}>
              {w.w.replace(/[.,]$/, "")}{" "}
            </span>
          ))}
        </span>
      </div>
    );
  }

  // kinetic: texto pequeño + palabra clave enorme en color de marca con blur-in.
  const hero = chunk.find((w) => kw.has(norm(w.w)));
  const rest = chunk.filter((w) => w !== hero).map((w) => w.w.replace(/[.,]$/, "")).join(" ");
  return (
    <div style={{ position: "absolute", top: posY[position], width: "100%", textAlign: "center", fontFamily: brand.font }}>
      {rest && (
        <div style={{ ...blurIn(frame, start, 6), fontSize: 46, fontWeight: 600, color: "inherit", letterSpacing: -0.5 }}>
          {rest}
        </div>
      )}
      {hero && (
        <div
          style={{
            ...blurIn(frame, Math.round(hero.s * FPS)),
            fontSize: 118,
            fontWeight: 800,
            color: brand.accent,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          {hero.w.replace(/[.,]$/, "")}
        </div>
      )}
    </div>
  );
};
