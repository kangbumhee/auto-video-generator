// ============================================================
// 후킹 씬 — 속보 배너 + 타자기 효과
// ============================================================

import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Audio, staticFile } from "remotion";
import type { Caption } from "../types";
import type { ChartConfig, AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { BreakingNewsBanner } from "../components/BreakingNewsBanner";
import { TypewriterText } from "../components/TypewriterText";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { ProgressBar } from "../components/ProgressBar";
import { LogoWatermark } from "../components/LogoWatermark";

interface Props {
  text: string;
  title: string;
  audioFile: string;
  captions: Caption[];
  imageFiles: string[];
  chartData?: ChartConfig;
  highlightWords?: string[];
  animationType: AnimationType;
}

export const HookScene: React.FC<Props> = ({
  text,
  title,
  audioFile,
  captions,
  imageFiles,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage src={imageFiles[0]} type="zoom-in" brightness={0.3} />
      )}

      <Audio src={staticFile(audioFile)} />

      <Sequence from={0} durationInFrames={3 * fps} premountFor={fps}>
        <BreakingNewsBanner title={title} />
      </Sequence>

      <Sequence from={Math.floor(2 * fps)} premountFor={fps}>
        <div
          style={{
            position: "absolute",
            top: "45%",
            width: "100%",
            padding: "0 80px",
            textAlign: "center",
          }}
        >
          <TypewriterText text={text.slice(0, 60)} fontSize={52} />
        </div>
      </Sequence>

      <AnimatedSubtitle captions={captions} style="news" />

      <LogoWatermark />
      <ProgressBar />
    </AbsoluteFill>
  );
};
