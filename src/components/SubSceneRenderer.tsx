// src/components/SubSceneRenderer.tsx
// ============================================================
// 모든 서브씬 타입을 렌더링하는 메가 컴포넌트
// useCurrentFrame + interpolate/spring만 사용 (Remotion 규칙 준수)
// ============================================================

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import type { SubScene } from "../types";

// ── 공통 유틸 훅 (컴포넌트 최상단에서만 호출) ──
function useEntrance(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 150 } });
}

function useSlideUp(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  return interpolate(s, [0, 1], [80, 0]);
}

function useFadeIn(delay = 0, duration = 15) {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── 공통: 파티클 배경 ──
const ParticleBg: React.FC<{ color: string; count?: number }> = ({ color, count = 15 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = (i * 137.508) % 100;
        const startY = (i * 73) % 100;
        const speed = 0.3 + (i % 5) * 0.15;
        const y = (startY + frame * speed) % 120 - 10;
        const size = 3 + (i % 4) * 2;
        const opacity = interpolate(
          (frame + i * 10) % 90,
          [0, 45, 90],
          [0.05, 0.2, 0.05],
          { extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
            }}
          />
        );
      })}
    </>
  );
};

// ── 공통: 글로우 라인 ──
const GlowLine: React.FC<{ color: string; top?: string }> = ({ color, top = "50%" }) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [0, 30], [0, 100], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: `${width}%`,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        boxShadow: `0 0 20px ${color}`,
      }}
    />
  );
};

// ── 공통: 자막 표시 (VideoComposition의 RealtimeSubtitle에서만 표시) ──
const CaptionOverlay: React.FC<{ text?: string }> = () => {
  return null;
};

// ── 메인 라우터 ──
export const SubSceneRenderer: React.FC<{ scene: SubScene }> = ({ scene }) => {
  switch (scene.type) {
    case "title-impact":
      return <TitleImpact scene={scene} />;
    case "stat-counter":
      return <StatCounter scene={scene} />;
    case "chart-bar":
      return <ChartBar scene={scene} />;
    case "chart-line":
      return <ChartLine scene={scene} />;
    case "chart-pie":
      return <ChartPie scene={scene} />;
    case "quote-highlight":
      return <QuoteHighlight scene={scene} />;
    case "keyword-explosion":
      return <KeywordExplosion scene={scene} />;
    case "comparison-split":
      return <ComparisonSplit scene={scene} />;
    case "list-reveal":
      return <ListReveal scene={scene} />;
    case "fullscreen-text":
      return <FullscreenText scene={scene} />;
    case "breaking-banner":
      return <BreakingBanner scene={scene} />;
    case "data-card-stack":
      return <DataCardStack scene={scene} />;
    case "transition-swoosh":
      return <TransitionSwoosh scene={scene} />;
    case "cta-subscribe":
      return <CtaSubscribe scene={scene} />;
    case "emoji-rain":
      return <EmojiRain scene={scene} />;
    case "timeline-progress":
      return <TimelineProgress scene={scene} />;
    case "verdict-stamp":
      return <VerdictStamp scene={scene} />;
    case "recap-scroll":
      return <RecapScroll scene={scene} />;
    case "image-kenburns":
      return <ImageKenburns scene={scene} />;
    case "map-highlight":
      return <MapHighlight scene={scene} />;
    case "gauge-meter":
      return <GaugeMeter scene={scene} />;
    case "donut-chart":
      return <DonutChart scene={scene} />;
    case "number-counter":
      return <NumberCounter scene={scene} />;
    case "progress-bar-multi":
      return <ProgressBarMulti scene={scene} />;
    case "pyramid-chart":
      return <PyramidChart scene={scene} />;
    default:
      return <FullscreenText scene={scene} />;
  }
};

// ── 1) 타이틀 임팩트 ──
const TitleImpact: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({ frame, fps, config: { damping: 8, stiffness: 200 } });
  const headlineScale = interpolate(scale, [0, 1], [3, 1]);
  const headlineOpacity = interpolate(scale, [0, 1], [0, 1]);
  const bodyY = useSlideUp(15);
  const bodyOpacity = useFadeIn(15);
  const ringScale = interpolate(frame, [0, 20], [0, 5], { extrapolateRight: "clamp" });
  const ringOpacity = interpolate(frame, [0, 20], [0.8, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={20} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: `3px solid ${scene.accentColor}`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "35%",
          width: "100%",
          textAlign: "center",
          fontSize: 90,
          fontWeight: 900,
          color: scene.accentColor,
          fontFamily: "sans-serif",
          transform: `scale(${headlineScale})`,
          opacity: headlineOpacity,
          textShadow: `0 0 40px ${scene.accentColor}66`,
        }}
      >
        {scene.headline}
      </div>
      {scene.body && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            width: "100%",
            textAlign: "center",
            fontSize: 64,
            fontWeight: 700,
            color: scene.textColor,
            fontFamily: "sans-serif",
            transform: `translateY(${bodyY}px)`,
            opacity: bodyOpacity,
            whiteSpace: "pre-line",
            lineHeight: 1.4,
          }}
        >
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor} top="88%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 2) 숫자 카운트업 ──
const StatCounter: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numbers = scene.numbers || [];
  const headlineOpacity = useFadeIn(0);
  const headlineY = useSlideUp(0);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            width: "100%",
            textAlign: "center",
            fontSize: 52,
            fontWeight: 700,
            color: scene.textColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          {scene.headline}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {numbers.map((num, i) => {
          const s = spring({ frame: frame - i * 10, fps, config: { damping: 12 } });
          const countProgress = interpolate(frame, [i * 10, i * 10 + 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const displayValue = (num.value * countProgress).toFixed(1);
          const barHeight = interpolate(s, [0, 1], [0, 200]);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 120,
                padding: 10,
                transform: `scale(${s})`,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 200,
                  backgroundColor: `${num.color}22`,
                  borderRadius: 12,
                  position: "relative",
                  overflow: "hidden",
                  margin: "0 auto 20px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: barHeight,
                    backgroundColor: num.color,
                    borderRadius: 12,
                    boxShadow: `0 0 30px ${num.color}88`,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: num.color || scene.accentColor || "#FF3366",
                  lineHeight: 1.2,
                  fontFamily: "sans-serif",
                  textShadow: `0 0 20px ${(num.color || scene.accentColor || "#FF3366")}66`,
                }}
              >
                {displayValue}
                {num.unit}
              </span>
              <span
                style={{
                  fontSize: 18,
                  color: scene.textColor || "#fff",
                  marginTop: 8,
                  textAlign: "center",
                  lineHeight: 1.3,
                  fontFamily: "sans-serif",
                }}
              >
                {num.label}
              </span>
            </div>
          );
        })}
      </div>
      <GlowLine color={scene.accentColor} top="85%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 3) 바 차트 ──
