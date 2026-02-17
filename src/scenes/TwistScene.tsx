import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Audio, staticFile } from "remotion";
import type { Caption } from "../types";
import type { ChartConfig, AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { HighlightText } from "../components/HighlightText";
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

export const TwistScene: React.FC<Props> = ({
  audioFile,
  captions,
  imageFiles,
  highlightWords = [],
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const flashOpacity = interpolate(frame, [0, 10, 20], [0, 0.3, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage src={imageFiles[0]} type="pan-right" brightness={0.3} />
      )}
      <Audio src={staticFile(audioFile)} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#CC0000",
          opacity: flashOpacity,
          zIndex: 10,
        }}
      />

      <Sequence from={0} durationInFrames={2 * fps} premountFor={fps}>
        <div
          style={{
            position: "absolute",
            top: "35%",
            width: "100%",
            textAlign: "center",
            zIndex: 20,
          }}
        >
          <HighlightText
            text="반전!"
            highlightColor="#CC0000"
            fontSize={80}
          />
        </div>
      </Sequence>

      <AnimatedSubtitle
        captions={captions}
        style="news"
        highlightWords={highlightWords}
      />
      <LogoWatermark />
      <ProgressBar />
    </AbsoluteFill>
  );
};
