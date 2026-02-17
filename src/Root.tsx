// src/Root.tsx
// ============================================================
// generated-script.json에서 직접 totalDurationFrames 사용
// ============================================================

import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./VideoComposition";
import type { VideoConfig } from "./types";

import generatedScript from "./generated-script.json";

export const RemotionRoot: React.FC = () => {
  const calculatedFrames = (generatedScript as Record<string, unknown>)
    .sections?.reduce(
      (sum: number, section: Record<string, unknown>) =>
        sum +
        ((section.subScenes as Record<string, unknown>[]) || []).reduce(
          (s: number, sub: Record<string, unknown>) =>
            s + (Number((sub as { durationFrames?: number }).durationFrames) || 150),
          0
        ),
      0
    ) || 18000;

  const savedTotal =
    Number(
      (generatedScript as Record<string, unknown>).totalDurationFrames
    ) || 0;
  let totalFrames = Math.max(calculatedFrames, savedTotal, 3600);
  totalFrames = Math.max(3600, Math.min(totalFrames, 54000)); // 최소 2분, 최대 30분

  console.log(
    `[Root] 프레임: calculated=${calculatedFrames}, saved=${savedTotal}, final=${totalFrames} (${(totalFrames / 30 / 60).toFixed(1)}분)`
  );

  const config: VideoConfig = {
    ...(generatedScript as VideoConfig),
    totalDurationFrames: totalFrames,
    fps: ((generatedScript as Record<string, unknown>).fps as number) || 30,
    width: ((generatedScript as Record<string, unknown>).width as number) || 1920,
    height:
      ((generatedScript as Record<string, unknown>).height as number) || 1080,
  };

  return (
    <Composition
      id="VideoComposition"
      component={VideoComposition}
      durationInFrames={totalFrames}
      fps={config.fps || 30}
      width={config.width || 1920}
      height={config.height || 1080}
      defaultProps={{ config }}
    />
  );
};
