// server.ts
// ============================================================
// 원클릭 자동화 서버 — 주제 입력만으로 영상 완성
// ============================================================

import express from "express";
import fs from "fs";
import path from "path";

const __dirname = process.cwd();

// ── 서버 시작 시 BGM 파일 포맷 확인 및 수정 ──
function ensureBgmFormat() {
  const bgmDir = path.join(__dirname, "public", "bgm");
  if (!fs.existsSync(bgmDir)) return;

  const files = fs.readdirSync(bgmDir).filter((f) => f.endsWith(".mp3"));
  for (const file of files) {
    const filePath = path.join(bgmDir, file);
    const stat = fs.statSync(filePath);
    if (stat.size < 50000) continue;

    const buf = Buffer.alloc(4);
    const fd = fs.openSync(filePath, "r");
    fs.readSync(fd, buf, 0, 4, 0);
    fs.closeSync(fd);

    const header = buf.toString("ascii", 0, 4);
    if (header === "RIFF") {
      const wavPath = filePath.replace(".mp3", ".wav");
      if (!fs.existsSync(wavPath)) {
        fs.copyFileSync(filePath, wavPath);
      }
      console.log(
        `⚠️ ${file}은 실제 WAV 파일입니다. ${file.replace(".mp3", ".wav")}로도 저장했습니다.`
      );
    }
  }
}
ensureBgmFormat();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use("/web", express.static(path.join(__dirname, "web")));
app.use("/public", express.static(path.join(__dirname, "public")));

const PORT = 3001;

// ── 설정 관리 (.env 대신 settings.json 사용) ──
const SETTINGS_FILE = path.join(__dirname, "settings.json");

interface AppSettings {
  elevenLabsKey: string;
  geminiKey: string;
  selectedVoiceId: string;
  selectedVoiceName: string;
  defaultDuration: number;
  defaultTone: string;
  defaultCategory: string;
}

function loadSettings(): AppSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
    }
  } catch {}
  return {
    elevenLabsKey: "",
    geminiKey: "",
    selectedVoiceId: "pNInz6obpgDQGcFmaJgB",
    selectedVoiceName: "Adam",
    defaultDuration: 10,
    defaultTone: "youtuber",
    defaultCategory: "economy",
  };
}

function saveSettings(settings: AppSettings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  // .env도 동기화
  const envPath = path.join(__dirname, ".env");
  const envContent = `ELEVENLABS_API_KEY=${settings.elevenLabsKey}\nGEMINI_API_KEY=${settings.geminiKey}\n`;
  fs.writeFileSync(envPath, envContent);
}

// ── 진행 상태 (SSE용) ──
interface ProgressState {
  status: "idle" | "running" | "complete" | "error";
  currentStep: string;
  currentStepLabel: string;
  progress: number;
  steps: {
    id: string;
    label: string;
    status: "pending" | "running" | "done" | "error";
    detail: string;
  }[];
  error?: string;
  resultVideoUrl?: string;
}

let progressState: ProgressState = {
  status: "idle",
  currentStep: "",
  currentStepLabel: "",
  progress: 0,
  steps: [],
};

let sseClients: express.Response[] = [];

function updateProgress(update: Partial<ProgressState>) {
  progressState = { ...progressState, ...update };
  const data = JSON.stringify(progressState);
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {}
  });
}

function setStepStatus(
  stepId: string,
  status: "running" | "done" | "error",
  detail = ""
) {
  progressState.steps = progressState.steps.map((s) =>
    s.id === stepId ? { ...s, status, detail } : s
  );
  if (status === "running") {
    progressState.currentStep = stepId;
    progressState.currentStepLabel =
      progressState.steps.find((s) => s.id === stepId)?.label || stepId;
  }
  updateProgress({});
}

// ═══════════════════════════════════════
// API 엔드포인트
// ═══════════════════════════════════════

app.get("/api/settings", (req, res) => {
  const settings = loadSettings();
  res.json({
    ...settings,
    elevenLabsKey: settings.elevenLabsKey
      ? settings.elevenLabsKey.slice(0, 8) + "..."
      : "",
    geminiKey: settings.geminiKey
      ? settings.geminiKey.slice(0, 8) + "..."
      : "",
    hasElevenLabsKey: !!settings.elevenLabsKey,
    hasGeminiKey: !!settings.geminiKey,
  });
});

app.post("/api/settings", (req, res) => {
  const current = loadSettings();
  const updates = req.body;

  const newSettings: AppSettings = {
    elevenLabsKey:
      updates.elevenLabsKey &&
      !String(updates.elevenLabsKey || "").includes("...")
        ? updates.elevenLabsKey
        : current.elevenLabsKey,
    geminiKey:
      updates.geminiKey && !String(updates.geminiKey || "").includes("...")
        ? updates.geminiKey
        : current.geminiKey,
    selectedVoiceId: updates.selectedVoiceId || current.selectedVoiceId,
    selectedVoiceName: updates.selectedVoiceName || current.selectedVoiceName,
    defaultDuration: updates.defaultDuration ?? current.defaultDuration,
    defaultTone: updates.defaultTone || current.defaultTone,
    defaultCategory: updates.defaultCategory || current.defaultCategory,
  };

  saveSettings(newSettings);
  res.json({ success: true, message: "설정이 저장되었습니다." });
});

