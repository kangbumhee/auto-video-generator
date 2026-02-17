// ============================================================
// 파이 차트 — Remotion 스킬: charts.md (Pie Chart)
// ============================================================

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import type { ChartConfig } from "../types";
import { notoSansKR } from "../utils/fonts";

const RADIUS = 100;
const CENTER = 150;
const STROKE = 50;

export const AnimatedPieChart: React.FC<{ config: ChartConfig }> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = config.data.reduce((sum, d) => sum + d.value, 0);
  const circumference = 2 * Math.PI * RADIUS;

  const revealProgress = interpolate(frame, [0, 1.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  let cumulativeAngle = -90;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
      <svg width={CENTER * 2} height={CENTER * 2}>
        {config.data.map((item, i) => {
          const segmentAngle = (item.value / total) * 360;
          const segmentLength = (item.value / total) * circumference;
          const dashOffset = interpolate(
            revealProgress,
            [0, 1],
            [segmentLength, 0]
          );
          const startAngle = cumulativeAngle;
          cumulativeAngle += segmentAngle;

          return (
            <circle
              key={i}
              r={RADIUS}
              cx={CENTER}
              cy={CENTER}
              fill="none"
              stroke={item.color || "#4ECDC4"}
              strokeWidth={STROKE}
              strokeDasharray={`${segmentLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(${startAngle} ${CENTER} ${CENTER})`}
            />
          );
        })}
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {config.data.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                backgroundColor: item.color || "#4ECDC4",
              }}
            />
            <span
              style={{
                fontFamily: notoSansKR,
                fontSize: 18,
                color: "#fff",
              }}
            >
              {item.label} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
