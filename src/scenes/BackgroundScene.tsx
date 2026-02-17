import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Audio, staticFile } from "remotion";
import type { Caption } from "../types";
import type { ChartConfig, AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { LowerThird } from "../components/LowerThird";
import { ProgressBar } from "../components/ProgressBar";
import { LogoWatermark } from "../components/LogoWatermark";

interface Props {
  text: string;
  audioFile: string;
  captions: Caption[];
  imageFiles: string[];
  chartData?: ChartConfig;
  highlightWords?: string[];
  animationType: AnimationType;
}

export const BackgroundScene: React.FC<Props> = ({
  audioFile,
  captions,
  imageFiles,
  highlightWords,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage src={imageFiles[0]} type="pan-left" brightness={0.35} />
      )}
      <Audio src={staticFile(audioFile)} />
      <LowerThird name="전문가 분석" title="부동산 시장 동향" />
      <AnimatedSubtitle
        captions={captions}
        style="youtube"
        highlightWords={highlightWords}
      />
      <LogoWatermark />
      <ProgressBar />
    </AbsoluteFill>
  );
};
