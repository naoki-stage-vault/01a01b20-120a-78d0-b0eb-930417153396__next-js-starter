import type { CustomLayer } from "@/lib/avatar/types";
import { partLabel } from "@/lib/avatar/catalog";
import { HAIR_COLORS } from "@/lib/avatar/palettes";
import { RULES, type DemoChange } from "./demo-rules";

/**
 * Deterministic fallback when no Gemini key is configured (demo mode).
 * Applies ONLY the categories the user mentions — same "preserve
 * everything else" contract as the Gemini path.
 */

const has = (s: string, words: string[]) => words.some((w) => s.includes(w));

export function demoInterpret(message: string): { reply: string; changes: DemoChange[] } {
  const m = message.toLowerCase();
  const changes: DemoChange[] = [];
  for (const rule of RULES) {
    if (has(m, rule.words) && (!rule.context || has(m, rule.context))) {
      changes.push({ category: rule.category, partId: rule.partId, colorId: rule.colorId });
    }
  }

  const reply =
    changes.length > 0
      ? `Done — I updated ${describe(changes)}. Anything else you'd like to change?`
      : `I couldn't tell what to change from that. Try something like "make the hair blonde", "add round glasses", or "change the shirt to green".`;

  return { reply, changes };
}

function describe(changes: DemoChange[]): string {
  return changes
    .map((c) => `${partLabel(c.category, c.partId ?? c.colorId ?? "")} ${c.category}`)
    .join(", ");
}

export function demoElement(prompt: string): CustomLayer {
  const m = prompt.toLowerCase();
  const color = HAIR_COLORS[hash(prompt) % HAIR_COLORS.length].value;
  const clips = has(m, ["clip", "bow", "flower", "pin"]);
  const messy = has(m, ["messy", "wild", "tousled"]);

  const fringe = messy
    ? `<path d="M112 122 Q132 82 172 96 Q202 78 238 92 Q268 82 288 112 Q286 150 256 160 Q222 170 188 158 Q152 168 120 152 Q106 140 112 122 Z" fill="${color}"/><circle cx="164" cy="96" r="16" fill="${color}"/><circle cx="226" cy="100" r="18" fill="${color}"/>`
    : `<path d="M112 120 Q140 84 180 96 Q210 80 244 92 Q276 84 288 112 Q284 148 256 158 Q222 168 188 158 Q150 166 120 150 Q108 138 112 120 Z" fill="${color}"/>`;

  const decoration = clips
    ? `<circle cx="168" cy="104" r="9" fill="#e0714f"/><circle cx="232" cy="108" r="9" fill="#f0c75e"/><circle cx="168" cy="104" r="3.5" fill="#fff" opacity="0.5"/><circle cx="232" cy="108" r="3.5" fill="#fff" opacity="0.5"/>`
    : "";

  return {
    id: crypto.randomUUID(),
    category: "hair",
    kind: "svg",
    label: "AI hair element",
    svg: `<g>${fringe}${decoration}</g>`,
  };
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
