// ============================================================
// BGM 프롬프트 생성 — Suno AI용
// ============================================================

import { writeFileSync } from "fs";
import { DEFAULT_CONFIG } from "./src/config";

function generateBGMPrompt(): string {
  return `[Suno AI BGM 생성 프롬프트]

제목: ${DEFAULT_CONFIG.title} - 배경음악
장르: Ambient News / Corporate / Documentary
분위기: 신뢰감 있고 차분한, 약간의 긴장감
BPM: 90~110
길이: 10분 (또는 2분 루프)

프롬프트:
"Create a professional ambient background music track suitable for a Korean news YouTube channel. 
The mood should convey authority and trust, with subtle tension building during analysis sections. 
Use soft piano, ambient pads, and gentle percussion. 
Include a slightly more dramatic section in the middle for the 'twist' moment.
Keep it clean and non-distracting as it will play under voice narration.
BPM around 100, in C minor key."

한국어 키워드: 뉴스 배경음악, 시사 프로그램, 다큐멘터리, 경제 분석
`;
}

const prompt = generateBGMPrompt();
writeFileSync("public/bgm/bgm-prompt.txt", prompt);
console.log("🎵 BGM 프롬프트 생성 완료: public/bgm/bgm-prompt.txt");
console.log("  → Suno AI (https://suno.ai)에서 위 프롬프트로 생성 후");
console.log("  → public/bgm/news-ambient.mp3 로 저장하세요");
