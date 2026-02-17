// src/components/SfxPlayer.tsx
// ============================================================
// 서브씬 시작 시점에 효과음을 재생하는 Remotion 컴포넌트
// Remotion <Audio> 사용
// ============================================================

import React from "react";
import { Audio, staticFile, interpolate } from "remotion";
import type { SfxType, SubSceneType } from "../types";
import { resolveSfx } from "../sfx-manager";

export const SfxPlayer: React.FC<{
  subSceneType: SubSceneType;
  explicitSfx?: SfxType;
  delay?: number;
  volumeScale?: number;
}> = ({ subSceneType, explicitSfx, volumeScale = 1 }) => {
  const { file, volume } = resolveSfx(subSceneType, explicitSfx);

  if (!file) return null;

  const finalVolume = volume * volumeScale;

  return <Audio src={staticFile(file)} volume={finalVolume} />;
};

// ── BGM 페이더: 서브씬 타입에 따라 BGM 볼륨 자동 조절 (덕킹) ──
const DUCK_TYPES: SubSceneType[] = [
  "breaking-banner",
  "verdict-stamp",
  "title-impact",
  "transition-swoosh",
];

export function getBgmDuckingVolume(
  frame: number,
  fps: number,
  subSceneType: SubSceneType,
  baseBgmVolume: number
): number {
  if (!DUCK_TYPES.includes(subSceneType)) return baseBgmVolume;

  const duckDuration = fps; // 1초
  const duckedVolume = baseBgmVolume * 0.3;
  return interpolate(
    frame,
    [0, 5, duckDuration, duckDuration + 15],
    [baseBgmVolume, duckedVolume, duckedVolume, baseBgmVolume],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

// ── globalFrame + sections → BGM 볼륨 (덕킹 적용) ──
export function getBgmVolumeForFrame(
  globalFrame: number,
  fps: number,
  sections: { subScenes?: { durationFrames?: number; type?: string }[] }[],
  baseVol: number
): number {
  let acc = 0;
  for (const section of sections || []) {
    for (const sub of section.subScenes || []) {
      const dur = sub.durationFrames || 150;
      const type = (sub.type || "fullscreen-text") as SubSceneType;
      if (globalFrame >= acc && globalFrame < acc + dur) {
        const localFrame = globalFrame - acc;
        return getBgmDuckingVolume(localFrame, fps, type, baseVol);
      }
      acc += dur;
    }
  }
  return baseVol;
}
