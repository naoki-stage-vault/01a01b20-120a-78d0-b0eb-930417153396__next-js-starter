"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AvatarDocument, AvatarParts, CategoryId, ChatMessage, CustomLayer } from "@/lib/avatar/types";
import { DEFAULT_PARTS } from "@/lib/avatar/catalog";
import { decodeParts, encodeParts } from "@/lib/avatar/url";

export interface AiStatus {
  demo: boolean;
  model: string;
  imageModel: string;
}

interface AvatarStore {
  doc: AvatarDocument;
  setPart: (category: CategoryId, partId: string) => void;
  setColor: (category: CategoryId, colorId: string) => void;
  applyAiParts: (parts: AvatarParts) => void;
  addLayer: (layer: CustomLayer) => void;
  removeLayer: (id: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  shuffle: () => void;
  reset: () => void;
  messages: ChatMessage[];
  appendMessage: (m: ChatMessage) => void;
  clearMessages: () => void;
  busy: boolean;
  setBusy: (b: boolean) => void;
  aiStatus: AiStatus | null;
  layerBusy: boolean;
  setLayerBusy: (b: boolean) => void;
}

const Ctx = createContext<AvatarStore | null>(null);

const HISTORY_LIMIT = 60;

function initialParts(): AvatarParts {
  if (typeof window === "undefined") return structuredClone(DEFAULT_PARTS);
  try {
    const params = new URLSearchParams(window.location.search);
    return decodeParts(params.get("face"));
  } catch {
    return structuredClone(DEFAULT_PARTS);
  }
}

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<AvatarParts[]>(() => [initialParts()]);
  const [index, setIndex] = useState(0);
  const [custom, setCustom] = useState<CustomLayer[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! Describe the avatar you'd like and I'll create it — then we can keep refining it together. Or start from scratch and customize it manually.",
    },
  ]);
  const [busy, setBusy] = useState(false);
  const [layerBusy, setLayerBusy] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);
  const firstRender = useRef(true);

  const parts = history[index];
  const doc = useMemo<AvatarDocument>(
    () => ({ parts, custom }),
    [parts, custom],
  );

  /* fetch AI status once */
  useEffect(() => {
    fetch("/api/ai")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j && setAiStatus(j))
      .catch(() => {});
  }, []);

  /* keep the URL in sync with the avatar (reference-style ?face= state) */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("face", encodeParts(parts));
      window.history.replaceState(null, "", url.toString());
    } catch {
      /* no-op */
    }
  }, [parts]);

  const commit = useCallback((next: AvatarParts) => {
    setHistory((h) => {
      const head = h.slice(0, index + 1);
      const nextHistory = [...head, next];
      if (nextHistory.length > HISTORY_LIMIT) nextHistory.shift();
      return nextHistory;
    });
    setIndex((i) => Math.min(i + 1, HISTORY_LIMIT - 1));
  }, [index]);

  const setPart = useCallback(
    (category: CategoryId, partId: string) => {
      const next = structuredClone(parts);
      next[category].partId = partId;
      commit(next);
    },
    [parts, commit],
  );

  const setColor = useCallback(
    (category: CategoryId, colorId: string) => {
      const next = structuredClone(parts);
      next[category].colorId = colorId;
      commit(next);
    },
    [parts, commit],
  );

  const applyAiParts = useCallback(
    (next: AvatarParts) => {
      commit(structuredClone(next));
    },
    [commit],
  );

  const addLayer = useCallback((layer: CustomLayer) => {
    setCustom((c) => [...c, layer]);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setCustom((c) => c.filter((l) => l.id !== id));
  }, []);

  const undo = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const redo = useCallback(() => setIndex((i) => Math.min(history.length - 1, i + 1)), [history.length]);

  const shuffle = useCallback(() => {
    const next = structuredClone(parts);
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
    next.background.partId = pick(["none", "blush", "mint", "sky", "butter", "lilac", "peach", "mist"]);
    next.skin.colorId = pick(["porcelain", "fair", "medium", "tan", "deep"]);
    next.hair.partId = pick(["none", "short", "long", "curly", "bob", "buzz", "bun", "ponytail", "waves"]);
    next.hair.colorId = pick(["black", "dark-brown", "brown", "auburn", "blonde", "gray", "pink", "purple"]);
    next.brows.partId = pick(["none", "straight", "arched", "thick", "raised"]);
    next.eyes.partId = pick(["dot", "round", "oval", "happy", "sleepy"]);
    next.eyes.colorId = pick(["dark", "brown", "blue", "green", "hazel"]);
    next.nose.partId = pick(["none", "dot", "line", "button"]);
    next.mouth.partId = pick(["smile", "big-smile", "neutral", "open", "smirk", "lips"]);
    next.eyewear.partId = pick(["none", "round", "square", "sunglasses"]);
    next.clothing.partId = pick(["tee", "hoodie", "collar", "jacket", "sweater"]);
    next.clothing.colorId = pick(["blue", "black", "coral", "mint", "yellow", "lavender", "pink", "gray"]);
    commit(next);
  }, [parts, commit]);

  const reset = useCallback(() => {
    commit(structuredClone(DEFAULT_PARTS));
    setCustom([]);
  }, [commit]);

  const appendMessage = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const value: AvatarStore = {
    doc,
    setPart,
    setColor,
    applyAiParts,
    addLayer,
    removeLayer,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    shuffle,
    reset,
    messages,
    appendMessage,
    clearMessages,
    busy,
    setBusy,
    aiStatus,
    layerBusy,
    setLayerBusy,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAvatar(): AvatarStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider");
  return ctx;
}
