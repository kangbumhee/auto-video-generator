// ============================================================
// 형광펜 효과 — Remotion 스킬: text-animations.md (Word Highlight)
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { notoSansKR } from "../utils/fonts";

interface Props {
  text: string;
  highlightColor?: string;
  fontSize?: number;
  delay?: number;
}

export const HighlightText: React.FC<Props> = ({
  text,
  highlightColor = "#FFE100",
  fontSize = 52,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = frame - delay;

  const wipeProgress = interpolate(
    adjustedFrame,
    [0, 1.2 * fps],
    [0, 100],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  return (
    <div
      style={{
        fontFamily: notoSansKR,
        fontSize,
        fontWeight: 900,
        color: "#fff",
        display: "inline-block",
        position: "relative",
        padding: "4px 12px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: `${wipeProgress}%`,
          backgroundColor: highlightColor,
          opacity: 0.5,
          borderRadius: 4,
          zIndex: -1,
        }}
      />
      {text}
    </div>
  );
};
