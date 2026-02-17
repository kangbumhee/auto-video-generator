// ============================================================
// 구독 유도 배너 — CTA
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
  text?: string;
}

export const SubscribeBanner: React.FC<Props> = ({
  text = "구독과 좋아요 부탁드립니다!",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 15 } });
  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 200,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `scale(${scale})`,
        zIndex: 80,
      }}
    >
      <div
        style={{
          backgroundColor: "#CC0000",
          padding: "16px 48px",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 32 }}>🔔</span>
        <span
          style={{
            fontFamily: notoSansKR,
            fontSize: 30,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
