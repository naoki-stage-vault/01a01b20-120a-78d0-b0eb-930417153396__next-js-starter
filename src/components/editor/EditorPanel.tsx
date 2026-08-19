"use client";

import { useState } from "react";
import { useAvatar } from "@/hooks/useAvatarStore";
import { CATEGORIES, CATEGORY_BY_ID, partLabel } from "@/lib/avatar/catalog";
import type { AvatarDocument, CategoryId } from "@/lib/avatar/types";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PlusIcon, SparkleIcon, TrashIcon } from "@/components/ui/Icons";
import styles from "./EditorPanel.module.css";

export function EditorPanel() {
  const store = useAvatar();
  const [active, setActive] = useState<CategoryId>("hair");
  const [aiPrompt, setAiPrompt] = useState("");
  const [elementError, setElementError] = useState<string | null>(null);

  const def = CATEGORY_BY_ID[active];
  const sel = store.doc.parts[active];
  const customLayers = store.doc.custom.filter((l) => l.category === active);

  const variantDoc = (category: CategoryId, partId: string): AvatarDocument => ({
    parts: {
      ...store.doc.parts,
      [category]: { partId, colorId: store.doc.parts[category].colorId },
    },
    custom: store.doc.custom,
  });

  const generateElement = async () => {
    const text = aiPrompt.trim();
    if (!text || store.layerBusy) return;
    store.setLayerBusy(true);
    setElementError(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "element",
          category: active,
          messages: [{ role: "user", content: text }],
          avatar: store.doc.parts,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      store.addLayer(data.layer);
      setAiPrompt("");
    } catch (e) {
      setElementError((e as Error).message);
    } finally {
      store.setLayerBusy(false);
    }
  };

  const showTiles = def.options.length > 1 || active === "background";

  return (
    <div className={styles.editor}>
      <div className={styles.catNav} role="tablist" aria-label="Avatar categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={active === c.id}
            className={`${styles.catTab} ${active === c.id ? styles.catTabActive : ""}`}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {showTiles && (
          <div className={styles.tiles}>
            {def.options.map((partId) => {
              const isSelected = sel.partId === partId;
              return (
                <button
                  key={partId}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${def.label}: ${partLabel(active, partId)}`}
                  className={`${styles.tile} ${isSelected ? styles.tileActive : ""}`}
                  onClick={() => store.setPart(active, partId)}
                >
                  <AvatarCanvas doc={variantDoc(active, partId)} className={styles.tileCanvas} ariaLabel="" />
                  <span className={styles.tileLabel}>{partLabel(active, partId)}</span>
                </button>
              );
            })}

            {def.aiElements && (
              <div className={`${styles.tile} ${styles.aiTile}`}>
                {store.layerBusy ? (
                  <span className={styles.aiBusy} role="status" aria-live="polite">
                    <span className={styles.ringSmall} aria-hidden="true" />
                  </span>
                ) : (
                  <SparkleIcon size={20} />
                )}
                <span className={styles.tileLabel}>Create with AI</span>
              </div>
            )}
          </div>
        )}

        {def.colors && (
          <div className={styles.colorRow} role="group" aria-label={`${def.label} colors`}>
            {def.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={sel.colorId === c.id}
                className={`tag ${sel.colorId === c.id ? "tag-active" : ""}`}
                onClick={() => store.setColor(active, c.id)}
              >
                <span className="swatch" style={{ background: c.value }} aria-hidden="true" />
                {c.label}
              </button>
            ))}
          </div>
        )}

        {def.aiElements && (
          <div className={styles.aiSection}>
            {customLayers.length > 0 && (
              <ul className={styles.layerList}>
                {customLayers.map((l) => (
                  <li key={l.id} className={styles.layerItem}>
                    <span className={styles.layerLabel}>{l.label}</span>
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={`Remove ${l.label}`}
                      onClick={() => store.removeLayer(l.id)}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.aiRow}>
              <input
                className={styles.aiInput}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void generateElement();
                  }
                }}
                placeholder={`Describe a custom ${active} element…`}
                aria-label={`Describe a custom ${active} element`}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={!aiPrompt.trim() || store.layerBusy}
                onClick={() => void generateElement()}
              >
                <PlusIcon size={15} /> Generate
              </button>
            </div>
            {elementError && <p className={styles.error}>{elementError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
