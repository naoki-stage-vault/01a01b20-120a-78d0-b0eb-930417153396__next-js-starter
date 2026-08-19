"use client";

import { useAvatar } from "@/hooks/useAvatarStore";
import styles from "./ChatPanel.module.css";

const SUGGESTIONS = [
  "A friendly woman with curly black hair and round glasses",
  "A man with short blonde hair and a blue shirt",
  "Make the hair blonde",
  "Add sunglasses",
];

export function ChatPanel({
  onSend,
  onStartFromScratch,
}: {
  onSend: (text: string) => void;
  onStartFromScratch: () => void;
}) {
  const { messages, busy } = useAvatar();
  const userCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className={styles.chat} role="log" aria-live="polite" aria-label="Conversation">
      {messages.map((m, i) => {
        const isLast = i === messages.length - 1;
        const typing = isLast && m.role === "user" && busy;
        return (
          <div
            key={m.id}
            className={`${styles.row} ${m.role === "user" ? styles.user : styles.assistant} ${m.error ? styles.error : ""}`}
          >
            <div className={styles.bubble}>
              {m.content}
              {typing && (
                <span className={styles.typing} aria-hidden="true">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </span>
              )}
            </div>
          </div>
        );
      })}

      {userCount === 0 && (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Describe the avatar you want, or try one of these:</p>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className={styles.suggestion} onClick={() => onSend(s)}>
                {s}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onStartFromScratch}>
            or start from scratch
          </button>
        </div>
      )}
    </div>
  );
}
