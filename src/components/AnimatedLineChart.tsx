// ============================================================
// 라인 차트 — Remotion 스킬: charts.md (Line Chart / @remotion/paths)
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import type { ChartConfig } from "../types";
import { notoSansKR, montserrat } from "../utils/fonts";

const CHART_W = 700;
const CHART_H = 300;
const PADDING = 60;

export const AnimatedLineChart: React.FC<{ config: ChartConfig }> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxVal = Math.max(...config.data.map((d) => d.value)) * 1.2;

  const points = config.data.map((d, i) => ({
    x: PADDING + (i / (config.data.length - 1 || 1)) * (CHART_W - PADDING * 2),
    y: CHART_H - PADDING - (d.value / maxVal) * (CHART_H - PADDING * 2),
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const progress = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, pathD);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: notoSansKR,
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 20,
        }}
      >
        {config.title}
      </div>
      <svg width={CHART_W} height={CHART_H}>
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={PADDING}
            x2={CHART_W - PADDING}
            y1={CHART_H - PADDING - ratio * (CHART_H - PADDING * 2)}
            y2={CHART_H - PADDING - ratio * (CHART_H - PADDING * 2)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        ))}
        <path
          d={pathD}
          fill="none"
          stroke="#FF4444"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        {points.map((p, i) => {
          const pointOpacity = interpolate(
            frame,
            [
              ((i + 0.5) / config.data.length) * 2 * fps,
              ((i + 1) / config.data.length) * 2 * fps,
            ],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={6}
                fill="#FF4444"
                opacity={pointOpacity}
              />
              <text
                x={p.x}
                y={p.y - 15}
                fill="#fff"
                fontSize={14}
                fontFamily={montserrat}
                textAnchor="middle"
                opacity={pointOpacity}
              >
                {config.data[i].value}
                {config.unit}
              </text>
              <text
                x={p.x}
                y={CHART_H - 20}
                fill="#aaa"
                fontSize={13}
                fontFamily={notoSansKR}
                textAnchor="middle"
                opacity={pointOpacity}
              >
                {config.data[i].label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
