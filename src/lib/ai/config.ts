/**
 * Centralized AI configuration. Keys are server-only (read via
 * process.env in route handlers); nothing here is ever exposed to the
 * client bundle.
 */
export interface AiConfig {
  apiKey: string;
  model: string;
  imageModel: string;
}

export function getAiConfig(): AiConfig {
  return {
    apiKey: process.env.GEMINI_API_KEY ?? "",
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    imageModel: process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image",
  };
}

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function publicAiStatus() {
  const cfg = getAiConfig();
  return { demo: !cfg.apiKey, model: cfg.model, imageModel: cfg.imageModel };
}
