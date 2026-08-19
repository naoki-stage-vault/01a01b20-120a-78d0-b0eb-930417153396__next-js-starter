/** Head, hair, body renderers (background, skin, hair, clothing, custom). */
import {
  BACKGROUND_COLORS,
  CLOTHING_COLORS,
  HAIR_COLORS,
  SKIN_COLORS,
} from "./palettes";
import { HAIR_BACK, HAIR_FRONT, TORSO, el, resolve } from "./parts-data";
import type { CustomLayer } from "./types";

export function backgroundHtml(partId: string): string {
  if (partId === "none") return "";
  const c = BACKGROUND_COLORS.find((b) => b.id === partId);
  if (!c) return "";
  return el("rect", { x: 0, y: 0, width: 400, height: 400, fill: c.value });
}

export function skinHtml(skin: string): string {
  const neck = el("rect", { x: 186, y: 226, width: 28, height: 46, rx: 13, fill: skin });
  const head = el("circle", { cx: 200, cy: 170, r: 88, fill: skin });
  const earL = el("circle", { cx: 108, cy: 178, r: 13, fill: skin });
  const earR = el("circle", { cx: 292, cy: 178, r: 13, fill: skin });
  const blushL = el("circle", { cx: 156, cy: 200, r: 13, fill: "rgba(214,98,98,.14)" });
  const blushR = el("circle", { cx: 244, cy: 200, r: 13, fill: "rgba(214,98,98,.14)" });
  return neck + head + earL + earR + blushL + blushR;
}

export function hairBackHtml(partId: string, color: string): string {
  const d = HAIR_BACK[partId];
  if (!d) return "";
  return el("path", { d, fill: color });
}

export function hairFrontHtml(partId: string, color: string): string {
  const d = HAIR_FRONT[partId];
  if (!d) return "";
  return el("path", { d, fill: color });
}

export function clothingHtml(partId: string, color: string): string {
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
    default:
      return base;
  }
}

export function customHtml(custom: CustomLayer[]): string {
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
