import type { CategoryId } from "@/lib/avatar/types";

/** Keyword rules for the demo interpreter (no Gemini key needed). */

export interface DemoChange {
  category: CategoryId;
  partId?: string;
  colorId?: string;
}

interface Rule {
  words: string[];
  /** extra words that must also be present (e.g. "hair" for hair colors) */
  context?: string[];
  category: CategoryId;
  partId?: string;
  colorId?: string;
}

const C = [
  "shirt",
  "hoodie",
  "tee",
  "sweater",
  "jacket",
  "clothing",
  "top",
  "wear",
];

export const RULES: Rule[] = [
  { words: ["curly", "curls"], category: "hair", partId: "curly" },
  { words: ["long hair", "long hairstyle"], category: "hair", partId: "long" },
  { words: ["short hair", "short hairstyle"], category: "hair", partId: "short" },
  { words: ["bob cut", "hair bob", " a bob"], category: "hair", partId: "bob" },
  { words: ["buzz"], category: "hair", partId: "buzz" },
  { words: ["hair bun", "a bun"], category: "hair", partId: "bun" },
  { words: ["ponytail", "pony tail"], category: "hair", partId: "ponytail" },
  { words: ["wavy", "waves"], category: "hair", partId: "waves" },
  { words: ["bald", "shaved", "no hair"], category: "hair", partId: "none" },
  { words: ["dark brown"], context: ["hair"], category: "hair", colorId: "dark-brown" },
  { words: ["blonde", "blond"], context: ["hair"], category: "hair", colorId: "blonde" },
  { words: ["auburn", "ginger", "red hair"], context: ["hair"], category: "hair", colorId: "auburn" },
  { words: ["gray", "grey"], context: ["hair"], category: "hair", colorId: "gray" },
  { words: ["pink"], context: ["hair"], category: "hair", colorId: "pink" },
  { words: ["purple"], context: ["hair"], category: "hair", colorId: "purple" },
  { words: ["black"], context: ["hair"], category: "hair", colorId: "black" },
  { words: ["brown", "brunette"], context: ["hair"], category: "hair", colorId: "brown" },
  { words: ["blue eyes"], category: "eyes", colorId: "blue" },
  { words: ["green eyes"], category: "eyes", colorId: "green" },
  { words: ["brown eyes"], category: "eyes", colorId: "brown" },
  { words: ["hazel eyes"], category: "eyes", colorId: "hazel" },
  { words: ["sleepy", "tired eyes"], category: "eyes", partId: "sleepy" },
  { words: ["happy eyes", "closed eyes", "smiling eyes"], category: "eyes", partId: "happy" },
  { words: ["dark eyes"], category: "eyes", colorId: "dark" },
  { words: ["thick brows", "thick eyebrows"], category: "brows", partId: "thick" },
  { words: ["arched brows", "arched eyebrows"], category: "brows", partId: "arched" },
  { words: ["raised brows", "raised eyebrows"], category: "brows", partId: "raised" },
  { words: ["no brows", "no eyebrows"], category: "brows", partId: "none" },
  { words: ["straight brows", "straight eyebrows"], category: "brows", partId: "straight" },
  { words: ["button nose"], category: "nose", partId: "button" },
  { words: ["no nose"], category: "nose", partId: "none" },
  { words: ["small nose"], category: "nose", partId: "dot" },
  { words: ["big smile", "grin", "huge smile", "wide smile"], category: "mouth", partId: "big-smile" },
  { words: ["smirk"], category: "mouth", partId: "smirk" },
  { words: ["neutral", "serious", "straight face"], category: "mouth", partId: "neutral" },
  { words: ["open mouth", "laughing"], category: "mouth", partId: "open" },
  { words: ["lips", "lipstick"], category: "mouth", partId: "lips" },
  { words: ["smile", "smiling", "friendly"], category: "mouth", partId: "smile" },
  { words: ["no glasses", "without glasses", "remove glasses"], category: "eyewear", partId: "none" },
  { words: ["sunglasses", "shades"], category: "eyewear", partId: "sunglasses" },
  { words: ["square glasses"], category: "eyewear", partId: "square" },
  { words: ["round glasses"], category: "eyewear", partId: "round" },
  { words: ["glasses", "spectacles", "specs", "eyewear"], category: "eyewear", partId: "round" },
  { words: ["hoodie", "hoody"], category: "clothing", partId: "hoodie" },
  { words: ["dress shirt", "button-up", "button down", "collar"], category: "clothing", partId: "collar" },
  { words: ["jacket"], category: "clothing", partId: "jacket" },
  { words: ["sweater", "jumper", "knitwear"], category: "clothing", partId: "sweater" },
  { words: ["shirt", "t-shirt", "tshirt", "tee"], category: "clothing", partId: "tee" },
  { words: ["blue"], context: C, category: "clothing", colorId: "blue" },
  { words: ["black"], context: C, category: "clothing", colorId: "black" },
  { words: ["coral", "orange", "red"], context: C, category: "clothing", colorId: "coral" },
  { words: ["green", "mint"], context: C, category: "clothing", colorId: "mint" },
  { words: ["yellow"], context: C, category: "clothing", colorId: "yellow" },
  { words: ["lavender", "purple"], context: C, category: "clothing", colorId: "lavender" },
  { words: ["pink"], context: C, category: "clothing", colorId: "pink" },
  { words: ["gray", "grey"], context: C, category: "clothing", colorId: "gray" },
  { words: ["porcelain", "pale", "light skin"], category: "skin", colorId: "porcelain" },
  { words: ["fair"], category: "skin", colorId: "fair" },
  { words: ["medium", "olive"], category: "skin", colorId: "medium" },
  { words: ["tan", "tanned"], category: "skin", colorId: "tan" },
  { words: ["dark skin", "deep skin", "rich skin"], category: "skin", colorId: "deep" },
  { words: ["no background", "transparent background"], category: "background", partId: "none" },
  { words: ["blush"], category: "background", partId: "blush" },
  { words: ["mint"], category: "background", partId: "mint" },
  { words: ["sky"], category: "background", partId: "sky" },
  { words: ["butter"], category: "background", partId: "butter" },
  { words: ["lilac"], category: "background", partId: "lilac" },
  { words: ["peach"], category: "background", partId: "peach" },
  { words: ["mist"], category: "background", partId: "mist" },
];
