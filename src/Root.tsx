import React from "react";
import { Composition, staticFile } from "remotion";
import { Reel } from "./Reel";
import { FPS, H, W } from "./style";
import { Edit, Word } from "./types";

// Cada reel es un JSON en public/edits/<nombre>.json; se pasa con --props.
const placeholder: Edit = { video: "", words: "", durationSeconds: 5, captionStyle: "clean" };

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel as unknown as React.FC<Record<string, unknown>>}
    width={W}
    height={H}
    fps={FPS}
    durationInFrames={FPS * 5}
    defaultProps={{ ...placeholder, wordsData: [] as Word[] }}
    calculateMetadata={async ({ props }) => {
      const p = props as unknown as Edit;
      const wordsData = p.words ? await (await fetch(staticFile(p.words))).json() : [];
      return { durationInFrames: Math.ceil(p.durationSeconds * FPS), props: { ...props, wordsData } };
    }}
  />
);
