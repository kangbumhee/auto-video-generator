// ============================================================
// 애니메이션 자막 — Remotion 스킬: subtitles.md, timing.md
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { Caption } from "../types";
import { notoSansKR } from "../utils/fonts";
import { findCurrentCaption } from "../utils/helpers";

interface Props {
  captions: Caption[];
  style?: "news" | "youtube" | "minimal" | "kinetic";
  position?: "bottom" | "center" | "top";
  fontSize?: number;
  highlightWords?: string[];
}

export const AnimatedSubtitle: React.FC<Props> = ({
  captions,
  style = "news",
  position = "bottom",
  fontSize = 48,
  highlightWords = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const current = findCurrentCaption(captions, frame, fps);
  if (!current) return null;

  const captionFrame = frame - Math.floor((current.startMs / 1000) * fps);
  const entrance = spring({
    frame: captionFrame,
    fps,
    config: { damping: 200 },
  });

  const translateY = interpolate(entrance, [0, 1], [30, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const positionStyle: React.CSSProperties = {
    bottom: position === "bottom" ? 100 : undefined,
    top: position === "top" ? 100 : position === "center" ? "50%" : undefined,
    transform:
      position === "center"
        ? `translateY(calc(-50% + ${translateY}px))`
        : `translateY(${translateY}px)`,
  };

  const bgStyles: Record<string, React.CSSProperties> = {
    news: {
      backgroundColor: "rgba(200, 0, 0, 0.85)",
      padding: "12px 32px",
      borderRadius: 4,
    },
    youtube: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      padding: "10px 28px",
      borderRadius: 8,
    },
    minimal: {
      backgroundColor: "transparent",
      textShadow: "2px 2px 8px rgba(0,0,0,0.9)",
      padding: "8px 24px",
    },
    kinetic: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      padding: "14px 36px",
      borderRadius: 12,
      color: "#000",
    },
  };

  const renderText = () => {
    if (highlightWords.length === 0) return current.text;
    let result = current.text;
    highlightWords.forEach((word) => {
      result = result.replace(
        new RegExp(`(${word})`, "gi"),
        `<mark style="background:#FFE100;color:#000;padding:2px 6px;border-radius:4px;">$1</mark>`
      );
    });
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        textAlign: "center",
        padding: "0 60px",
        opacity,
        ...positionStyle,
        zIndex: 100,
      }}
    >
      <span
        style={{
          fontFamily: notoSansKR,
          fontSize,
          fontWeight: 700,
          color: style === "kinetic" ? "#000" : "#fff",
          display: "inline-block",
          ...bgStyles[style],
        }}
      >
        {renderText()}
      </span>
    </div>
  );
};
