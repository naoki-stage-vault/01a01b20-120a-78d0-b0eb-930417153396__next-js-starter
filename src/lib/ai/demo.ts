import type { AvatarParts, CategoryId, CustomLayer } from "@/lib/avatar/types";
import { partLabel } from "@/lib/avatar/catalog";
import { HAIR_COLORS } from "@/lib/avatar/palettes";

/**
 * Deterministic fallback used when no Gemini key is configured (demo mode).
 * It parses common avatar requests by keyword and applies only the
 * categories the user mentions — the same "preserve everything else"
 * contract the Gemini path follows. The product is fully testable without
 * a key; with a key, Gemini takes over and this is never called.
 */

const has = (s: string, ...words: string[]) => words.some((w) => s.includes(w));

export function demoInterpret(
  message: string,
  _current: AvatarParts,
): { reply: string; changes: { category: CategoryId; partId?: string; colorId?: string }[] } {
  const m = message.toLowerCase();
  const changes: { category: CategoryId; partId?: string; colorId?: string }[] = [];
  const push = (category: CategoryId, partId?: string, colorId?: string) =>
    changes.push({ category, partId, colorId });

  /* ---- hair style ---- */
  if (has(m, "curly", "curls")) push("hair", "curly");
  else if (has(m, "long hair", "long hairstyle")) push("hair", "long");
  else if (has(m, "short hair", "short hairstyle")) push("hair", "short");
  else if (has(m, "bob cut", "hair bob", " a bob")) push("hair", "bob");
  else if (has(m, "buzz")) push("hair", "buzz");
  else if (has(m, "hair bun", "a bun")) push("hair", "bun");
  else if (has(m, "ponytail", "pony tail")) push("hair", "ponytail");
  else if (has(m, "wavy", "waves")) push("hair", "waves");
  else if (has(m, "bald", "shaved", "no hair")) push("hair", "none");

  /* ---- hair color (only when the message is about hair) ---- */
  if (has(m, "hair") || has(m, "brunette") || has(m, "blonde") || has(m, "blond")) {
    if (has(m, "dark brown")) push("hair", undefined, "dark-brown");
    else if (has(m, "blonde", "blond")) push("hair", undefined, "blonde");
    else if (has(m, "black")) push("hair", undefined, "black");
    else if (has(m, "auburn", "ginger", "red hair")) push("hair", undefined, "auburn");
    else if (has(m, "gray", "grey")) push("hair", undefined, "gray");
    else if (has(m, "pink")) push("hair", undefined, "pink");
    else if (has(m, "purple")) push("hair", undefined, "purple");
    else if (has(m, "brown", "brunette")) push("hair", undefined, "brown");
  }

  /* ---- eyes ---- */
  if (has(m, "blue eyes")) push("eyes", undefined, "blue");
  else if (has(m, "green eyes")) push("eyes", undefined, "green");
  else if (has(m, "brown eyes")) push("eyes", undefined, "brown");
  else if (has(m, "hazel eyes")) push("eyes", undefined, "hazel");
  else if (has(m, "sleepy", "tired eyes")) push("eyes", "sleepy");
  else if (has(m, "happy eyes", "closed eyes", "smiling eyes")) push("eyes", "happy");
  else if (has(m, "dark eyes")) push("eyes", undefined, "dark");

  /* ---- brows ---- */
  if (has(m, "thick brows", "thick eyebrows")) push("brows", "thick");
  else if (has(m, "arched brows", "arched eyebrows")) push("brows", "arched");
  else if (has(m, "raised brows", "raised eyebrows")) push("brows", "raised");
  else if (has(m, "no brows", "no eyebrows")) push("brows", "none");
  else if (has(m, "straight brows", "straight eyebrows")) push("brows", "straight");

  /* ---- nose ---- */
  if (has(m, "button nose")) push("nose", "button");
  else if (has(m, "no nose")) push("nose", "none");
  else if (has(m, "small nose")) push("nose", "dot");

  /* ---- mouth ---- */
  if (has(m, "big smile", "grin", "huge smile", "wide smile")) push("mouth", "big-smile");
  else if (has(m, "smirk")) push("mouth", "smirk");
  else if (has(m, "neutral", "serious", "straight face")) push("mouth", "neutral");
  else if (has(m, "open mouth", "laughing")) push("mouth", "open");
  else if (has(m, "lips", "lipstick")) push("mouth", "lips");
  else if (has(m, "smile", "smiling", "happy", "friendly")) push("mouth", "smile");

  /* ---- eyewear ---- */
  if (has(m, "no glasses", "without glasses", "remove glasses")) push("eyewear", "none");
  else if (has(m, "sunglasses", "shades")) push("eyewear", "sunglasses");
  else if (has(m, "square glasses")) push("eyewear", "square");
  else if (has(m, "round glasses")) push("eyewear", "round");
  else if (has(m, "glasses", "spectacles", "specs", "eyewear")) push("eyewear", "round");

  /* ---- clothing style ---- */
  if (has(m, "hoodie", "hoody")) push("clothing", "hoodie");
  else if (has(m, "dress shirt", "button-up", "button down", "collar")) push("clothing", "collar");
  else if (has(m, "jacket")) push("clothing", "jacket");
  else if (has(m, "sweater", "jumper", "knitwear")) push("clothing", "sweater");
  else if (has(m, "shirt", "t-shirt", "tshirt", "tee")) push("clothing", "tee");

  /* ---- clothing color (only with a clothing word) ---- */
  if (has(m, "shirt", "hoodie", "tee", "sweater", "jacket", "clothing", "top")) {
    if (has(m, "blue")) push("clothing", undefined, "blue");
    else if (has(m, "black")) push("clothing", undefined, "black");
    else if (has(m, "coral", "orange", "red")) push("clothing", undefined, "coral");
    else if (has(m, "green", "mint")) push("clothing", undefined, "mint");
    else if (has(m, "yellow")) push("clothing", undefined, "yellow");
    else if (has(m, "lavender", "purple")) push("clothing", undefined, "lavender");
    else if (has(m, "pink")) push("clothing", undefined, "pink");
    else if (has(m, "gray", "grey")) push("clothing", undefined, "gray");
  }

  /* ---- skin tone ---- */
  if (has(m, "porcelain", "pale", "light skin")) push("skin", undefined, "porcelain");
  else if (has(m, "fair")) push("skin", undefined, "fair");
  else if (has(m, "medium", "olive")) push("skin", undefined, "medium");
  else if (has(m, "tan", "tanned")) push("skin", undefined, "tan");
  else if (has(m, "dark skin", "deep skin", "rich skin")) push("skin", undefined, "deep");

  /* ---- background ---- */
  if (has(m, "no background", "transparent background")) push("background", "none");
  else if (has(m, "background")) {
    if (has(m, "pink", "blush")) push("background", "blush");
    else if (has(m, "green", "mint")) push("background", "mint");
    else if (has(m, "blue", "sky")) push("background", "sky");
    else if (has(m, "yellow", "butter")) push("background", "butter");
    else if (has(m, "purple", "lilac")) push("background", "lilac");
    else if (has(m, "peach")) push("background", "peach");
    else if (has(m, "gray", "mist")) push("background", "mist");
  }

  const reply =
    changes.length > 0
      ? `Done — I updated ${describe(changes)}. Anything else you'd like to change?`
      : `I couldn't tell what to change from that. Try something like “make the hair blonde”, “add round glasses”, or “change the shirt to green”.`;

  return { reply, changes };
}

