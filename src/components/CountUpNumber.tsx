// ============================================================
// 숫자 카운트업 — Remotion 스킬: timing.md (spring + interpolate)
// ============================================================

import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { notoSansKR, montserrat } from "../utils/fonts";

interface Props {
  from: number;
  to: number;
  suffix?: string;
  prefix?: string;
  fontSize?: number;
  color?: string;
  label?: string;
}

export const CountUpNumber: React.FC<Props> = ({
  from,
  to,
  suffix = "",
  prefix = "",
  fontSize = 96,
  color = "#FFE100",
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 2 * fps,
  });

  const currentValue = interpolate(progress, [0, 1], [from, to]);
  const displayValue =
    to % 1 !== 0 ? currentValue.toFixed(1) : Math.floor(currentValue);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: montserrat,
          fontSize,
          fontWeight: 900,
          color,
          textShadow: "3px 3px 15px rgba(0,0,0,0.5)",
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </div>
      {label && (
        <div
          style={{
            fontFamily: notoSansKR,
            fontSize: fontSize * 0.35,
            color: "#ccc",
            marginTop: 8,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
