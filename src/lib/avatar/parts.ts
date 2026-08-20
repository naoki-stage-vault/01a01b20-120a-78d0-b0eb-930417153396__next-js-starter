/** Avatar assembler — composes all layers in fixed z-order. */
import type { AvatarDocument } from "./types";
import { resolve } from "./parts-data";
import {
  backgroundHtml,
  clothingHtml,
  customHtml,
  hairBackHtml,
  hairFrontHtml,
  skinHtml,
} from "./parts-body";
import {
  browsHtml,
  eyesHtml,
  eyewearHtml,
  mouthHtml,
  noseHtml,
} from "./parts-face";
import {
  CLOTHING_COLORS,
  EYE_COLORS,
  HAIR_COLORS,
  SKIN_COLORS,
} from "./palettes";

export const AVATAR_VIEWBOX = "0 0 400 400";

export interface AvatarLayer {
  id: string;
  html: string;
}

export function buildAvatarLayers(doc: AvatarDocument): AvatarLayer[] {
  const p = doc.parts;
  const skin = resolve(SKIN_COLORS, p.skin.colorId, "fair");
  const hair = resolve(HAIR_COLORS, p.hair.colorId, "dark-brown");
  const eye = resolve(EYE_COLORS, p.eyes.colorId, "dark");
  const clothes = resolve(CLOTHING_COLORS, p.clothing.colorId, "blue");

  const layers: AvatarLayer[] = [
    { id: "background", html: backgroundHtml(p.background.partId) },
    { id: "hair-back", html: hairBackHtml(p.hair.partId, hair) },
    { id: "skin", html: skinHtml(skin) },
    { id: "clothing", html: clothingHtml(p.clothing.partId, clothes) },
    { id: "brows", html: browsHtml(p.brows.partId, hair) },
    { id: "eyes", html: eyesHtml(p.eyes.partId, eye) },
    { id: "nose", html: noseHtml(p.nose.partId) },
    { id: "mouth", html: mouthHtml(p.mouth.partId) },
    { id: "eyewear", html: eyewearHtml(p.eyewear.partId) },
    { id: "hair-front", html: hairFrontHtml(p.hair.partId, hair) },
    { id: "custom", html: customHtml(doc.custom) },
  ];
  return layers.filter((l) => l.html !== "");
}