const ChartBar: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chart = scene.chartData;
  const titleOpacity = useFadeIn(0);
  if (!chart) return <FullscreenText scene={scene} />;
  const maxVal = Math.max(...chart.data.map((d) => d.value));

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={10} />
      <div
        style={{
          position: "absolute",
          top: "8%",
          width: "100%",
          textAlign: "center",
          fontSize: 48,
          fontWeight: 700,
          color: scene.textColor,
          fontFamily: "sans-serif",
          opacity: titleOpacity,
        }}
      >
        {scene.headline || chart.title}
      </div>
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "10%",
          right: "10%",
          bottom: "22%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {chart.data.map((d, i) => {
          const barSpring = spring({
            frame: frame - i * 12,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const barHeight = interpolate(barSpring, [0, 1], [0, (d.value / maxVal) * 100]);
          const color = d.color || scene.accentColor;
          const isLast = i === chart.data.length - 1;
          const valueOpacity = interpolate(barSpring, [0.5, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
                maxWidth: 200,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: isLast ? "#ff1744" : color,
                  fontFamily: "sans-serif",
                  marginBottom: 8,
                  opacity: valueOpacity,
                  textShadow: isLast ? "0 0 20px rgba(255,23,68,0.5)" : "none",
                }}
              >
                {d.value}
                {chart.unit}
              </div>
              <div
                style={{
                  width: "100%",
                  height: `${barHeight}%`,
                  minHeight: 4,
                  backgroundColor: color,
                  borderRadius: "12px 12px 4px 4px",
                  boxShadow: `0 0 30px ${color}44`,
                  position: "relative",
                  border: isLast ? "3px solid #ff1744" : "none",
                }}
              >
                {isLast && (
                  <div
                    style={{
                      position: "absolute",
                      top: -40,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: 28,
                      color: "#ff1744",
                      fontWeight: 900,
                      fontFamily: "sans-serif",
                    }}
                  >
                    ▼ 최저
                  </div>
                )}
              </div>
              <div style={{ fontSize: 28, color: "#ffffffcc", fontFamily: "sans-serif", marginTop: 12 }}>
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
      <GlowLine color={scene.accentColor} top="88%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 4) 라인 차트 ──
const ChartLine: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chart = scene.chartData;
  const titleOpacity = useFadeIn(0);
  if (!chart) return <FullscreenText scene={scene} />;
  const maxVal = Math.max(...chart.data.map((d) => d.value)) * 1.2;
  const drawProgress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chartWidth = 1400;
  const chartHeight = 500;
  const padding = 60;
  const points = chart.data.map((d, i) => ({
    x: padding + (i / (chart.data.length - 1 || 1)) * (chartWidth - padding * 2),
    y: chartHeight - padding - (d.value / maxVal) * (chartHeight - padding * 2),
    value: d.value,
    label: d.label,
  }));
  const visibleCount = Math.floor(drawProgress * points.length);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={8} />
      <div
        style={{
          position: "absolute",
          top: "6%",
          width: "100%",
          textAlign: "center",
          fontSize: 48,
          fontWeight: 700,
          color: scene.textColor,
          fontFamily: "sans-serif",
          opacity: titleOpacity,
        }}
      >
        {scene.headline || chart.title}
      </div>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "55%",
        }}
      >
        {[0.25, 0.5, 0.75, 1].map((r, i) => (
          <line
            key={i}
            x1={padding}
            y1={chartHeight - padding - r * (chartHeight - padding * 2)}
            x2={chartWidth - padding}
            y2={chartHeight - padding - r * (chartHeight - padding * 2)}
            stroke="#ffffff15"
            strokeWidth={1}
          />
        ))}
        {points.slice(0, visibleCount + 1).map((p, i) => {
          if (i === 0) return null;
          const prev = points[i - 1]!;
          return (
            <line
              key={i}
              x1={prev.x}
              y1={prev.y}
              x2={p.x}
              y2={p.y}
              stroke={scene.accentColor}
              strokeWidth={4}
            />
          );
        })}
        {points.slice(0, visibleCount + 1).map((p, i) => {
          const s = spring({ frame: frame - 10 - i * 8, fps, config: { damping: 10 } });
          const r = interpolate(s, [0, 1], [0, 12]);
          const valueOpacity = interpolate(s, [0.5, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={r} fill={scene.accentColor} />
              <circle cx={p.x} cy={p.y} r={interpolate(s, [0, 1], [0, 24])} fill={`${scene.accentColor}22`} />
              <text
                x={p.x}
                y={p.y - 25}
                textAnchor="middle"
                fill="#fff"
                fontSize={28}
                fontWeight={700}
                opacity={valueOpacity}
              >
                {p.value}
                {chart.unit}
              </text>
              <text x={p.x} y={chartHeight - 20} textAnchor="middle" fill="#ffffff88" fontSize={24}>
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
      <GlowLine color={scene.accentColor} top="88%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 5) 파이 차트 ──
const ChartPie: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chart = scene.chartData;
  const titleOpacity = useFadeIn(0);
  if (!chart) return <FullscreenText scene={scene} />;
  const total = chart.data.reduce((s, d) => s + d.value, 0);
  const sweepProgress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cx = 300;
  const cy = 300;
  const r = 220;
  let accumulated = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={8} />
      <div
        style={{
          position: "absolute",
          top: "6%",
          width: "100%",
          textAlign: "center",
          fontSize: 48,
          fontWeight: 700,
          color: scene.textColor,
          fontFamily: "sans-serif",
          opacity: titleOpacity,
        }}
      >
        {scene.headline || chart.title}
      </div>
      <div style={{ position: "absolute", top: "18%", left: "10%", width: 600, height: 600 }}>
        <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%" }}>
          {chart.data.map((d, i) => {
            const fraction = d.value / total;
            const startAngle = accumulated * 360 * sweepProgress;
            accumulated += fraction;
            const endAngle = accumulated * 360 * sweepProgress;
            const color = d.color || scene.accentColor;
            const startRad = ((startAngle - 90) * Math.PI) / 180;
            const endRad = ((endAngle - 90) * Math.PI) / 180;
            const largeArc = endAngle - startAngle > 180 ? 1 : 0;
            const x1 = cx + r * Math.cos(startRad);
            const y1 = cy + r * Math.sin(startRad);
            const x2 = cx + r * Math.cos(endRad);
            const y2 = cy + r * Math.sin(endRad);
            const sliceOpacity = interpolate(
              frame,
              [i * 15, i * 15 + 20],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <path
                key={i}
                d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                fill={color}
                stroke={scene.bgColor}
                strokeWidth={3}
                opacity={sliceOpacity}
              />
            );
          })}
        </svg>
      </div>
      <div style={{ position: "absolute", top: "30%", right: "8%", display: "flex", flexDirection: "column", gap: 24 }}>
        {chart.data.map((d, i) => {
          const s = spring({ frame: frame - 30 - i * 10, fps, config: { damping: 15 } });
          const x = interpolate(s, [0, 1], [60, 0]);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                opacity: interpolate(s, [0, 1], [0, 1]),
                transform: `translateX(${x}px)`,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: d.color || scene.accentColor,
                }}
              />
              <span style={{ fontSize: 32, color: "#fff", fontFamily: "sans-serif", fontWeight: 700 }}>
                {d.label}: {d.value}%
              </span>
            </div>
          );
        })}
      </div>
      <GlowLine color={scene.accentColor} top="88%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 6) 인용문 ──
const QuoteHighlight: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 15 } });
  const quoteWidth = interpolate(frame, [0, 20], [0, 100], { extrapolateRight: "clamp" });
  const bodyOpacity = useFadeIn(10);
  const bodyY = useSlideUp(10);
  const sourceOpacity = useFadeIn(25);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={8} />
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          fontSize: 200,
          color: `${scene.accentColor}33`,
          fontFamily: "serif",
          transform: `scale(${s})`,
        }}
      >
        "
      </div>
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "12%",
          right: "12%",
          fontSize: 52,
          fontWeight: 700,
          color: scene.textColor,
          fontFamily: "sans-serif",
          lineHeight: 1.6,
          whiteSpace: "pre-line",
          opacity: bodyOpacity,
          transform: `translateY(${bodyY}px)`,
        }}
      >
        {scene.body}
      </div>
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: "12%",
          width: `${quoteWidth * 0.4}%`,
          height: 6,
          backgroundColor: scene.accentColor,
          borderRadius: 3,
          boxShadow: `0 0 15px ${scene.accentColor}`,
        }}
      />
      {scene.caption && (
        <div
          style={{
            position: "absolute",
            top: "76%",
            left: "12%",
            fontSize: 32,
            color: `${scene.accentColor}cc`,
            fontFamily: "sans-serif",
            opacity: sourceOpacity,
          }}
        >
          — {scene.caption}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ── 7) 키워드 폭발 ──
const KeywordExplosion: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const keywords = scene.keywords || [];
  const headlineOpacity = useFadeIn(0);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={20} />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "8%",
            width: "100%",
            textAlign: "center",
            fontSize: 56,
            fontWeight: 900,
            color: scene.accentColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
            textShadow: `0 0 30px ${scene.accentColor}66`,
          }}
        >
          {scene.headline}
        </div>
      )}
      {keywords.map((kw, i) => {
        const angle = (i / Math.max(keywords.length, 1)) * Math.PI * 2;
        const radius = 250 + (i % 3) * 50;
        const s = spring({ frame: frame - i * 6, fps, config: { damping: 8, stiffness: 150 } });
        const x = Math.cos(angle) * radius * interpolate(s, [0, 1], [0, 1]);
        const y = Math.sin(angle) * radius * interpolate(s, [0, 1], [0, 1]);
        const size = 36 + (i % 3) * 12;
        const rotation = interpolate(
          frame,
          [i * 6, i * 6 + 30],
          [-15, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotation}deg) scale(${s})`,
              fontSize: size,
              fontWeight: 900,
              color: i % 2 === 0 ? scene.accentColor : scene.textColor,
              fontFamily: "sans-serif",
              textShadow: `0 0 15px ${scene.accentColor}44`,
              backgroundColor: `${scene.accentColor}15`,
              padding: "8px 20px",
              borderRadius: 12,
              border: `2px solid ${scene.accentColor}33`,
              whiteSpace: "nowrap",
            }}
          >
            {kw}
          </div>
        );
      })}
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 8) 좌우 비교 ──
const ComparisonSplit: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leftSpring = spring({ frame, fps, config: { damping: 15 } });
  const rightSpring = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  const leftX = interpolate(leftSpring, [0, 1], [-960, 0]);
  const rightX = interpolate(rightSpring, [0, 1], [960, 0]);
  const headlineOpacity = useFadeIn(0);
  const dividerOpacity = useFadeIn(20);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "6%",
            width: "100%",
            textAlign: "center",
            fontSize: 48,
            fontWeight: 700,
            color: scene.textColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
            zIndex: 10,
          }}
        >
          {scene.headline}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50%",
          maxWidth: "45%",
          height: "100%",
          transform: `translateX(${leftX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          padding: "0 30px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 36, color: "#ffffffaa", fontFamily: "sans-serif", textAlign: "center" }}>
          {scene.comparisonLeft?.label}
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#4ECDC4",
            fontFamily: "sans-serif",
            textShadow: "0 0 30px rgba(78,205,196,0.4)",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {scene.comparisonLeft?.value}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "15%",
          bottom: "15%",
          width: 4,
          backgroundColor: scene.accentColor,
          transform: "translateX(-50%)",
          boxShadow: `0 0 20px ${scene.accentColor}`,
          opacity: dividerOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: scene.accentColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 28,
            fontWeight: 900,
            color: scene.bgColor,
            fontFamily: "sans-serif",
          }}
        >
          VS
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50%",
          maxWidth: "45%",
          height: "100%",
          transform: `translateX(${rightX}px)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          padding: "0 30px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ fontSize: 36, color: "#ffffffaa", fontFamily: "sans-serif", textAlign: "center" }}>
          {scene.comparisonRight?.label}
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#E74C3C",
            fontFamily: "sans-serif",
            textShadow: "0 0 30px rgba(231,76,60,0.4)",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {scene.comparisonRight?.value}
        </div>
      </div>
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 9) 리스트 순차 등장 ──
const ListReveal: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = scene.listItems || [];
  const headlineOpacity = useFadeIn(0);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={8} />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "8%",
            width: "100%",
            textAlign: "center",
            fontSize: 52,
            fontWeight: 700,
            color: scene.accentColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
            textShadow: `0 0 20px ${scene.accentColor}44`,
          }}
        >
          {scene.headline}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "12%",
          right: "12%",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {items.map((item, i) => {
          const s = spring({
            frame: frame - 15 - i * 15,
            fps,
            config: { damping: 15, stiffness: 120 },
          });
          const x = interpolate(s, [0, 1], [200, 0]);
          const itemOpacity = interpolate(s, [0, 1], [0, 1]);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity: itemOpacity,
                transform: `translateX(${x}px)`,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: scene.accentColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 28,
                  fontWeight: 900,
                  color: scene.bgColor,
                  fontFamily: "sans-serif",
                  boxShadow: `0 0 20px ${scene.accentColor}44`,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{
                  fontSize: 40,
                  fontWeight: 600,
                  color: scene.textColor,
                  fontFamily: "sans-serif",
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
      <GlowLine color={scene.accentColor} top="88%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 10) 전체화면 텍스트 ──
const FullscreenText: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, stiffness: 150 } });
  const bgPulse = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const headlineOpacity = useFadeIn(0);
  const headlineY = useSlideUp(0);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={15} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${scene.accentColor}15, transparent)`,
          transform: `translate(-50%, -50%) scale(${bgPulse})`,
        }}
      />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "28%",
            width: "100%",
            textAlign: "center",
            fontSize: 56,
            fontWeight: 700,
            color: `${scene.accentColor}cc`,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
            transform: `translateY(${headlineY}px)`,
          }}
        >
          {scene.headline}
        </div>
      )}
      {scene.body && (
        <div
          style={{
            position: "absolute",
            top: "42%",
            width: "100%",
            textAlign: "center",
            fontSize: 72,
            fontWeight: 900,
            color: scene.textColor,
            fontFamily: "sans-serif",
            whiteSpace: "pre-line",
            lineHeight: 1.5,
            transform: `scale(${s})`,
            textShadow: `0 4px 40px ${scene.accentColor}44`,
          }}
        >
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor} top="85%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 11) 속보 배너 ──
const BreakingBanner: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flashOpacity =
    frame < 10
      ? interpolate(frame % 4, [0, 2, 4], [1, 0, 1], { extrapolateRight: "clamp" })
      : 0;
  const bannerS = spring({ frame, fps, config: { damping: 12 } });
  const bannerY = interpolate(bannerS, [0, 1], [-200, 0]);
  const bodyS = spring({ frame: frame - 20, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundColor: scene.accentColor, opacity: flashOpacity }} />
      <ParticleBg color={scene.accentColor} count={20} />
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: scene.accentColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${bannerY}px)`,
          boxShadow: `0 4px 30px ${scene.accentColor}88`,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "sans-serif",
            letterSpacing: 20,
          }}
        >
          {scene.headline || "속보"}
        </span>
      </div>
      {scene.body && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            width: "100%",
            textAlign: "center",
            fontSize: 72,
            fontWeight: 900,
            color: scene.textColor,
            fontFamily: "sans-serif",
            transform: `scale(${bodyS})`,
            whiteSpace: "pre-line",
            lineHeight: 1.4,
            textShadow: `0 0 40px ${scene.accentColor}44`,
          }}
        >
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor} top="30%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 12) 데이터 카드 스택 ──
const DataCardStack: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const numbers = scene.numbers || [];
  const headlineOpacity = useFadeIn(0);
  const bodyOpacity = useFadeIn(40);
  const bodyY = useSlideUp(40);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={10} />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "8%",
            width: "100%",
            textAlign: "center",
            fontSize: 52,
            fontWeight: 700,
            color: scene.accentColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
          }}
        >
          {scene.headline}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 40,
        }}
      >
        {numbers.map((num, i) => {
          const s = spring({
            frame: frame - 10 - i * 12,
            fps,
            config: { damping: 12, stiffness: 120 },
          });
          const y = interpolate(s, [0, 1], [100, 0]);
          const countProgress = interpolate(
            frame,
            [10 + i * 12, 40 + i * 12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const displayVal =
            num.value % 1 === 0
              ? (num.value * countProgress).toFixed(0)
              : (num.value * countProgress).toFixed(1);
          const cardOpacity = interpolate(s, [0, 1], [0, 1]);
          return (
            <div
              key={i}
              style={{
                width: 280,
                padding: "40px 24px",
                backgroundColor: `${num.color}15`,
                borderRadius: 20,
                border: `2px solid ${num.color}44`,
                textAlign: "center",
                transform: `translateY(${y}px)`,
                opacity: cardOpacity,
                boxShadow: `0 8px 30px ${num.color}22`,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  color: "#ffffffaa",
                  fontFamily: "sans-serif",
                  marginBottom: 12,
                }}
              >
                {num.label}
              </div>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: num.color,
                  fontFamily: "sans-serif",
                  textShadow: `0 0 20px ${num.color}44`,
                }}
              >
                {displayVal}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: `${num.color}cc`,
                  fontFamily: "sans-serif",
                  marginTop: 8,
                }}
              >
                {num.unit}
              </div>
            </div>
          );
        })}
      </div>
      {scene.body && (
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            width: "100%",
            textAlign: "center",
            fontSize: 44,
            fontWeight: 700,
            color: scene.textColor,
            fontFamily: "sans-serif",
            whiteSpace: "pre-line",
            lineHeight: 1.5,
            opacity: bodyOpacity,
            transform: `translateY(${bodyY}px)`,
          }}
        >
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor} top="88%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 13) 전환 스우시 ──
const TransitionSwoosh: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [0, scene.durationFrames],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const swooshX = interpolate(progress, [0, 0.5, 1], [-2000, 0, 2000]);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "150%",
          height: "100%",
          backgroundColor: scene.accentColor,
          transform: `translateX(${swooshX}px) skewX(-15deg)`,
          opacity: 0.9,
        }}
      />
    </AbsoluteFill>
  );
};

// ── 14) 구독 CTA ──
const CtaSubscribe: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bellSwing = Math.sin(frame * 0.3) * 15;
  const s = spring({ frame, fps, config: { damping: 10 } });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.05;
  const headlineOpacity = useFadeIn(5);
  const bodyOpacity = useFadeIn(20);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color="#ffd600" count={25} />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: `translate(-50%, 0) scale(${s * pulse})`,
        }}
      >
        <div
          style={{
            backgroundColor: "#ff0000",
            padding: "24px 80px",
            borderRadius: 16,
            fontSize: 52,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "sans-serif",
            boxShadow: "0 8px 40px rgba(255,0,0,0.4)",
            textAlign: "center",
          }}
        >
          구독
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "50%",
          transform: `translate(-50%, 0) rotate(${bellSwing}deg)`,
          fontSize: 100,
        }}
      >
        🔔
      </div>
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            width: "100%",
            textAlign: "center",
            fontSize: 56,
            fontWeight: 900,
            color: scene.textColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
          }}
        >
          {scene.headline}
        </div>
      )}
      {scene.body && (
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            width: "100%",
            textAlign: "center",
            fontSize: 40,
            color: "#ffffffcc",
            fontFamily: "sans-serif",
            whiteSpace: "pre-line",
            lineHeight: 1.5,
            opacity: bodyOpacity,
          }}
        >
          {scene.body}
        </div>
      )}
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 15) 이모지 비 ──
const EmojiRain: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const emojis = scene.keywords || ["🏠", "📈", "💰"];
  const headlineOpacity = useFadeIn(5);
  const bodyOpacity = useFadeIn(15);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      {Array.from({ length: 30 }).map((_, i) => {
        const emoji = emojis[i % emojis.length];
        const x = (i * 137.508) % 100;
        const speed = 1.5 + (i % 5) * 0.8;
        const y = -10 + (frame * speed + i * 40) % 130;
        const rotation = frame * (1 + (i % 3));
        const size = 40 + (i % 4) * 15;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontSize: size,
              transform: `rotate(${rotation}deg)`,
              opacity: 0.7,
            }}
          >
            {emoji}
          </div>
        );
      })}
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "30%",
            width: "100%",
            textAlign: "center",
            fontSize: 64,
            fontWeight: 900,
            color: scene.accentColor,
            fontFamily: "sans-serif",
            zIndex: 10,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            opacity: headlineOpacity,
          }}
        >
          {scene.headline}
        </div>
      )}
      {scene.body && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            width: "100%",
            textAlign: "center",
            fontSize: 52,
            fontWeight: 700,
            color: scene.textColor,
            fontFamily: "sans-serif",
            zIndex: 10,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
            opacity: bodyOpacity,
          }}
        >
          {scene.body}
        </div>
      )}
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 16) 타임라인 진행 ──
const TimelineProgress: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = scene.listItems || [];
  const totalSteps = items.length;
  const headlineOpacity = useFadeIn(0);
  const bodyOpacity = useFadeIn(5);

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor, overflow: "hidden" }}>
      <ParticleBg color={scene.accentColor} count={8} />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "6%",
            width: "100%",
            textAlign: "center",
            fontSize: 48,
            fontWeight: 700,
            color: scene.accentColor,
            fontFamily: "sans-serif",
            opacity: headlineOpacity,
          }}
        >
          {scene.headline}
        </div>
      )}
      {scene.body && (
        <div
          style={{
            position: "absolute",
            top: "14%",
            width: "100%",
            textAlign: "center",
            fontSize: 36,
            color: "#ffffffaa",
            fontFamily: "sans-serif",
            opacity: bodyOpacity,
          }}
        >
          {scene.body}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          top: "26%",
          left: "8%",
          right: "8%",
          bottom: "20%",
        }}
      >
        {items.map((item, i) => {
          const delay = 15 + i * 20;
          const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
          const isActive = frame >= delay;
          const lineProgress = interpolate(
            frame,
            [delay, delay + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const itemOpacity = interpolate(s, [0, 1], [0, 1]);
          const itemX = interpolate(s, [0, 1], [40, 0]);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 8,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 27,
                  top: 56,
                  width: 4,
                  height: i < totalSteps - 1 ? `${lineProgress * 50}px` : 0,
                  backgroundColor: scene.accentColor,
                  opacity: 0.3,
                }}
              />
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: isActive ? scene.accentColor : `${scene.accentColor}33`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 24,
                  fontWeight: 900,
                  color: isActive ? scene.bgColor : scene.accentColor,
                  fontFamily: "sans-serif",
                  transform: `scale(${s})`,
                  marginRight: 20,
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 20px ${scene.accentColor}44` : "none",
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 36,
                  color: scene.textColor,
                  fontFamily: "sans-serif",
                  paddingTop: 10,
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}
              >
                {item}
              </div>
            </div>
          );
        })}
      </div>
      <GlowLine color={scene.accentColor} top="90%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 17) 판정 스탬프 ──
