// src/VideoComposition.tsx
// ============================================================
// BGM: loop 대신 Sequence 반복 (Remotion loop 버그 우회)
// 효과음: 섹션 전환 시점에만 재생
// ============================================================

import React, { useEffect, useState, useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  Sequence,
  interpolate,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import type { VideoConfig, SubScene } from "./types";
import { SubSceneRenderer } from "./components/SubSceneRenderer";
import { DebugOverlay } from "./components/DebugOverlay";

const DEBUG_MODE = true;

type SubEntry = { text: string; startMs: number; endMs: number };

function useAllSubtitles(sectionIds: string[]): Record<string, SubEntry[]> {
  const [allSubs, setAllSubs] = useState<Record<string, SubEntry[]>>({});
  const key = sectionIds.join(",");
  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      const result: Record<string, SubEntry[]> = {};
      for (const id of sectionIds) {
        try {
          const url = staticFile(`voiceover/${id}-subs.json`);
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            result[id] = Array.isArray(data) ? data : [];
          } else {
            result[id] = [];
          }
        } catch {
          result[id] = [];
        }
      }
      if (!cancelled) setAllSubs(result);
    };
    loadAll();
    return () => {
      cancelled = true;
    };
  }, [key]);
  return allSubs;
}

const RealtimeSubtitle: React.FC<{
  subs: SubEntry[];
  frame: number;
  fps: number;
  sectionStartFrame: number;
}> = ({ subs, frame, fps, sectionStartFrame }) => {
  const relativeMs = ((frame - sectionStartFrame) / fps) * 1000;
  const activeSub = subs.find(
    (s) => relativeMs >= s.startMs && relativeMs <= s.endMs
  );
  if (!activeSub) return null;
  const dur = activeSub.endMs - activeSub.startMs;
  const prog = dur > 0 ? (relativeMs - activeSub.startMs) / dur : 0;
  const opacity = interpolate(prog, [0, 0.05, 0.9, 1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "#fff",
        padding: "14px 32px",
        borderRadius: 10,
        fontSize: 34,
        fontWeight: 700,
        maxWidth: "80%",
        textAlign: "center",
        lineHeight: 1.5,
        opacity,
        zIndex: 100,
        textShadow: "0 2px 8px rgba(0,0,0,0.6)",
      }}
    >
      {activeSub.text}
    </div>
  );
};

const SectionLabel: React.FC<{ label: string; color: string }> = ({
  label,
  color,
}) => (
  <div
    style={{
      position: "absolute",
      top: 24,
      left: 24,
      backgroundColor: color || "#FF3366",
      color: "#fff",
      padding: "6px 18px",
      borderRadius: 6,
      fontSize: 18,
      fontWeight: 700,
      zIndex: 90,
    }}
  >
    {label}
  </div>
);

const GlobalProgress: React.FC<{ frame: number; total: number }> = ({
  frame,
  total,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: 4,
      backgroundColor: "rgba(255,255,255,0.15)",
      zIndex: 90,
    }}
  >
    <div
      style={{
        width: `${Math.min((frame / total) * 100, 100)}%`,
        height: "100%",
        backgroundColor: "#FF3366",
      }}
    />
  </div>
);

const SafeSubScene: React.FC<{ subScene: SubScene; fps: number }> = ({
  subScene,
  fps,
}) => {
  const safe: SubScene = {
    ...subScene,
    bgColor: subScene.bgColor || "#0a0a2e",
    textColor: subScene.textColor || "#FFFFFF",
    accentColor: subScene.accentColor || "#FF3366",
    headline: subScene.headline || subScene.caption || "",
    body: subScene.body || "",
    durationFrames: subScene.durationFrames || 150,
  };
  try {
    return <SubSceneRenderer scene={safe} />;
  } catch {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: safe.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: safe.textColor,
          fontSize: 36,
          fontWeight: 700,
          padding: 60,
          textAlign: "center",
        }}
      >
        {safe.headline}
      </AbsoluteFill>
    );
  }
};

