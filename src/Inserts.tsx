import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { blurIn, fadeOut, pop, sec } from "./anim";
import { brand, FPS } from "./style";
import { Insert } from "./types";

const Paper: React.FC<{ children: React.ReactNode; opacity: number }> = ({ children, opacity }) => (
  <AbsoluteFill
    style={{
      opacity,
      background: `radial-gradient(circle at 85% 8%, ${brand.accentSoft} 0, transparent 38%),
                   radial-gradient(circle at 10% 92%, ${brand.accentSoft} 0, transparent 35%), ${brand.paper}`,
      fontFamily: brand.font,
      color: brand.ink,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </AbsoluteFill>
);

const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: brand.white,
      borderRadius: 36,
      boxShadow: "0 30px 80px rgba(21,80,255,.12), 0 4px 14px rgba(0,0,0,.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Check: React.FC<{ on: number }> = ({ on }) => (
  <div
    style={{
      width: 52,
      height: 52,
      borderRadius: 12,
      background: on > 0.5 ? brand.accent : "#E5E9F2",
      transform: `scale(${0.7 + 0.3 * on})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: brand.white,
      fontSize: 34,
      fontWeight: 900,
    }}
  >
    {on > 0.5 ? "✓" : ""}
  </div>
);

const Body: React.FC<{ ins: Insert; f: number }> = ({ ins, f }) => {
  switch (ins.type) {
    case "bigword":
      return (
        <div style={{ textAlign: "center" }}>
          {ins.small && <div style={{ ...blurIn(f, 0), fontSize: 56, fontWeight: 600 }}>{ins.small}</div>}
          <div style={{ ...blurIn(f, 5), fontSize: 170, fontWeight: 800, color: brand.accent, letterSpacing: -6 }}>{ins.big}</div>
        </div>
      );
    case "number": {
      const n = Math.round(interpolate(f, [4, 22], [0, ins.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <div style={{ textAlign: "center", width: 820 }}>
          {ins.top && <div style={{ ...blurIn(f, 0), fontSize: 50, color: brand.muted, fontWeight: 600 }}>{ins.top}</div>}
          <div
            style={{
              fontSize: 420,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -20,
              background: `linear-gradient(180deg, #8A93A6, ${brand.ink})`,
              WebkitBackgroundClip: "text",
              color: "transparent",
              transform: `scale(${pop(f, 2)})`,
            }}
          >
            {n}
          </div>
          <div style={{ ...blurIn(f, 10), fontSize: 120, fontStyle: "italic", fontWeight: 500, color: brand.accent, marginTop: -20 }}>{ins.word}</div>
          <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
            {(ins.items ?? []).map((it, i) => (
              <Card key={i} style={{ ...blurIn(f, 18 + i * 6), padding: "26px 34px", display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 600 }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: brand.accent, color: brand.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{i + 1}</div>
                {it}
              </Card>
            ))}
          </div>
        </div>
      );
    }
    case "checklist":
      return (
        <Card style={{ ...blurIn(f, 0), padding: "50px 60px", width: 760 }}>
          <div style={{ fontFamily: brand.mono, fontSize: 40, marginBottom: 36 }}>{ins.title}</div>
          {ins.items.map((it, i) => {
            const on = pop(f, 10 + i * 9);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 56, fontWeight: 600, marginBottom: 22, opacity: 0.35 + 0.65 * on }}>
                <Check on={on} />
                {it}
              </div>
            );
          })}
        </Card>
      );
    case "logo":
      return (
        <div style={{ textAlign: "center" }}>
          <Card style={{ width: 300, height: 300, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f)}) rotate(${(1 - pop(f)) * -12}deg)` }}>
            <div style={{ fontSize: 150, fontWeight: 900, color: brand.accent }}>{ins.name[0]}</div>
          </Card>
          <div style={{ ...blurIn(f, 8), fontSize: 110, fontWeight: 800, marginTop: 50, letterSpacing: -3 }}>{ins.name}</div>
          {ins.tagline && <div style={{ ...blurIn(f, 14), fontSize: 46, color: brand.muted, marginTop: 10 }}>{ins.tagline}</div>}
        </div>
      );
    case "versions":
      return (
        <div style={{ display: "flex", gap: 34 }}>
          {ins.labels.map((l, i) => {
            const picked = i === ins.pick && f > 30;
            const p = pop(f, i * 6);
            return (
              <div key={i} style={{ textAlign: "center", transform: `scale(${p * (picked ? 1.08 : 1)})`, opacity: f > 30 && !picked ? 0.4 : 1 }}>
                <Card style={{ width: 280, height: 480, border: picked ? `6px solid ${brand.accent}` : "6px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, color: brand.accent }}>▶</Card>
                <div style={{ fontFamily: brand.mono, fontSize: 40, marginTop: 20 }}>{l}</div>
              </div>
            );
          })}
        </div>
      );
    case "flow": {
      const n = ins.children.length;
      return (
        <div style={{ position: "relative", width: 960, height: 760 }}>
          <svg width={960} height={760} style={{ position: "absolute" }}>
            {ins.children.map((_, i) => {
              const x = (960 / n) * (i + 0.5);
              const draw = interpolate(f, [12 + i * 4, 30 + i * 4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <line key={i} x1={480} y1={150} x2={x} y2={470} stroke={brand.accent} strokeWidth={5} pathLength={1} strokeDasharray="1" strokeDashoffset={draw} />;
            })}
          </svg>
          <Card style={{ position: "absolute", left: 230, top: 40, width: 500, padding: "36px 0", textAlign: "center", border: `5px solid ${brand.accent}`, fontFamily: brand.mono, fontSize: 52, transform: `scale(${pop(f)})` }}>{ins.root}</Card>
          {ins.children.map((c, i) => (
            <Card key={i} style={{ position: "absolute", left: (960 / n) * (i + 0.5) - 130, top: 470, width: 260, padding: "60px 0", textAlign: "center", fontSize: 40, fontWeight: 700, transform: `scale(${pop(f, 24 + i * 5)})` }}>{c}</Card>
          ))}
        </div>
      );
    }
    case "terminal": {
      const chars = Math.floor(interpolate(f, [8, 8 + ins.command.length * 1.2], [0, ins.command.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return (
        <div style={{ ...blurIn(f, 0), width: 900, background: "#12151C", borderRadius: 28, boxShadow: "0 30px 80px rgba(0,0,0,.25)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 12, padding: "22px 26px" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />)}
          </div>
          <div style={{ fontFamily: brand.mono, color: "#E6EAF2", fontSize: 40, padding: "10px 36px 50px" }}>
            $ {ins.command.slice(0, chars)}
            <span style={{ opacity: Math.floor(f / 8) % 2 ? 0 : 1, color: brand.accent }}>▍</span>
          </div>
        </div>
      );
    }
  }
};

export const Inserts: React.FC<{ inserts: Insert[] }> = ({ inserts }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const ins = inserts.find((i) => t >= i.at && t < i.until);
  if (!ins) return null;
  const f = frame - sec(ins.at);
  const opacity = Math.min(interpolate(f, [0, 4], [0, 1], { extrapolateRight: "clamp" }), fadeOut(frame, sec(ins.until), 4));
  return (
    <Paper opacity={opacity}>
      <Body ins={ins} f={f} />
    </Paper>
  );
};

export const insertActive = (inserts: Insert[], t: number) => inserts.some((i) => t >= i.at && t < i.until);