const VerdictStamp: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampScale = spring({ frame: frame - 15, fps, config: { damping: 6, stiffness: 300 } });
  const stampRotation = interpolate(stampScale, [0, 1], [-25, -5]);
  const shakeX = frame >= 15 && frame <= 25 ? Math.sin(frame * 2) * 8 : 0;
  const shakeY = frame >= 15 && frame <= 25 ? Math.cos(frame * 3) * 5 : 0;
  const bodyOpacity = useFadeIn(30);
  const bodyY = useSlideUp(30);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.bgColor,
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <ParticleBg color={scene.accentColor} count={15} />
      {scene.headline && (
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${stampScale}) rotate(${stampRotation}deg)`,
            fontSize: 80,
            fontWeight: 900,
            color: scene.accentColor,
            fontFamily: "sans-serif",
            border: `6px solid ${scene.accentColor}`,
            padding: "20px 60px",
            borderRadius: 16,
            textShadow: `0 0 40px ${scene.accentColor}66`,
            boxShadow: `0 0 40px ${scene.accentColor}33`,
          }}
        >
          {scene.headline}
        </div>
      )}
      {scene.body && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            width: "100%",
            textAlign: "center",
            fontSize: 56,
            fontWeight: 700,
            color: scene.textColor,
            fontFamily: "sans-serif",
            whiteSpace: "pre-line",
            lineHeight: 1.5,
            opacity: bodyOpacity,
            transform: `translateY(${bodyY}px)`,
          }}
        >
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor} top="85%" />
      <CaptionOverlay text={scene.caption} />
    </AbsoluteFill>
  );
};

// ── 18~20) 나머지 ──
const RecapScroll: React.FC<{ scene: SubScene }> = ({ scene }) => (
  <ListReveal scene={scene} />
);
const ImageKenburns: React.FC<{ scene: SubScene }> = ({ scene }) => (
  <FullscreenText scene={scene} />
);
const MapHighlight: React.FC<{ scene: SubScene }> = ({ scene }) => (
  <DataCardStack scene={scene} />
);

// ── 21) 게이지 미터 ──
const GaugeMeter: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const value = scene.numbers?.[0]?.value ? parseFloat(String(scene.numbers[0].value).replace(/[^0-9.]/g, "")) : 72;
  const maxVal = 100;
  const ratio = Math.min(value / maxVal, 1);
  const angle = ratio * 180 * entrance;
  const colors = ["#ff4757", "#ffa502", "#2ed573", "#1e90ff"];
  const colorIdx = ratio < 0.25 ? 0 : ratio < 0.5 ? 1 : ratio < 0.75 ? 2 : 3;

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor || "#0a0a1a", justifyContent: "center", alignItems: "center" }}>
      <ParticleBg color={scene.accentColor || "#6c5ce7"} count={10} />
      {scene.headline && (
        <div style={{ position: "absolute", top: "8%", width: "100%", textAlign: "center", fontSize: 48, fontWeight: 800, color: scene.accentColor || "#ffd600", fontFamily: "sans-serif" }}>
          {scene.headline}
        </div>
      )}
      <svg width="600" height="340" viewBox="0 0 600 340" style={{ marginTop: 30 }}>
        <path d="M 60 300 A 240 240 0 0 1 540 300" fill="none" stroke="#333" strokeWidth="40" strokeLinecap="round" />
        <path
          d="M 60 300 A 240 240 0 0 1 540 300"
          fill="none"
          stroke={colors[colorIdx]}
          strokeWidth="40"
          strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 754} 754`}
          style={{ filter: `drop-shadow(0 0 12px ${colors[colorIdx]})` }}
        />
        <text x="300" y="260" textAnchor="middle" fontSize="90" fontWeight="900" fill="#fff" fontFamily="sans-serif">
          {Math.round(value * entrance)}
        </text>
        <text x="300" y="310" textAnchor="middle" fontSize="32" fill="#aaa" fontFamily="sans-serif">
          {scene.numbers?.[0]?.label || "지표"}
        </text>
        {[0, 25, 50, 75, 100].map((tick) => {
          const a = (tick / 100) * Math.PI;
          const x = 300 - 240 * Math.cos(a);
          const y = 300 - 240 * Math.sin(a);
          return <text key={tick} x={x} y={y - 30} textAnchor="middle" fontSize="22" fill="#888" fontFamily="sans-serif">{tick}</text>;
        })}
      </svg>
      {scene.body && (
        <div style={{ position: "absolute", bottom: "8%", width: "80%", textAlign: "center", fontSize: 36, color: "#ccc", fontFamily: "sans-serif", lineHeight: 1.5 }}>
          {scene.body}
        </div>
      )}
      <GlowLine color={colors[colorIdx]} top="95%" />
    </AbsoluteFill>
  );
};

