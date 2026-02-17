import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { Audio, staticFile } from "remotion";
import type { Caption } from "../types";
import type { ChartConfig, AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { DataCard } from "../components/DataCard";
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

export const SummaryScene: React.FC<Props> = ({
  audioFile,
  captions,
  imageFiles,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage src={imageFiles[0]} type="zoom-out" brightness={0.25} />
      )}
      <Audio src={staticFile(audioFile)} />

      <Sequence
        from={Math.floor(fps * 2)}
        durationInFrames={durationInFrames - 2 * fps}
        premountFor={fps}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DataCard
            items={[
              { label: "공급 부족", value: "-35%", color: "#E74C3C" },
              { label: "숨은 수요", value: "폭발 예상", color: "#F39C12" },
              { label: "정책 방향", value: "규제 완화", color: "#2ECC71" },
            ]}
          />
        </div>
      </Sequence>

      <AnimatedSubtitle captions={captions} style="youtube" />
      <LogoWatermark />
      <ProgressBar />
    </AbsoluteFill>
  );
};
