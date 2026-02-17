// src/components/ScriptEditor.tsx
// 섹션별 나레이션 텍스트 + 서브씬 헤드라인/본문 수정
// 글자수, 예상 발화시간, 서브씬 추가/삭제/순서변경

import React, { useState } from "react";
import type { ScriptSection, SubScene, SubSceneType } from "../types";

const DEFAULT_COLORS = { bgColor: "#0d1117", accentColor: "#4ECDC4", textColor: "#ffffff" };

const SUB_SCENE_TEMPLATES: Record<string, Partial<SubScene> & { type: SubSceneType }> = {
  "title-impact": {
    type: "title-impact",
    durationFrames: 180,
    headline: "새 제목",
    body: "본문 내용",
    sfx: "impact",
    ...DEFAULT_COLORS,
  },
  "stat-counter": {
    type: "stat-counter",
    durationFrames: 210,
    headline: "숫자 카운트",
    numbers: [{ label: "항목", value: 0, unit: "%", color: "#ff6b35" }],
    sfx: "ding",
    ...DEFAULT_COLORS,
  },
  "fullscreen-text": {
    type: "fullscreen-text",
    durationFrames: 180,
    headline: "전체화면",
    body: "큰 텍스트",
    sfx: "whoosh",
    ...DEFAULT_COLORS,
  },
  "chart-bar": {
    type: "chart-bar",
    durationFrames: 270,
    headline: "바 차트",
    chartData: {
      type: "bar",
      title: "차트",
      data: [{ label: "항목", value: 50 }],
    },
    sfx: "reveal",
    ...DEFAULT_COLORS,
  },
  "keyword-explosion": {
    type: "keyword-explosion",
    durationFrames: 210,
    headline: "키워드",
    keywords: ["키워드1", "키워드2"],
    sfx: "pop",
    ...DEFAULT_COLORS,
  },
  "comparison-split": {
    type: "comparison-split",
    durationFrames: 210,
    headline: "비교",
    comparisonLeft: { label: "A", value: "값" },
    comparisonRight: { label: "B", value: "값" },
    sfx: "impact",
    ...DEFAULT_COLORS,
  },
  "list-reveal": {
    type: "list-reveal",
    durationFrames: 240,
    headline: "리스트",
    listItems: ["항목 1", "항목 2"],
    sfx: "typing",
    ...DEFAULT_COLORS,
  },
  "quote-highlight": {
    type: "quote-highlight",
    durationFrames: 240,
    headline: "인용",
    body: '"인용 텍스트"',
    sfx: "reveal",
    ...DEFAULT_COLORS,
  },
  "verdict-stamp": {
    type: "verdict-stamp",
    durationFrames: 180,
    headline: "판정",
    body: "결론 내용",
    sfx: "impact",
    ...DEFAULT_COLORS,
  },
  "cta-subscribe": {
    type: "cta-subscribe",
    durationFrames: 180,
    headline: "구독!",
    body: "좋아요 구독 알림",
    sfx: "ding",
    ...DEFAULT_COLORS,
  },
  "transition-swoosh": {
    type: "transition-swoosh",
    durationFrames: 60,
    sfx: "swoosh",
    ...DEFAULT_COLORS,
  },
};

