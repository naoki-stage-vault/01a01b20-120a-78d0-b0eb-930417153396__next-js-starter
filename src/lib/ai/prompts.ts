import { CATEGORIES } from "@/lib/avatar/catalog";

/**
 * Internal style specification — the visual contract for everything the AI
 * produces. Deliberately NOT "make a Notion avatar": it describes the visual
 * characteristics (flat, rounded, minimal, friendly) so generations stay
 * consistent without relying on another product's name as a shortcut.
 */
export const STYLE_SPEC = `Visual style specification for avatar generation:
- Flat, minimal, friendly illustrated avatar for profile/avatar use. NOT a realistic photo, NOT a painting.
- Large rounded head shape filling the upper two-thirds of the frame; simple rounded torso/clothing at the bottom.
- Simple geometric facial features: small nose, simple eyes (dots, circles or gentle arcs), a simple curved mouth, optional small round glasses.
- Flat colors with at most very subtle shading; soft warm/pastel palette; no gradients, no heavy outlines, no 3D, no textures.
- Background is a plain solid soft color or transparent; nothing else in the frame.
- Consistency is critical: keep the exact same artistic style, proportions and color handling across every generation and every edit.`;

export function catalogPrompt(): string {
  return JSON.stringify(
    CATEGORIES.map((c) => ({
      category: c.id,
      label: c.label,
      options: c.options.map((o) => (o === "none" ? "none (nothing shown)" : o)),
      colors: c.colors?.map((col) => col.id) ?? [],
    })),
    null,
    1,
  );
}

export const INTERPRETER_SYSTEM = `${STYLE_SPEC}

You are the AI inside an avatar customization product. The user describes an avatar or asks for targeted edits. The avatar is a structured document of categories: background, skin, hair, brows, eyes, nose, mouth, eyewear, clothing. Each category has a current part and an optional color.

Valid options per category:
${catalogPrompt()}

Respond ONLY with JSON of this exact shape:
{ "reply": "short, warm confirmation in plain language, 1-2 sentences, mentioning what changed",
  "changes": [ { "category": "<one of the categories>", "partId": "<a valid part>", "colorId": "<a valid color, omit if the category has no colors>" } ] }

Rules:
- ONLY include categories the user actually asked to change. Everything else must remain untouched.
- "Make the hair blonde" -> hair colorId "blonde". "Add glasses" -> eyewear partId "round". "Make the glasses round" -> eyewear partId "round".
- A full description may legitimately set several categories at once.
- If the user asks for something with no exact option, choose the closest available option.
- If nothing should change, return "changes": [].
- The reply must never mention JSON, options or categories by id.`;

export function elementPrompt(category: string, userPrompt: string): string {
  return `${STYLE_SPEC}

Create a single isolated "${category}" element for the avatar described by the user: "${userPrompt}".

Requirements:
- Only the requested element (e.g. hair), on a fully transparent background.
- The element is centered and sized so it can be layered onto a head occupying the center of a square canvas.
- Same flat, rounded, friendly style; soft palette; no text, no watermark, no frame, no other objects.`;
}

/** Build the model input for a structured edit request. */
export function buildContents(messages: { role: "user" | "assistant"; content: string }[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}
