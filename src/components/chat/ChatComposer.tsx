"use client";

import { useState } from "react";
import { useAvatar } from "@/hooks/useAvatarStore";
import { SendIcon } from "@/components/ui/Icons";
import styles from "./ChatComposer.module.css";

export function ChatComposer({ onSend }: { onSend: (text: string) => void }) {
  const { busy } = useAvatar();
  const [text, setText] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t || busy) return;
    setText("");
    onSend(t);
  };

  return (
    <div className={styles.wrap}>
      <textarea
        className={styles.input}
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Describe the avatar you want…"
        aria-label="Describe the avatar you want"
      />
      <button
        type="button"
        className={styles.send}
        onClick={submit}
        disabled={!text.trim() || busy}
        aria-label="Send message"
      >
        <SendIcon size={16} />
      </button>
    </div>
  );
}