export const ScriptEditor: React.FC<{
  sections: ScriptSection[];
  onUpdateNarration: (sIdx: number, text: string) => void;
  onUpdateSubScene: (sIdx: number, subIdx: number, updates: Partial<SubScene>) => void;
  onAddSubScene: (sIdx: number, type: SubSceneType) => void;
  onRemoveSubScene: (sIdx: number, subIdx: number) => void;
  onMoveSubScene: (sIdx: number, subIdx: number, direction: "up" | "down") => void;
}> = ({
  sections,
  onUpdateNarration,
  onUpdateSubScene,
  onAddSubScene,
  onRemoveSubScene,
  onMoveSubScene,
}) => {
  const [expandedSection, setExpandedSection] = useState<number>(0);
  const [addMenuOpen, setAddMenuOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "sans-serif" }}>
      <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>✏️ 대본 편집기</h3>

      {sections.map((section, sIdx) => {
        const totalSec =
          section.subScenes.reduce((s, sub) => s + sub.durationFrames, 0) / 30;
        const charCount = section.narrationText.length;
        const estimatedReadSec = Math.ceil(charCount / 5);

        return (
          <div
            key={section.id}
            style={{
              borderRadius: 10,
              border: "1px solid #1f2937",
              overflow: "hidden",
            }}
          >
            <div
              onClick={() => setExpandedSection(expandedSection === sIdx ? -1 : sIdx)}
              style={{
                padding: "12px 16px",
                backgroundColor: "#111827",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 700, color: "#e5e7eb", fontSize: 15 }}>
                {section.label}
              </span>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280" }}>
                <span>⏱ {totalSec.toFixed(0)}초</span>
                <span>📝 {charCount}자</span>
                <span>🗣 ~{estimatedReadSec}초</span>
                <span>🎬 {section.subScenes.length}씬</span>
              </div>
            </div>

            {expandedSection === sIdx && (
              <div
                style={{
                  padding: 12,
                  backgroundColor: "#0d1117",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      marginBottom: 4,
                      display: "block",
                    }}
                  >
                    📢 나레이션 텍스트 (TTS에 전달됨)
                  </label>
                  <textarea
                    value={section.narrationText}
                    onChange={(e) => onUpdateNarration(sIdx, e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: 10,
                      backgroundColor: "#1a1a2e",
                      color: "#e5e7eb",
                      border: "1px solid #374151",
                      borderRadius: 8,
                      fontSize: 14,
                      lineHeight: 1.7,
                      resize: "vertical",
                      fontFamily: "sans-serif",
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>
                    {section.narrationText.length}자 / 예상 발화시간 ~
                    {Math.ceil(section.narrationText.length / 5)}초
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 700 }}>
                    🎬 서브씬 목록
                  </div>

                  {section.subScenes.map((sub, subIdx) => (
                    <SubSceneEditor
                      key={sub.id}
                      sub={sub}
                      index={subIdx}
                      total={section.subScenes.length}
                      onUpdate={(updates) => onUpdateSubScene(sIdx, subIdx, updates)}
                      onRemove={() => onRemoveSubScene(sIdx, subIdx)}
                      onMove={(dir) => onMoveSubScene(sIdx, subIdx, dir)}
                    />
                  ))}

                  <div style={{ position: "relative" }}>
                    <button
                      onClick={() => setAddMenuOpen(addMenuOpen === sIdx ? null : sIdx)}
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        backgroundColor: "#1f2937",
                        color: "#9ca3af",
                        border: "1px dashed #374151",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        fontFamily: "sans-serif",
                      }}
                    >
                      + 서브씬 추가
                    </button>

                    {addMenuOpen === sIdx && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "100%",
                          left: 0,
                          right: 0,
                          backgroundColor: "#1f2937",
                          borderRadius: 8,
                          border: "1px solid #374151",
                          padding: 8,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          zIndex: 100,
                          marginBottom: 4,
                        }}
                      >
                        {Object.keys(SUB_SCENE_TEMPLATES).map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              onAddSubScene(sIdx, type as SubSceneType);
                              setAddMenuOpen(null);
                            }}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#111827",
                              color: "#e5e7eb",
                              border: "1px solid #374151",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: 11,
                              fontFamily: "sans-serif",
                            }}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SubSceneEditor: React.FC<{
  sub: SubScene;
  index: number;
  total: number;
  onUpdate: (updates: Partial<SubScene>) => void;
  onRemove: () => void;
  onMove: (dir: "up" | "down") => void;
}> = ({ sub, index, total, onUpdate, onRemove, onMove }) => {
  const [expanded, setExpanded] = useState(false);
  const durationSec = (sub.durationFrames / 30).toFixed(1);

  return (
    <div
      style={{
        backgroundColor: "#111827",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          cursor: "pointer",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ fontSize: 12, color: "#6b7280", width: 24 }}>
          #{index + 1}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#fff",
            backgroundColor: sub.accentColor,
            padding: "2px 8px",
            borderRadius: 4,
            fontWeight: 700,
          }}
        >
          {sub.type}
        </span>
        <span
          style={{
            fontSize: 13,
            color: "#e5e7eb",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {sub.headline ?? sub.body ?? "(내용 없음)"}
        </span>
        <span style={{ fontSize: 11, color: "#4b5563" }}>{durationSec}초</span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove("up");
          }}
          disabled={index === 0}
          style={{
            border: "none",
            background: "none",
            color: index === 0 ? "#333" : "#9ca3af",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ▲
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove("down");
          }}
          disabled={index === total - 1}
          style={{
            border: "none",
            background: "none",
            color: index === total - 1 ? "#333" : "#9ca3af",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ▼
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("이 서브씬을 삭제하시겠습니까?")) onRemove();
          }}
          style={{
            border: "none",
            background: "none",
            color: "#ef4444",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>

      {expanded && (
        <div
          style={{
            padding: "8px 10px",
            borderTop: "1px solid #1f2937",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", width: 80 }}>
              길이(프레임)
            </label>
            <input
              type="range"
              min={60}
              max={450}
              step={30}
              value={sub.durationFrames}
              onChange={(e) =>
                onUpdate({ durationFrames: parseInt(e.target.value, 10) })
              }
              style={{ flex: 1 }}
            />
            <span
              style={{
                fontSize: 12,
                color: "#e5e7eb",
                width: 60,
                textAlign: "right",
              }}
            >
              {(sub.durationFrames / 30).toFixed(1)}초
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", width: 80 }}>
              제목
            </label>
            <input
              value={sub.headline ?? ""}
              onChange={(e) => onUpdate({ headline: e.target.value })}
              style={{
                flex: 1,
                padding: "6px 10px",
                backgroundColor: "#0d1117",
                color: "#e5e7eb",
                border: "1px solid #374151",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "sans-serif",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <label
              style={{
                fontSize: 12,
                color: "#9ca3af",
                width: 80,
                paddingTop: 6,
              }}
            >
              본문
            </label>
            <textarea
              value={sub.body ?? ""}
              onChange={(e) => onUpdate({ body: e.target.value })}
              rows={2}
              style={{
                flex: 1,
                padding: "6px 10px",
                backgroundColor: "#0d1117",
                color: "#e5e7eb",
                border: "1px solid #374151",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "sans-serif",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <label style={{ fontSize: 12, color: "#9ca3af" }}>배경색</label>
              <input
                type="color"
                value={sub.bgColor}
                onChange={(e) => onUpdate({ bgColor: e.target.value })}
                style={{ width: 32, height: 24, border: "none", cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <label style={{ fontSize: 12, color: "#9ca3af" }}>강조색</label>
              <input
                type="color"
                value={sub.accentColor}
                onChange={(e) => onUpdate({ accentColor: e.target.value })}
                style={{ width: 32, height: 24, border: "none", cursor: "pointer" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 12, color: "#9ca3af", width: 80 }}>
              효과음
            </label>
            <select
              value={sub.sfx ?? "none"}
              onChange={(e) =>
                onUpdate({ sfx: (e.target.value as SubScene["sfx"]) ?? "none" })
              }
              style={{
                padding: "4px 8px",
                backgroundColor: "#0d1117",
                color: "#e5e7eb",
                border: "1px solid #374151",
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "sans-serif",
              }}
            >
              <option value="none">없음</option>
              <option value="whoosh">스우시 (휘~)</option>
              <option value="impact">임팩트 (쿵!)</option>
              <option value="pop">팝 (퐁!)</option>
              <option value="ding">딩 (띵!)</option>
              <option value="swoosh">스우시 (슉!)</option>
              <option value="bass-drop">베이스드롭 (쿵~)</option>
              <option value="click">클릭 (딸깍)</option>
              <option value="reveal">공개 (짜잔~)</option>
              <option value="alarm">알람 (삐~)</option>
              <option value="success">성공 (짠!)</option>
              <option value="typing">타이핑 (딸깍딸깍)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export { SUB_SCENE_TEMPLATES };
