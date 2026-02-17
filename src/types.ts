// src/types.ts
// ============================================================
// 전체 타입 시스템 — 5~10초 서브씬 기반
// ============================================================

export type SubSceneType =
  | "title-impact"
  | "stat-counter"
  | "chart-bar"
  | "chart-line"
  | "chart-pie"
  | "quote-highlight"
  | "keyword-explosion"
  | "comparison-split"
  | "list-reveal"
  | "fullscreen-text"
  | "image-kenburns"
  | "breaking-banner"
  | "data-card-stack"
  | "transition-swoosh"
  | "cta-subscribe"
  | "emoji-rain"
  | "map-highlight"
  | "timeline-progress"
  | "verdict-stamp"
  | "recap-scroll";

export interface SubScene {
  id: string;
  type: SubSceneType;
  durationFrames: number;
  headline?: string;
  body?: string;
  caption?: string;
  numbers?: { label: string; value: number; unit: string; color: string }[];
  chartData?: ChartConfig;
  keywords?: string[];
  comparisonLeft?: { label: string; value: string };
  comparisonRight?: { label: string; value: string };
  listItems?: string[];
  bgColor: string;
  accentColor: string;
  textColor: string;
  sfx?: SfxType;
  sfxFile?: string;
  imageFile?: string;
}

export type SfxType =
  | "whoosh"
  | "impact"
  | "pop"
  | "ding"
  | "swoosh"
  | "bass-drop"
  | "click"
  | "reveal"
  | "alarm"
  | "success"
  | "typing"
  | "none";

export interface ChartConfig {
  type: "bar" | "line" | "pie";
  title: string;
  data: { label: string; value: number; color?: string }[];
  unit?: string;
}

export type SectionType =
  | "HOOK"
  | "PROBLEM"
  | "BACKGROUND"
  | "ANALYSIS_1"
  | "ANALYSIS_2"
  | "ANALYSIS_3"
  | "TWIST"
  | "SUMMARY"
  | "OUTRO";

export interface ScriptSection {
  id: SectionType;
  label: string;
  narrationText: string;
  subScenes: SubScene[];
  audioFile?: string;
  captionsFile?: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  sampleUrl: string;
  provider: "elevenlabs" | "google" | "naver";
  tags: string[];
}

export interface VideoConfig {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  topic: string;
  fps: number;
  width: number;
  height: number;
  bgmFile: string;
  bgmVolume: number;
  thumbnailFile: string;
  selectedVoice: VoiceOption;
  totalDurationFrames: number;
  sections: ScriptSection[];
}

export interface CaptionItem {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
}

/** @deprecated 레거시 씬 호환용 — CaptionItem과 동일 */
export type Caption = CaptionItem;

/** @deprecated 레거시 씬 호환용 */
export type AnimationType =
  | "fade"
  | "typewriter"
  | "kenburns"
  | "none"
  | "slide";

export interface ProjectState {
  step: "idle" | "analyzing" | "scripting" | "voiceover" | "rendering" | "complete" | "error";
  progress: number;
  currentSection?: string;
  logs: string[];
}
