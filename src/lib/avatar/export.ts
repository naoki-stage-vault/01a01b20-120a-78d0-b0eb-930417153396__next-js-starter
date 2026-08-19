import type { AvatarDocument } from "./types";
import { AVATAR_VIEWBOX, buildAvatarLayers } from "./parts";

/**
 * Export utilities — the avatar is a layered SVG document, so we can ship
 * both the exact SVG (vector) and a rasterized PNG, straight from the
 * browser. No server, no accounts, no database.
 */

export function buildSvgString(doc: AvatarDocument): string {
  const layers = buildAvatarLayers(doc);
  const body = layers.map((l) => `<g id="layer-${l.id}">${l.html}</g>`).join("");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${AVATAR_VIEWBOX}" width="400" height="400" role="img" aria-label="Avatar">`,
    body,
    "</svg>",
  ].join("");
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function downloadSVG(doc: AvatarDocument, filename = "avatar.svg") {
  const svg = buildSvgString(doc);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadPNG(doc: AvatarDocument, size = 1024, filename = "avatar.png") {
  const svg = buildSvgString(doc);
  const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, size, size);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      triggerDownload(url, filename);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, "image/png");
  };
  img.src = encoded;
}
