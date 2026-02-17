// src/components/TimelineVisualizer.tsx
// 전체 영상 타임라인을 시각적으로 보여주는 컴포넌트
// 마우스 호버로 서브씬 정보 표시, 클릭으로 해당 시점 이동

import React, { useState, useMemo } from "react";
import type { ScriptSection } from "../types";

const SECTION_COLORS: Record<string, string> = {
  HOOK: "#ff0033",
  PROBLEM: "#e94560",
  BACKGROUND: "#0f3460",
  ANALYSIS_1: "#533483",
  ANALYSIS_2: "#2ECC71",
  ANALYSIS_3: "#3498DB",
  TWIST: "#E67E22",
  SUMMARY: "#1abc9c",
  OUTRO: "#9b59b6",
};

export const TimelineVisualizer: React.FC<{
  sections: ScriptSection[];
  currentFrame?: number;
  totalFrames: number;
  onSeek?: (frame: number) => void;
}> = ({ sections, currentFrame = 0, totalFrames, onSeek }) => {
  const [hoveredSub, setHoveredSub] = useState<{
    sectionId: string;
    subId: string;
    x: number;
    info: string;
  } | null>(null);

  const flatMap = useMemo(() => {
    const result: {
      subId: string;
      sectionId: string;
      sectionLabel: string;
      type: string;
      headline: string;
      startFrame: number;
      endFrame: number;
      color: string;
    }[] = [];
    let acc = 0;
    sections.forEach((sec) => {
      sec.subScenes.forEach((sub) => {
        result.push({
          subId: sub.id,
          sectionId: sec.id,
          sectionLabel: sec.label,
          type: sub.type,
          headline: sub.headline ?? sub.body ?? sub.type,
          startFrame: acc,
          endFrame: acc + sub.durationFrames,
          color: SECTION_COLORS[sec.id] ?? "#666",
        });
        acc += sub.durationFrames;
      });
    });
    return result;
  }, [sections]);

  const playheadPercent = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  return (
    <div style={{ position: "relative", fontFamily: "sans-serif" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 16, color: "#fff" }}>
        🎬 타임라인 ({(totalFrames / 30 / 60).toFixed(1)}분, {flatMap.length}씬)
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#4b5563",
          marginBottom: 4,
        }}
      >
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i}>
            {Math.floor((i * totalFrames) / 10 / 30 / 60)}:
            {String(Math.floor(((i * totalFrames) / 10 / 30) % 60)).padStart(
              2,
              "0"
            )}
          </span>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          height: 48,
          backgroundColor: "#111827",
          borderRadius: 8,
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          const frame = Math.floor(percent * totalFrames);
          onSeek?.(frame);
        }}
      >
        {flatMap.map((item) => {
          const left = (item.startFrame / totalFrames) * 100;
          const width = ((item.endFrame - item.startFrame) / totalFrames) * 100;
          const isHovered = hoveredSub?.subId === item.subId;

          return (
            <div
              key={item.subId}
              onMouseEnter={(e) =>
                setHoveredSub({
                  sectionId: item.sectionId,
                  subId: item.subId,
                  x: e.clientX,
                  info: `${item.sectionLabel} > ${item.headline}\n${item.type} | ${((item.endFrame - item.startFrame) / 30).toFixed(1)}초`,
                })
              }
              onMouseLeave={() => setHoveredSub(null)}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: 2,
                bottom: 2,
                width: `${width}%`,
                backgroundColor: item.color,
                opacity: isHovered ? 1 : 0.7,
                borderRadius: 4,
                borderRight: "1px solid #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transition: "opacity 0.15s",
              }}
            >
              {width > 3 && (
                <span
                  style={{
                    fontSize: 10,
                    color: "#fff",
                    fontWeight: 700,
                    textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    padding: "0 4px",
                  }}
                >
                  {item.headline}
                </span>
              )}
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: `${playheadPercent}%`,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: "#fff",
            boxShadow: "0 0 6px #fff",
            zIndex: 10,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 6,
          height: 20,
        }}
      >
        {sections.map((sec) => {
          const sectionFrames = sec.subScenes.reduce(
            (s, sub) => s + sub.durationFrames,
            0
          );
          const width = totalFrames > 0 ? (sectionFrames / totalFrames) * 100 : 0;
          return (
            <div
              key={sec.id}
              style={{
                width: `${width}%`,
                textAlign: "center",
                fontSize: 11,
                color: SECTION_COLORS[sec.id] ?? "#999",
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {sec.label}
            </div>
          );
        })}
      </div>

      {hoveredSub && (
        <div
          style={{
            position: "fixed",
            left: hoveredSub.x + 10,
            top: 0,
            transform: "translateY(-110%)",
            backgroundColor: "#1f2937",
            color: "#e5e7eb",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 12,
            whiteSpace: "pre-line",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            pointerEvents: "none",
          }}
        >
          {hoveredSub.info}
        </div>
      )}
    </div>
  );
};
