import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Audio, staticFile } from "remotion";
import type { Caption } from "../types";
import type { ChartConfig, AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { AnimatedBarChart } from "../components/AnimatedBarChart";
import { AnimatedLineChart } from "../components/AnimatedLineChart";
import { AnimatedPieChart } from "../components/AnimatedPieChart";
import { ChapterTitle } from "../components/ChapterTitle";
import { SubscribeBanner } from "../components/SubscribeBanner";
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
  chapterNumber: number;
  chapterTitle: string;
}

export const AnalysisScene: React.FC<Props> = ({
  audioFile,
  captions,
  imageFiles,
  chartData,
  highlightWords,
  chapterNumber,
  chapterTitle,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  const kenBurnsType =
    chapterNumber === 1
      ? "zoom-out"
      : chapterNumber === 2
        ? "pan-right"
        : "zoom-in";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage
          src={imageFiles[0]}
          type={kenBurnsType as "zoom-out" | "pan-right" | "zoom-in"}
          brightness={0.3}
        />
      )}
      <Audio src={staticFile(audioFile)} />

      <Sequence from={0} durationInFrames={3 * fps} premountFor={fps}>
        <ChapterTitle number={chapterNumber} title={chapterTitle} />
      </Sequence>

      {chartData && (
        <Sequence
          from={3 * fps}
          durationInFrames={durationInFrames - 3 * fps}
          premountFor={fps}
        >
          <div
            style={{
              position: "absolute",
              top: "12%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {chartData.type === "bar" && (
              <AnimatedBarChart config={chartData} />
            )}
            {chartData.type === "line" && (
              <AnimatedLineChart config={chartData} />
            )}
            {chartData.type === "pie" && (
              <AnimatedPieChart config={chartData} />
            )}
          </div>
        </Sequence>
      )}

      {chapterNumber === 3 && (
        <Sequence
          from={Math.floor(durationInFrames * 0.3)}
          durationInFrames={3 * fps}
          premountFor={fps}
        >
          <SubscribeBanner />
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
