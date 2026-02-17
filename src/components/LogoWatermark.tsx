// ============================================================
// 로고 워터마크 — 화면 구석에 상시 표시
// ============================================================

import React from "react";
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

interface Props {
  logoSrc?: string;
  channelName?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const LogoWatermark: React.FC<Props> = ({
  logoSrc,
  channelName = "MY CHANNEL",
  position = "top-right",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps], [0, 0.6], {
    extrapolateRight: "clamp",
  });

  const posStyle: React.CSSProperties = {
    top: position.includes("top") ? 30 : undefined,
    bottom: position.includes("bottom") ? 30 : undefined,
    left: position.includes("left") ? 30 : undefined,
    right: position.includes("right") ? 30 : undefined,
  };

  return (
    <div
      style={{
        position: "absolute",
        ...posStyle,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 10,
        zIndex: 150,
      }}
    >
      {logoSrc && (
        <Img
          src={staticFile(logoSrc)}
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      )}
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "rgba(255,255,255,0.7)",
          letterSpacing: 1,
        }}
      >
        {channelName}
      </span>
    </div>
  );
};
