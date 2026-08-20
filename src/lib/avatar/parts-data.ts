/** Shared SVG builders + geometry constants (small, safe module). */

export function el(
  tag: string,
  attrs: Record<string, string | number | undefined>,
  children?: string,
): string {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) =>
      `${k}="${String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"`,
    )
    .join(" ");
  return children === undefined
    ? `<${tag} ${a}/>`
    : `<${tag} ${a}>${children}</${tag}>`;
}

export function resolve(
  defs: { id: string; value: string }[],
  id: string | undefined,
  fallback: string,
): string {
  return defs.find((d) => d.id === id)?.value ?? fallback;
}

export const AVATAR_VIEWBOX = "0 0 400 400";
export const INK = "#4a2f24";
export const SOFT_SHADE = "rgba(0,0,0,0.14)";

export const TORSO =
  "M112 248 Q112 232 128 226 L166 216 Q178 212 186 224 Q200 232 214 224 Q222 212 234 216 L272 226 Q288 232 288 248 L288 296 Q288 330 252 336 L148 336 Q112 330 112 296 Z";

export const HAIR_BACK: Record<string, string> = {
  short:
    "M116 132 Q118 64 200 60 Q282 64 284 132 Q284 196 262 214 Q240 226 200 228 Q160 226 138 214 Q116 196 116 132 Z",
  long:
    "M116 132 Q116 60 200 58 Q284 60 284 132 Q288 210 268 268 Q252 306 200 310 Q148 306 132 268 Q112 210 116 132 Z",
  bob: "M116 132 Q118 60 200 58 Q282 60 284 132 Q286 210 268 238 Q240 254 200 256 Q160 254 132 238 Q114 210 116 132 Z",
  buzz: "M118 118 Q120 64 200 60 Q280 64 282 118 Q200 126 118 118 Z",
  bun: "M118 122 Q120 64 200 60 Q280 64 282 122 Q240 132 200 130 Q160 132 118 122 Z",
  ponytail:
    "M118 122 Q120 64 200 60 Q280 64 282 122 Q240 132 200 130 Q160 132 118 122 Z" +
    "M284 116 Q310 142 304 182 Q298 218 282 234 Q270 214 276 178 Q280 148 284 116 Z",
  waves:
    "M116 128 Q118 62 200 58 Q282 62 284 128 Q284 190 266 216 Q246 232 200 234 Q154 232 134 216 Q116 190 116 128 Z",
};

export const HAIR_FRONT: Record<string, string> = {
  short:
    "M118 116 Q146 90 180 102 Q210 88 240 100 Q268 90 284 114 Q282 140 262 148 Q230 156 200 152 Q170 156 140 148 Q118 140 118 116 Z",
  long:
    "M118 116 Q160 92 200 98 Q240 92 282 116 Q282 138 262 144 Q230 150 200 146 Q170 150 138 144 Q118 138 118 116 Z",
  bob: "M118 114 Q200 88 282 114 L282 146 Q200 158 118 146 Z",
  buzz: "",
  bun: "M120 112 Q200 90 282 112 Q282 132 200 140 Q120 132 120 112 Z",
  ponytail: "M120 112 Q200 90 282 112 Q282 132 200 140 Q120 132 120 112 Z",
  waves:
    "M118 114 Q160 90 204 100 Q252 90 284 116 Q278 142 252 150 Q220 156 192 150 Q156 156 132 146 Q114 136 118 114 Z",
};