// ── 22) 도넛 차트 ──
const DonutChart: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 90 } });
  const data = (scene.chartData as { data?: { label: string; value: number }[] })?.data || scene.chartData as { label: string; value: number }[] || [
    { label: "A", value: 40 }, { label: "B", value: 30 },
    { label: "C", value: 20 }, { label: "D", value: 10 },
  ];
  const arr = Array.isArray(data) ? data : (data as { data?: { label: string; value: number }[] })?.data || [];
  const total = arr.reduce((s: number, d: { value?: number }) => s + (d.value || 0), 0) || 100;
  const sliceColors = ["#6c5ce7", "#00cec9", "#fdcb6e", "#e17055", "#0984e3", "#55efc4", "#ff6b6b", "#a29bfe"];
  const cx = 300, cy = 300, r = 200, inner = 120;

  let cumAngle = -90;
  const slices = arr.map((d: { label?: string; value?: number }, i: number) => {
    const val = d.value || 0;
    const sliceAngle = (val / total) * 360 * entrance;
    const startAngle = cumAngle;
    cumAngle += sliceAngle;
    const endAngle = cumAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const ix1 = cx + inner * Math.cos(endRad);
    const iy1 = cy + inner * Math.sin(endRad);
    const ix2 = cx + inner * Math.cos(startRad);
    const iy2 = cy + inner * Math.sin(startRad);
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${inner} ${inner} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    return { path, color: sliceColors[i % sliceColors.length], label: d.label || `항목${i + 1}`, pct: total > 0 ? Math.round((val / total) * 100) : 0 };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor || "#0a0a1a", justifyContent: "center", alignItems: "center" }}>
      <ParticleBg color={scene.accentColor || "#6c5ce7"} count={8} />
      {scene.headline && (
        <div style={{ position: "absolute", top: "6%", width: "100%", textAlign: "center", fontSize: 48, fontWeight: 800, color: scene.accentColor || "#ffd600", fontFamily: "sans-serif" }}>
          {scene.headline}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
        <svg width="600" height="600" viewBox="0 0 600 600">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} style={{ filter: `drop-shadow(0 0 8px ${s.color}66)` }} />
          ))}
          <text x={cx} y={cy - 10} textAnchor="middle" fontSize="52" fontWeight="900" fill="#fff" fontFamily="sans-serif">
            {total}
          </text>
          <text x={cx} y={cy + 35} textAnchor="middle" fontSize="26" fill="#aaa" fontFamily="sans-serif">합계</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {slices.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(frame - i * 5, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: s.color }} />
              <span style={{ fontSize: 30, color: "#fff", fontFamily: "sans-serif", fontWeight: 600 }}>{s.label} {s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <GlowLine color={scene.accentColor || "#6c5ce7"} top="95%" />
    </AbsoluteFill>
  );
};

