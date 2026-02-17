// ============================================================
// 속보 배너 — 뉴스 스타일 후킹
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
  title: string;
}

export const BreakingNewsBanner: React.FC<Props> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 200 },
  });

  const translateX = interpolate(slideIn, [0, 1], [-100, 0]);

  const flashOpacity = frame % (fps * 0.6) < fps * 0.3 ? 1 : 0.7;

  return (
    <div
      style={{
        position: "absolute",
        top: "15%",
        left: 0,
        width: "100%",
        transform: `translateX(${translateX}%)`,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "stretch" }}>
        <div
          style={{
            backgroundColor: "#CC0000",
            padding: "16px 28px",
            opacity: flashOpacity,
          }}
        >
          <span
            style={{
              fontFamily: notoSansKR,
              fontSize: 32,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            속보
          </span>
        </div>
        <div
          style={{
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: "16px 32px",
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: notoSansKR,
              fontSize: 36,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};
