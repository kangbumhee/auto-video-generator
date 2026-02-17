// src/sfx-manager.ts
// ============================================================
// 효과음 매니저 — 서브씬 타입별 자동 SFX 매핑
// ============================================================

import type { SfxType, SubSceneType } from "./types";

// 서브씬 타입 → 기본 효과음 자동 매핑
export const DEFAULT_SFX_MAP: Record<SubSceneType, SfxType> = {
  "title-impact": "impact",
  "stat-counter": "ding",
  "chart-bar": "reveal",
  "chart-line": "reveal",
  "chart-pie": "reveal",
  "quote-highlight": "reveal",
  "keyword-explosion": "pop",
  "comparison-split": "impact",
  "list-reveal": "typing",
  "fullscreen-text": "whoosh",
  "image-kenburns": "none",
  "breaking-banner": "alarm",
  "data-card-stack": "ding",
  "transition-swoosh": "swoosh",
  "cta-subscribe": "success",
  "emoji-rain": "pop",
  "map-highlight": "click",
  "timeline-progress": "typing",
  "verdict-stamp": "impact",
  "recap-scroll": "typing",
};

// SFX 파일명 매핑 (WAV 플레이스홀더 사용)
export const SFX_FILES: Record<SfxType, string> = {
  whoosh: "sfx/whoosh.wav",
  impact: "sfx/impact.wav",
  pop: "sfx/pop.wav",
  ding: "sfx/ding.wav",
  swoosh: "sfx/swoosh.wav",
  "bass-drop": "sfx/bass-drop.wav",
  click: "sfx/click.wav",
  reveal: "sfx/reveal.wav",
  alarm: "sfx/alarm.wav",
  success: "sfx/success.wav",
  typing: "sfx/typing.wav",
  none: "",
};

// SFX 한글 설명
export const SFX_LABELS: Record<SfxType, string> = {
  whoosh: "휘~ (전환)",
  impact: "쿵! (임팩트)",
  pop: "퐁! (등장)",
  ding: "띵! (알림)",
  swoosh: "슉! (스와이프)",
  "bass-drop": "쿵~ (베이스)",
  click: "딸깍 (클릭)",
  reveal: "짜잔~ (공개)",
  alarm: "삐~ (경고)",
  success: "짠! (성공)",
  typing: "딸깍딸깍 (타이핑)",
  none: "없음",
};

// 효과음 볼륨 (타입별 기본값)
export const SFX_VOLUME: Record<SfxType, number> = {
  whoosh: 0.4,
  impact: 0.6,
  pop: 0.35,
  ding: 0.3,
  swoosh: 0.4,
  "bass-drop": 0.5,
  click: 0.25,
  reveal: 0.4,
  alarm: 0.5,
  success: 0.35,
  typing: 0.2,
  none: 0,
};

// 서브씬에 SFX가 없으면 타입 기반 자동 할당
export function resolveSfx(
  subSceneType: SubSceneType,
  explicitSfx?: SfxType
): { file: string; volume: number } {
  const sfx = explicitSfx ?? DEFAULT_SFX_MAP[subSceneType] ?? "none";
  return {
    file: SFX_FILES[sfx] ?? "",
    volume: SFX_VOLUME[sfx] ?? 0,
  };
}
