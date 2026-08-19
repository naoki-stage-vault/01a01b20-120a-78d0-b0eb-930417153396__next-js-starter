# Implementation Map — AI Avatar Generator (Notion Faces-inspired)

Phase 0 deliverable. Written before implementation code, based on live analysis of
`faces.notion.com/customize` (fetched its HTML, CSS bundles and JS chunks directly).

## 1. Reference analysis (what the real page revealed)

### Design tokens (extracted verbatim from the production CSS)

```
spacing        xxs:2  xs:4  sm:8  md:16  lg:20  xl:32  xxl:64 (px)
radii          sm:4  md:8  lg:12  xl:24  full:9999
button sizes   xs:30  sm:36  md:40  lg:60 (px heights)
font sizes     body-xs/sm:13  body-md:16  heading-sm:18*  heading-md:22 (px)
font weights   regular:450  medium:550  bold:600
heading-md     letter-spacing: -0.26px
colors         mono-300:#aaaaaa  400:#999  500:#808080  600:#666  800:#1a1a1a
               white:#fff  white-dark:#fafaf9
               blue-light:#ebf5fe  blue:#1684ef  blue-dark:#1277dc
               cream-light:#fafaf9  cream:#f4f4f1
               hover:rgba(0,0,0,.04)  active:rgba(0,0,0,.08)  border:rgba(0,0,0,.08)
focus          inset 0 0 0 1px #2383e291, 0 0 0 2px #2383e259
shadows        level-1/2: ultra-soft multi-layer (used on cards/buttons/frames)
font           Inter variable 100–900 (page font is Inter)
```

### Page structure (from component class names)

- **Header**: absolute, padding 16 (mobile) / 20 (desktop), logo (20px bold) left,
  actions right. Logo focuses with the focus ring.
- **Main**: 100dvh flex column centered; mobile padding 48/16/16; card grid
  `max-width:800px; margin:62px auto` (mobile) / `78px auto` (desktop).
- **Card**: white, radius 12 (≥600px), soft shadow; full-bleed on mobile.
- **Customize card**: `grid-template-columns:3fr 2fr` on desktop (avatar+form : editor);
  editor separated by `border-left + padding-left:20px`.
- **Face**: circular frame (border-radius:50%, white, border rgba(0,0,0,.08),
  shadow level-2, padding 13.5%), 220px wide, expands to 280px, `translateY(-42px)`
  — the frame floats UP over the card edge (signature look). Actions row appears
  below the frame on hover (scale .5→1 + fade, .15s).
- **Generator canvas**: width 100%, radius 8px, touch-action none (drag-to-rotate?).
- **Message form** (`customizationCard_messageWrap`): the AI prompt input sits
  directly under the avatar, with a small icon button at top-right of the wrap.
- **Palette** (mobile): bottom sheet, `height:50dvh-61px` content, border-top,
  height transition .25s linear. Desktop: hidden; replaced by a left rail of
  category tool buttons (60px tall) + panel.
- **Category panel**: white, border-left; header row (category name + action
  buttons: shuffle, clear), color-tag row, tile grid `repeat(3,minmax(80px,1fr))`
  mobile / `repeat(6,minmax(80px,1fr))` desktop, gap 8. "None" option present in
  each category.
- **Color tags**: pill (radius full, height 30, font 13), swatch 20px circle;
  active = blue-light bg + blue border.
- **Color picker**: 5-col grid of 40px circles, swatch radius 40, active = 2px blue border.
- **Buttons**: primary = blue #1684ef / white text; secondary = white / mono-800
  / 1px border; radius 8; heights 36/40; pill variant (radius 100px) heights 40/60;
  lg primary active → `scale(.95)`; focus = the blue ring.
- **Popups**: `popIn .2s cubic-bezier(.175,.885,.32,1.275)` (overshoot), white,
  radius 8, shadow level-2, border.
- **Loading**: 40px ring spinner, 2px border, .6s linear; also `fadeIn .15/.25s`.
- **Categories** (from JS): Hair, Mouth, Nose, Eyes, Brows, Eyewear, Skin,
  Accessories, Background (+ Top/Clothing equivalents in translations).
- **Avatar state in URL**: `?face=<compact string>` encodes the full avatar
  (e.g. `s5e28y7b22n16m32h244a10`) — state survives reload/share via URL.

### Interaction philosophy

