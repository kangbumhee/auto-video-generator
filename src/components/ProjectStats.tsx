// src/components/ProjectStats.tsx
// 영상 전체 통계 + 경고 표시

import React, { useMemo } from "react";
import type { VideoConfig } from "../types";

const StatCard: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => (
  <div
    style={{
      padding: "12px 14px",
      backgroundColor: "#111827",
      borderRadius: 10,
      borderLeft: `3px solid ${color}`,
    }}
  >
    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ fontSize: 20, fontWeight: 900, color }}>{value}</div>
  </div>
);

export const ProjectStats: React.FC<{ config: VideoConfig }> = ({ config }) => {
  const stats = useMemo(() => {
    const totalSubScenes = config.sections.reduce(
      (s, sec) => s + sec.subScenes.length,
      0
    );
    const totalFrames = config.sections.reduce(
      (s, sec) =>
        s + sec.subScenes.reduce((ss, sub) => ss + sub.durationFrames, 0),
      0
    );
    const totalDurationSec = totalFrames / config.fps;
    const totalNarrationChars = config.sections.reduce(
      (s, sec) => s + sec.narrationText.length,
      0
    );
    const estimatedNarrationSec = Math.ceil(totalNarrationChars / 5);
    const avgSubSceneSec =
      totalSubScenes > 0 ? totalDurationSec / totalSubScenes : 0;
    const captionCount = config.sections.reduce(
      (s, sec) =>
        s + sec.subScenes.filter((sub) => sub.caption).length,
      0
    );
    const sfxCount = config.sections.reduce(
      (s, sec) =>
        s +
        sec.subScenes.filter((sub) => sub.sfx && sub.sfx !== "none").length,
      0
    );

    const warnings: string[] = [];
    if (avgSubSceneSec > 10)
      warnings.push("평균 서브씬 길이가 10초 초과 → 더 빠른 전환 권장");
    if (estimatedNarrationSec > totalDurationSec * 0.95)
      warnings.push("나레이션이 영상 길이보다 길 수 있음");
    if (captionCount < totalSubScenes * 0.5)
      warnings.push("자막이 절반 이하 → 더 추가 권장");
    if (totalDurationSec < 540)
      warnings.push("총 길이 9분 미만 → 10분 이상 권장 (수익 극대화)");

    return {
      totalSubScenes,
      totalFrames,
      totalDurationSec,
      totalNarrationChars,
      estimatedNarrationSec,
      avgSubSceneSec,
      captionCount,
      sfxCount,
      warnings,
    };
  }, [config]);

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>
        📊 프로젝트 통계
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <StatCard
          label="총 길이"
          value={formatTime(stats.totalDurationSec)}
          color="#3b82f6"
        />
        <StatCard
          label="서브씬 수"
          value={`${stats.totalSubScenes}개`}
          color="#10b981"
        />
        <StatCard
          label="평균 씬 길이"
          value={`${stats.avgSubSceneSec.toFixed(1)}초`}
          color={stats.avgSubSceneSec > 10 ? "#ef4444" : "#10b981"}
        />
        <StatCard
          label="나레이션"
          value={`${stats.totalNarrationChars}자`}
          color="#8b5cf6"
        />
        <StatCard
          label="예상 발화"
          value={`~${formatTime(stats.estimatedNarrationSec)}`}
          color="#f59e0b"
        />
        <StatCard
          label="자막 수"
          value={`${stats.captionCount}/${stats.totalSubScenes}`}
          color="#06b6d4"
        />
        <StatCard
          label="효과음 수"
          value={`${stats.sfxCount}개`}
          color="#ec4899"
        />
        <StatCard
          label="섹션 수"
          value={`${config.sections.length}개`}
          color="#14b8a6"
        />
      </div>

      {stats.warnings.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {stats.warnings.map((w, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                backgroundColor: "#7f1d1d33",
                borderRadius: 8,
                borderLeft: "3px solid #ef4444",
                fontSize: 13,
                color: "#fca5a5",
              }}
            >
              ⚠️ {w}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
