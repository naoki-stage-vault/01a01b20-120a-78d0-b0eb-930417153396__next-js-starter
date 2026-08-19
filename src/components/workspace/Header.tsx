"use client";

import { useAvatar } from "@/hooks/useAvatarStore";
import { LogoIcon } from "@/components/ui/Icons";
import styles from "./Header.module.css";

export function Header({ onStartFromScratch }: { onStartFromScratch: () => void }) {
  const { aiStatus } = useAvatar();
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <LogoIcon size={22} />
        <span className={styles.logoText}>FaceCraft</span>
      </div>
      <div className={styles.actions}>
        {aiStatus?.demo && (
          <span className="chip" title="No Gemini API key configured — using a built-in demo interpreter">
            Demo mode
          </span>
        )}
        <button type="button" className="pill pill-secondary" onClick={onStartFromScratch}>
          Start from scratch
        </button>
      </div>
    </header>
  );
}
