// ============================================================
// 씬 라우터 — 섹션 ID에 따라 적절한 씬 컴포넌트 렌더링
// @deprecated 새 컴포지션은 SubSceneRenderer 사용
// ============================================================

import React from "react";
import type { AnimationType, Caption, ChartConfig, ScriptSection } from "../types";
import { HookScene } from "./HookScene";
import { ProblemScene } from "./ProblemScene";
import { BackgroundScene } from "./BackgroundScene";
import { AnalysisScene } from "./AnalysisScene";
import { TwistScene } from "./TwistScene";
import { SummaryScene } from "./SummaryScene";
import { OutroScene } from "./OutroScene";

interface Props {
  section: ScriptSection;
  sectionIndex: number;
}

type LegacySection = ScriptSection & {
  text?: string;
  captions?: Caption[];
  imageFiles?: string[];
  chartData?: unknown;
  highlightWords?: string[];
  animationType?: string;
};

export const SceneRouter: React.FC<Props> = ({ section }) => {
  const legacy = section as LegacySection;
  const commonProps = {
    text: section.narrationText ?? legacy.text ?? "",
    audioFile: section.audioFile ?? "",
    captions: (legacy.captions ?? []) as Caption[],
    imageFiles: legacy.imageFiles ?? [],
    chartData: (legacy.chartData ?? undefined) as ChartConfig | undefined,
    highlightWords: legacy.highlightWords ?? [],
    animationType: (legacy.animationType ?? "fade") as AnimationType,
  };

  switch (section.id) {
    case "HOOK":
      return <HookScene {...commonProps} title={section.label} />;
    case "PROBLEM":
      return <ProblemScene {...commonProps} />;
    case "BACKGROUND":
      return <BackgroundScene {...commonProps} />;
    case "ANALYSIS_1":
      return (
        <AnalysisScene
          {...commonProps}
          chapterNumber={1}
          chapterTitle="공급 분석"
        />
      );
    case "ANALYSIS_2":
      return (
        <AnalysisScene
          {...commonProps}
          chapterNumber={2}
          chapterTitle="수요 분석"
        />
      );
    case "ANALYSIS_3":
      return (
        <AnalysisScene
          {...commonProps}
          chapterNumber={3}
          chapterTitle="정책 분석"
        />
      );
    case "TWIST":
      return <TwistScene {...commonProps} />;
    case "SUMMARY":
      return <SummaryScene {...commonProps} />;
    case "OUTRO":
      return <OutroScene {...commonProps} />;
    default:
      return <BackgroundScene {...commonProps} />;
  }
};
