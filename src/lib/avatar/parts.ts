import type { AvatarDocument, CustomLayer } from "./types";
import {
  BACKGROUND_COLORS,
  CLOTHING_COLORS,
  EYE_COLORS,
  HAIR_COLORS,
  INK,
  SKIN_COLORS,
  SOFT_SHADE,
  colorValue,
} from "./palettes";

/* ============================================================
   Original artwork — flat, rounded, friendly shape language
   inspired by the reference's visual characteristics.
   All geometry lives in a 400x400 viewBox; the circular frame
   crops to a 146-unit radius around (200,200).
   ============================================================ */

/** Tiny, safe SVG element builder (attributes escaped). */
function el(
  tag: string,
  attrs: Record<string, string | number | undefined>,
  children?: string,
): string {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}="${String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`)
    .join(" ");
  return children === undefined ? `<${tag} ${a}/>` : `<${tag} ${a}>${children}</${tag}>`;
}

function resolve(defs: { id: string; value: string }[], id: string | undefined, fallback: string): string {
  return colorValue(defs, id) ?? fallback;
}

/* ---------- Background ---------- */

function backgroundHtml(partId: string): string {
  if (partId === "none") return "";
  const c = BACKGROUND_COLORS.find((b) => b.id === partId);
  if (!c) return "";
  return el("rect", { x: 0, y: 0, width: 400, height: 400, fill: c.value });
}

/* ---------- Skin (head + neck + ears) ---------- */

function skinHtml(skin: string): string {
  const neck = el("rect", { x: 186, y: 226, width: 28, height: 46, rx: 13, fill: skin });
  const head = el("circle", { cx: 200, cy: 170, r: 88, fill: skin });
  const earL = el("circle", { cx: 108, cy: 178, r: 13, fill: skin });
  const earR = el("circle", { cx: 292, cy: 178, r: 13, fill: skin });
  const blushL = el("circle", { cx: 156, cy: 200, r: 13, fill: "rgba(214,98,98,.14)" });
  const blushR = el("circle", { cx: 244, cy: 200, r: 13, fill: "rgba(214,98,98,.14)" });
  return neck + head + earL + earR + blushL + blushR;
}

/* ---------- Hair ---------- */

const HAIR_BACK: Record<string, string> = {
  short:
    "M116 132 Q118 64 200 60 Q282 64 284 132 Q284 196 262 214 Q240 226 200 228 Q160 226 138 214 Q116 196 116 132 Z",
  long:
    "M116 132 Q116 60 200 58 Q284 60 284 132 Q288 210 268 268 Q252 306 200 310 Q148 306 132 268 Q112 210 116 132 Z",
  bob: "M116 132 Q118 60 200 58 Q282 60 284 132 Q286 210 268 238 Q240 254 200 256 Q160 254 132 238 Q114 210 116 132 Z",
  buzz: "M118 118 Q120 64 200 60 Q280 64 282 118 Q200 126 118 118 Z",
  bun: "M118 122 Q120 64 200 60 Q280 64 282 122 Q240 132 200 130 Q160 132 118 122 Z",
  ponytail:
    "M118 122 Q120 64 200 60 Q280 64 282 122 Q240 132 200 130 Q160 132 118 122 Z" +
    "M284 116 Q310 142 304 182 Q298 218 282 234 Q270 214 276 178 Q280 148 284 116 Z",
  waves: "M116 128 Q118 62 200 58 Q282 62 284 128 Q284 190 266 216 Q246 232 200 234 Q154 232 134 216 Q116 190 116 128 Z",
  curly:
    el("circle", { cx: 142, cy: 118, r: 30 }) +
    el("circle", { cx: 200, cy: 78, r: 34 }) +
    el("circle", { cx: 258, cy: 118, r: 30 }) +
    el("circle", { cx: 114, cy: 172, r: 26 }) +
    el("circle", { cx: 286, cy: 172, r: 26 }),
};

