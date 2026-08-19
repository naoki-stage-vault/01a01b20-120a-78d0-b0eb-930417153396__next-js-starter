"use client";

import type { AvatarDocument } from "@/lib/avatar/types";
import { AVATAR_VIEWBOX, buildAvatarLayers } from "@/lib/avatar/parts";

export function AvatarCanvas({
  doc,
  className,
  ariaLabel,
}: {
  doc: AvatarDocument;
  className?: string;
  ariaLabel?: string;
}) {
  const layers = buildAvatarLayers(doc);
  return (
    <svg
      viewBox={AVATAR_VIEWBOX}
      className={className}
      role="img"
      aria-label={ariaLabel ?? "Avatar preview"}
      preserveAspectRatio="xMidYMid meet"
    >
      {layers.map((l) => (
        <g key={l.id} id={`layer-${l.id}`} dangerouslySetInnerHTML={{ __html: l.html }} />
      ))}
    </svg>
  );
}
