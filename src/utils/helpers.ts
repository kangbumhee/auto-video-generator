// ============================================================
// 유틸리티 함수
// ============================================================

import type { Caption } from "../types";

/** 현재 프레임에 해당하는 자막 찾기 */
export function findCurrentCaption(
  captions: Caption[],
  frame: number,
  fps: number
): Caption | null {
  const currentTimeMs = (frame / fps) * 1000;
  return (
    captions.find(
      (c) => currentTimeMs >= c.startMs && currentTimeMs <= c.endMs
    ) ?? null
  );
}

/** 시간 문자열 → 초 변환 ("1:30" → 90) */
export function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/** 프레임 → 시간 표시 (450 → "0:15") */
export function framesToTime(frames: number, fps: number): string {
  const totalSec = Math.floor(frames / fps);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

/** 단어 배열을 N어절씩 묶어 자막 라인으로 변환 */
export function chunkWordsToLines(
  words: Array<{ text: string; start: number; end: number }>,
  wordsPerLine: number = 4
): Caption[] {
  const lines: Caption[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    const chunk = words.slice(i, i + wordsPerLine);
    lines.push({
      text: chunk.map((w) => w.text).join(" "),
      startMs: chunk[0].start * 1000,
      endMs: chunk[chunk.length - 1].end * 1000,
      timestampMs: chunk[0].start * 1000,
      confidence: 1.0,
    });
  }
  return lines;
}
