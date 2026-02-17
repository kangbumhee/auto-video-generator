import 'dotenv/config';
// ============================================================
// TTS 생성 — ElevenLabs /with-timestamps API 사용
// ============================================================

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { DEFAULT_CONFIG } from "./src/config";
import { chunkWordsToLines } from "./src/utils/helpers";

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("❌ ELEVENLABS_API_KEY가 .env에 없습니다!");
  process.exit(1);
}

const VOICE_ID = DEFAULT_CONFIG.selectedVoice.id;
const OUTPUT_DIR = "public/voiceover";

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

interface AlignmentChar {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

function buildWordsFromAlignment(alignment: AlignmentChar) {
  const words: Array<{ text: string; start: number; end: number }> = [];
  let currentWord = "";
  let wordStart = 0;
  let wordEnd = 0;

  for (let i = 0; i < alignment.characters.length; i++) {
    const char = alignment.characters[i];
    const start = alignment.character_start_times_seconds[i];
    const end = alignment.character_end_times_seconds[i];

    if (char === " " || char === "\n") {
      if (currentWord.length > 0) {
        words.push({ text: currentWord, start: wordStart, end: wordEnd });
        currentWord = "";
      }
    } else {
      if (currentWord.length === 0) wordStart = start;
      currentWord += char;
      wordEnd = end;
    }
  }
  if (currentWord.length > 0) {
    words.push({ text: currentWord, start: wordStart, end: wordEnd });
  }
  return words;
}

async function generateSection(
  sectionId: string,
  text: string
): Promise<void> {
  console.log(`🎙️ [${sectionId}] TTS 생성 중... (${text.length}자)`);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error(`❌ [${sectionId}] TTS 실패: ${response.status} ${errText}`);
    return;
  }

  const data = (await response.json()) as {
    audio_base64?: string;
    alignment?: AlignmentChar | { characters?: AlignmentChar };
  };

  if (data.audio_base64) {
    const audioBuffer = Buffer.from(data.audio_base64, "base64");
    const audioPath = `${OUTPUT_DIR}/${sectionId}.mp3`;
    writeFileSync(audioPath, audioBuffer);
    console.log(
      `  ✅ 오디오 저장: ${audioPath} (${(audioBuffer.length / 1024).toFixed(0)}KB)`
    );
  }

  const alignment = Array.isArray((data.alignment as AlignmentChar)?.characters)
    ? (data.alignment as AlignmentChar)
    : (data.alignment as { characters?: AlignmentChar })?.characters;
  if (alignment) {
    const words = buildWordsFromAlignment(alignment);
    const subtitleLines = chunkWordsToLines(words, 4);
    const subsPath = `${OUTPUT_DIR}/${sectionId}-subs.json`;
    writeFileSync(subsPath, JSON.stringify(subtitleLines, null, 2));
    console.log(`  💬 자막 저장: ${subsPath} (${subtitleLines.length}개 라인)`);
  }
}

async function main() {
  console.log("========================================");
  console.log("🎙️ ElevenLabs TTS 생성 시작");
  console.log(`  음성: ${DEFAULT_CONFIG.selectedVoice.name} (${VOICE_ID})`);
  console.log(`  섹션 수: ${DEFAULT_CONFIG.sections.length}`);
  console.log("========================================");

  for (const section of DEFAULT_CONFIG.sections) {
    await generateSection(section.id, section.narrationText);
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("========================================");
  console.log("✅ 전체 TTS 생성 완료!");
  console.log("  다음: npm run dev 로 프리뷰 확인");
  console.log("========================================");
}

main().catch(console.error);

