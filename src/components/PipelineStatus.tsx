// src/components/PipelineStatus.tsx
// 전체 제작 파이프라인 단계별 상태

import React from "react";

export type PipelineStep =
  | "topic"
  | "news"
  | "script"
  | "voice"
  | "bgm"
  | "images"
  | "render"
  | "thumbnail"
  | "upload";

const STEPS: { id: PipelineStep; label: string; icon: string }[] = [
  { id: "topic", label: "주제 설정", icon: "🎯" },
  { id: "news", label: "뉴스 수집", icon: "📰" },
  { id: "script", label: "대본 생성", icon: "✏️" },
  { id: "voice", label: "음성 생성", icon: "🎙️" },
  { id: "bgm", label: "배경음악", icon: "🎵" },
  { id: "images", label: "이미지 준비", icon: "🖼️" },
  { id: "render", label: "영상 렌더링", icon: "🎬" },
  { id: "thumbnail", label: "썸네일 제작", icon: "📸" },
  { id: "upload", label: "업로드", icon: "📤" },
];

export const PipelineStatus: React.FC<{
  currentStep: PipelineStep;
  completedSteps: PipelineStep[];
  errorStep?: PipelineStep;
}> = ({ currentStep, completedSteps, errorStep }) => {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 18, color: "#fff" }}>
        🔄 제작 파이프라인
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isError = errorStep === step.id;

          let statusColor = "#374151";
          let statusText = "대기";
          if (isCompleted) {
            statusColor = "#10b981";
            statusText = "완료";
          }
          if (isCurrent) {
            statusColor = "#3b82f6";
            statusText = "진행 중";
          }
          if (isError) {
            statusColor = "#ef4444";
            statusText = "오류";
          }

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: isCurrent ? "#1e3a5f" : "#0d1117",
                borderLeft: `3px solid ${statusColor}`,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: statusColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {isCompleted ? "✓" : isError ? "✕" : i + 1}
              </div>

              <span
                style={{
                  fontSize: 13,
                  color: "#e5e7eb",
                  flex: 1,
                }}
              >
                {step.icon} {step.label}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: statusColor,
                  fontWeight: isCurrent ? 700 : 400,
                }}
              >
                {statusText}
                {isCurrent && (
                  <span
                    style={{
                      marginLeft: 4,
                      animation: "pulse 1s infinite",
                    }}
                  >
                    ●
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
