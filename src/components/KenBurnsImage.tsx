// ============================================================
// Ken Burns 이미지 — Remotion 스킬: animations.md, images.md, timing.md
// ============================================================

import React from "react";
import {
  Img,
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

type KenBurnsType =
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "pan-up"
  | "pan-down";

interface Props {
  src: string;
  type?: KenBurnsType;
  brightness?: number;
}

export const KenBurnsImage: React.FC<Props> = ({
  src,
  type = "zoom-in",
  brightness = 0.4,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  let transform = "";
  switch (type) {
    case "zoom-in":
      transform = `scale(${interpolate(progress, [0, 1], [1.0, 1.2])})`;
      break;
    case "zoom-out":
      transform = `scale(${interpolate(progress, [0, 1], [1.2, 1.0])})`;
      break;
    case "pan-left":
      transform = `scale(1.15) translateX(${interpolate(progress, [0, 1], [5, -5])}%)`;
      break;
    case "pan-right":
      transform = `scale(1.15) translateX(${interpolate(progress, [0, 1], [-5, 5])}%)`;
      break;
    case "pan-up":
      transform = `scale(1.15) translateY(${interpolate(progress, [0, 1], [5, -5])}%)`;
      break;
    case "pan-down":
      transform = `scale(1.15) translateY(${interpolate(progress, [0, 1], [-5, 5])}%)`;
      break;
  }

  const isRemote = src.startsWith("http");

  return (
    <AbsoluteFill
      style={{
        filter: `brightness(${brightness})`,
        transform,
      }}
    >
      <Img
        src={isRemote ? src : staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};