Fast, subtle, intentional. Hover = 4% black wash; active = 8%; selection = blue
ring/light-blue fill; avatar always visible and dominant; controls compact; the
face floats over the card; transitions 0.15–0.25s ease-in-out; popups overshoot.

## 2. Product architecture (our decisions)

### Core concept: the avatar is a layered SVG document

```
AvatarDocument {
  parts: Record<CategoryId, { partId: string; colorId?: string }>
  custom: CustomLayer[]        // AI-generated raster elements (v1: hair)
}
```

Composed client-side in fixed z-order:

```
background → clothing → neck → hair-back → head → ears →
eyes → brows → nose → mouth → eyewear → hair-front → custom elements
```

Why: this is the ONLY architecture that guarantees the spec's hardest acceptance
criteria — manual edits survive AI edits, and AI edits never touch unrelated
parts. A flat raster pipeline cannot do this reliably; layers do it by
construction. AI "edits" become structured changes to the document.

### AI layer (server-side, `POST /api/ai`)

- **Interpreter**: user message + current avatar + conversation → structured
  `AiEdit` (which categories to change, to what) via Gemini JSON mode
  (`responseMimeType: application/json` + schema), or a deterministic keyword
  interpreter in **demo mode** when `GEMINI_API_KEY` is absent (this environment
  has none — the product must be fully testable without a key).
- **Custom elements**: "Create with AI" in a category (v1: Hair). With a key,
  Gemini image model generates a transparent-background element; without, a
  procedural SVG element in our flat style. Result becomes a custom layer.
- **Style prompt**: an internal style specification (NOT "make a Notion avatar")
  describing our flat, rounded, friendly visual system, so any future raster path
  stays on-style.
- **Config**: `GEMINI_API_KEY` (server-only), `GEMINI_MODEL` (default
  `gemini-2.5-flash`), `GEMINI_IMAGE_MODEL` (default `gemini-2.5-flash-image`).
  Keys never reach the client; UI shows a subtle "demo mode" chip when no key.
- **Hybrid consistency**: manual changes are layer swaps; the interpreter only
  returns the categories the user asked about → manual edits preserved by design.

### Manual editor

Reference-shaped palette: category rail/tabs → tile grid (option previews =
whole avatar with that option applied) + color tags per category + "None".
9 curated categories: Background, Skin, Hair, Eyes, Brows, Nose, Mouth,
Eyewear, Clothing. No "Apply" button — instant updates.

### UI composition

- **Header**: logo (our brand: **FaceCraft**), actions (download, demo chip).
- **Workspace**: reference-style card; circular face frame floating over the
  card; AI prompt input under the avatar (like the reference form); actions:
  Download PNG (primary pill), Download SVG, Undo/Redo, Shuffle.
- **Right panel**: tabs **Chat** (conversation, Claude-style, minimal) and
  **Customize** (editor palette). Mobile: stacked, tabbed, no horizontal scroll.
- **Loading**: the reference's 40px ring + the frame content fades (.25s) — no
  "Loading…" text, no flashy AI styling.
- **Errors**: human-readable messages (mapped from Gemini/network/demo errors),
  never stack traces.
- **Download**: PNG (SVG→canvas @1024) and SVG (serialized document) directly
  from the browser. No DB, no auth, no uploads.
- **URL state**: our own compact `?face=` encoding of the document
  (same spirit as the reference's param), synced via `history.replaceState`.

### Original artwork

All SVG parts are drawn from scratch in the reference's *shape language* (flat,
rounded, soft pastels, subtle shading, minimal facial features). No Notion
assets are copied; part IDs/labels are our own.

## 3. Build phases (execution order)

1. ✅ Phase 0 — reference analysis (this doc)
2. Design tokens + global styles (Tailwind v4 `@theme` mirroring the tokens above)
3. Avatar engine: types, palettes, catalog, defaults, URL encode, export
4. SVG parts + AvatarCanvas
5. Manual editor UI
6. AI: config, prompt, gemini client, demo interpreter, route handler
7. Chat UI + generation overlay
8. History (undo/redo), shuffle, download wiring
9. Responsive + a11y pass
10. QA: full journey + build/typecheck + dev-server smoke test

## 4. Verification

- `npm run build` clean (strict TS), dev server serves the app.
- Journey A: describe → generate → refine via chat → manual fine-tune → AI
  element → download. Journey B: start from scratch → customize → download.
- Manual edits survive subsequent AI edits (by construction).
- Visual audit vs tokens above; mobile: no overflow, touch targets ≥36px.
