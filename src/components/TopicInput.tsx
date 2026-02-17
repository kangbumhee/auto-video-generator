// src/components/TopicInput.tsx
// 주제 입력 → AI 대본 생성 요청

import React, { useState } from "react";

const CATEGORY_OPTIONS = [
  { value: "economy", label: "💰 경제" },
  { value: "realestate", label: "🏠 부동산" },
  { value: "current", label: "📰 시사" },
  { value: "tech", label: "💻 기술" },
  { value: "finance", label: "📈 금융/투자" },
  { value: "policy", label: "🏛️ 정책" },
];

const DURATION_OPTIONS = [
  { value: 5, label: "5분 (짧은 분석)" },
  { value: 8, label: "8분 (표준)" },
  { value: 10, label: "10분 (심층 분석)" },
  { value: 15, label: "15분 (풀 다큐)" },
];

const TONE_OPTIONS = [
  { value: "anchor", label: "🎙️ 뉴스 앵커풍" },
  { value: "youtuber", label: "🎬 유튜버 친근체" },
  { value: "documentary", label: "🎥 다큐멘터리풍" },
  { value: "lecture", label: "📚 강의/해설풍" },
];

export const TopicInput: React.FC<{
  onGenerate: (params: {
    topic: string;
    category: string;
    duration: number;
    tone: string;
  }) => void;
  isGenerating: boolean;
}> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("economy");
  const [duration, setDuration] = useState(10);
  const [tone, setTone] = useState("youtuber");

  const handleSubmit = () => {
    if (!topic.trim()) {
      alert("주제를 입력해주세요!");
      return;
    }
    onGenerate({
      topic: topic.trim(),
      category,
      duration,
      tone,
    });
  };

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
        🎯 영상 주제 설정
      </h3>

      <div>
        <label
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 6,
            display: "block",
          }}
        >
          주제 / 키워드
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="예: 2026년 수도권 아파트 가격 전망, 미국 금리 인하 영향..."
          rows={3}
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: "#111827",
            color: "#e5e7eb",
            border: "1px solid #374151",
            borderRadius: 10,
            fontSize: 15,
            lineHeight: 1.6,
            fontFamily: "sans-serif",
            resize: "vertical",
          }}
        />
      </div>

      <div>
        <label
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 6,
            display: "block",
          }}
        >
          카테고리
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setCategory(opt.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border:
                  category === opt.value
                    ? "2px solid #3b82f6"
                    : "1px solid #374151",
                backgroundColor:
                  category === opt.value ? "#1e3a5f" : "#111827",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "sans-serif",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 6,
            display: "block",
          }}
        >
          영상 길이
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDuration(opt.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border:
                  duration === opt.value
                    ? "2px solid #10b981"
                    : "1px solid #374151",
                backgroundColor:
                  duration === opt.value ? "#064e3b" : "#111827",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "sans-serif",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          style={{
            fontSize: 13,
            color: "#9ca3af",
            marginBottom: 6,
            display: "block",
          }}
        >
          말투 / 톤
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTone(opt.value)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border:
                  tone === opt.value
                    ? "2px solid #f59e0b"
                    : "1px solid #374151",
                backgroundColor:
                  tone === opt.value ? "#78350f" : "#111827",
                color: "#e5e7eb",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "sans-serif",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isGenerating || !topic.trim()}
        style={{
          padding: "14px 0",
          borderRadius: 12,
          border: "none",
          backgroundColor: isGenerating ? "#374151" : "#3b82f6",
          color: "#fff",
          fontSize: 16,
          fontWeight: 700,
          cursor: isGenerating ? "wait" : "pointer",
          fontFamily: "sans-serif",
          boxShadow: isGenerating ? "none" : "0 4px 20px rgba(59,130,246,0.3)",
        }}
      >
        {isGenerating ? "⏳ AI 대본 생성 중..." : "🚀 AI 대본 생성하기"}
      </button>
    </div>
  );
};
