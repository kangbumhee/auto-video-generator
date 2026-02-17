// ============================================================
// 하단 진행 바
// ============================================================

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 4,
        backgroundColor: "rgba(255,255,255,0.15)",
        zIndex: 200,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: "#FF0000",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
};
