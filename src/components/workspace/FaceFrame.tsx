"use client";

import type { AvatarDocument } from "@/lib/avatar/types";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import styles from "./FaceFrame.module.css";

export function FaceFrame({ doc, busy }: { doc: AvatarDocument; busy: boolean }) {
  return (
    <div className={styles.frameWrap}>
      <div className={`${styles.frame} ${busy ? styles.fading : ""}`}>
        <AvatarCanvas doc={doc} className={styles.canvas} ariaLabel="Current avatar" />
      </div>
      {busy && (
        <div className={styles.overlay} role="status" aria-live="polite">
          <span className={styles.ring} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