app.post("/api/validate-keys", async (req, res) => {
  const settings = loadSettings();
  const results: Record<string, unknown> = {
    elevenlabs: false,
    gemini: false,
  };

  if (settings.elevenLabsKey) {
    try {
      const r = await fetch("https://api.elevenlabs.io/v1/user", {
        headers: { "xi-api-key": settings.elevenLabsKey },
      });
      results.elevenlabs = r.ok;
      if (r.ok) {
        const data = (await r.json()) as Record<string, unknown>;
        const sub = data.subscription as Record<string, unknown> | undefined;
        results.elevenLabsInfo = {
          name: sub?.tier,
          charsRemaining:
            (Number(sub?.character_count) || 0) -
            (Number(sub?.character_used) || 0) || 0,
        };
      }
    } catch {}
  }

  if (settings.geminiKey) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${settings.geminiKey}`
      );
      results.gemini = r.ok;
    } catch {}
  }

  res.json(results);
});

app.get("/api/progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  res.write(`data: ${JSON.stringify(progressState)}\n\n`);
  sseClients.push(res);
  req.on("close", () => {
    sseClients = sseClients.filter((c) => c !== res);
  });
});

// ═══════════════════════════════════════
// 🚀 원클릭 생성 — 전체 파이프라인
// ═══════════════════════════════════════
app.post("/api/generate", async (req, res) => {
  const { topic, category, duration, tone, bgmVolume } = req.body;
  const settings = loadSettings();

  if (!topic) {
    res.status(400).json({ error: "주제를 입력해주세요." });
    return;
  }

  if (!settings.elevenLabsKey) {
    res
      .status(400)
      .json({
        error: "ElevenLabs API 키를 설정에서 먼저 입력해주세요.",
      });
    return;
  }

  if (!settings.geminiKey) {
    res
      .status(400)
      .json({ error: "Gemini API 키를 설정에서 먼저 입력해주세요." });
    return;
  }

  res.json({
    success: true,
    message: "생성을 시작합니다. 진행 상태를 확인하세요.",
  });

  runPipeline(
    topic,
    category || settings.defaultCategory,
    duration ?? settings.defaultDuration,
    tone || settings.defaultTone,
    settings,
    typeof bgmVolume === "number" ? bgmVolume : parseFloat(bgmVolume) || 0.15
  ).catch((err: Error) => {
    updateProgress({ status: "error", error: err.message });
  });
});

// ════════════════════════════════════════════════════
// Gemini 대본 자동 보정 함수
// 누락된 필드를 채우고, 프레임 길이를 맞춤
// ════════════════════════════════════════════════════
function autoFixScript(script: any, targetTotalFrames: number): any {
  const BG_COLORS = ["#0a0a1a", "#0d1117", "#1a1a2e", "#16213e", "#0f3460", "#1a0a2e", "#533483"];
  const ACCENT_COLORS = ["#ff0033", "#ffd600", "#00e676", "#4ECDC4", "#E74C3C", "#ff6b35", "#6c5ce7", "#FF9800", "#2196F3"];

  const REQUIRED_SECTIONS = ["HOOK", "PROBLEM", "BACKGROUND", "ANALYSIS_1", "ANALYSIS_2", "ANALYSIS_3", "TWIST", "SUMMARY", "OUTRO"];
  const SECTION_LABELS: Record<string, string> = {
    HOOK: "🔥 후킹", PROBLEM: "😰 문제 제기", BACKGROUND: "📚 배경 설명",
    ANALYSIS_1: "🔍 분석 1", ANALYSIS_2: "🔍 분석 2", ANALYSIS_3: "🔍 분석 3",
    TWIST: "🔄 반전", SUMMARY: "📋 정리", OUTRO: "👋 아웃트로",
  };

  if (!script.sections || !Array.isArray(script.sections)) {
    script.sections = [];
  }

  const existingIds = script.sections.map((s: any) => s.id);
  for (const reqId of REQUIRED_SECTIONS) {
    if (!existingIds.includes(reqId)) {
      script.sections.push({
        id: reqId,
        label: SECTION_LABELS[reqId] || reqId,
        narrationText: `${SECTION_LABELS[reqId] || reqId} 섹션입니다.`,
        subScenes: [],
        audioFile: `voiceover/${reqId}.mp3`,
      });
    }
  }

  let colorIdx = 0;
  script.sections.forEach((section: any, sIdx: number) => {
    if (!section.label) section.label = SECTION_LABELS[section.id] || `섹션 ${sIdx + 1}`;
    if (!section.audioFile) section.audioFile = `voiceover/${section.id}.mp3`;
    if (!section.narrationText) section.narrationText = `${section.label} 내용입니다.`;
    if (!section.subScenes || !Array.isArray(section.subScenes)) section.subScenes = [];

    if (section.subScenes.length === 0) {
      section.subScenes = [
        { id: `${section.id}-1`, type: "title-impact", durationFrames: 180, headline: section.label, body: section.narrationText.slice(0, 40), bgColor: "#0a0a1a", accentColor: "#6c5ce7", textColor: "#ffffff", sfx: "impact", caption: "" },
        { id: `${section.id}-2`, type: "fullscreen-text", durationFrames: 240, headline: "핵심 내용", body: section.narrationText.slice(0, 60), bgColor: "#0d1117", accentColor: "#ffd600", textColor: "#ffffff", sfx: "none", caption: "" },
        { id: `${section.id}-3`, type: "fullscreen-text", durationFrames: 180, headline: "", body: section.narrationText.slice(40, 100), bgColor: "#1a1a2e", accentColor: "#4ECDC4", textColor: "#ffffff", sfx: "none", caption: "" },
      ];
    }

    section.subScenes.forEach((sub: any, subIdx: number) => {
      if (!sub.id) sub.id = `${section.id}-${subIdx + 1}`;
      if (!sub.type) sub.type = "fullscreen-text";
      if (!sub.durationFrames || sub.durationFrames < 30) sub.durationFrames = 180;
      if (!sub.bgColor) sub.bgColor = BG_COLORS[(colorIdx + subIdx) % BG_COLORS.length];
      if (!sub.textColor) sub.textColor = "#ffffff";
      if (!sub.accentColor) sub.accentColor = ACCENT_COLORS[(colorIdx + subIdx) % ACCENT_COLORS.length];
      if (!sub.caption) sub.caption = sub.headline || sub.body || "";
      if (!sub.headline) sub.headline = sub.title || sub.label || section.label || "";
      if (!sub.body) sub.body = sub.text || sub.content || sub.caption || "";

      if (sub.type === "stat-counter" && !sub.numbers) {
        sub.numbers = [{ label: "수치", value: 0, unit: "%", color: sub.accentColor }];
        if (sub.startValue !== undefined && sub.endValue !== undefined) {
          sub.numbers = [{ label: sub.label || "수치", value: sub.endValue, unit: sub.suffix || "", color: sub.accentColor }];
        }
        if (sub.data && Array.isArray(sub.data)) {
          sub.numbers = sub.data.map((d: any, i: number) => ({
            label: d.label || `항목${i + 1}`, value: d.value || 0, unit: d.unit || "", color: d.color || sub.accentColor,
          }));
        }
      }

      if ((sub.type === "chart-bar" || sub.type === "chart-line" || sub.type === "chart-pie") && !sub.chartData) {
        sub.chartData = {
          type: sub.type.replace("chart-", ""),
          title: sub.headline || "차트",
          data: [{ label: "A", value: 40 }, { label: "B", value: 70 }, { label: "C", value: 55 }],
        };
      }

      if (sub.type === "keyword-explosion" && !sub.keywords) {
        sub.keywords = ["키워드1", "키워드2", "키워드3"];
      }

      if (sub.type === "comparison-split") {
        if (!sub.comparisonLeft) sub.comparisonLeft = { label: "비교 A", value: "항목 A" };
        if (!sub.comparisonRight) sub.comparisonRight = { label: "비교 B", value: "항목 B" };
      }

      if (sub.type === "list-reveal" && !sub.listItems) {
        sub.listItems = ["항목 1", "항목 2", "항목 3"];
      }

      colorIdx++;
    });
  });

  // ════════════════════════════════════════
  // 핵심: 프레임 수 강제 보정
  // ════════════════════════════════════════

  let actualTotal = 0;
  for (const section of script.sections) {
    for (const ss of section.subScenes || []) {
      actualTotal += ss.durationFrames || 0;
    }
  }

  console.log(`📊 프레임 보정: 현재=${actualTotal}(${(actualTotal / 30 / 60).toFixed(1)}분) → 목표=${targetTotalFrames}(${(targetTotalFrames / 30 / 60).toFixed(1)}분)`);

  if (actualTotal > 0 && actualTotal !== targetTotalFrames) {
    const ratio = targetTotalFrames / actualTotal;
    console.log(`🔧 프레임 비율: ${ratio.toFixed(2)}x`);

    for (const section of script.sections) {
      for (const ss of section.subScenes || []) {
        ss.durationFrames = Math.max(90, Math.round((ss.durationFrames || 150) * ratio));
      }
    }
  }

  let afterTotal = 0;
  const allSS: any[] = [];
  for (const section of script.sections) {
    for (const ss of section.subScenes || []) {
      afterTotal += ss.durationFrames;
      allSS.push(ss);
    }
  }

  const remaining = targetTotalFrames - afterTotal;
  if (remaining !== 0 && allSS.length > 0) {
    const perSS = Math.floor(remaining / allSS.length);
    const leftover = remaining - perSS * allSS.length;
    for (const ss of allSS) {
      ss.durationFrames = Math.max(60, ss.durationFrames + perSS);
    }
    allSS[allSS.length - 1]!.durationFrames += leftover;
  }

  script.totalDurationFrames = 0;
  for (const section of script.sections) {
    for (const ss of section.subScenes || []) {
      script.totalDurationFrames += ss.durationFrames;
    }
  }

  console.log(`✅ 최종 프레임: ${script.totalDurationFrames} = ${(script.totalDurationFrames / 30 / 60).toFixed(1)}분`);

  return script;
}

// ════════════════════════════════════════════════════
// ElevenLabs alignment → 자막 변환
// ════════════════════════════════════════════════════
function buildSubtitlesFromAlignment(
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  },
  fullText: string
): { text: string; startMs: number; endMs: number }[] {
  const subs: { text: string; startMs: number; endMs: number }[] = [];
  const sentences = fullText.match(/[^.?!。]+[.?!。]?/g) || [fullText];

  let charIndex = 0;
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed || trimmed.length < 2) continue;

    const startCharIdx = charIndex;
    const endCharIdx = Math.min(
      charIndex + trimmed.length - 1,
      alignment.characters.length - 1
    );

    if (
      startCharIdx < alignment.character_start_times_seconds.length &&
      endCharIdx >= 0 &&
      endCharIdx < alignment.character_end_times_seconds.length
    ) {
      const startMs = Math.round(
        alignment.character_start_times_seconds[startCharIdx]! * 1000
      );
      const endMs = Math.round(
        alignment.character_end_times_seconds[endCharIdx]! * 1000
      );

      if (trimmed.length > 30) {
        const mid = Math.floor(trimmed.length / 2);
        const spaceIdx = trimmed.indexOf(" ", mid - 5);
        const commaIdx = trimmed.indexOf(",", mid - 5);
        const splitIdx =
          commaIdx > 0 ? commaIdx + 1 : spaceIdx > 0 ? spaceIdx : mid;
        const midTime = startMs + Math.round((endMs - startMs) * (splitIdx / trimmed.length));
        subs.push({
          text: trimmed.slice(0, splitIdx).trim(),
          startMs,
          endMs: midTime,
        });
        subs.push({
          text: trimmed.slice(splitIdx).trim(),
          startMs: midTime,
          endMs,
        });
      } else {
        subs.push({ text: trimmed, startMs, endMs });
      }
    }
    charIndex += sentence.length;
  }

  return subs.filter((s) => s.text.length > 0);
}

// ════════════════════════════════════════════════════
// 파일 크기 기반 자막 추정 (fallback)
// ════════════════════════════════════════════════════
function buildFallbackSubtitles(
  narrationText: string,
  mp3Path: string
): { text: string; startMs: number; endMs: number }[] {
  let totalMs = 10000;
  try {
    const stat = fs.statSync(mp3Path);
    totalMs = Math.round((stat.size / 16000) * 1000);
  } catch {}

  const sentences =
    narrationText.match(/[^.?!。,]+[.?!。,]?/g) || [narrationText];
  const totalChars = sentences.reduce((s, sent) => s + sent.trim().length, 0);
  const subs: { text: string; startMs: number; endMs: number }[] = [];

  let currentMs = 0;
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed || trimmed.length < 2) continue;

    const duration = Math.round((trimmed.length / totalChars) * totalMs);
    subs.push({
      text: trimmed,
      startMs: currentMs,
      endMs: currentMs + duration,
    });
    currentMs += duration;
  }

  return subs;
}

// ════════════════════════════════════════════════════
// 음성 MP3 길이에 맞게 서브씬 프레임 자동 조정
// ════════════════════════════════════════════════════
function adjustFramesToAudioLength(scriptData: any, voiceDir: string) {
  const FPS = 30;
  const BYTES_PER_SECOND = 16000;

  for (const section of scriptData.sections) {
    const mp3Path = path.join(voiceDir, `${section.id}.mp3`);
    if (!fs.existsSync(mp3Path)) continue;

    const stat = fs.statSync(mp3Path);
    const audioSeconds = stat.size / BYTES_PER_SECOND;
    const audioFrames = Math.round(audioSeconds * FPS);
    const targetFrames = audioFrames + FPS * 2;

    const currentTotal = section.subScenes.reduce(
      (sum: number, sub: any) => sum + sub.durationFrames,
      0
    );

    if (currentTotal > 0 && currentTotal !== targetFrames) {
      const ratio = targetFrames / currentTotal;
      section.subScenes.forEach((sub: any) => {
        sub.durationFrames = Math.max(
          60,
          Math.round(sub.durationFrames * ratio)
        );
      });
    }
  }

  scriptData.totalDurationFrames = scriptData.sections.reduce(
    (sum: number, sec: any) =>
      sum +
      sec.subScenes.reduce(
        (s: number, sub: any) => s + sub.durationFrames,
        0
      ),
    0
  );
}

async function runPipeline(
  topic: string,
  category: string,
  duration: number,
  tone: string,
  settings: AppSettings,
  bgmVolume: number = 0.15
) {
  updateProgress({
    status: "running",
    progress: 0,
    error: undefined,
    steps: [
      { id: "script", label: "📝 AI 대본 생성", status: "pending", detail: "" },
      { id: "voice", label: "🎙️ 음성 생성 (TTS)", status: "pending", detail: "" },
      { id: "sfx", label: "🔊 효과음 준비", status: "pending", detail: "" },
      { id: "assets", label: "🖼️ 에셋 준비", status: "pending", detail: "" },
      { id: "done", label: "✅ 완료", status: "pending", detail: "" },
    ],
  });

  try {
    setStepStatus("script", "running", "Gemini로 대본 작성 중...");
    updateProgress({ progress: 10 });

    const script = await generateScriptWithGemini(
      topic,
      category,
      duration,
      tone,
      settings.geminiKey,
      settings.selectedVoiceId
    );

    setStepStatus("script", "done", `${script.sections.length}개 섹션 생성`);
    updateProgress({ progress: 30 });

    setStepStatus("voice", "running", "음성 나래이션을 생성하고 있습니다...");
    updateProgress({ progress: 30 });

    if (settings.elevenLabsKey && script.sections?.length) {
      const voiceDir = path.join(__dirname, "public", "voiceover");
      if (!fs.existsSync(voiceDir)) fs.mkdirSync(voiceDir, { recursive: true });

      const oldFiles = fs.readdirSync(voiceDir);
      for (const f of oldFiles) {
        if (f.endsWith(".mp3") || f.endsWith("-subs.json")) {
          fs.unlinkSync(path.join(voiceDir, f));
        }
      }
      setStepStatus("voice", "running", "이전 음성 파일 정리 완료. 새 음성 생성 시작...");

      const vid = settings.selectedVoiceId || "pNInz6obpgDQGcFmaJgB";
      let voiceSuccess = 0;

      for (let i = 0; i < script.sections.length; i++) {
        const section = script.sections[i] as (typeof script.sections)[0];
        if (!section.narrationText || section.narrationText.length < 10) continue;

        const mp3Path = path.join(voiceDir, `${section.id}.mp3`);
        const subsPath = path.join(voiceDir, `${section.id}-subs.json`);

        try {
          setStepStatus(
            "voice",
            "running",
            `음성 생성 중: ${section.label || section.id} (${i + 1}/${script.sections.length})`
          );
          updateProgress({
            progress: 32 + Math.round((i / script.sections.length) * 20),
          });

          const ttsRes = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${vid}/with-timestamps`,
            {
              method: "POST",
              headers: {
                "xi-api-key": settings.elevenLabsKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: section.narrationText,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.75,
                  style: 0.3,
                  use_speaker_boost: true,
                },
              }),
            }
          );

          if (ttsRes.ok) {
            const ttsData = (await ttsRes.json()) as {
              audio_base64?: string;
              alignment?: {
                characters: string[];
                character_start_times_seconds: number[];
                character_end_times_seconds: number[];
              };
            };

            if (ttsData.audio_base64) {
              const audioBuffer = Buffer.from(ttsData.audio_base64, "base64");
              fs.writeFileSync(mp3Path, audioBuffer);
            }

            if (ttsData.alignment) {
              const subs = buildSubtitlesFromAlignment(
                ttsData.alignment,
                section.narrationText
              );
              fs.writeFileSync(subsPath, JSON.stringify(subs, null, 2), "utf-8");
            } else {
              const fallbackSubs = buildFallbackSubtitles(
                section.narrationText,
                mp3Path
              );
              fs.writeFileSync(
                subsPath,
                JSON.stringify(fallbackSubs, null, 2),
                "utf-8"
              );
            }
            voiceSuccess++;
          } else {
            const fallbackRes = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${vid}`,
              {
                method: "POST",
                headers: {
                  "xi-api-key": settings.elevenLabsKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  text: section.narrationText,
                  model_id: "eleven_multilingual_v2",
                  voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.3,
                    use_speaker_boost: true,
                  },
                }),
              }
            );

            if (fallbackRes.ok) {
              const buffer = Buffer.from(await fallbackRes.arrayBuffer());
              fs.writeFileSync(mp3Path, buffer);
              const fallbackSubs = buildFallbackSubtitles(
                section.narrationText,
                mp3Path
              );
              fs.writeFileSync(
                subsPath,
                JSON.stringify(fallbackSubs, null, 2),
                "utf-8"
              );
              voiceSuccess++;
            }
          }

          await sleep(1500);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`음성 생성 실패 (${section.id}):`, msg);
        }
      }

      const targetTotalFrames = duration * 60 * 30;

      // ── 나레이션 문장 기반 서브씬 자동 재생성 ──
      regenerateSubScenesFromNarration(script);

      // ════════════════════════════════════════════════════
      // 음성 기반 프레임 배분 (시각적 보충 시간 포함)
      // ════════════════════════════════════════════════════
      applyVoiceBasedFrameFix(script, targetTotalFrames);

      try {
        fs.writeFileSync(
          path.join(__dirname, "src", "generated-script.json"),
          JSON.stringify(script, null, 2),
          "utf-8"
        );
      } catch {}

      setStepStatus(
        "voice",
        "done",
        `음성 생성 완료! (${voiceSuccess}/${script.sections.length}개 섹션)`
      );
      updateProgress({ progress: 70 });
    } else {
      setStepStatus("voice", "done", "ElevenLabs 키 미설정 — 음성 단계 건너뜀");
      updateProgress({ progress: 70 });
    }

    // ── 3단계: 효과음 건너뜀 (사용하지 않음) ──
    setStepStatus("sfx", "done", "효과음 건너뜀");
    updateProgress({ progress: 75 });

    // ── 4단계: BGM 생성 (ElevenLabs Music API) + 에셋 준비 ──
    setStepStatus("assets", "running", "배경음악 생성 중...");
    updateProgress({ progress: 80 });

    const bgmDir = path.join(__dirname, "public", "bgm");
    if (!fs.existsSync(bgmDir)) fs.mkdirSync(bgmDir, { recursive: true });

    const bgmOutputPath = path.join(bgmDir, "generated-bgm.mp3");
    let bgmFile = "bgm/generated-bgm.mp3";

    if (
      fs.existsSync(bgmOutputPath) &&
      fs.statSync(bgmOutputPath).size > 100000
    ) {
      console.log(
        `🎵 기존 BGM 재사용: ${(fs.statSync(bgmOutputPath).size / 1024).toFixed(0)}KB`
      );
    } else if (settings.elevenLabsKey) {
      try {
        const musicPrompt = `Calm ambient background music for a Korean YouTube documentary about ${topic || "current affairs"}. Soft piano, gentle pads, minimal percussion. Suitable for narration overlay. Instrumental only.`;

        console.log(
          `🎵 BGM 생성 중: "${musicPrompt.slice(0, 60)}..."`
        );

        const musicRes = await fetch(
          "https://api.elevenlabs.io/v1/music/stream",
          {
            method: "POST",
            headers: {
              "xi-api-key": settings.elevenLabsKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: musicPrompt,
              music_length_ms: 60000,
              force_instrumental: true,
            }),
          }
        );

        if (musicRes.ok) {
          const musicBuffer = Buffer.from(await musicRes.arrayBuffer());
          fs.writeFileSync(bgmOutputPath, musicBuffer);
          console.log(
            `🎵 BGM 생성 완료: ${(musicBuffer.length / 1024).toFixed(0)}KB`
          );
        } else {
          const errText = await musicRes.text().catch(() => "");
          console.log(
            `⚠️ BGM 생성 실패 (${musicRes.status}): ${errText.slice(0, 100)}`
          );
          bgmFile = "";
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`⚠️ BGM 생성 오류: ${msg}`);
        bgmFile = "";
      }
    } else {
      console.log("⚠️ ElevenLabs 키 없음 — BGM 건너뜀");
      bgmFile = "";
    }

    (script as Record<string, unknown>).bgmFile = bgmFile;
    (script as Record<string, unknown>).bgmVolume = bgmVolume;

    try {
      fs.writeFileSync(
        path.join(__dirname, "src", "generated-script.json"),
        JSON.stringify(script, null, 2),
        "utf-8"
      );
    } catch {}

    ensureAssetFiles();
    setStepStatus(
      "assets",
      "done",
      `에셋 준비 완료! BGM: ${bgmFile ? "ElevenLabs 생성" : "없음"}`
    );
    updateProgress({ progress: 90 });

    setStepStatus("done", "done", "모든 준비 완료! Remotion에서 미리보기하세요.");
    updateProgress({
      status: "complete",
      progress: 100,
      resultVideoUrl: "http://localhost:3000",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    updateProgress({ status: "error", error: msg });
    const runningStep = progressState.steps.find((s) => s.status === "running");
    if (runningStep) {
      setStepStatus(runningStep.id, "error", msg);
    }
  }
}

// ═══════════════════════════════════════
// 내부 함수들
// ═══════════════════════════════════════

function analyzeType(
  sentence: string,
  idx: number,
  total: number,
  sectionId: string
): string {
  const s = sentence.toLowerCase();

  if (idx === 0) return "title-impact";
  if (idx === total - 1) {
    if (sectionId === "OUTRO") return "cta-subscribe";
    if (sectionId === "SUMMARY" || sectionId === "TWIST")
      return "verdict-stamp";
  }

  const hasNumbers =
    /\d+[%만억원조달러]|\d+\.\d+/.test(sentence);
  const hasCompare =
    /비교|대비|반면|차이|vs|높고|낮고|증가|감소|상승|하락/.test(s);
  const hasList =
    /첫째|둘째|셋째|첫 번째|두 번째|세 번째|하나|둘|셋/.test(s);
  const hasQuote = /라고|따르면|의하면|말했|밝혔|강조|주장/.test(s);
  const hasKeyword = /핵심|중요|포인트|키워드|요약|정리/.test(s);
  const hasQuestion = /\?|일까|할까|는가|인가/.test(sentence);
  const hasRatio = /비율|비중|점유율|구성|분포/.test(s);
  const hasTrend = /추이|변화|흐름|동향|추세|전망/.test(s);
  const hasLevel = /단계|레벨|수준|계층|등급|순위/.test(s);
  const hasProgress = /진행|달성|목표|현황|상태|지수/.test(s);
  const hasGauge = /수치|측정|평가|점수|등급|위험/.test(s);

  if (hasGauge && hasNumbers) return "gauge-meter";
  if (hasRatio) return "donut-chart";
  if (hasNumbers && hasCompare) return "comparison-split";
  if (hasTrend) return "chart-line";
  if (hasLevel) return "pyramid-chart";
  if (hasProgress && hasNumbers) return "progress-bar-multi";
  if (hasNumbers && /큰|높은|최고|최대|역대/.test(s))
    return "number-counter";
  if (hasNumbers) {
    const types = [
      "stat-counter",
      "chart-bar",
      "gauge-meter",
      "number-counter",
      "progress-bar-multi",
    ];
    return types[idx % types.length];
  }
  if (hasCompare) return "comparison-split";
  if (hasList) return "list-reveal";
  if (hasQuote) return "quote-highlight";
  if (hasKeyword) return "keyword-explosion";
  if (hasQuestion) return "breaking-banner";

  const visualTypes = [
    "data-card-stack",
    "keyword-explosion",
    "quote-highlight",
    "list-reveal",
    "chart-bar",
    "donut-chart",
    "gauge-meter",
    "progress-bar-multi",
    "number-counter",
    "pyramid-chart",
  ];
  return visualTypes[idx % visualTypes.length];
}

function regenerateSubScenesFromNarration(scriptData: {
  sections: { id: string; label?: string; narrationText?: string; subScenes?: unknown[] }[];
}) {
  const BG = [
    "#0a0a1a",
    "#0d1117",
    "#1a1a2e",
    "#16213e",
    "#0f3460",
    "#1a0a2e",
    "#533483",
    "#1e3a5f",
    "#2d1b69",
    "#0a192f",
    "#1b2838",
    "#0e1428",
    "#1c1c3a",
    "#0b1622",
    "#1a0533",
  ];
  const AC = [
    "#ff0033",
    "#ffd600",
    "#00e676",
    "#4ECDC4",
    "#E74C3C",
    "#ff6b35",
    "#6c5ce7",
    "#FF9800",
    "#2196F3",
    "#e91e63",
    "#26de81",
    "#fd9644",
    "#a55eea",
    "#45aaf2",
    "#fc5c65",
  ];

  for (const section of scriptData.sections) {
    const text = section.narrationText || "";
    if (text.length < 10) continue;

    const rawSent = text.match(/[^.!?。]+[.!?。]?/g) || [text];
    const sentences = rawSent
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 3);
    const subs: Record<string, unknown>[] = [];
    let idx = 1;

    subs.push({
      id: `${section.id}-${idx}`,
      type: "title-impact",
      durationFrames: 150,
      headline: section.label || section.id,
      body: sentences[0] || text.slice(0, 50),
      bgColor: BG[0],
      textColor: "#fff",
      accentColor: AC[0],
      sfx: "none",
      caption: "",
    });
    idx++;

    for (let i = 0; i < sentences.length; i++) {
      const ci = idx % BG.length;
      const sentence = sentences[i];
      const sceneType = analyzeType(sentence, i, sentences.length, section.id);

      const sub: Record<string, unknown> = {
        id: `${section.id}-${idx}`,
        type: sceneType,
        durationFrames: 150,
        headline: sentence.slice(0, 30).replace(/[.!?。,]/g, ""),
        body: sentence,
        bgColor: BG[ci],
        textColor: "#fff",
        accentColor: AC[ci],
        sfx: "none",
        caption: sentence,
      };

      const numMatch = sentence.match(/\d+(?:\.\d+)?/);
      if (numMatch && ["gauge-meter", "number-counter", "stat-counter"].includes(sceneType)) {
        sub.numbers = [{ label: sub.headline || "지표", value: parseFloat(numMatch[0]), unit: "%" }];
      }
      if (["donut-chart", "progress-bar-multi"].includes(sceneType)) {
        sub.chartData = [
          { label: "A", value: 40 },
          { label: "B", value: 30 },
          { label: "C", value: 20 },
          { label: "D", value: 10 },
        ];
      }
      if (sceneType === "pyramid-chart") {
        (sub as { items?: string[] }).items = ["최상위", "상위", "중간", "하위", "기반"];
      }

      subs.push(sub);
      idx++;
    }

    const typeCount: Record<string, number> = {};
    subs.forEach((s) => {
      const t = (s.type as string) || "fullscreen-text";
      typeCount[t] = (typeCount[t] || 0) + 1;
    });
    const typeStr = Object.entries(typeCount)
      .map(([k, v]) => `${k}:${v}`)
      .join(", ");
    console.log(
      `📝 ${section.id}: ${sentences.length}문장 → ${subs.length}개 서브씬 [${typeStr}]`
    );
    section.subScenes = subs;
  }
}

function applyVoiceBasedFrameFix(
  script: { sections: { id: string; subScenes?: { durationFrames?: number }[]; narrationText?: string; label?: string }[]; totalDurationFrames?: number },
  targetTotalFrames: number
) {
  const fps = 30;
  const sections = script.sections || [];
  const voiceDir = path.join(__dirname, "public", "voiceover");

  let totalVoiceFrames = 0;
  for (const sec of sections) {
    const audioPath = path.join(voiceDir, `${sec.id}.mp3`);
    let voiceFrames = 0;
    try {
      const stat = fs.statSync(audioPath);
      const voiceSec = stat.size / 16000;
      voiceFrames = Math.ceil(voiceSec * fps);
    } catch {
      voiceFrames = Math.ceil(40 * fps);
    }
    (sec as { _voiceFrames?: number })._voiceFrames = voiceFrames;
    totalVoiceFrames += voiceFrames;
  }

  console.log(
    `🎤 총 음성 프레임: ${totalVoiceFrames} (${(totalVoiceFrames / fps / 60).toFixed(1)}분)`
  );
  console.log(
    `🎯 목표 프레임: ${targetTotalFrames} (${(targetTotalFrames / fps / 60).toFixed(1)}분)`
  );

  const extraFrames = Math.max(0, targetTotalFrames - totalVoiceFrames);
  const extraPerSection = Math.floor(extraFrames / sections.length);
  let remainder = extraFrames - extraPerSection * sections.length;

  for (const sec of sections) {
    const voiceFrames = (sec as { _voiceFrames?: number })._voiceFrames || 0;
    const sectionTotalFrames =
      voiceFrames + extraPerSection + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const subScenes = sec.subScenes || [];
    if (subScenes.length === 0) {
      sec.subScenes = [
        {
          id: `${sec.id}-1`,
          type: "fullscreen-text",
          durationFrames: sectionTotalFrames,
          headline: sec.label || sec.id,
          body: sec.narrationText || sec.label || "...",
          bgColor: "#1a1a2e",
          accentColor: "#e94560",
          textColor: "#ffffff",
        } as { id: string; type: string; durationFrames: number; [k: string]: unknown },
      ];
    } else {
      const basePerSub = Math.floor(sectionTotalFrames / subScenes.length);
      let subRemainder = sectionTotalFrames - basePerSub * subScenes.length;

      for (let i = 0; i < subScenes.length; i++) {
        subScenes[i].durationFrames =
          Math.max(90, basePerSub) + (subRemainder > 0 ? 1 : 0);
        if (subRemainder > 0) subRemainder--;
      }
    }

    delete (sec as { _voiceFrames?: number })._voiceFrames;

    const actual = (sec.subScenes || []).reduce(
      (s, ss) => s + (ss.durationFrames || 0),
      0
    );
    console.log(
      `📐 ${sec.id}: 할당=${(actual / 30).toFixed(1)}s, 서브씬=${(sec.subScenes || []).length}개`
    );
  }

  let finalTotal = 0;
  for (const sec of sections) {
    for (const ss of sec.subScenes || []) {
      finalTotal += ss.durationFrames || 0;
    }
  }

  if (finalTotal !== targetTotalFrames && sections.length > 0) {
    const diff = targetTotalFrames - finalTotal;
    const lastSec = sections[sections.length - 1];
    const lastSubs = lastSec.subScenes || [];
    if (lastSubs.length > 0) {
      const lastSub = lastSubs[lastSubs.length - 1];
      lastSub.durationFrames = (lastSub.durationFrames || 0) + diff;
    }
  }

  script.totalDurationFrames = targetTotalFrames;
  console.log(
    `✅ 최종 프레임: ${targetTotalFrames} = ${(targetTotalFrames / fps / 60).toFixed(1)}분`
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface GeminiSection {
  id: string;
  label: string;
  narrationText: string;
  subScenes: unknown[];
}

interface GeminiScript {
  title: string;
  description: string;
  sections: GeminiSection[];
  tags?: string[];
  hashtags?: string[];
  totalDurationFrames?: number;
}

async function generateScriptWithGemini(
  topic: string,
  category: string,
  duration: number,
  tone: string,
  apiKey: string,
  voiceId: string
): Promise<GeminiScript> {
  const toneMap: Record<string, string> = {
    documentary: "다큐멘터리처럼 웅장하고 몰입감 있는 말투",
    news: "뉴스 앵커처럼 차분하고 객관적인 말투",
    casual: "친근한 유튜버처럼 편안한 말투",
    lecture: "전문 강의처럼 논리적이고 체계적인 말투",
    dramatic: "긴장감 넘치는 드라마틱한 말투",
    anchor: "뉴스 앵커처럼 차분하고 객관적인 말투",
    youtuber: "친근한 유튜버처럼 편안한 말투",
  };
  const categoryMap: Record<string, string> = {
    economy: "경제/재테크",
    tech: "기술/IT",
    society: "사회/이슈",
    science: "과학/우주",
    health: "건강/의학",
    history: "역사/문화",
    lifestyle: "라이프스타일",
    education: "교육/학습",
    entertainment: "엔터테인먼트",
    politics: "정치/국제",
    realestate: "부동산",
    current: "시사",
    finance: "금융",
    policy: "정책",
  };

  const targetTotalFrames = duration * 60 * 30;
  const framesPerSection = Math.round(targetTotalFrames / 9);

  const minCharsPerSection = Math.round((duration * 60 * 5) / 9);
  const totalMinChars = duration * 60 * 5;

  const lengthRule = `
[필수 규칙 - 나레이션 길이]
- 이 영상의 총 길이는 ${duration}분입니다.
- 한국어 TTS는 1초에 약 5자를 읽습니다.
- 따라서 전체 나레이션 총 글자 수는 최소 ${totalMinChars}자 이상이어야 합니다.
- 9개 섹션이므로 각 섹션의 narrationText는 최소 ${minCharsPerSection}자 이상이어야 합니다.
- 짧은 문장으로 끝내지 말고, 구체적인 예시, 통계, 비유, 설명을 풍부하게 포함하세요.
- 10분 영상 예시: 각 섹션당 최소 330자, 총 3000자 이상.
- 이 규칙을 반드시 지켜야 합니다. 글자 수가 부족하면 영상에 음성 공백이 생깁니다.
`;

  const prompt = `유튜브 롱폼 영상 대본을 JSON으로 생성하세요.

주제: ${topic}
카테고리: ${categoryMap[category] || category}
말투: ${toneMap[tone] || tone}
영상 길이: ${duration}분 (총 ${targetTotalFrames}프레임, 30fps)
${lengthRule}

절대 규칙 — 하나라도 어기면 실패:
1. JSON만 출력. 다른 텍스트 금지
2. 섹션 9개 필수: HOOK, PROBLEM, BACKGROUND, ANALYSIS_1, ANALYSIS_2, ANALYSIS_3, TWIST, SUMMARY, OUTRO
3. 각 섹션의 subScenes durationFrames 합계 = 약 ${framesPerSection}프레임 (${Math.round(framesPerSection / 30)}초)
4. 전체 subScenes durationFrames 총합 = ${targetTotalFrames}
5. 모든 subScenes에 반드시 포함: id, type, durationFrames, headline, bgColor, accentColor, textColor, sfx, caption
6. bgColor는 어두운 색상 (#0a0a1a, #0d1117, #1a1a2e, #16213e, #0f3460, #1a0a2e, #533483 중 선택)
7. textColor는 항상 "#ffffff"
8. accentColor는 밝은 강조색 (#ff0033, #ffd600, #00e676, #4ECDC4, #E74C3C, #ff6b35, #6c5ce7 중 선택)
9. sfx는 다음 중 선택: "alarm", "impact", "whoosh", "pop", "bass-drop", "reveal", "typing", "ding", "swoosh", "success"

서브씬 type별 필수 추가 필드:
- "stat-counter": numbers=[{"label":"텍스트","value":숫자,"unit":"단위","color":"#색상"}]
- "chart-bar","chart-line","chart-pie": chartData={"type":"bar","title":"제목","data":[{"label":"이름","value":숫자,"color":"#색상"}],"unit":"단위"}
- "keyword-explosion": keywords=["단어1","단어2",...] (최소 5개)
- "comparison-split": comparisonLeft={"label":"이름","value":"값"}, comparisonRight={"label":"이름","value":"값"}
- "list-reveal": listItems=["항목1","항목2",...] (최소 3개)
- "emoji-rain": keywords=["이모지1","이모지2",...] (최소 5개)
- "fullscreen-text","title-impact","verdict-stamp","breaking-banner","cta-subscribe": body="본문텍스트"
- "quote-highlight": body="인용문"
- "timeline-progress": listItems=["단계1","단계2",...], body="설명"
- "transition-swoosh": 추가 필드 없음 (durationFrames=60 고정)

JSON:
{
  "title": "한국어 제목",
  "description": "한국어 설명",
  "tags": ["태그",...],
  "hashtags": ["#태그",...],
  "topic": "${topic.replace(/"/g, '\\"')}",
  "totalDurationFrames": ${targetTotalFrames},
  "sections": [
    {
      "id": "HOOK",
      "label": "🔥 후킹",
      "narrationText": "한국어 나래이션 (최소 3문장, 이 섹션에서 읽을 모든 대사)",
      "subScenes": [
        {"id":"HOOK-1","type":"breaking-banner","durationFrames":${Math.round(framesPerSection * 0.4)},"headline":"큰제목","body":"부제목","caption":"자막","bgColor":"#0a0a1a","accentColor":"#ff0033","textColor":"#ffffff","sfx":"alarm"},
        {"id":"HOOK-2","type":"stat-counter","durationFrames":${Math.round(framesPerSection * 0.35)},"headline":"제목","numbers":[{"label":"항목","value":0,"unit":"%","color":"#ff0033"}],"caption":"자막","bgColor":"#0d1117","accentColor":"#ffd600","textColor":"#ffffff","sfx":"impact"},
        {"id":"HOOK-3","type":"fullscreen-text","durationFrames":${Math.round(framesPerSection * 0.25)},"headline":"제목","body":"본문","caption":"자막","bgColor":"#1a0a2e","accentColor":"#ffd600","textColor":"#ffffff","sfx":"whoosh"}
      ],
      "audioFile": "voiceover/HOOK.mp3"
    },
    ...나머지 8개 섹션도 동일한 구조로 작성...
  ]
}

각 섹션의 narrationText는 최소 50자 이상, 전문적이고 흥미로운 한국어 대본이어야 합니다.
서브씬은 섹션당 3~6개, 각 서브씬은 최소 120프레임(4초) 이상이어야 합니다.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 16384,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API 오류: ${response.status} ${errText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!rawText) throw new Error("Gemini 응답이 비어있습니다.");

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Gemini 응답에서 JSON을 추출할 수 없습니다.");

  let parsed: GeminiScript;
  try {
    parsed = JSON.parse(jsonMatch[0]) as GeminiScript;
  } catch {
    throw new Error("Gemini 응답 JSON 파싱 실패");
  }

  if (!parsed.sections?.length) {
    throw new Error("대본에 섹션이 없습니다.");
  }

  parsed = autoFixScript(parsed, targetTotalFrames) as GeminiScript;
  console.log(
    `📏 autoFixScript 적용 완료: ${parsed.totalDurationFrames} frames = ${((parsed.totalDurationFrames || 0) / 30 / 60).toFixed(1)}분`
  );

  parsed.sections = parsed.sections.map((s) => ({
    ...s,
    audioFile: `voiceover/${s.id}.mp3`,
  }));

  // BGM fallback — placeholder가 아닌 실제 파일만 사용
  const bgmPath = path.join(__dirname, "public", parsed.bgmFile || "bgm/news-ambient.mp3");
  let finalBgm = "bgm/news-ambient.mp3";
  try {
    const bgmStat = fs.statSync(bgmPath);
    if (bgmStat.size > 50000) {
      finalBgm = parsed.bgmFile || "bgm/news-ambient.mp3";
    }
  } catch {}

  const output = {
    ...parsed,
    topic,
    fps: 30,
    width: 1920,
    height: 1080,
    bgmFile: finalBgm,
    bgmVolume: 0.12,
    thumbnailFile: "thumbnails/thumb.jpg",
    selectedVoiceId: voiceId,
    totalDurationFrames: parsed.totalDurationFrames || targetTotalFrames,
  };

  const publicDir = path.join(__dirname, "public");
  const srcDir = path.join(__dirname, "src");
  fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(
    path.join(publicDir, "script-latest.json"),
    JSON.stringify(output, null, 2)
  );
  fs.writeFileSync(
    path.join(srcDir, "generated-script.json"),
    JSON.stringify(output, null, 2)
  );

  return parsed;
}