const HAIR_FRONT: Record<string, string> = {
  short:
    "M118 116 Q146 90 180 102 Q210 88 240 100 Q268 90 284 114 Q282 140 262 148 Q230 156 200 152 Q170 156 140 148 Q118 140 118 116 Z",
  long: "M118 116 Q160 92 200 98 Q240 92 282 116 Q282 138 262 144 Q230 150 200 146 Q170 150 138 144 Q118 138 118 116 Z",
  bob: "M118 114 Q200 88 282 114 L282 146 Q200 158 118 146 Z",
  buzz: "",
  bun: "M120 112 Q200 90 282 112 Q282 132 200 140 Q120 132 120 112 Z",
  ponytail: "M120 112 Q200 90 282 112 Q282 132 200 140 Q120 132 120 112 Z",
  waves: "M118 114 Q160 90 204 100 Q252 90 284 116 Q278 142 252 150 Q220 156 192 150 Q156 156 132 146 Q114 136 118 114 Z",
  curly:
    el("circle", { cx: 152, cy: 128, r: 20 }) +
    el("circle", { cx: 200, cy: 116, r: 22 }) +
    el("circle", { cx: 248, cy: 128, r: 20 }),
};

function hairBackHtml(partId: string, color: string): string {
  const d = HAIR_BACK[partId];
  if (!d) return "";
  return el("path", { d, fill: color });
}

function hairFrontHtml(partId: string, color: string): string {
  const d = HAIR_FRONT[partId];
  if (!d) return "";
  return el("path", { d, fill: color });
}

/* ---------- Brows (follow hair color) ---------- */

function browsHtml(partId: string, brow: string): string {
  switch (partId) {
    case "straight":
      return (
        el("rect", { x: 142, y: 138, width: 42, height: 7, rx: 3.5, fill: brow }) +
        el("rect", { x: 216, y: 138, width: 42, height: 7, rx: 3.5, fill: brow })
      );
    case "arched":
      return (
        el("path", { d: "M142 148 Q163 132 184 142", stroke: brow, "stroke-width": 6, "stroke-linecap": "round", fill: "none" }) +
        el("path", { d: "M216 142 Q237 132 258 148", stroke: brow, "stroke-width": 6, "stroke-linecap": "round", fill: "none" })
      );
    case "thick":
      return (
        el("rect", { x: 142, y: 134, width: 42, height: 11, rx: 5.5, fill: brow }) +
        el("rect", { x: 216, y: 134, width: 42, height: 11, rx: 5.5, fill: brow })
      );
    case "raised":
      return (
        el("path", { d: "M142 140 Q163 124 184 136", stroke: brow, "stroke-width": 6, "stroke-linecap": "round", fill: "none" }) +
        el("path", { d: "M216 136 Q237 124 258 140", stroke: brow, "stroke-width": 6, "stroke-linecap": "round", fill: "none" })
      );
    default:
      return "";
  }
}

/* ---------- Eyes ---------- */

function eyesHtml(partId: string, eye: string): string {
  const L = { x: 164, y: 176 };
  const R = { x: 236, y: 176 };
  switch (partId) {
    case "round":
      return (
        el("circle", { cx: L.x, cy: L.y, r: 10, fill: eye }) +
        el("circle", { cx: L.x - 3, cy: L.y - 3, r: 3, fill: "#fff" }) +
        el("circle", { cx: R.x, cy: R.y, r: 10, fill: eye }) +
        el("circle", { cx: R.x - 3, cy: R.y - 3, r: 3, fill: "#fff" })
      );
    case "oval":
      return (
        el("ellipse", { cx: L.x, cy: L.y, rx: 12, ry: 7, fill: eye }) +
        el("circle", { cx: L.x - 3, cy: L.y - 2, r: 2.5, fill: "#fff" }) +
        el("ellipse", { cx: R.x, cy: R.y, rx: 12, ry: 7, fill: eye }) +
        el("circle", { cx: R.x - 3, cy: R.y - 2, r: 2.5, fill: "#fff" })
      );
    case "happy":
      return (
        el("path", { d: "M154 178 Q164 166 174 178", stroke: eye, "stroke-width": 5, "stroke-linecap": "round", fill: "none" }) +
        el("path", { d: "M226 178 Q236 166 246 178", stroke: eye, "stroke-width": 5, "stroke-linecap": "round", fill: "none" })
      );
    case "sleepy":
      return (
        el("path", { d: "M154 176 Q164 184 174 176", stroke: eye, "stroke-width": 5, "stroke-linecap": "round", fill: "none" }) +
        el("path", { d: "M226 176 Q236 184 246 176", stroke: eye, "stroke-width": 5, "stroke-linecap": "round", fill: "none" })
      );
    default: // dot
      return el("circle", { cx: L.x, cy: L.y, r: 6, fill: eye }) + el("circle", { cx: R.x, cy: R.y, r: 6, fill: eye });
  }
}

