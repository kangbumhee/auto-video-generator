import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Audio, staticFile } from "remotion";
import type { Caption } from "../types";
import type { ChartConfig, AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { AnimatedLineChart } from "../components/AnimatedLineChart";
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

export const ProblemScene: React.FC<Props> = ({
  audioFile,
  captions,
  imageFiles,
  chartData,
  highlightWords,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage src={imageFiles[0]} type="zoom-in" brightness={0.35} />
      )}
      <Audio src={staticFile(audioFile)} />

      {chartData && chartData.type === "line" && (
        <Sequence
          from={Math.floor(durationInFrames * 0.4)}
          durationInFrames={Math.floor(durationInFrames * 0.55)}
          premountFor={fps}
        >
          <div
            style={{
              position: "absolute",
              top: "15%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AnimatedLineChart config={chartData} />
          </div>
        </Sequence>
      )}

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
