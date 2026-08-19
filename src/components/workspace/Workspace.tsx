"use client";

import { useAvatar } from "@/hooks/useAvatarStore";
import { downloadPNG, downloadSVG } from "@/lib/avatar/export";
import { FaceFrame } from "@/components/workspace/FaceFrame";
import { SidePanel } from "@/components/workspace/SidePanel";
import { ChatComposer } from "@/components/chat/ChatComposer";
import {
  DownloadIcon,
  RedoIcon,
  ShuffleIcon,
  UndoIcon,
} from "@/components/ui/Icons";
import styles from "./Workspace.module.css";

export function Workspace({
  onSend,
  onStartFromScratch,
}: {
  onSend: (text: string) => void;
  onStartFromScratch: () => void;
}) {
  const { doc, busy, undo, redo, canUndo, canRedo, shuffle } = useAvatar();

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <FaceFrame doc={doc} busy={busy} />

        <div className={styles.actions} aria-label="Avatar actions">
          <button
            type="button"
            className="btn-icon"
            onClick={undo}
            disabled={!canUndo || busy}
            aria-label="Undo"
            title="Undo"
          >
            <UndoIcon size={16} />
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={redo}
            disabled={!canRedo || busy}
            aria-label="Redo"
            title="Redo"
          >
            <RedoIcon size={16} />
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={shuffle}
            disabled={busy}
            aria-label="Shuffle avatar"
            title="Shuffle"
          >
            <ShuffleIcon size={16} />
          </button>

          <div className={styles.actionsRight}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => downloadSVG(doc)}
              disabled={busy}
            >
              <DownloadIcon size={15} /> SVG
            </button>
            <button
              type="button"
              className="pill pill-primary"
              onClick={() => downloadPNG(doc)}
              disabled={busy}
            >
              <DownloadIcon size={15} /> Download PNG
            </button>
          </div>
        </div>

        <ChatComposer onSend={onSend} />
      </div>

      <div className={styles.right}>
        <SidePanel onSend={onSend} onStartFromScratch={onStartFromScratch} />
      </div>
    </div>
  );
}
