import type { ColorDef } from "./types";

export const BACKGROUND_COLORS: ColorDef[] = [
  { id: "blush", label: "Blush", value: "#fde8e4" },
  { id: "mint", label: "Mint", value: "#e2f0e4" },
  { id: "sky", label: "Sky", value: "#e2edfa" },
  { id: "butter", label: "Butter", value: "#faf0d7" },
  { id: "lilac", label: "Lilac", value: "#ede6f7" },
  { id: "peach", label: "Peach", value: "#fdeede" },
  { id: "mist", label: "Mist", value: "#e4f2f6" },
];

export const SKIN_COLORS: ColorDef[] = [
  { id: "porcelain", label: "Porcelain", value: "#ffe3d3" },
  { id: "fair", label: "Fair", value: "#ffd0b5" },
  { id: "medium", label: "Medium", value: "#f0b28c" },
  { id: "tan", label: "Tan", value: "#c98f6e" },
  { id: "deep", label: "Deep", value: "#8f5e43" },
];

export const HAIR_COLORS: ColorDef[] = [
  { id: "black", label: "Black", value: "#2b2b2b" },
  { id: "dark-brown", label: "Dark brown", value: "#4a2f24" },
  { id: "brown", label: "Brown", value: "#6b4a2f" },
  { id: "auburn", label: "Auburn", value: "#a9683f" },
  { id: "blonde", label: "Blonde", value: "#e3b778" },
  { id: "gray", label: "Gray", value: "#cfc9c2" },
  { id: "pink", label: "Pink", value: "#d4729b" },
  { id: "purple", label: "Purple", value: "#7a5ba8" },
];

export const EYE_COLORS: ColorDef[] = [
  { id: "dark", label: "Dark", value: "#2b2b2b" },
  { id: "brown", label: "Brown", value: "#4a2f24" },
  { id: "blue", label: "Blue", value: "#3d6fa8" },
  { id: "green", label: "Green", value: "#4f7a4f" },
  { id: "hazel", label: "Hazel", value: "#7a5f3a" },
];

export const CLOTHING_COLORS: ColorDef[] = [
  { id: "blue", label: "Blue", value: "#1684ef" },
  { id: "black", label: "Black", value: "#2b2b2b" },
  { id: "coral", label: "Coral", value: "#e0714f" },
  { id: "mint", label: "Mint", value: "#7fc8a9" },
  { id: "yellow", label: "Yellow", value: "#f0c75e" },
  { id: "lavender", label: "Lavender", value: "#8a8fd8" },
  { id: "pink", label: "Pink", value: "#e8a0bf" },
  { id: "gray", label: "Gray", value: "#6b6f76" },
];

/** Fixed tone for brows/nose/mouth shading. */
export const INK = "#4a2f24";
export const SOFT_SHADE = "rgba(0,0,0,0.14)";

export function colorValue(defs: ColorDef[], id?: string): string | undefined {
  if (!id) return undefined;
  return defs.find((d) => d.id === id)?.value;
}

export function colorLabel(defs: ColorDef[], id?: string): string | undefined {
  if (!id) return undefined;
  return defs.find((d) => d.id === id)?.label;
}
