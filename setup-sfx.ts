// setup-sfx.ts
// ============================================================
// 11종 효과음 플레이스홀더 생성 (WAV 기반)
// 실제 운영 시 Pixabay/Mixkit에서 무료 SFX 다운로드해서 교체
// 실행: npx tsx setup-sfx.ts
// ============================================================

import fs from "fs";
import path from "path";

const SFX_DIR = path.join(process.cwd(), "public", "sfx");
fs.mkdirSync(SFX_DIR, { recursive: true });

function createWav(
  durationMs: number,
  frequency: number,
  type: "sine" | "noise" | "decay",
  volume = 0.5
): Buffer {
  const sampleRate = 44100;
  const numSamples = Math.floor((sampleRate * durationMs) / 1000);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  // WAV 헤더
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

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.max(0, 1 - t / (durationMs / 1000));
    let sample = 0;

    if (type === "sine") {
      sample = Math.sin(2 * Math.PI * frequency * t) * volume * envelope;
    } else if (type === "noise") {
      sample = (Math.random() * 2 - 1) * volume * envelope;
    } else if (type === "decay") {
      const decayRate = 10;
      sample =
        Math.sin(2 * Math.PI * frequency * t) *
        volume *
        Math.exp(-decayRate * t);
    }

    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  return buffer;
}

const SFX_DEFINITIONS: {
  name: string;
  duration: number;
  freq: number;
  type: "sine" | "noise" | "decay";
  vol: number;
}[] = [
  { name: "whoosh", duration: 400, freq: 200, type: "noise", vol: 0.6 },
  { name: "impact", duration: 300, freq: 60, type: "decay", vol: 0.8 },
  { name: "pop", duration: 150, freq: 800, type: "decay", vol: 0.5 },
  { name: "ding", duration: 500, freq: 1200, type: "decay", vol: 0.4 },
  { name: "swoosh", duration: 350, freq: 300, type: "noise", vol: 0.5 },
  { name: "bass-drop", duration: 600, freq: 40, type: "decay", vol: 0.9 },
  { name: "click", duration: 50, freq: 2000, type: "decay", vol: 0.3 },
  { name: "reveal", duration: 700, freq: 600, type: "sine", vol: 0.4 },
  { name: "alarm", duration: 400, freq: 900, type: "sine", vol: 0.6 },
  { name: "success", duration: 500, freq: 1000, type: "decay", vol: 0.5 },
  { name: "typing", duration: 100, freq: 3000, type: "noise", vol: 0.2 },
];

for (const sfx of SFX_DEFINITIONS) {
  const filePath = path.join(SFX_DIR, `${sfx.name}.wav`);
  if (!fs.existsSync(filePath)) {
    const wav = createWav(sfx.duration, sfx.freq, sfx.type, sfx.vol);
    fs.writeFileSync(filePath, wav);
    console.log(`✅ SFX 생성: ${filePath}`);
  } else {
    console.log(`⏭️  이미 존재: ${filePath}`);
  }
}

console.log(`
🔊 효과음 11종 준비 완료!
📁 위치: public/sfx/

💡 더 좋은 소리로 교체하려면:
   - https://pixabay.com/sound-effects/ (무료, 저작권 없음)
   - https://mixkit.co/free-sound-effects/ (무료)
   에서 다운로드해서 같은 파일명(.wav)으로 교체하세요.
`);
