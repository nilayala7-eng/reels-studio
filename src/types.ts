export type Word = { w: string; s: number; e: number };

// Etiqueta tipo "pill" que se apila sobre los subtítulos (estilo referencia 1).
export type Pill = { at: number; until: number; text: string; variant?: "white" | "accent" | "pixel" };

// Escena a pantalla completa de motion graphics (estilo referencia 2).
export type Insert =
  | { type: "bigword"; at: number; until: number; small?: string; big: string }
  | { type: "number"; at: number; until: number; top?: string; value: number; word: string; items?: string[] }
  | { type: "checklist"; at: number; until: number; title: string; items: string[] }
  | { type: "logo"; at: number; until: number; name: string; tagline?: string }
  | { type: "versions"; at: number; until: number; labels: string[]; pick: number }
  | { type: "flow"; at: number; until: number; root: string; children: string[] }
  | { type: "terminal"; at: number; until: number; command: string };

export type Zoom = { at: number; scale: number };

export type Edit = {
  video: string; // archivo en public/
  words: string; // words.json en public/
  durationSeconds: number;
  title?: string; // título fijo arriba
  captionStyle: "clean" | "kinetic";
  captionPosition?: "top" | "middle" | "bottom";
  keywords?: string[]; // palabras que se resaltan en grande/color
  pills?: Pill[];
  inserts?: Insert[];
  zooms?: Zoom[];
};
