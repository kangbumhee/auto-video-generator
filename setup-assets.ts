// setup-assets.ts
// 실행: npx tsx setup-assets.ts

import fs from "fs";
import path from "path";

// ── 디렉토리 확인/생성 ──
const dirs = [
  "public/images",
  "public/bgm",
  "public/voiceover",
  "public/thumbnails",
  "public/fonts",
];
for (const d of dirs) {
  fs.mkdirSync(d, { recursive: true });
}

// ── 1) 플레이스홀더 이미지 생성 ──
const placeholderImages = [
  { name: "hook-bg.jpg", label: "HOOK", color: "#1a1a2e" },
  { name: "problem-bg.jpg", label: "PROBLEM", color: "#16213e" },
  { name: "background-bg.jpg", label: "BACKGROUND", color: "#0f3460" },
  { name: "analysis1-bg.jpg", label: "ANALYSIS 1", color: "#533483" },
  { name: "analysis2-bg.jpg", label: "ANALYSIS 2", color: "#533483" },
  { name: "analysis3-bg.jpg", label: "ANALYSIS 3", color: "#533483" },
  { name: "twist-bg.jpg", label: "TWIST", color: "#e94560" },
  { name: "summary-bg.jpg", label: "SUMMARY", color: "#1a1a2e" },
  { name: "outro-bg.jpg", label: "OUTRO", color: "#0f3460" },
];

async function createImages() {
  let sharp: typeof import("sharp");
  try {
    sharp = (await import("sharp")).default;
  } catch {
    sharp = require("sharp");
  }

  for (const img of placeholderImages) {
    const filePath = path.join("public/images", img.name);
    if (!fs.existsSync(filePath)) {
      const hex = img.color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      await sharp({
        create: {
          width: 1920,
          height: 1080,
          channels: 3,
          background: { r, g, b },
        },
      })
        .jpeg({ quality: 80 })
        .toFile(filePath);
      console.log(`✅ Created placeholder: ${filePath}`);
    } else {
      console.log(`⏭️  Already exists: ${filePath}`);
    }
  }
}

// ── 2) 무음 WAV 파일 생성 (BGM, 보이스오버 플레이스홀더) ──
function createSilentWav(durationSec: number): Buffer {
  const sampleRate = 44100;
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = sampleRate * durationSec * numChannels;
  const dataSize = numSamples * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

async function main() {
  await createImages();

  // BGM 플레이스홀더 (10초 무음)
  const bgmPath = "public/bgm/news-ambient.mp3";
  if (!fs.existsSync(bgmPath)) {
    fs.writeFileSync(bgmPath, createSilentWav(10));
    console.log(`✅ Created silent BGM placeholder: ${bgmPath}`);
  } else {
    console.log(`⏭️  Already exists: ${bgmPath}`);
  }

  // 각 섹션 보이스오버 플레이스홀더 (2초 무음)
  const sections = [
    "HOOK",
    "PROBLEM",
    "BACKGROUND",
    "ANALYSIS_1",
    "ANALYSIS_2",
    "ANALYSIS_3",
    "TWIST",
    "SUMMARY",
    "OUTRO",
  ];
  for (const sec of sections) {
    const voPath = `public/voiceover/${sec}.mp3`;
    if (!fs.existsSync(voPath)) {
      fs.writeFileSync(voPath, createSilentWav(2));
      console.log(`✅ Created silent voiceover: ${voPath}`);
    } else {
      console.log(`⏭️  Already exists: ${voPath}`);
    }
  }

  console.log("\n🎉 에셋 준비 완료! npm run dev 로 미리보기를 시작하세요.");
  console.log("   → 실제 이미지/음악/TTS는 나중에 해당 파일을 교체하면 됩니다.\n");
}

main().catch(console.error);