// ── 23) 큰 숫자 카운터 ──
const NumberCounter: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 25, stiffness: 60 } });
  const numbers = scene.numbers || [{ label: "핵심 수치", value: "1234", unit: "" }];

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor || "#0a0a1a", justifyContent: "center", alignItems: "center" }}>
      <ParticleBg color={scene.accentColor || "#6c5ce7"} count={12} />
      {scene.headline && (
        <div style={{ position: "absolute", top: "8%", width: "100%", textAlign: "center", fontSize: 46, fontWeight: 800, color: scene.accentColor || "#ffd600", fontFamily: "sans-serif" }}>
          {scene.headline}
        </div>
      )}
      <div style={{ display: "flex", gap: 80, flexWrap: "wrap", justifyContent: "center", padding: "0 60px" }}>
        {numbers.map((n: { label?: string; value?: number | string; unit?: string; suffix?: string }, i: number) => {
          const delay = i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 100 } });
          const numVal = parseFloat(String(n.value).replace(/[^0-9.]/g, "")) || 0;
          const displayNum = Math.round(numVal * s);
          const scaleUp = interpolate(s, [0, 1], [0.5, 1]);
          return (
            <div key={i} style={{ textAlign: "center", transform: `scale(${scaleUp})` }}>
              <div style={{
                fontSize: 120, fontWeight: 900, color: "#fff", fontFamily: "sans-serif",
                textShadow: `0 0 40px ${(scene.accentColor || "#6c5ce7")}88`,
                lineHeight: 1.1,
              }}>
                {displayNum.toLocaleString()}{n.suffix || n.unit || ""}
              </div>
              <div style={{ fontSize: 32, color: scene.accentColor || "#aaa", fontFamily: "sans-serif", marginTop: 12, fontWeight: 600 }}>
                {n.label}
              </div>
            </div>
          );
        })}
      </div>
      {scene.body && (
        <div style={{ position: "absolute", bottom: "10%", width: "80%", textAlign: "center", fontSize: 34, color: "#ccc", fontFamily: "sans-serif", lineHeight: 1.5 }}>
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor || "#6c5ce7"} top="95%" />
    </AbsoluteFill>
  );
};