function describe(changes: { category: CategoryId; partId?: string; colorId?: string }[]): string {
  return changes
    .map((c) => {
      const label = partLabel(c.category, c.partId ?? (c.colorId ? c.colorId : ""));
      return `${label} ${c.category}`;
    })
    .join(", ");
}

export function demoElement(prompt: string): CustomLayer {
  const m = prompt.toLowerCase();
  const color = HAIR_COLORS[hash(prompt) % HAIR_COLORS.length].value;
  const clips = has(m, "clip", "bow", "flower", "pin");
  const messy = has(m, "messy", "wild", "tousled");

  const fringe = messy
    ? `<path d="M112 122 Q132 82 172 96 Q202 78 238 92 Q268 82 288 112 Q286 150 256 160 Q222 170 188 158 Q152 168 120 152 Q106 140 112 122 Z" fill="${color}"/>` +
      `<circle cx="164" cy="96" r="16" fill="${color}"/><circle cx="226" cy="100" r="18" fill="${color}"/>`
    : `<path d="M112 120 Q140 84 180 96 Q210 80 244 92 Q276 84 288 112 Q284 148 256 158 Q222 168 188 158 Q150 166 120 150 Q108 138 112 120 Z" fill="${color}"/>`;

  const decoration = clips
    ? `<circle cx="168" cy="104" r="9" fill="#e0714f"/><circle cx="232" cy="108" r="9" fill="#f0c75e"/><circle cx="168" cy="104" r="3.5" fill="#fff" opacity="0.5"/><circle cx="232" cy="108" r="3.5" fill="#fff" opacity="0.5"/>`
    : "";

  const svg = `<g>${fringe}${decoration}</g>`;
  return {
    id: crypto.randomUUID(),
    category: "hair",
    kind: "svg",
    label: "AI hair element",
    svg,
  };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
