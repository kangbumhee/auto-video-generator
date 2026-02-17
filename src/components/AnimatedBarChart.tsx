// ============================================================
// 바 차트 — Remotion 스킬: charts.md (Bar Chart)
// ============================================================

import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import type { ChartConfig } from "../types";
import { notoSansKR, montserrat } from "../utils/fonts";

const STAGGER_DELAY = 8;

export const AnimatedBarChart: React.FC<{ config: ChartConfig }> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxValue = Math.max(...config.data.map((d) => d.value));
  const barWidth = Math.min(120, 600 / config.data.length);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          fontFamily: notoSansKR,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 30,
        }}
      >
        {config.title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 24,
          height: 300,
        }}
      >
        {config.data.map((item, i) => {
          const heightProgress = spring({
            frame,
            fps,
            delay: i * STAGGER_DELAY,
            config: { damping: 200 },
          });

          const barHeight = heightProgress * (item.value / maxValue) * 260;
          const barColor = item.color || "#4ECDC4";

          return (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: montserrat,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  opacity: heightProgress,
                }}
              >
                {item.value}
                {config.unit}
              </div>
              <div
                style={{
                  width: barWidth,
                  height: barHeight,
                  backgroundColor: barColor,
                  borderRadius: "8px 8px 0 0",
                  transition: "none",
                }}
              />
              <div
                style={{
                  fontFamily: notoSansKR,
                  fontSize: 16,
                  color: "#aaa",
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
