import type { AvatarParts, CategoryId } from "./types";
import { CATEGORIES, CATEGORY_BY_ID, DEFAULT_PARTS } from "./catalog";

/**
 * Compact URL encoding of an avatar, in the same spirit as the reference's
 * `?face=` parameter. Fixed category order; each category contributes one
 * base36 char for the part index and (when the category has colors) one
 * char for the color index. Invalid input falls back to defaults.
 */

const ORDER: CategoryId[] = CATEGORIES.map((c) => c.id);

function toChar(n: number): string {
  return n.toString(36);
}

function fromChar(c: string): number {
  return parseInt(c, 36);
}

export function encodeParts(parts: AvatarParts): string {
  return ORDER.map((id) => {
    const def = CATEGORY_BY_ID[id];
    const sel = parts[id];
    const partIdx = def.options.indexOf(sel.partId);
    const safe = partIdx >= 0 ? partIdx : 0;
    let s = toChar(safe);
    if (def.colors && sel.colorId) {
      const colorIdx = def.colors.findIndex((c) => c.id === sel.colorId);
      s += toChar(colorIdx >= 0 ? colorIdx : 0);
    }
    return s;
  }).join("");
}

export function decodeParts(code: string | null | undefined): AvatarParts {
  if (!code) return structuredClone(DEFAULT_PARTS);
  const out = structuredClone(DEFAULT_PARTS);
  let i = 0;
  for (const id of ORDER) {
    const def = CATEGORY_BY_ID[id];
    if (i >= code.length) break;
    const partIdx = fromChar(code[i]);
    i += 1;
    const partId = def.options[partIdx];
    if (partId !== undefined) out[id].partId = partId;
    if (def.colors && i < code.length) {
      const colorIdx = fromChar(code[i]);
      i += 1;
      const color = def.colors[colorIdx];
      if (color) out[id].colorId = color.id;
    }
  }
  return out;
}

export function partsToQuery(parts: AvatarParts): string {
  return `?face=${encodeParts(parts)}`;
}
