// src/components/DebugOverlay.tsx
// ============================================================
// 영상 디버깅 오버레이 — 모든 문제를 시각적으로 표시
// Remotion 미리보기에서 실시간으로 작동
// ============================================================

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoConfig } from "../types";

function analyzeConfig(config: VideoConfig): {
  warnings: string[];
  errors: string[];
  sectionMap: {
    id: string;
    label: string;
    startFrame: number;
    endFrame: number;
    subScenes: {
      id: string;
      type: string;
      startFrame: number;
      endFrame: number;
      issues: string[];
    }[];
  }[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  const sectionMap: ReturnType<typeof analyzeConfig>["sectionMap"] = [];

  let globalFrame = 0;

  config.sections.forEach((section, sIdx) => {
    const sectionStart = globalFrame;
    const subSceneEntries: {
      id: string;
      type: string;
      startFrame: number;
      endFrame: number;
      issues: string[];
    }[] = [];

    if (!section.audioFile) {
      warnings.push(`[${section.id}] audioFile 누락`);
    }
    if (!section.narrationText || section.narrationText.length < 10) {
      warnings.push(`[${section.id}] narrationText 너무 짧거나 누락`);
    }

    const sectionTotalFrames = (section.subScenes || []).reduce(
      (s, sc) => s + sc.durationFrames,
      0
    );
    if (sectionTotalFrames < 60) {
      errors.push(
        `[${section.id}] 전체 길이 ${sectionTotalFrames}프레임 (${(sectionTotalFrames / 30).toFixed(1)}초) — 너무 짧음`
      );
    }

    (section.subScenes || []).forEach((sub, subIdx) => {
      const subStart = globalFrame;
      const issues: string[] = [];

      if (!sub.bgColor) issues.push("bgColor 누락 → 검정화면");
      if (!sub.textColor) issues.push("textColor 누락");
      if (!sub.accentColor) issues.push("accentColor 누락");
      if (!sub.type) issues.push("type 누락 → 렌더링 불가");

      const needsHeadline = [
        "title-impact",
        "stat-counter",
        "chart-bar",
        "chart-line",
        "chart-pie",
        "comparison-split",
        "keyword-explosion",
        "list-reveal",
        "data-card-stack",
        "verdict-stamp",
        "quote-highlight",
        "timeline-progress",
        "fullscreen-text",
        "breaking-banner",
        "cta-subscribe",
        "emoji-rain",
      ];

      if (needsHeadline.includes(sub.type) && !sub.headline) {
        issues.push(`headline 누락 (${sub.type}에 필요)`);
      }

      if (sub.type === "stat-counter" && !sub.numbers) {
        issues.push("numbers 배열 누락 (stat-counter에 필요)");
      }
      if (sub.type === "chart-bar" && !sub.chartData) {
        issues.push("chartData 누락 (chart-bar에 필요)");
      }
      if (sub.type === "chart-line" && !sub.chartData) {
        issues.push("chartData 누락 (chart-line에 필요)");
      }
      if (sub.type === "keyword-explosion" && !sub.keywords) {
        issues.push("keywords 배열 누락 (keyword-explosion에 필요)");
      }
      if (
        sub.type === "comparison-split" &&
        (!sub.comparisonLeft || !sub.comparisonRight)
      ) {
        issues.push("comparisonLeft/Right 누락 (comparison-split에 필요)");
      }
      if (sub.type === "list-reveal" && !sub.listItems) {
        issues.push("listItems 누락 (list-reveal에 필요)");
      }

      if (sub.durationFrames < 30) {
        issues.push(
          `너무 짧음: ${sub.durationFrames}프레임 (${(sub.durationFrames / 30).toFixed(1)}초)`
        );
      }

      subSceneEntries.push({
        id: sub.id,
        type: sub.type,
        startFrame: subStart,
        endFrame: subStart + sub.durationFrames,
        issues,
      });

      if (issues.length > 0) {
        issues.forEach((issue) => {
          errors.push(`[${sub.id}] ${issue}`);
        });
      }

      globalFrame += sub.durationFrames;
    });

    sectionMap.push({
      id: section.id,
      label: section.label,
      startFrame: sectionStart,
      endFrame: globalFrame,
      subScenes: subSceneEntries,
    });
  });

  const totalSeconds = globalFrame / 30;
  if (totalSeconds < 60) {
    errors.push(
      `전체 영상 ${totalSeconds.toFixed(0)}초 — 10분 미만 (목표: 600초)`
    );
  }

  return { warnings, errors, sectionMap };
}

export const DebugOverlay: React.FC<{
  config: VideoConfig;
  enabled?: boolean;
}> = ({ config, enabled = true }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (!enabled) return null;

  const { warnings, errors, sectionMap } = analyzeConfig(config);

  let currentSection = "알 수 없음";
  let currentSubScene = "알 수 없음";
  let currentSubType = "알 수 없음";
  let currentIssues: string[] = [];

  for (const sec of sectionMap) {
    if (frame >= sec.startFrame && frame < sec.endFrame) {
      currentSection = `${sec.label} (${sec.id})`;
      for (const sub of sec.subScenes) {
        if (frame >= sub.startFrame && frame < sub.endFrame) {
          currentSubScene = sub.id;
          currentSubType = sub.type;
          currentIssues = sub.issues;
          break;
        }
      }
      break;
    }
  }

  const currentTime = (frame / fps).toFixed(1);
  const totalTime = (durationInFrames / fps).toFixed(1);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 420,
        maxHeight: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0,0,0,0.9)",
        color: "#fff",
        fontFamily: "monospace",
        fontSize: 11,
        padding: 12,
        zIndex: 9999,
        borderLeft:
          errors.length > 0 ? "3px solid #ff0033" : "3px solid #00e676",
      }}
    >
      <div
        style={{
          marginBottom: 8,
          borderBottom: "1px solid #333",
          paddingBottom: 8,
        }}
      >
        <div
          style={{ color: "#ffd600", fontWeight: "bold", fontSize: 13 }}
        >
          🔍 디버그 모드
        </div>
        <div>
          ⏱ {currentTime}초 / {totalTime}초 (프레임 {frame}/{durationInFrames})
        </div>
        <div>📂 섹션: {currentSection}</div>
        <div>🎬 서브씬: {currentSubScene}</div>
        <div>
          🏷 타입: <span style={{ color: "#4ECDC4" }}>{currentSubType}</span>
        </div>
      </div>

      {currentIssues.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            borderBottom: "1px solid #333",
            paddingBottom: 8,
          }}
        >
          <div style={{ color: "#ff0033", fontWeight: "bold" }}>
            ⚠️ 현재 서브씬 문제:
          </div>
          {currentIssues.map((issue, i) => (
            <div key={i} style={{ color: "#ff6b6b", paddingLeft: 8 }}>
              • {issue}
            </div>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            borderBottom: "1px solid #333",
            paddingBottom: 8,
          }}
        >
          <div style={{ color: "#ff0033", fontWeight: "bold" }}>
            🚨 에러 ({errors.length}개):
          </div>
          <div style={{ maxHeight: 150, overflow: "auto" }}>
            {errors.map((e, i) => (
              <div
                key={i}
                style={{
                  color: "#ff6b6b",
                  paddingLeft: 8,
                  marginTop: 2,
                }}
              >
                • {e}
              </div>
            ))}
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div
          style={{
            marginBottom: 8,
            borderBottom: "1px solid #333",
            paddingBottom: 8,
          }}
        >
          <div style={{ color: "#ffd600", fontWeight: "bold" }}>
            ⚠️ 경고 ({warnings.length}개):
          </div>
          {warnings.map((w, i) => (
            <div key={i} style={{ color: "#F7DC6F", paddingLeft: 8 }}>
              • {w}
            </div>
          ))}
        </div>
      )}

      <div>
        <div
          style={{
            color: "#a0a0c0",
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          📋 타임라인:
        </div>
        {sectionMap.map((sec) => {
          const isActive = frame >= sec.startFrame && frame < sec.endFrame;
          const secErrors = sec.subScenes.reduce(
            (c, s) => c + s.issues.length,
            0
          );
          return (
            <div
              key={sec.id}
              style={{
                padding: "3px 6px",
                marginBottom: 2,
                borderRadius: 4,
                backgroundColor: isActive
                  ? "rgba(108,92,231,0.3)"
                  : "transparent",
                borderLeft:
                  secErrors > 0 ? "2px solid #ff0033" : "2px solid #00e676",
              }}
            >
              <span style={{ color: isActive ? "#fff" : "#888" }}>
                {sec.label} {(sec.startFrame / 30).toFixed(0)}~
                {(sec.endFrame / 30).toFixed(0)}초
                {secErrors > 0 && (
                  <span style={{ color: "#ff0033" }}>
                    {" "}
                    ({secErrors}에러)
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
