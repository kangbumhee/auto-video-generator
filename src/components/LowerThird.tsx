// ============================================================
// 로어서드 (뉴스 하단 정보 표시)
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
  name: string;
  title: string;
}

export const LowerThird: React.FC<Props> = ({ name, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay: 15,
    config: { damping: 200 },
  });

  const slideX = interpolate(entrance, [0, 1], [-300, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        left: 60,
        transform: `translateX(${slideX}px)`,
        opacity,
        zIndex: 60,
      }}
    >
      <div
        style={{
          backgroundColor: "#CC0000",
          padding: "8px 20px",
          display: "inline-block",
        }}
      >
        <span
          style={{
            fontFamily: notoSansKR,
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {name}
        </span>
      </div>
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          padding: "8px 20px",
          display: "inline-block",
          marginLeft: 4,
        }}
      >
        <span
          style={{
            fontFamily: notoSansKR,
            fontSize: 18,
            color: "#ccc",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};
