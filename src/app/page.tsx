"use client";

import { useCallback } from "react";
import { useAvatar } from "@/hooks/useAvatarStore";
import { Header } from "@/components/workspace/Header";
import { Workspace } from "@/components/workspace/Workspace";
import styles from "./page.module.css";

export default function Home() {
  const { doc, messages, appendMessage, applyAiParts, setBusy, busy, reset } = useAvatar();

  const handleSend = useCallback(
    async (text: string) => {
      if (busy) return;
      appendMessage({ id: crypto.randomUUID(), role: "user", content: text });
      setBusy(true);
      try {
        const history = messages
          .filter((m) => m.role !== "welcome" && !m.error)
          .map((m) => ({ role: m.role, content: m.content }))
          .concat([{ role: "user" as const, content: text }]);
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "interpret",
            messages: history,
            avatar: doc.parts,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
        if (data.kind === "edit") {
          applyAiParts(data.parts);
          appendMessage({ id: crypto.randomUUID(), role: "assistant", content: data.reply });
        }
      } catch (e) {
        appendMessage({
          id: crypto.randomUUID(),
          role: "assistant",
          content: (e as Error).message || "Something went wrong while creating your avatar. Try again.",
          error: true,
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, appendMessage, applyAiParts, doc.parts, messages, setBusy],
  );

  const handleStartFromScratch = useCallback(() => {
    reset();
    appendMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Fresh canvas! Customize any part of the avatar on the right — or tell me what to change.",
    });
  }, [reset, appendMessage]);

  return (
    <main className={styles.main}>
      <Header onStartFromScratch={handleStartFromScratch} />
      <div className={styles.wrap}>
        <Workspace onSend={handleSend} onStartFromScratch={handleStartFromScratch} />
      </div>
    </main>
  );
}
