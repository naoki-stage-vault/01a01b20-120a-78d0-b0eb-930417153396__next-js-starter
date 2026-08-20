import type { AiElementResult, AiEditResult, AiRequest, CategoryId, CustomLayer } from "@/lib/avatar/types";
import { publicAiStatus, hasGeminiKey } from "@/lib/ai/config";
import { geminiElement, geminiInterpret, humanizeAiError } from "@/lib/ai/gemini";
import { demoElement, demoInterpret } from "@/lib/ai/demo";
import { applyChanges, validateChanges } from "@/lib/avatar/apply";

export const runtime = "nodejs";

export async function GET() {
  return Response.json(publicAiStatus());
}

function lastUserMessage(messages: { role: string; content: string }[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

export async function POST(req: Request) {
  let body: AiRequest;
  try {
    body = (await req.json()) as AiRequest;
  } catch {
    return Response.json({ error: "Something went wrong. Try again." }, { status: 400 });
  }

  const userMsg = lastUserMessage(body.messages ?? []);
  if (!userMsg.trim()) {
    return Response.json({ error: "Tell me what avatar you'd like to create." }, { status: 400 });
  }

  try {
    /* -------- AI-generated element ("Create with AI" in a category) -------- */
    if (body.mode === "element") {
      const category = (body.category ?? "hair") as CategoryId;
      let layer: CustomLayer;
      if (hasGeminiKey()) {
        const { dataUrl } = await geminiElement(category, userMsg);
        layer = {
          id: crypto.randomUUID(),
          category,
          kind: "raster",
          label: "AI element",
          url: dataUrl,
        };
      } else {
        layer = demoElement(userMsg);
      }
      const result: AiElementResult = {
        kind: "element",
        reply: `Created a custom ${category} element for you. It's layered onto the avatar — you can remove it anytime.`,
        layer,
      };
      return Response.json(result);
    }

    /* -------- Structured edit (chat) -------- */
    let reply: string;
    let changes: ReturnType<typeof validateChanges>;
    if (hasGeminiKey()) {
      const parsed = await geminiInterpret(body.messages ?? [], JSON.stringify(body.avatar));
      reply = parsed.reply;
      changes = validateChanges(parsed.changes);
    } else {
      const demo = demoInterpret(userMsg);
      reply = demo.reply;
      changes = validateChanges(demo.changes);
    }

    const result: AiEditResult = {
      kind: "edit",
      reply,
      parts: applyChanges(body.avatar, changes),
    };
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: humanizeAiError(e) }, { status: 500 });
  }
}
