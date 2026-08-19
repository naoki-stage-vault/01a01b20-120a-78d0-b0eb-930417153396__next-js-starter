import type { AvatarParts, CategoryDef, CategoryId } from "./types";
import {
  BACKGROUND_COLORS,
  CLOTHING_COLORS,
  EYE_COLORS,
  HAIR_COLORS,
  SKIN_COLORS,
} from "./palettes";

export const CATEGORIES: CategoryDef[] = [
  {
    id: "background",
    label: "Background",
    options: ["none", ...BACKGROUND_COLORS.map((c) => c.id)],
    hasNone: true,
  },
  { id: "skin", label: "Skin", options: ["default"], colors: SKIN_COLORS, hasNone: false },
  {
    id: "hair",
    label: "Hair",
    options: ["none", "short", "long", "curly", "bob", "buzz", "bun", "ponytail", "waves"],
    colors: HAIR_COLORS,
    hasNone: true,
    aiElements: true,
  },
  { id: "brows", label: "Brows", options: ["none", "straight", "arched", "thick", "raised"], hasNone: true },
  { id: "eyes", label: "Eyes", options: ["dot", "round", "oval", "happy", "sleepy"], colors: EYE_COLORS, hasNone: false },
  { id: "nose", label: "Nose", options: ["none", "dot", "line", "button"], hasNone: true },
  { id: "mouth", label: "Mouth", options: ["smile", "big-smile", "neutral", "open", "smirk", "lips"], hasNone: false },
  { id: "eyewear", label: "Eyewear", options: ["none", "round", "square", "sunglasses"], hasNone: true },
  {
    id: "clothing",
    label: "Clothing",
    options: ["tee", "hoodie", "collar", "jacket", "sweater"],
    colors: CLOTHING_COLORS,
    hasNone: false,
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryDef>;

export const CATEGORY_ORDER: CategoryId[] = CATEGORIES.map((c) => c.id);

export const DEFAULT_PARTS: AvatarParts = {
  background: { partId: "none" },
  skin: { partId: "default", colorId: "fair" },
  hair: { partId: "short", colorId: "dark-brown" },
  brows: { partId: "straight" },
  eyes: { partId: "round", colorId: "dark" },
  nose: { partId: "dot" },
  mouth: { partId: "smile" },
  eyewear: { partId: "none" },
  clothing: { partId: "tee", colorId: "blue" },
};

export function partLabel(category: CategoryId, partId: string): string {
  const def = CATEGORY_BY_ID[category];
  if (partId === "none") return "None";
  const color = def.colors?.find((c) => c.id === partId);
  if (color) return color.label;
  // humanize kebab-case ids
  return partId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function isKnownPart(category: CategoryId, partId: string): boolean {
  const def = CATEGORY_BY_ID[category];
  return def.options.includes(partId);
}

export function isKnownColor(category: CategoryId, colorId?: string): boolean {
  if (!colorId) return true;
  const def = CATEGORY_BY_ID[category];
  return def.colors?.some((c) => c.id === colorId) ?? true;
}
