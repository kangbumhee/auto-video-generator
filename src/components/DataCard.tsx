// ============================================================
// 데이터 카드 — 핵심 수치를 카드 형태로 표시
// ============================================================

import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { notoSansKR, montserrat } from "../utils/fonts";

interface Props {
  items: Array<{ label: string; value: string; color?: string }>;
}

export const DataCard: React.FC<Props> = ({ items }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      {items.map((item, i) => {
        const entrance = spring({
          frame,
          fps,
          delay: i * 8,
          config: { damping: 200 },
        });
        const translateY = interpolate(entrance, [0, 1], [50, 0]);
        const opacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <div
            key={i}
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "28px 36px",
              textAlign: "center",
              transform: `translateY(${translateY}px)`,
              opacity,
              border: `2px solid ${item.color || "#333"}`,
              minWidth: 180,
            }}
          >
            <div
              style={{
                fontFamily: montserrat,
                fontSize: 40,
                fontWeight: 900,
                color: item.color || "#FFE100",
              }}
            >
              {item.value}
            </div>
            <div
              style={{
                fontFamily: notoSansKR,
                fontSize: 18,
                color: "#aaa",
                marginTop: 8,
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
