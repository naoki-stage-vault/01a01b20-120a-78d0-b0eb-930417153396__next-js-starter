"use client";

import { useState } from "react";
import { useAvatar } from "@/hooks/useAvatarStore";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { ChatIcon, SlidersIcon } from "@/components/ui/Icons";
import styles from "./SidePanel.module.css";

type Tab = "chat" | "customize";

export function SidePanel({
  onSend,
  onStartFromScratch,
}: {
  onSend: (text: string) => void;
  onStartFromScratch: () => void;
}) {
  const [tab, setTab] = useState<Tab>("chat");
  const { busy } = useAvatar();

  return (
    <div className={styles.side}>
      <div className={styles.tabs} role="tablist" aria-label="Editor mode">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "chat"}
          className={`${styles.tab} ${tab === "chat" ? styles.tabActive : ""}`}
          onClick={() => setTab("chat")}
        >
          <ChatIcon size={15} /> Chat
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "customize"}
          className={`${styles.tab} ${tab === "customize" ? styles.tabActive : ""}`}
          onClick={() => setTab("customize")}
        >
          <SlidersIcon size={15} /> Customize
        </button>
      </div>

      <div className={styles.panel}>
        {tab === "chat" ? (
          <ChatPanel onSend={onSend} onStartFromScratch={onStartFromScratch} />
        ) : (
          <EditorPanel />
        )}
      </div>

      {tab === "chat" && busy && (
        <p className={styles.busyHint} role="status">
          Updating your avatar…
        </p>
      )}
    </div>
  );
}
