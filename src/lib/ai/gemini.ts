import type { AiEditChange } from "@/lib/avatar/types";
import { getAiConfig } from "./config";
import { INTERPRETER_SYSTEM, STYLE_SPEC, buildContents, elementPrompt } from "./prompts";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export class AiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "AiError";
  }
}

/** Map any failure to a human-readable message. Never leak internals. */
export function humanizeAiError(e: unknown): string {
  if (e instanceof AiError) {
    switch (e.status) {
      case 400:
        return "The request couldn't be understood. Try rephrasing.";
      case 401:
      case 403:
        return "The AI service rejected the request — check the server configuration.";
      case 404:
        return "The configured AI model isn't available. Check the model setting.";
      case 422:
        return "The AI returned an unexpected response. Try again.";
      case 429:
        return "The AI service is busy right now. Try again in a moment.";
      case 500:
      case 502:
      case 503:
        return "Something went wrong while creating your avatar. Try again.";
    }
    return "Something went wrong while creating your avatar. Try again.";
  }
  if (e instanceof Error && e.name === "TimeoutError") {
    return "The AI took too long to respond. Try again.";
  }
  if (e instanceof Error && /fetch|network|ECONN|ENOTFOUND|ETIMEDOUT/i.test(e.message)) {
    return "Couldn't reach the AI service. Check your connection.";
  }
  return "Something went wrong while creating your avatar. Try again.";
}

export interface InterpreterResponse {
  reply: string;
  changes: AiEditChange[];
}

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}
interface GeminiResponse {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
}

function parseGeminiResponse(raw: string): GeminiResponse {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new AiError("Malformed API response", 422);
  }
  return json as GeminiResponse;
}

function firstText(res: GeminiResponse): string {
  const parts = res.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? "").join("");
}

export async function geminiInterpret(
  messages: { role: "user" | "assistant"; content: string }[],
  currentPartsJson: string,
): Promise<InterpreterResponse> {
  const cfg = getAiConfig();
  if (!cfg.apiKey) throw new AiError("No API key configured", 403);

  const contents = buildContents(messages);
  contents.push({
    role: "user",
    parts: [{ text: `Current avatar document (JSON):\n${currentPartsJson}` }],
  });

  const res = await fetch(`${API_BASE}/${cfg.model}:generateContent?key=${cfg.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: INTERPRETER_SYSTEM }] },
      contents,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        responseSchema: {
          type: "OBJECT",
          properties: {
            reply: { type: "STRING" },
            changes: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  category: { type: "STRING" },
                  partId: { type: "STRING" },
                  colorId: { type: "STRING" },
                },
              },
            },
          },
          required: ["reply", "changes"],
        },
      },
    }),
  });

  const raw = await res.text();
  if (!res.ok) throw new AiError(raw.slice(0, 300), res.status);

  const out = firstText(parseGeminiResponse(raw));
  try {
    const parsed = JSON.parse(out) as { reply?: unknown; changes?: unknown };
    return {
      reply: String(parsed.reply ?? ""),
      changes: Array.isArray(parsed.changes) ? (parsed.changes as AiEditChange[]) : [],
    };
  } catch {
    throw new AiError("Unexpected AI response", 422);
  }
}

export async function geminiElement(
  category: string,
  prompt: string,
): Promise<{ dataUrl: string }> {
  const cfg = getAiConfig();
  if (!cfg.apiKey) throw new AiError("No API key configured", 403);

  const res = await fetch(`${API_BASE}/${cfg.imageModel}:generateContent?key=${cfg.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(90_000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: STYLE_SPEC }] },
      contents: [{ role: "user", parts: [{ text: elementPrompt(category, prompt) }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });

  const raw = await res.text();
  if (!res.ok) throw new AiError(raw.slice(0, 300), res.status);

  const parsed = parseGeminiResponse(raw);
  const parts = parsed.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img?.inlineData) throw new AiError("No image returned", 422);
  const { mimeType, data } = img.inlineData;
  return { dataUrl: `data:${mimeType};base64,${data}` };
}
