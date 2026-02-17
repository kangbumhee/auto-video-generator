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
import type { AnimationType } from "../types";
import { KenBurnsImage } from "../components/KenBurnsImage";
import { AnimatedSubtitle } from "../components/AnimatedSubtitle";
import { SubscribeBanner } from "../components/SubscribeBanner";
import { ProgressBar } from "../components/ProgressBar";
import { LogoWatermark } from "../components/LogoWatermark";
import { notoSansKR } from "../utils/fonts";

interface Props {
  text: string;
  audioFile: string;
  captions: Caption[];
  imageFiles: string[];
  highlightWords?: string[];
  animationType: AnimationType;
}

export const OutroScene: React.FC<Props> = ({
  audioFile,
  captions,
  imageFiles,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const fadeToBlack = interpolate(
    frame,
    [durationInFrames - 2 * fps, durationInFrames],
    [0, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {imageFiles[0] && (
        <KenBurnsImage src={imageFiles[0]} type="zoom-out" brightness={0.3} />
      )}
      <Audio src={staticFile(audioFile)} />

      <Sequence
        from={fps}
        durationInFrames={durationInFrames - fps}
        premountFor={fps}
      >
        <SubscribeBanner text="구독 + 알림 설정 해주세요!" />
      </Sequence>

      <Sequence
        from={Math.floor(durationInFrames * 0.5)}
        premountFor={fps}
      >
        <div
          style={{
            position: "absolute",
            top: "30%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 28,
              color: "#aaa",
            }}
          >
            다음 영상
          </div>
          <div
            style={{
              fontFamily: notoSansKR,
              fontSize: 40,
              fontWeight: 700,
              color: "#fff",
              marginTop: 12,
            }}
          >
            지금 사야 할 서울 아파트 TOP 5
          </div>
        </div>
      </Sequence>

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          opacity: fadeToBlack,
          zIndex: 90,
        }}
      />

      <AnimatedSubtitle captions={captions} style="youtube" />
      <LogoWatermark />
      <ProgressBar />
    </AbsoluteFill>
  );
};