// ── 24) 다중 프로그레스 바 ──
const ProgressBarMulti: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const items = (scene.chartData as { data?: { label: string; value: number }[] })?.data || (scene as { items?: { label: string; value: number }[] }).items || [
    { label: "경제 성장률", value: 72 }, { label: "물가 상승률", value: 45 },
    { label: "실업률", value: 28 }, { label: "소비자 신뢰지수", value: 85 },
    { label: "수출 증가율", value: 60 },
  ];
  const barColors = ["#6c5ce7", "#00cec9", "#fdcb6e", "#e17055", "#0984e3", "#55efc4", "#ff6b6b"];

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor || "#0a0a1a", justifyContent: "center", alignItems: "center" }}>
      <ParticleBg color={scene.accentColor || "#6c5ce7"} count={8} />
      {scene.headline && (
        <div style={{ position: "absolute", top: "6%", width: "100%", textAlign: "center", fontSize: 48, fontWeight: 800, color: scene.accentColor || "#ffd600", fontFamily: "sans-serif" }}>
          {scene.headline}
        </div>
      )}
      <div style={{ width: "75%", display: "flex", flexDirection: "column", gap: 28 }}>
        {items.map((item: { label?: string; value?: number }, i: number) => {
          const delay = i * 6;
          const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100 } });
          const barWidth = Math.min(item.value || 0, 100) * s;
          const color = barColors[i % barColors.length];
          const fadeIn = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ opacity: fadeIn }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "sans-serif" }}>{item.label}</span>
                <span style={{ fontSize: 30, fontWeight: 700, color, fontFamily: "sans-serif" }}>{Math.round((item.value || 0) * s)}%</span>
              </div>
              <div style={{ width: "100%", height: 32, backgroundColor: "#222", borderRadius: 16, overflow: "hidden" }}>
                <div style={{
                  width: `${barWidth}%`, height: "100%", borderRadius: 16,
                  background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                  boxShadow: `0 0 20px ${color}66`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
      <GlowLine color={scene.accentColor || "#6c5ce7"} top="95%" />
    </AbsoluteFill>
  );
};

