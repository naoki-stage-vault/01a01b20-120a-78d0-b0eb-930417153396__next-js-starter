export type CategoryId =
  | "background"
  | "skin"
  | "hair"
  | "brows"
  | "eyes"
  | "nose"
  | "mouth"
  | "eyewear"
  | "clothing";

export interface PartSelection {
  partId: string;
  colorId?: string;
}

export type AvatarParts = Record<CategoryId, PartSelection>;

/** AI-generated element layered on top of the avatar (v1: hair). */
export interface CustomLayer {
  id: string;
  category: CategoryId;
  kind: "svg" | "raster";
  label: string;
  /** inline SVG fragment rendered inside a group over the head area */
  svg?: string;
  /** data URL for raster (Gemini) elements */
  url?: string;
}

export interface AvatarDocument {
  parts: AvatarParts;
  custom: CustomLayer[];
}

export interface ColorDef {
  id: string;
  label: string;
  value: string;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  options: string[];
  colors?: ColorDef[];
  hasNone: boolean;
  /** whether this category supports "Create with AI" elements (v1: hair) */
  aiElements?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  pending?: boolean;
}

export interface AiEditChange {
  category: CategoryId;
  partId?: string;
  colorId?: string;
}

export interface AiEditResult {
  kind: "edit";
  reply: string;
  parts: AvatarParts;
}

export interface AiElementResult {
  kind: "element";
  reply: string;
  layer: CustomLayer;
}

export type AiResult = AiEditResult | AiElementResult;

export interface AiRequest {
  mode: "interpret" | "element";
  messages: { role: "user" | "assistant"; content: string }[];
  avatar: AvatarParts;
  category?: CategoryId;
}
