/** Facial feature renderers (brows, eyes, nose, mouth, eyewear). */
import { INK, SOFT_SHADE, el } from "./parts-data";

export function browsHtml(partId: string, brow: string): string {
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

export function eyesHtml(partId: string, eye: string): string {
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
    default:
      return (
        el("circle", { cx: L.x, cy: L.y, r: 6, fill: eye }) +
        el("circle", { cx: R.x, cy: R.y, r: 6, fill: eye })
      );
  }
}

export function noseHtml(partId: string): string {
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

export function mouthHtml(partId: string): string {
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
    default:
      return el("path", { d: "M182 206 Q200 224 218 206", stroke: INK, "stroke-width": 4.5, "stroke-linecap": "round", fill: "none" });
  }
}

export function eyewearHtml(partId: string): string {
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