// ── 25) 피라미드 차트 ──
const PyramidChart: React.FC<{ scene: SubScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const levels = (scene as { items?: string[] }).items || (scene.chartData as { data?: { label: string }[] })?.data?.map((d: { label: string }) => d.label) || ["최상위", "상위", "중간", "하위", "기반"];
  const pyramidColors = ["#e74c3c", "#e67e22", "#f1c40f", "#2ecc71", "#3498db"];

  return (
    <AbsoluteFill style={{ backgroundColor: scene.bgColor || "#0a0a1a", justifyContent: "center", alignItems: "center" }}>
      <ParticleBg color={scene.accentColor || "#6c5ce7"} count={8} />
      {scene.headline && (
        <div style={{ position: "absolute", top: "5%", width: "100%", textAlign: "center", fontSize: 48, fontWeight: 800, color: scene.accentColor || "#ffd600", fontFamily: "sans-serif" }}>
          {scene.headline}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 20 }}>
        {levels.map((level: string | { label?: string }, i: number) => {
          const delay = i * 8;
          const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100 } });
          const widthPct = 20 + (i / (levels.length - 1 || 1)) * 60;
          const color = pyramidColors[i % pyramidColors.length];
          const label = typeof level === "string" ? level : (level as { label?: string }).label || `레벨${i + 1}`;
          return (
            <div key={i} style={{
              width: `${widthPct * s}%`, minWidth: 100,
              padding: "22px 0", textAlign: "center",
              backgroundColor: color,
              fontSize: 30, fontWeight: 700, color: "#fff", fontFamily: "sans-serif",
              borderRadius: 8,
              opacity: interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
              boxShadow: `0 4px 20px ${color}66`,
              clipPath: i === 0 ? "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" : undefined,
            }}>
              {label}
            </div>
          );
        })}
      </div>
      {scene.body && (
        <div style={{ position: "absolute", bottom: "6%", width: "80%", textAlign: "center", fontSize: 32, color: "#ccc", fontFamily: "sans-serif", lineHeight: 1.5 }}>
          {scene.body}
        </div>
      )}
      <GlowLine color={scene.accentColor || "#6c5ce7"} top="95%" />
    </AbsoluteFill>
  );
};