export const VideoComposition: React.FC<{ config: VideoConfig }> = ({
  config,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sectionIds = useMemo(
    () => (config.sections || []).map((s: { id: string }) => s.id),
    [config.sections]
  );
  const allSubs = useAllSubtitles(sectionIds);

  const sectionFrameMap = useMemo(() => {
    const map: Record<string, number> = {};
    let acc = 0;
    for (const section of config.sections || []) {
      map[section.id] = acc;
      acc += (section.subScenes || []).reduce(
        (sum: number, ss: SubScene) => sum + (ss.durationFrames || 150),
        0
      );
    }
    return map;
  }, [config.sections]);

  const currentSection = useMemo(() => {
    let acc = 0;
    for (const section of config.sections || []) {
      const sf = (section.subScenes || []).reduce(
        (sum: number, ss: SubScene) => sum + (ss.durationFrames || 150),
        0
      );
      if (frame >= acc && frame < acc + sf) return section;
      acc += sf;
    }
    return null;
  }, [config.sections, frame]);

  const totalFrames =
    config.totalDurationFrames || durationInFrames || 18000;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {(config.sections || []).flatMap(
          (section: { id: string; subScenes?: SubScene[] }) =>
            (section.subScenes || []).map((subScene: SubScene, idx: number) => (
              <React.Fragment key={`${section.id}-${idx}`}>
                {idx > 0 && (
                  <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: 15 })}
                  />
                )}
                <TransitionSeries.Sequence
                  durationInFrames={subScene.durationFrames || 150}
                >
                  <SafeSubScene subScene={subScene} fps={fps} />
                </TransitionSeries.Sequence>
              </React.Fragment>
            ))
        )}
      </TransitionSeries>

      {(() => {
        let acc = 0;
        return (config.sections || []).map(
          (section: {
            id: string;
            audioFile?: string;
            subScenes?: SubScene[];
          }) => {
            const start = acc;
            const sf = (section.subScenes || []).reduce(
              (sum: number, ss: SubScene) => sum + (ss.durationFrames || 150),
              0
            );
            acc += sf;
            if (!section.audioFile) return null;
            return (
              <Sequence
                key={`vo-${section.id}`}
                from={start}
                durationInFrames={sf}
              >
                <Audio src={staticFile(section.audioFile)} volume={1} />
              </Sequence>
            );
          }
        );
      })()}

      {/* ── BGM (config.bgmFile 또는 기본값) ── */}
      {(config.bgmFile || "bgm/generated-bgm.mp3") &&
        (() => {
          const bgmFile =
            config.bgmFile && config.bgmFile.length > 0
              ? config.bgmFile
              : "bgm/generated-bgm.mp3";
        const bgmVol = config.bgmVolume ?? 0.15;
        const BGM_DURATION_FRAMES = 1800;
        const total =
          config.totalDurationFrames || durationInFrames || 18000;
        const bgmRepeats = Math.ceil(total / BGM_DURATION_FRAMES) + 1;

          return Array.from({ length: bgmRepeats }, (_, i) => (
            <Sequence
              key={`bgm-${i}`}
              from={i * BGM_DURATION_FRAMES}
              durationInFrames={BGM_DURATION_FRAMES}
            >
              <Audio
                src={staticFile(bgmFile)}
                volume={bgmVol}
                startFrom={0}
              />
            </Sequence>
          ));
        })()}

      {currentSection && (
        <RealtimeSubtitle
          subs={allSubs[currentSection.id] || []}
          frame={frame}
          fps={fps}
          sectionStartFrame={sectionFrameMap[currentSection.id] || 0}
        />
      )}

      {currentSection && (
        <SectionLabel
          label={currentSection.label || currentSection.id}
          color={currentSection.subScenes?.[0]?.accentColor || "#FF3366"}
        />
      )}

      <GlobalProgress frame={frame} total={totalFrames} />
      {DEBUG_MODE && <DebugOverlay config={config} />}
    </AbsoluteFill>
  );
};
