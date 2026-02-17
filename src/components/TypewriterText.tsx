// ============================================================
// 타자기 효과 — Remotion 스킬: text-animations.md
// "Always use string slicing for typewriter effects"
// ============================================================

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { notoSansKR } from "../utils/fonts";

interface Props {
  text: string;
  fontSize?: number;
  color?: string;
  charsPerSecond?: number;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<Props> = ({
  text,
  fontSize = 56,
  color = "#fff",
  charsPerSecond = 20,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalChars = text.length;
  const totalFrames = (totalChars / charsPerSecond) * fps;

  const charCount = Math.floor(
    interpolate(frame, [0, totalFrames], [0, totalChars], {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    })
  );

  const displayedText = text.slice(0, charCount);

  const cursorVisible =
    showCursor && Math.floor(frame / (fps * 0.5)) % 2 === 0;

  return (
    <div
      style={{
        fontFamily: notoSansKR,
        fontSize,
        fontWeight: 700,
        color,
        textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
        lineHeight: 1.4,
      }}
    >
      {displayedText}
      {cursorVisible && charCount < totalChars && (
        <span style={{ color: "#FFE100" }}>|</span>
      )}
    </div>
  );
};
