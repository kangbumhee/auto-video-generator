// src/components/VoiceSelector.tsx
// 음성 선택 패널 (Remotion Studio Props 패널 또는 웹 대시보드용)
// 특징 설명 + 샘플 미리듣기 버튼

import React, { useState, useCallback, useRef } from "react";
import type { VoiceOption } from "../types";
import { VOICE_OPTIONS } from "../config";

export const VoiceSelector: React.FC<{
  selected: VoiceOption;
  onSelect: (voice: VoiceOption) => void;
  apiKey?: string;
}> = ({ selected, onSelect, apiKey }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = useCallback(
    async (voice: VoiceOption) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (playingId === voice.id) {
        setPlayingId(null);
        return;
      }

      if (!apiKey) {
        alert("ElevenLabs API 키를 먼저 입력해주세요.");
        return;
      }

      setLoadingId(voice.id);

      try {
        const res = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voice.id}/stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": apiKey,
            },
            body: JSON.stringify({
              text: "안녕하세요, 이 목소리로 영상 나레이션을 진행합니다. 어떠신가요?",
              model_id: "eleven_multilingual_v2",
              voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
          }
        );

        if (!res.ok) throw new Error("미리듣기 실패");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
          setPlayingId(null);
          URL.revokeObjectURL(url);
        };

        audio.play();
        audioRef.current = audio;
        setPlayingId(voice.id);
      } catch {
        alert("미리듣기 실패: API 키를 확인해주세요.");
      } finally {
        setLoadingId(null);
      }
    },
    [playingId, apiKey]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 18, color: "#fff", fontFamily: "sans-serif" }}>
        🎙️ 나레이션 음성 선택
      </h3>

      {VOICE_OPTIONS.map((voice) => {
        const isSelected = selected.id === voice.id;
        const isPlaying = playingId === voice.id;
        const isLoading = loadingId === voice.id;

        return (
          <div
            key={voice.id}
            onClick={() => onSelect(voice)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 18px",
              borderRadius: 12,
              backgroundColor: isSelected ? "#1a3a5c" : "#111827",
              border: isSelected ? "2px solid #3b82f6" : "2px solid #1f2937",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: `2px solid ${isSelected ? "#3b82f6" : "#4b5563"}`,
                backgroundColor: isSelected ? "#3b82f6" : "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {isSelected && (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  fontFamily: "sans-serif",
                }}
              >
                {voice.description}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 6,
                  flexWrap: "wrap",
                }}
              >
                {voice.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      backgroundColor: "#1f2937",
                      padding: "2px 8px",
                      borderRadius: 6,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(voice);
              }}
              disabled={isLoading}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: "none",
                backgroundColor: isPlaying ? "#ef4444" : "#3b82f6",
                color: "#fff",
                fontSize: 18,
                cursor: isLoading ? "wait" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {isLoading ? "⏳" : isPlaying ? "⏹" : "▶"}
            </button>
          </div>
        );
      })}
    </div>
  );
};
