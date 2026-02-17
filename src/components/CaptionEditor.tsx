// src/components/CaptionEditor.tsx
// 각 서브씬의 자막(caption)을 인라인 수정 가능
// 글자수 표시, 실시간 미리보기

import React, { useState } from "react";
import type { ScriptSection, SubScene } from "../types";

const TYPE_LABEL: Record<string, string> = {
  "title-impact": "🎯 제목",
  "stat-counter": "🔢 숫자",
  "chart-bar": "📊 바차트",
  "chart-line": "📈 라인차트",
  "chart-pie": "🥧 파이차트",
  "quote-highlight": "💬 인용",
  "keyword-explosion": "💥 키워드",
  "comparison-split": "⚖️ 비교",
  "list-reveal": "📋 리스트",
  "fullscreen-text": "📺 전체화면",
  "breaking-banner": "🚨 속보",
  "data-card-stack": "🗂️ 카드",
  "transition-swoosh": "🎬 전환",
  "cta-subscribe": "🔔 구독유도",
  "emoji-rain": "🌧️ 이모지",
  "timeline-progress": "⏱️ 타임라인",
  "verdict-stamp": "✅ 판정",
  "recap-scroll": "📜 요약",
  "image-kenburns": "🖼️ 이미지",
  "map-highlight": "🗺️ 지도",
};

const SubCaptionRow: React.FC<{
  sub: SubScene;
  onChange: (val: string) => void;
}> = ({ sub, onChange }) => {
  const [value, setValue] = useState(sub.caption || "");
  const charCount = value.length;
  const durationSec = (sub.durationFrames / 30).toFixed(1);

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <div
        style={{
          width: 90,
          flexShrink: 0,
          padding: "6px 0",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "sans-serif" }}>
          {TYPE_LABEL[sub.type] ?? sub.type}
        </div>
        <div style={{ fontSize: 11, color: "#4b5563", fontFamily: "sans-serif", marginTop: 2 }}>
          {durationSec}초
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <textarea
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            setValue(v);
            onChange(v);
          }}
          placeholder="자막 입력 (비우면 표시 안 됨)"
          rows={2}
          style={{
            width: "100%",
            padding: "8px 10px",
            backgroundColor: "#111827",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: "sans-serif",
            lineHeight: 1.5,
            resize: "vertical",
            outline: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 8,
            fontSize: 10,
            color: charCount > 50 ? "#ef4444" : "#4b5563",
            fontFamily: "sans-serif",
          }}
        >
          {charCount}자
        </div>
      </div>
    </div>
  );
};

export const CaptionEditor: React.FC<{
  sections: ScriptSection[];
  onUpdate: (sectionIdx: number, subIdx: number, newCaption: string) => void;
}> = ({ sections, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState<number>(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <h3 style={{ margin: 0, fontSize: 18, color: "#fff", fontFamily: "sans-serif" }}>
        📝 자막 편집기
      </h3>

      {sections.map((section, sIdx) => (
        <div
          key={section.id}
          style={{
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #1f2937",
          }}
        >
          <div
            onClick={() => setExpandedSection(expandedSection === sIdx ? -1 : sIdx)}
            style={{
              padding: "10px 14px",
              backgroundColor: "#111827",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb", fontFamily: "sans-serif" }}>
              {section.label}
            </span>
            <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "sans-serif" }}>
              서브씬 {section.subScenes.length}개 {expandedSection === sIdx ? "▲" : "▼"}
            </span>
          </div>

          {expandedSection === sIdx && (
            <div
              style={{
                padding: 10,
                backgroundColor: "#0d1117",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {section.subScenes.map((sub, subIdx) => (
                <SubCaptionRow
                  key={sub.id}
                  sub={sub}
                  onChange={(val) => onUpdate(sIdx, subIdx, val)}
                />
              ))}

              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  backgroundColor: "#1a1a2e",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4, fontFamily: "sans-serif" }}>
                  📢 나레이션 원문 (TTS용)
                </div>
                <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, fontFamily: "sans-serif" }}>
                  {section.narrationText}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