/* ---------- Nose ---------- */

function noseHtml(partId: string): string {
  switch (partId) {
    case "dot":
      return el("circle", { cx: 200, cy: 192, r: 5, fill: SOFT_SHADE });
    case "line":
      return el("path", { d: "M200 182 L200 196", stroke: SOFT_SHADE, "stroke-width": 3, "stroke-linecap": "round" });
    case "button":
      return el("path", { d: "M200 184 Q210 190 206 197 Q200 203 194 197 Q190 190 200 184 Z", fill: SOFT_SHADE });
    default:
      return "";
  }
}

/* ---------- Mouth ---------- */

function mouthHtml(partId: string): string {
  switch (partId) {
    case "big-smile":
      return el("path", { d: "M176 204 Q200 230 224 204 Q200 240 176 204 Z", fill: "#7a4030" });
    case "neutral":
      return el("path", { d: "M186 210 L214 210", stroke: INK, "stroke-width": 4.5, "stroke-linecap": "round" });
    case "open":
      return el("ellipse", { cx: 200, cy: 212, rx: 13, ry: 10, fill: "#7a4030" });
    case "smirk":
      return el("path", { d: "M182 206 Q200 222 220 208", stroke: INK, "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" });
    case "lips":
      return (
        el("ellipse", { cx: 200, cy: 207, rx: 15, ry: 6, fill: "#b0604f" }) +
        el("path", { d: "M184 206 Q200 216 216 206", stroke: "#8c4038", "stroke-width": 3, fill: "none" })
      );
    default: // smile
      return el("path", { d: "M182 206 Q200 224 218 206", stroke: INK, "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" });
  }
}

/* ---------- Eyewear ---------- */

function eyewearHtml(partId: string): string {
  const frame = "#2b2b2b";
  switch (partId) {
    case "round":
      return (
        el("circle", { cx: 164, cy: 176, r: 19, fill: "rgba(255,255,255,.18)", stroke: frame, "stroke-width": 4 }) +
        el("circle", { cx: 236, cy: 176, r: 19, fill: "rgba(255,255,255,.18)", stroke: frame, "stroke-width": 4 }) +
        el("path", { d: "M183 173 Q200 165 217 173", stroke: frame, "stroke-width": 4, fill: "none" }) +
        el("path", { d: "M145 174 L122 168", stroke: frame, "stroke-width": 4 }) +
        el("path", { d: "M255 174 L278 168", stroke: frame, "stroke-width": 4 })
      );
    case "square":
      return (
        el("rect", { x: 144, y: 160, width: 40, height: 32, rx: 9, fill: "rgba(255,255,255,.18)", stroke: frame, "stroke-width": 4 }) +
        el("rect", { x: 216, y: 160, width: 40, height: 32, rx: 9, fill: "rgba(255,255,255,.18)", stroke: frame, "stroke-width": 4 }) +
        el("path", { d: "M184 172 Q200 164 216 172", stroke: frame, "stroke-width": 4, fill: "none" }) +
        el("path", { d: "M144 172 L122 166", stroke: frame, "stroke-width": 4 }) +
        el("path", { d: "M256 172 L278 166", stroke: frame, "stroke-width": 4 })
      );
    case "sunglasses":
      return (
        el("rect", { x: 142, y: 160, width: 44, height: 30, rx: 12, fill: frame }) +
        el("rect", { x: 214, y: 160, width: 44, height: 30, rx: 12, fill: frame }) +
        el("path", { d: "M186 172 Q200 164 214 172", stroke: frame, "stroke-width": 5, fill: "none" }) +
        el("path", { d: "M142 172 L122 166", stroke: frame, "stroke-width": 5 }) +
        el("path", { d: "M258 172 L278 166", stroke: frame, "stroke-width": 5 }) +
        el("path", { d: "M150 167 L158 167", stroke: "rgba(255,255,255,.5)", "stroke-width": 3, "stroke-linecap": "round" }) +
        el("path", { d: "M222 167 L230 167", stroke: "rgba(255,255,255,.5)", "stroke-width": 3, "stroke-linecap": "round" })
      );
    default:
      return "";
  }
}

/* ---------- Clothing ---------- */

const TORSO =
  "M112 248 Q112 232 128 226 L166 216 Q178 212 186 224 Q200 232 214 224 Q222 212 234 216 L272 226 Q288 232 288 248 L288 296 Q288 330 252 336 L148 336 Q112 330 112 296 Z";

