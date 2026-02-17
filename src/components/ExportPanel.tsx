// src/components/ExportPanel.tsx
// 렌더링 설정 + 내보내기

import React, { useState } from "react";

export interface ExportSettings {
  format: "mp4" | "webm" | "mov";
  quality: "draft" | "medium" | "high";
  resolution: "720p" | "1080p" | "4K";
  includeSubtitles: boolean;
  includeBgm: boolean;
  outputFileName: string;
}

const OptionRow: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <label
      style={{
        fontSize: 13,
        color: "#9ca3af",
        marginBottom: 6,
        display: "block",
      }}
    >
      {label}
    </label>
    <div style={{ display: "flex", gap: 6 }}>{children}</div>
  </div>
);

const OptionBtn: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: 8,
      border: selected ? "2px solid #10b981" : "1px solid #374151",
      backgroundColor: selected ? "#064e3b" : "#111827",
      color: "#e5e7eb",
      cursor: "pointer",
      fontSize: 13,
      fontFamily: "sans-serif",
    }}
  >
    {label}
  </button>
);

const Toggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
    }}
  >
    <div
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        backgroundColor: checked ? "#10b981" : "#374151",
        position: "relative",
        transition: "background-color 0.2s",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          top: 2,
          left: checked ? 18 : 2,
          transition: "left 0.2s",
        }}
      />
    </div>
    <span
      style={{
        fontSize: 13,
        color: "#9ca3af",
        fontFamily: "sans-serif",
      }}
    >
      {label}
    </span>
  </div>
);

export const ExportPanel: React.FC<{
  onRender: (settings: ExportSettings) => void;
  isRendering: boolean;
  progress: number;
}> = ({ onRender, isRendering, progress }) => {
  const [settings, setSettings] = useState<ExportSettings>({
    format: "mp4",
    quality: "high",
    resolution: "1080p",
    includeSubtitles: true,
    includeBgm: true,
    outputFileName: "output",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: "sans-serif",
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>
        📤 영상 내보내기
      </h3>

      <OptionRow label="형식">
        {(["mp4", "webm", "mov"] as const).map((f) => (
          <OptionBtn
            key={f}
            label={f.toUpperCase()}
            selected={settings.format === f}
            onClick={() => setSettings({ ...settings, format: f })}
          />
        ))}
      </OptionRow>

      <OptionRow label="화질">
        {[
          { value: "draft" as const, label: "초안 (빠름)" },
          { value: "medium" as const, label: "중간" },
          { value: "high" as const, label: "고화질" },
        ].map((q) => (
          <OptionBtn
            key={q.value}
            label={q.label}
            selected={settings.quality === q.value}
            onClick={() => setSettings({ ...settings, quality: q.value })}
          />
        ))}
      </OptionRow>

      <OptionRow label="해상도">
        {(["720p", "1080p", "4K"] as const).map((r) => (
          <OptionBtn
            key={r}
            label={r}
            selected={settings.resolution === r}
            onClick={() => setSettings({ ...settings, resolution: r })}
          />
        ))}
      </OptionRow>

      <div style={{ display: "flex", gap: 16 }}>
        <Toggle
          label="자막 포함"
          checked={settings.includeSubtitles}
          onChange={(v) =>
            setSettings({ ...settings, includeSubtitles: v })
          }
        />
        <Toggle
          label="BGM 포함"
          checked={settings.includeBgm}
          onChange={(v) => setSettings({ ...settings, includeBgm: v })}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label
          style={{
            fontSize: 13,
            color: "#9ca3af",
            width: 60,
          }}
        >
          파일명
        </label>
        <input
          value={settings.outputFileName}
          onChange={(e) =>
            setSettings({ ...settings, outputFileName: e.target.value })
          }
          style={{
            flex: 1,
            padding: "8px 10px",
            backgroundColor: "#111827",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: 8,
            fontSize: 14,
            fontFamily: "sans-serif",
          }}
        />
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          .{settings.format}
        </span>
      </div>

      {isRendering ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "#9ca3af",
              marginBottom: 6,
            }}
          >
            <span>렌더링 중...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            style={{
              height: 8,
              backgroundColor: "#1f2937",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                backgroundColor: "#3b82f6",
                borderRadius: 4,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => onRender(settings)}
          style={{
            padding: "14px 0",
            borderRadius: 12,
            border: "none",
            backgroundColor: "#10b981",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "sans-serif",
            boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
          }}
        >
          🎬 영상 렌더링 시작
        </button>
      )}
    </div>
  );
};