async function generateVoiceForSection(
  sectionId: string,
  text: string,
  voiceId: string,
  apiKey: string
): Promise<void> {
  const outputDir = path.join(__dirname, "public", "voiceover");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `${sectionId}.mp3`);

  if (!text || text.trim().length === 0) return;

  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 10000) {
    return;
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ElevenLabs 오류 (${sectionId}): ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
}

function ensureSfxFiles() {
  const sfxDir = path.join(__dirname, "public", "sfx");
  fs.mkdirSync(sfxDir, { recursive: true });

  const sfxNames = [
    "whoosh",
    "impact",
    "pop",
    "ding",
    "swoosh",
    "bass-drop",
    "click",
    "reveal",
    "alarm",
    "success",
    "typing",
  ];

  for (const name of sfxNames) {
    const filePath = path.join(sfxDir, `${name}.wav`);
    if (!fs.existsSync(filePath)) {
      const buf = createMinimalWav(200);
      fs.writeFileSync(filePath, buf);
    }
  }
}

function ensureAssetFiles() {
  const dirs = [
    "public/images",
    "public/bgm",
    "public/voiceover",
    "public/thumbnails",
  ];
  dirs.forEach((d) =>
    fs.mkdirSync(path.join(__dirname, d), { recursive: true })
  );

  // BGM은 사용자가 별도로 추가 (mp3 인코딩 필요)
}

