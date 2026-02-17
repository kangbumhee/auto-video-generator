// ============================================================
// 챕터 제목 — 세그먼트 시작 시 표시
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { notoSansKR } from "../utils/fonts";

interface Props {
  number: number;
  title: string;
  color?: string;
}

export const ChapterTitle: React.FC<Props> = ({
  number,
  title,
  color = "#FFE100",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numSpring = spring({ frame, fps, config: { damping: 12 } });
  const textSpring = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 200 },
  });

  const numScale = interpolate(numSpring, [0, 1], [0.5, 1]);
  const textTranslateY = interpolate(textSpring, [0, 1], [40, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  const fadeOut = interpolate(frame, [2.5 * fps, 3 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "38%",
        width: "100%",
        textAlign: "center",
        opacity: fadeOut,
        zIndex: 70,
      }}
    >
      <div
        style={{
          fontFamily: notoSansKR,
          fontSize: 120,
          fontWeight: 900,
          color,
          transform: `scale(${numScale})`,
          lineHeight: 1,
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: notoSansKR,
          fontSize: 44,
          fontWeight: 700,
          color: "#fff",
          marginTop: 16,
          transform: `translateY(${textTranslateY}px)`,
          opacity: textOpacity,
        }}
      >
        {title}
      </div>
    </div>
  );
};