function clothingHtml(partId: string, color: string): string {
  const base = el("path", { d: TORSO, fill: color });
  switch (partId) {
    case "hoodie":
      return (
        base +
        el("path", {
          d: "M120 232 Q128 200 168 208 Q182 198 200 210 Q218 198 232 208 Q272 200 280 232 Q282 242 266 240 Q232 234 200 242 Q168 234 134 240 Q118 242 120 232 Z",
          fill: "rgba(255,255,255,.16)",
        }) +
        el("path", { d: "M160 280 Q200 296 240 280 L240 300 Q200 314 160 300 Z", fill: "rgba(0,0,0,.09)" }) +
        el("path", { d: "M192 214 L192 234", stroke: "rgba(0,0,0,.35)", "stroke-width": 3, "stroke-linecap": "round" }) +
        el("path", { d: "M208 214 L208 234", stroke: "rgba(0,0,0,.35)", "stroke-width": 3, "stroke-linecap": "round" })
      );
    case "collar":
      return (
        base +
        el("path", { d: "M186 224 L200 254 L214 224 Q200 236 186 224 Z", fill: "#fafaf9" }) +
        el("path", { d: "M186 224 L200 254 L186 244 Z", fill: "rgba(0,0,0,.06)" })
      );
    case "jacket":
      return (
        base +
        el("path", { d: "M200 228 L200 336", stroke: "rgba(0,0,0,.18)", "stroke-width": 3 }) +
        el("path", { d: "M186 224 L200 258 L186 250 Z", fill: "rgba(255,255,255,.2)" }) +
        el("path", { d: "M214 224 L200 258 L214 250 Z", fill: "rgba(255,255,255,.2)" }) +
        el("path", { d: "M200 258 L200 268", stroke: "rgba(0,0,0,.25)", "stroke-width": 2 })
      );
    case "sweater":
      return (
        base +
        el("rect", { x: 182, y: 222, width: 36, height: 16, rx: 8, fill: "rgba(255,255,255,.18)" }) +
        el("path", {
          d: "M152 318 L152 332 M168 324 L168 334 M232 324 L232 334 M248 318 L248 332",
          stroke: "rgba(0,0,0,.12)",
          "stroke-width": 3,
          "stroke-linecap": "round",
        })
      );
    default: // tee
      return base;
  }
}

/* ---------- Custom (AI-generated) elements ---------- */

function customHtml(custom: CustomLayer[]): string {
  if (custom.length === 0) return "";
  return custom
    .map((layer) => {
      if (layer.kind === "raster" && layer.url) {
        return el("image", {
          href: layer.url,
          x: 40,
          y: 0,
          width: 320,
          height: 320,
          preserveAspectRatio: "xMidYMid meet",
        });
      }
      if (layer.kind === "svg" && layer.svg) {
        return layer.svg;
      }
      return "";
    })
    .join("");
}

/* ---------- Assembler ---------- */

export interface AvatarLayer {
  id: string;
  html: string;
}

export function buildAvatarLayers(doc: AvatarDocument): AvatarLayer[] {
  const p = doc.parts;
  const skin = resolve(SKIN_COLORS, p.skin.colorId, "fair");
  const hair = resolve(HAIR_COLORS, p.hair.colorId, "dark-brown");
  const eye = resolve(EYE_COLORS, p.eyes.colorId, "dark");
  const clothes = resolve(CLOTHING_COLORS, p.clothing.colorId, "blue");

  const layers: AvatarLayer[] = [
    { id: "background", html: backgroundHtml(p.background.partId) },
    { id: "hair-back", html: hairBackHtml(p.hair.partId, hair) },
    { id: "skin", html: skinHtml(skin) },
    { id: "clothing", html: clothingHtml(p.clothing.partId, clothes) },
    { id: "brows", html: browsHtml(p.brows.partId, hair) },
    { id: "eyes", html: eyesHtml(p.eyes.partId, eye) },
    { id: "nose", html: noseHtml(p.nose.partId) },
    { id: "mouth", html: mouthHtml(p.mouth.partId) },
    { id: "eyewear", html: eyewearHtml(p.eyewear.partId) },
    { id: "hair-front", html: hairFrontHtml(p.hair.partId, hair) },
    { id: "custom", html: customHtml(doc.custom) },
  ];
  return layers.filter((l) => l.html !== "");
}

export const AVATAR_VIEWBOX = "0 0 400 400";