function createMinimalWav(durationMs: number): Buffer {
  const sampleRate = 44100;
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const buffer = Buffer.alloc(44 + numSamples * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(numSamples * 2, 40);
  return buffer;
}

app.post("/api/voice-preview", async (req, res) => {
  const { voiceId, text } = req.body;
  const settings = loadSettings();

  if (!settings.elevenLabsKey) {
    res.status(400).json({ error: "ElevenLabs API 키가 필요합니다." });
    return;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": settings.elevenLabsKey,
        },
        body: JSON.stringify({
          text:
            text ||
            "안녕하세요, 이 목소리로 나레이션을 진행합니다.",
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      }
    );

    if (!response.ok) throw new Error("API 오류");

    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err: unknown) {
    res
      .status(500)
      .json({
        error: err instanceof Error ? err.message : String(err),
      });
  }
});

app.get("/", (req, res) => res.redirect("/web/index.html"));
app.get("/admin", (req, res) => res.redirect("/web/admin.html"));

app.listen(PORT, () => {
  const settings = loadSettings();
  const hasKeys = !!settings.elevenLabsKey && !!settings.geminiKey;

  const sfxDir = path.join(__dirname, "public", "sfx");
  if (!fs.existsSync(sfxDir)) fs.mkdirSync(sfxDir, { recursive: true });
  const whooshPath = path.join(sfxDir, "whoosh.mp3");
  if (
    !fs.existsSync(whooshPath) ||
    fs.statSync(whooshPath).size < 10000
  ) {
    console.log("⚠️ whoosh.mp3 효과음이 없거나 작습니다. ElevenLabs로 생성 시 자동 반영됩니다.");
    if (!fs.existsSync(whooshPath)) {
      try {
        fs.writeFileSync(whooshPath, Buffer.alloc(0));
      } catch {}
    }
  }

  console.log(`
🎬 YouTube LongForm Studio 시작!
${"─".repeat(45)}
  📱 대시보드:  http://localhost:${PORT}
  🛠️ 관리자:   http://localhost:${PORT}/admin
  🖥️ Remotion: npm run dev → http://localhost:3000
${"─".repeat(45)}
  API 키 상태: ${hasKeys ? "✅ 설정됨" : "⚠️ 대시보드에서 설정 필요"}
  `);
});
