import type { AiEditChange, AvatarParts, CategoryId } from "./types";
import { CATEGORY_BY_ID } from "./catalog";

/** Drop any change that references an unknown category/part/color. */
export function validateChanges(changes: AiEditChange[]): AiEditChange[] {
  return changes.filter((c) => {
    const def = CATEGORY_BY_ID[c.category as CategoryId];
    if (!def) return false;
    if (c.partId !== undefined && !def.options.includes(c.partId)) return false;
    if (c.colorId !== undefined && def.colors && !def.colors.some((x) => x.id === c.colorId)) {
      return false;
    }
    return true;
  });
}

/** Apply validated changes to a copy of the avatar. Untouched parts survive. */
export function applyChanges(parts: AvatarParts, changes: AiEditChange[]): AvatarParts {
  const next = structuredClone(parts);
  for (const c of changes) {
    const sel = next[c.category as CategoryId];
    if (!sel) continue;
    if (c.partId !== undefined) sel.partId = c.partId;
    if (c.colorId !== undefined) sel.colorId = c.colorId;
  }
  return next;
}
