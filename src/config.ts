// src/config.ts
// ============================================================
// 50개 음성 + 음성 길이 기반 자동 싱크
// ============================================================

import type { VideoConfig, VoiceOption } from "./types";
import generatedRaw from "./generated-script.json";

interface GeneratedScript {
  sections?: unknown[];
  title?: string;
  description?: string;
  tags?: string[];
  hashtags?: string[];
  topic?: string;
  selectedVoiceId?: string;
  totalDurationFrames?: number;
}

const generated = generatedRaw as GeneratedScript | null;

const sampleUrl = (id: string) =>
  `https://api.elevenlabs.io/v1/text-to-speech/${id}/stream`;

// ── 50개 음성 (한글 설명) ──
export const VOICE_OPTIONS: VoiceOption[] = [
  // ── 남성 — 내레이션/다큐 ──
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "🎬 깊고 웅장한 남성 목소리 — 다큐멘터리, 뉴스 해설에 최적", sampleUrl: sampleUrl("pNInz6obpgDQGcFmaJgB"), provider: "elevenlabs", tags: ["남성", "웅장", "다큐", "저음"] },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian", description: "🎙️ 울림 있는 중년 남성 — 광고, 나래이션에 적합", sampleUrl: sampleUrl("nPczCjzI2devNBz1zQrb"), provider: "elevenlabs", tags: ["남성", "울림", "광고", "나래이션"] },
  { id: "pqHfZKP75CvOlQylNhV4", name: "Bill", description: "📖 따뜻하고 힘 있는 남성 — 다큐멘터리, 스토리텔링", sampleUrl: sampleUrl("pqHfZKP75CvOlQylNhV4"), provider: "elevenlabs", tags: ["남성", "따뜻", "다큐", "스토리"] },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", description: "🔥 깊고 에너지 넘치는 청년 — 유튜브, 예능 콘텐츠", sampleUrl: sampleUrl("TxGEqnHWrfWFTfGW9XjX"), provider: "elevenlabs", tags: ["남성", "에너지", "유튜브", "청년"] },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", description: "💪 또렷하고 선명한 중년 남성 — 교육, 설명 영상", sampleUrl: sampleUrl("VR6AewLTigWG4xSOukaG"), provider: "elevenlabs", tags: ["남성", "또렷", "교육", "설명"] },
  // ── 남성 — 뉴스/앵커 ──
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", description: "📺 깊은 영국식 남성 — 뉴스 앵커, 시사 프로그램", sampleUrl: sampleUrl("onwK4e9ZLuTAKqWW03F9"), provider: "elevenlabs", tags: ["남성", "앵커", "뉴스", "영국"] },
  { id: "29vD33N1CtxCmqQRPOHJ", name: "Drew", description: "📰 균형 잡힌 중년 남성 — 뉴스, 리포트", sampleUrl: sampleUrl("29vD33N1CtxCmqQRPOHJ"), provider: "elevenlabs", tags: ["남성", "뉴스", "균형", "리포트"] },
  { id: "5Q0t7uMcjvnagumLfvZi", name: "Paul", description: "🎤 현장감 있는 남성 — 뉴스 리포터, 현장 중계", sampleUrl: sampleUrl("5Q0t7uMcjvnagumLfvZi"), provider: "elevenlabs", tags: ["남성", "리포터", "현장", "뉴스"] },
  { id: "Zlb1dXrM653N07WRdFW3", name: "Joseph", description: "🇬🇧 차분한 영국 남성 — 뉴스, 격식 있는 나래이션", sampleUrl: sampleUrl("Zlb1dXrM653N07WRdFW3"), provider: "elevenlabs", tags: ["남성", "차분", "영국", "격식"] },
  { id: "ZQe5CZNOzWyzPSCn5a3c", name: "James", description: "🌏 차분한 호주 남성 — 뉴스, 교양 프로그램", sampleUrl: sampleUrl("ZQe5CZNOzWyzPSCn5a3c"), provider: "elevenlabs", tags: ["남성", "호주", "차분", "교양"] },
  // ── 남성 — 친근/캐주얼 ──
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni", description: "💬 친근하고 편안한 남성 — 유튜버, 브이로그", sampleUrl: sampleUrl("ErXwobaYiN019PkySvjV"), provider: "elevenlabs", tags: ["남성", "친근", "유튜버", "편안"] },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", description: "🇦🇺 자신감 넘치는 호주 청년 — 캐주얼 콘텐츠", sampleUrl: sampleUrl("IKne3meq5aSn9XLyUdCD"), provider: "elevenlabs", tags: ["남성", "호주", "자신감", "캐주얼"] },
  { id: "iP95p4xoKVk53GoZ742B", name: "Chris", description: "🏠 자연스럽고 편안한 남성 — 일상 콘텐츠, 리뷰", sampleUrl: sampleUrl("iP95p4xoKVk53GoZ742B"), provider: "elevenlabs", tags: ["남성", "자연스러움", "일상", "리뷰"] },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "⚡ 에너지와 따뜻함의 청년 — 숏폼, 릴스", sampleUrl: sampleUrl("TX3LPaxmHKxFdv7VOQHJ"), provider: "elevenlabs", tags: ["남성", "에너지", "숏폼", "따뜻"] },
  { id: "bVMeCyTHy58xNoL34h3p", name: "Jeremy", description: "🎉 흥분된 아이리시 청년 — 리뷰, 하이라이트", sampleUrl: sampleUrl("bVMeCyTHy58xNoL34h3p"), provider: "elevenlabs", tags: ["남성", "흥분", "리뷰", "아이리시"] },
  { id: "CYw3kZ02Hs0563khs1Fj", name: "Dave", description: "🗣️ 대화체 영국 청년 — 캐주얼, 게임 콘텐츠", sampleUrl: sampleUrl("CYw3kZ02Hs0563khs1Fj"), provider: "elevenlabs", tags: ["남성", "대화체", "영국", "게임"] },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "☕ 편안하고 느긋한 남성 — 팟캐스트, 일상 대화", sampleUrl: sampleUrl("CwhRBWXzGAHq8TQ4Fs17"), provider: "elevenlabs", tags: ["남성", "편안", "팟캐스트", "느긋"] },
  { id: "bIHbv24MWmeRgasZH58o", name: "Will", description: "😎 대화체로 편안한 남성 — 캐주얼 나래이션", sampleUrl: sampleUrl("bIHbv24MWmeRgasZH58o"), provider: "elevenlabs", tags: ["남성", "대화체", "캐주얼", "편안"] },
  // ── 남성 — 특수 (캐릭터/명상/ASMR) ──
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum", description: "🎮 거친 허스키 남성 — 게임, 미스터리 콘텐츠", sampleUrl: sampleUrl("N2lVS1w4EtoT3dr4eOWO"), provider: "elevenlabs", tags: ["남성", "허스키", "게임", "미스터리"] },
  { id: "2EiwWnXFnvU5JabPnv8n", name: "Clyde", description: "🪖 전쟁 베테랑 남성 — 게임 캐릭터, 드라마", sampleUrl: sampleUrl("2EiwWnXFnvU5JabPnv8n"), provider: "elevenlabs", tags: ["남성", "베테랑", "게임", "드라마"] },
  { id: "D38z5RcWu1voky8WS1ja", name: "Fin", description: "🍀 아이리시 노인 남성 — 스토리텔링, 판타지", sampleUrl: sampleUrl("D38z5RcWu1voky8WS1ja"), provider: "elevenlabs", tags: ["남성", "아이리시", "노인", "판타지"] },
  { id: "SOYHLrjzK2X1ezoPC6cr", name: "Harry", description: "⚔️ 긴장감 있는 청년 — 게임, 액션 콘텐츠", sampleUrl: sampleUrl("SOYHLrjzK2X1ezoPC6cr"), provider: "elevenlabs", tags: ["남성", "긴장", "게임", "액션"] },
  { id: "t0jbNlBVZ17f02VDIeMI", name: "Jessie", description: "🤠 거친 노인 남성 — 서부극, 캐릭터 음성", sampleUrl: sampleUrl("t0jbNlBVZ17f02VDIeMI"), provider: "elevenlabs", tags: ["남성", "거친", "노인", "캐릭터"] },
  { id: "ODq5zmih8GrVes37Dizd", name: "Patrick", description: "📢 우렁찬 남성 — 게임 캐릭터, 광고", sampleUrl: sampleUrl("ODq5zmih8GrVes37Dizd"), provider: "elevenlabs", tags: ["남성", "우렁찬", "게임", "광고"] },
  { id: "GBv7mTt0atIp3Br8iCZE", name: "Thomas", description: "🧘 부드럽고 차분한 남성 — 명상, ASMR", sampleUrl: sampleUrl("GBv7mTt0atIp3Br8iCZE"), provider: "elevenlabs", tags: ["남성", "차분", "명상", "ASMR"] },
  { id: "g5CIjZEefAph4nQFvHAz", name: "Ethan", description: "🌙 속삭이는 남성 — ASMR, 수면 콘텐츠", sampleUrl: sampleUrl("g5CIjZEefAph4nQFvHAz"), provider: "elevenlabs", tags: ["남성", "속삭임", "ASMR", "수면"] },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam", description: "🎸 허스키한 청년 — 나래이션, 인디 콘텐츠", sampleUrl: sampleUrl("yoZ06aMxZJJ28mfd3POQ"), provider: "elevenlabs", tags: ["남성", "허스키", "나래이션", "인디"] },
  { id: "zcAOhNBS3c14rBihAFp1", name: "Giovanni", description: "🇮🇹 이탈리안 악센트 청년 — 오디오북, 감성 콘텐츠", sampleUrl: sampleUrl("zcAOhNBS3c14rBihAFp1"), provider: "elevenlabs", tags: ["남성", "이탈리안", "오디오북", "감성"] },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", description: "🎭 따뜻한 영국 남성 — 나래이션, 오디오북", sampleUrl: sampleUrl("JBFqnCBsd6RMkjVDRZzb"), provider: "elevenlabs", tags: ["남성", "영국", "따뜻", "오디오북"] },
  { id: "flq6f7yk4E4fJM5XTYuZ", name: "Michael", description: "📚 노련한 미국 남성 — 오디오북, 역사 콘텐츠", sampleUrl: sampleUrl("flq6f7yk4E4fJM5XTYuZ"), provider: "elevenlabs", tags: ["남성", "노련", "오디오북", "역사"] },
  { id: "SAz9YHcvj6GT2YYXdXww", name: "River", description: "🌊 편안하고 중성적인 목소리 — 나래이션, 대화", sampleUrl: sampleUrl("SAz9YHcvj6GT2YYXdXww"), provider: "elevenlabs", tags: ["중성", "편안", "나래이션", "대화"] },
  { id: "cjVigY5qzO86Huf0OWal", name: "Eric", description: "🤖 부드러운 테너 남성 — AI 에이전트, 안내 음성", sampleUrl: sampleUrl("cjVigY5qzO86Huf0OWal"), provider: "elevenlabs", tags: ["남성", "테너", "AI", "안내"] },
  { id: "knrPHWnBmmDHMoiMeP3l", name: "Santa", description: "🎅 산타클로스 — 특별 이벤트, 시즌 콘텐츠", sampleUrl: sampleUrl("knrPHWnBmmDHMoiMeP3l"), provider: "elevenlabs", tags: ["남성", "산타", "이벤트", "시즌"] },
  // ── 여성 — 뉴스/나래이션 ──
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "📰 따뜻하고 전문적인 여성 — 뉴스, 교육 콘텐츠", sampleUrl: sampleUrl("EXAVITQu4vr4xnSDxMaL"), provider: "elevenlabs", tags: ["여성", "전문", "뉴스", "교육"] },
  { id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice", description: "🇬🇧 자신감 있는 영국 여성 — 이러닝, 교육", sampleUrl: sampleUrl("Xb7hH8MSUJpSbSDYk0k2"), provider: "elevenlabs", tags: ["여성", "영국", "자신감", "교육"] },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "🌸 벨벳 같은 영국 여성 — 뉴스, 나래이션", sampleUrl: sampleUrl("pFZP5JQG7iQjIQuC4Bku"), provider: "elevenlabs", tags: ["여성", "영국", "벨벳", "나래이션"] },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", description: "🎯 따뜻한 전문 여성 — 다목적 나래이션", sampleUrl: sampleUrl("XrExE9yKIg1WjnnlVkGX"), provider: "elevenlabs", tags: ["여성", "따뜻", "전문", "다목적"] },
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "🌍 차분하고 허스키한 여성 — 나래이션, 다큐", sampleUrl: sampleUrl("9BWtsMINqrJLrRacOk9x"), provider: "elevenlabs", tags: ["여성", "차분", "허스키", "다큐"] },
  // ── 여성 — 친근/캐주얼 ──
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", description: "💬 대화하듯 편안한 여성 — 브이로그, 리뷰", sampleUrl: sampleUrl("21m00Tcm4TlvDq8ikWAM"), provider: "elevenlabs", tags: ["여성", "편안", "브이로그", "대화"] },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", description: "💪 강하고 또렷한 젊은 여성 — 나래이션, 광고", sampleUrl: sampleUrl("AZnzlk1XvdvUeBnXmlld"), provider: "elevenlabs", tags: ["여성", "강함", "또렷", "광고"] },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", description: "📰 차분하고 지적인 여성 — 해설, 분석", sampleUrl: sampleUrl("MF3mGyEYCl7XYWbV9V6O"), provider: "elevenlabs", tags: ["여성", "차분", "지적", "해설"] },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", description: "☀️ 밝고 쾌활한 여성 — 유튜브, 트렌드 콘텐츠", sampleUrl: sampleUrl("FGY2WhTYpPnrIDTdsKH5"), provider: "elevenlabs", tags: ["여성", "밝음", "쾌활", "트렌드"] },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", description: "🌟 인기 있는 젊은 여성 — 트렌디한 콘텐츠", sampleUrl: sampleUrl("cgSgspJ2msm6clMCkdW9"), provider: "elevenlabs", tags: ["여성", "인기", "트렌디", "젊은"] },
  { id: "pMsXgVXv3BLzUgSXRplE", name: "Serena", description: "😊 상냥하고 밝은 여성 — 안내, 인터랙티브", sampleUrl: sampleUrl("pMsXgVXv3BLzUgSXRplE"), provider: "elevenlabs", tags: ["여성", "상냥", "안내", "인터랙티브"] },
  // ── 여성 — 특수 (캐릭터/명상/애니) ──
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", description: "✨ 세련되고 고급스러운 여성 — 프리미엄 나래이션", sampleUrl: sampleUrl("XB0fDUnXU5powFXDhCwa"), provider: "elevenlabs", tags: ["여성", "세련", "고급", "프리미엄"] },
  { id: "LcfcDJNUP1GQjkzn1xUU", name: "Emily", description: "🧘 고요하고 차분한 여성 — 명상, 힐링", sampleUrl: sampleUrl("LcfcDJNUP1GQjkzn1xUU"), provider: "elevenlabs", tags: ["여성", "고요", "명상", "힐링"] },
  { id: "piTKgcLEGmPE4e6mEKli", name: "Nicole", description: "🌙 속삭이는 여성 — ASMR, 오디오북", sampleUrl: sampleUrl("piTKgcLEGmPE4e6mEKli"), provider: "elevenlabs", tags: ["여성", "속삭임", "ASMR", "오디오북"] },
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Dorothy", description: "🧒 밝고 상냥한 여성 — 동화, 키즈 콘텐츠", sampleUrl: sampleUrl("ThT5KcBeYPX3keUQqHPh"), provider: "elevenlabs", tags: ["여성", "밝음", "동화", "키즈"] },
  { id: "oWAxZDx7w5VEj9dCyTzz", name: "Grace", description: "🌻 남부 악센트 젊은 여성 — 오디오북, 감성", sampleUrl: sampleUrl("oWAxZDx7w5VEj9dCyTzz"), provider: "elevenlabs", tags: ["여성", "남부", "오디오북", "감성"] },
  { id: "jsCqWAovK2LkecY7zXl4", name: "Freya", description: "🎵 자유로운 젊은 여성 — 다양한 콘텐츠", sampleUrl: sampleUrl("jsCqWAovK2LkecY7zXl4"), provider: "elevenlabs", tags: ["여성", "자유", "다양", "콘텐츠"] },
  { id: "z9fAnlkpzviPz146aGWa", name: "Glinda", description: "🧙 마녀 캐릭터 여성 — 게임, 판타지", sampleUrl: sampleUrl("z9fAnlkpzviPz146aGWa"), provider: "elevenlabs", tags: ["여성", "마녀", "게임", "판타지"] },
  { id: "jBpfuIE2acCO8z3wKNLl", name: "Gigi", description: "🎀 아기 같은 여성 — 애니메이션, 캐릭터", sampleUrl: sampleUrl("jBpfuIE2acCO8z3wKNLl"), provider: "elevenlabs", tags: ["여성", "귀여움", "애니", "캐릭터"] },
  { id: "zrHiDhphv9ZnVXBqCLjz", name: "Mimi", description: "🎈 장난스러운 어린 여성 — 애니메이션, 캐릭터", sampleUrl: sampleUrl("zrHiDhphv9ZnVXBqCLjz"), provider: "elevenlabs", tags: ["여성", "장난", "애니", "캐릭터"] },
];

// ── MP3 파일 크기 → 대략적 길이(프레임) 변환 ──
const BYTES_PER_SECOND = 16000;
const FPS = 30;

function estimateFramesFromFileSize(bytes: number): number {
  const seconds = bytes / BYTES_PER_SECOND;
  return Math.round(seconds * FPS);
}

const AUDIO_FILE_SIZES: Record<string, number> = {
  HOOK: 136298,
  PROBLEM: 313931,
  BACKGROUND: 333993,
  ANALYSIS_1: 249983,
  ANALYSIS_2: 168063,
  ANALYSIS_3: 146747,
  TWIST: 170571,
  SUMMARY: 205262,
  OUTRO: 122088,
};

function adjustSubSceneDurations(
  sectionId: string,
  subScenes: VideoConfig["sections"][0]["subScenes"]
): VideoConfig["sections"][0]["subScenes"] {
  const fileSize = AUDIO_FILE_SIZES[sectionId];
  if (!fileSize) return subScenes;

  const audioFrames = estimateFramesFromFileSize(fileSize);
  const originalTotal = subScenes.reduce((s, sc) => s + sc.durationFrames, 0);
  if (originalTotal === 0) return subScenes;

  return subScenes.map((sc) => ({
    ...sc,
    durationFrames: Math.max(30, Math.round((sc.durationFrames / originalTotal) * audioFrames)),
  }));
}

const BASE_SECTIONS: VideoConfig["sections"] = [
  { id: "HOOK", label: "🔥 후킹", narrationText: "잠깐만요, 금리가 내려가면 집값이 오른다고요? 근데 지금 데이터를 보면 완전히 반대 상황이 벌어지고 있습니다.", subScenes: [{ id: "HOOK-1", type: "breaking-banner", durationFrames: 150, headline: "긴급 속보", body: "금리 인하 → 집값 상승?", caption: "잠깐만요, 금리가 내려가면 집값이 오른다고요?", bgColor: "#0a0a1a", accentColor: "#ff0033", textColor: "#ffffff", sfx: "alarm" }, { id: "HOOK-2", type: "stat-counter", durationFrames: 150, headline: "현실은 정반대", numbers: [{ label: "금리 인하", value: -1.5, unit: "%p", color: "#00e676" }, { label: "집값 변동", value: -2.3, unit: "%", color: "#ff1744" }], caption: "근데 지금 데이터를 보면 완전히 반대 상황이 벌어지고 있습니다.", bgColor: "#0d1117", accentColor: "#ff6b35", textColor: "#ffffff", sfx: "impact" }, { id: "HOOK-3", type: "fullscreen-text", durationFrames: 150, headline: "끝까지 보시면", body: "2026년 내 집 마련\n타이밍을 잡습니다", caption: "이 영상 끝까지 보시면 타이밍을 정확히 잡으실 수 있습니다.", bgColor: "#1a0a2e", accentColor: "#ffd600", textColor: "#ffffff", sfx: "whoosh" }], audioFile: "voiceover/HOOK.mp3" },
  { id: "PROBLEM", label: "😰 문제 제기", narrationText: "요즘 부동산 기사 보시면 하루는 오른다, 하루는 내린다, 도대체 뭘 믿어야 할지 모르겠죠? 실제로 한국은행이 지난달 발표한 자료에 따르면 가계대출 증가율이 3개월 연속 둔화됐습니다. 금리는 내렸는데 대출은 줄고 있다는 겁니다.", subScenes: [{ id: "PROB-1", type: "keyword-explosion", durationFrames: 210, headline: "혼란의 부동산 시장", keywords: ["오른다!", "내린다!", "폭락?", "폭등?", "바닥?", "꼭대기?", "지금 사?", "기다려?"], caption: "요즘 부동산 기사 보시면 하루는 오른다, 하루는 내린다,", bgColor: "#1a1a2e", accentColor: "#e94560", textColor: "#ffffff", sfx: "pop" }, { id: "PROB-2", type: "fullscreen-text", durationFrames: 180, headline: "뭘 믿어야 하죠?", body: "전문가마다 다른 말\n데이터도 제각각", caption: "도대체 뭘 믿어야 할지 모르겠죠?", bgColor: "#16213e", accentColor: "#ff6b6b", textColor: "#ffffff", sfx: "bass-drop" }, { id: "PROB-3", type: "chart-line", durationFrames: 270, headline: "가계대출 증가율 추이", chartData: { type: "line", title: "가계대출 증가율", data: [{ label: "1월", value: 5.2 }, { label: "2월", value: 4.8 }, { label: "3월", value: 4.1 }, { label: "4월", value: 3.5 }, { label: "5월", value: 3.0 }, { label: "6월", value: 2.7 }], unit: "%" }, caption: "한국은행 발표 자료에 따르면 가계대출 증가율이 3개월 연속 둔화됐습니다.", bgColor: "#0d1117", accentColor: "#4ECDC4", textColor: "#ffffff", sfx: "reveal" }, { id: "PROB-4", type: "comparison-split", durationFrames: 210, headline: "이상한 현상", comparisonLeft: { label: "금리", value: "↓ 인하" }, comparisonRight: { label: "대출", value: "↓ 감소" }, caption: "금리는 내렸는데 대출은 줄고 있다는 겁니다.", bgColor: "#0a0a1a", accentColor: "#ffd600", textColor: "#ffffff", sfx: "impact" }, { id: "PROB-5", type: "stat-counter", durationFrames: 180, headline: "3개월 연속 둔화", numbers: [{ label: "4월", value: 3.5, unit: "%", color: "#F7DC6F" }, { label: "5월", value: 3.0, unit: "%", color: "#F39C12" }, { label: "6월", value: 2.7, unit: "%", color: "#E74C3C" }], caption: "가계대출 증가율이 3개월 연속 둔화됐습니다.", bgColor: "#1a0a2e", accentColor: "#E74C3C", textColor: "#ffffff", sfx: "ding" }, { id: "PROB-6", type: "transition-swoosh", durationFrames: 60, bgColor: "#0d1117", accentColor: "#4ECDC4", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/PROBLEM.mp3" },
  { id: "BACKGROUND", label: "📚 배경 설명", narrationText: "이걸 이해하려면 먼저 한 가지를 알아야 합니다. 금리와 집값의 관계는 우리가 생각하는 것만큼 단순하지 않습니다. 서울대 경제학과 김모 교수에 따르면 금리 인하 효과가 부동산 시장에 반영되기까지 평균 6개월에서 12개월이 걸립니다.", subScenes: [{ id: "BG-1", type: "title-impact", durationFrames: 180, headline: "핵심 포인트", body: "금리 ≠ 집값\n그렇게 단순하지 않습니다", caption: "금리와 집값의 관계는 우리가 생각하는 것만큼 단순하지 않습니다.", bgColor: "#0f3460", accentColor: "#e94560", textColor: "#ffffff", sfx: "impact" }, { id: "BG-2", type: "timeline-progress", durationFrames: 240, headline: "금리 인하 → 시장 반영", body: "평균 6~12개월 소요", listItems: ["금리 인하 결정", "시중은행 대출금리 하락", "대출 수요 증가", "매수세 유입", "가격 반영"], caption: "금리 인하 효과가 부동산 시장에 반영되기까지 평균 6개월에서 12개월이 걸립니다.", bgColor: "#1a1a2e", accentColor: "#00e676", textColor: "#ffffff", sfx: "typing" }, { id: "BG-3", type: "quote-highlight", durationFrames: 240, headline: "전문가 의견", body: '"금리 인하 효과는\n최소 6개월 뒤에 나타납니다"', caption: "서울대 경제학과 김모 교수", bgColor: "#16213e", accentColor: "#ffd600", textColor: "#ffffff", sfx: "reveal" }, { id: "BG-4", type: "comparison-split", durationFrames: 210, headline: "지금 vs 6개월 후", comparisonLeft: { label: "현재", value: "가격 횡보" }, comparisonRight: { label: "6개월 후", value: "상승 가능성" }, caption: "지금 당장 안 올랐다고 앞으로도 안 오를 거라는 건 다른 이야기입니다.", bgColor: "#0a0a1a", accentColor: "#4ECDC4", textColor: "#ffffff", sfx: "whoosh" }, { id: "BG-5", type: "data-card-stack", durationFrames: 240, headline: "역사적 패턴", numbers: [{ label: "2015년 인하", value: 8.2, unit: "%↑", color: "#E74C3C" }, { label: "2019년 인하", value: 12.5, unit: "%↑", color: "#FF5722" }, { label: "2020년 인하", value: 15.3, unit: "%↑", color: "#ff1744" }], caption: "과거 금리 인하 후 6~12개월 뒤 수도권 아파트 가격 상승률입니다.", bgColor: "#0d1117", accentColor: "#E74C3C", textColor: "#ffffff", sfx: "ding" }, { id: "BG-6", type: "fullscreen-text", durationFrames: 180, headline: "그래서 지금이", body: "가장 중요한\n판단의 시기입니다", bgColor: "#1a0a2e", accentColor: "#ffd600", textColor: "#ffffff", sfx: "bass-drop" }, { id: "BG-7", type: "transition-swoosh", durationFrames: 60, bgColor: "#0f3460", accentColor: "#e94560", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/BACKGROUND.mp3" },
  { id: "ANALYSIS_1", label: "🔍 분석 1: 공급", narrationText: "첫 번째 핵심은 공급입니다. 2026년 수도권 아파트 입주 물량이 역대 최저 수준입니다. 올해 예정된 입주 물량은 전년 대비 35% 감소한 12만 가구에 불과합니다.", subScenes: [{ id: "A1-1", type: "title-impact", durationFrames: 150, headline: "핵심 #1", body: "공급 절벽", bgColor: "#1a0a2e", accentColor: "#ff0033", textColor: "#ffffff", sfx: "impact" }, { id: "A1-2", type: "chart-bar", durationFrames: 300, headline: "수도권 아파트 입주물량", chartData: { type: "bar", title: "연도별 입주물량", data: [{ label: "2023", value: 22, color: "#4ECDC4" }, { label: "2024", value: 18.5, color: "#45B7D1" }, { label: "2025", value: 15, color: "#F7DC6F" }, { label: "2026", value: 12, color: "#E74C3C" }], unit: "만 가구" }, caption: "2026년 입주물량은 전년 대비 35% 감소한 12만 가구입니다.", bgColor: "#0d1117", accentColor: "#E74C3C", textColor: "#ffffff", sfx: "reveal" }, { id: "A1-3", type: "stat-counter", durationFrames: 210, headline: "역대 최저 입주물량", numbers: [{ label: "감소율", value: 35, unit: "%", color: "#ff1744" }, { label: "입주물량", value: 12, unit: "만", color: "#ffd600" }], caption: "역대 최저 수준의 입주 물량입니다.", bgColor: "#1a1a2e", accentColor: "#ff6b35", textColor: "#ffffff", sfx: "bass-drop" }, { id: "A1-4", type: "verdict-stamp", durationFrames: 180, headline: "공급 부족", body: "가격 상승 압력 ↑", bgColor: "#0a0a1a", accentColor: "#ff0033", textColor: "#ffffff", sfx: "impact" }, { id: "A1-5", type: "emoji-rain", durationFrames: 150, headline: "공급이 줄면?", body: "가격은 올라갈 수밖에", keywords: ["🏠", "📈", "💰", "🔥", "⬆️"], caption: "공급이 줄면 당연히 가격은 올라갈 수밖에 없습니다.", bgColor: "#16213e", accentColor: "#00e676", textColor: "#ffffff", sfx: "pop" }, { id: "A1-6", type: "transition-swoosh", durationFrames: 60, bgColor: "#0d1117", accentColor: "#4ECDC4", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/ANALYSIS_1.mp3" },
  { id: "ANALYSIS_2", label: "🔍 분석 2: 수요", narrationText: "두 번째 핵심은 숨어 있는 수요입니다. 전세 만기가 돌아오는 2026년 하반기에 대규모 매수 전환이 예상됩니다.", subScenes: [{ id: "A2-1", type: "title-impact", durationFrames: 150, headline: "핵심 #2", body: "숨은 수요 폭발", bgColor: "#0f3460", accentColor: "#ffd600", textColor: "#ffffff", sfx: "impact" }, { id: "A2-2", type: "stat-counter", durationFrames: 240, headline: "전세 만기 도래", numbers: [{ label: "만기 세대", value: 48, unit: "만", color: "#FF9800" }, { label: "매수 전환 예상", value: 30, unit: "%", color: "#4CAF50" }], caption: "전세 만기가 돌아오는 하반기에 대규모 매수 전환이 예상됩니다.", bgColor: "#0d1117", accentColor: "#FF9800", textColor: "#ffffff", sfx: "reveal" }, { id: "A2-3", type: "list-reveal", durationFrames: 240, headline: "매수 전환 시그널", listItems: ["전세 만기 대규모 도래", "전세 → 매매 전환 증가", "대기 수요 누적", "신규 분양 감소"], caption: "지금 당장 매수하지 않는 사람들이 사라진 게 아닙니다.", bgColor: "#1a1a2e", accentColor: "#2ECC71", textColor: "#ffffff", sfx: "typing" }, { id: "A2-4", type: "cta-subscribe", durationFrames: 180, headline: "여러분 생각은?", body: "댓글로 알려주세요!", bgColor: "#e94560", accentColor: "#ffffff", textColor: "#ffffff", sfx: "ding" }, { id: "A2-5", type: "transition-swoosh", durationFrames: 60, bgColor: "#0d1117", accentColor: "#e94560", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/ANALYSIS_2.mp3" },
  { id: "ANALYSIS_3", label: "🔍 분석 3: 정책", narrationText: "세 번째는 정부 정책입니다. 현재 정부의 부동산 정책 기조를 보면 규제 완화 방향이 뚜렷합니다.", subScenes: [{ id: "A3-1", type: "title-impact", durationFrames: 150, headline: "핵심 #3", body: "정책 대전환", bgColor: "#533483", accentColor: "#00e676", textColor: "#ffffff", sfx: "impact" }, { id: "A3-2", type: "chart-pie", durationFrames: 240, headline: "정부 부동산 정책 방향", chartData: { type: "pie", title: "정책 방향", data: [{ label: "대출 완화", value: 40, color: "#3498DB" }, { label: "세금 감면", value: 35, color: "#2ECC71" }, { label: "재건축", value: 25, color: "#E67E22" }] }, caption: "대출 규제 완화, 세금 감면, 재건축 활성화가 동시에 진행 중입니다.", bgColor: "#0d1117", accentColor: "#3498DB", textColor: "#ffffff", sfx: "reveal" }, { id: "A3-3", type: "keyword-explosion", durationFrames: 180, headline: "규제 완화 3종 세트", keywords: ["대출 완화", "세금 감면", "재건축 활성화"], caption: "이 세 가지가 동시에 진행되고 있습니다.", bgColor: "#1a0a2e", accentColor: "#ffd600", textColor: "#ffffff", sfx: "pop" }, { id: "A3-4", type: "transition-swoosh", durationFrames: 60, bgColor: "#0d1117", accentColor: "#533483", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/ANALYSIS_3.mp3" },
  { id: "TWIST", label: "🔄 반전", narrationText: "근데 여기서 반전이 있습니다. 모든 지역이 다 오르는 건 아닙니다. 사람들이 가장 안전하다고 생각하는 곳이 오히려 가장 위험할 수 있습니다.", subScenes: [{ id: "TW-1", type: "verdict-stamp", durationFrames: 180, headline: "⚠️ 반전 주의", body: "모든 지역이\n오르는 건 아닙니다", bgColor: "#0a0a1a", accentColor: "#ff0033", textColor: "#ffffff", sfx: "alarm" }, { id: "TW-2", type: "comparison-split", durationFrames: 240, headline: "안전 vs 위험", comparisonLeft: { label: "구축 + 교통확정", value: "✅ 안전" }, comparisonRight: { label: "신도시 + 입주폭탄", value: "❌ 위험" }, caption: "가장 안전하다고 생각하는 곳이 오히려 가장 위험할 수 있습니다.", bgColor: "#1a1a2e", accentColor: "#ffd600", textColor: "#ffffff", sfx: "impact" }, { id: "TW-3", type: "list-reveal", durationFrames: 240, headline: "전문가 공통 경고", listItems: ["입주물량 몰리는 신도시", "교통 미확정 지역", "투기 수요 과열 지역", "인구 유출 지역"], caption: "전문가들이 공통으로 지목하는 위험 지역입니다.", bgColor: "#16213e", accentColor: "#E74C3C", textColor: "#ffffff", sfx: "typing" }, { id: "TW-4", type: "data-card-stack", durationFrames: 240, headline: "💡 꿀팁", numbers: [{ label: "교통 확정", value: 1, unit: "순위", color: "#4CAF50" }, { label: "구축 아파트", value: 2, unit: "순위", color: "#2196F3" }, { label: "학군 우수", value: 3, unit: "순위", color: "#FF9800" }], body: "교통 인프라 확정된\n구축 아파트가 안전합니다", caption: "교통 인프라가 확정된 구축 아파트가 신축보다 안전합니다.", bgColor: "#0d1117", accentColor: "#00e676", textColor: "#ffffff", sfx: "success" }, { id: "TW-5", type: "fullscreen-text", durationFrames: 180, headline: "기억하세요", body: "신축이 항상\n정답은 아닙니다", bgColor: "#1a0a2e", accentColor: "#ff6b35", textColor: "#ffffff", sfx: "bass-drop" }, { id: "TW-6", type: "transition-swoosh", durationFrames: 60, bgColor: "#0d1117", accentColor: "#e94560", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/TWIST.mp3" },
  { id: "SUMMARY", label: "📋 정리", narrationText: "정리하겠습니다. 첫째, 공급 부족. 둘째, 숨은 수요 폭발. 셋째, 정부 정책 완화. 하지만 지역 선별이 핵심입니다.", subScenes: [{ id: "SUM-1", type: "title-impact", durationFrames: 150, headline: "📋 최종 정리", body: "3가지 핵심 요약", bgColor: "#0f3460", accentColor: "#ffd600", textColor: "#ffffff", sfx: "impact" }, { id: "SUM-2", type: "list-reveal", durationFrames: 300, headline: "핵심 요약", listItems: ["① 공급 부족 → 가격 상승 압력", "② 숨은 수요 → 하반기 폭발", "③ 정책 완화 → 매수 환경 조성"], caption: "공급 부족, 숨은 수요 폭발, 정부 정책 완화 방향입니다.", bgColor: "#1a1a2e", accentColor: "#4ECDC4", textColor: "#ffffff", sfx: "reveal" }, { id: "SUM-3", type: "verdict-stamp", durationFrames: 210, headline: "⚠️ 핵심 경고", body: "지역 선별이\n가장 중요합니다", caption: "무조건 오른다는 말에 현혹되지 마시고 입주 물량과 교통을 확인하세요.", bgColor: "#0a0a1a", accentColor: "#E74C3C", textColor: "#ffffff", sfx: "alarm" }, { id: "SUM-4", type: "data-card-stack", durationFrames: 240, headline: "체크리스트", numbers: [{ label: "입주물량", value: 1, unit: "확인", color: "#E74C3C" }, { label: "교통인프라", value: 2, unit: "확인", color: "#FF9800" }, { label: "학군/편의", value: 3, unit: "확인", color: "#4CAF50" }], caption: "입주 물량과 교통 인프라를 꼭 확인하세요.", bgColor: "#0d1117", accentColor: "#ffd600", textColor: "#ffffff", sfx: "typing" }, { id: "SUM-5", type: "transition-swoosh", durationFrames: 60, bgColor: "#0d1117", accentColor: "#00e676", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/SUMMARY.mp3" },
  { id: "OUTRO", label: "👋 아웃트로", narrationText: "다음 영상에서는 지금 사야 할 서울 아파트 5곳을 분석합니다. 구독과 알림 설정 꼭 해주세요.", subScenes: [{ id: "OUT-1", type: "fullscreen-text", durationFrames: 180, headline: "다음 영상 예고", body: "지금 사야 할\n서울 아파트 TOP 5", caption: "다음 영상에서는 지금 사야 할 서울 아파트 5곳을 분석합니다.", bgColor: "#1a0a2e", accentColor: "#ff6b35", textColor: "#ffffff", sfx: "whoosh" }, { id: "OUT-2", type: "cta-subscribe", durationFrames: 300, headline: "구독 & 알림 🔔", body: "좋아요 · 구독 · 알림설정\n감사합니다!", caption: "구독과 알림 설정 꼭 해주시고, 좋아요 한번 부탁드립니다.", bgColor: "#e94560", accentColor: "#ffffff", textColor: "#ffffff", sfx: "success" }, { id: "OUT-3", type: "transition-swoosh", durationFrames: 90, bgColor: "#0a0a1a", accentColor: "#ffd600", textColor: "#ffffff", sfx: "swoosh" }], audioFile: "voiceover/OUTRO.mp3" },
];

const ADJUSTED_SECTIONS = BASE_SECTIONS.map((section) => ({
  ...section,
  subScenes: adjustSubSceneDurations(section.id, section.subScenes),
}));

const baseConfig: VideoConfig = {
  title: "전문가도 놀란 2026 수도권 집값의 3가지 함정",
  description: "금리 인하 이후 부동산 시장의 숨은 진실을 파헤칩니다.",
  tags: ["부동산", "집값", "금리", "수도권", "아파트", "2026", "경제", "투자", "재테크", "뉴스", "시사", "분석", "전망", "한국은행", "대출", "전세", "월세", "부동산시장", "서울", "수도권아파트"],
  hashtags: ["#부동산", "#집값전망", "#금리인하", "#2026부동산", "#경제뉴스"],
  topic: "2026년 수도권 아파트 가격 전망",
  fps: 30,
  width: 1920,
  height: 1080,
  bgmFile: "bgm/news-ambient.mp3",
  bgmVolume: 0.08,
  thumbnailFile: "thumbnails/thumb.jpg",
  selectedVoice: VOICE_OPTIONS[0]!,
  totalDurationFrames: 0,
  sections: ADJUSTED_SECTIONS,
};

baseConfig.totalDurationFrames = baseConfig.sections.reduce(
  (total, section) => total + section.subScenes.reduce((s, sc) => s + sc.durationFrames, 0),
  0
);

const selectedVoiceFromGenerated =
  generated?.selectedVoiceId
    ? VOICE_OPTIONS.find((v) => v.id === generated.selectedVoiceId) ?? VOICE_OPTIONS[0]!
    : baseConfig.selectedVoice;

export const DEFAULT_CONFIG: VideoConfig = generated?.sections?.length
  ? (() => {
      const genSections = generated.sections as VideoConfig["sections"];
      const adjustedSections = genSections.map((sec) => ({
        ...sec,
        subScenes: adjustSubSceneDurations(sec.id, sec.subScenes),
      }));
      const totalFrames = adjustedSections.reduce(
        (t, s) => t + s.subScenes.reduce((a, sc) => a + sc.durationFrames, 0),
        0
      );
      return {
        ...baseConfig,
        sections: adjustedSections,
        title: generated.title ?? baseConfig.title,
        description: generated.description ?? baseConfig.description,
        tags: generated.tags ?? baseConfig.tags,
        hashtags: generated.hashtags ?? baseConfig.hashtags,
        topic: generated.topic ?? baseConfig.topic,
        totalDurationFrames: totalFrames,
        selectedVoice: selectedVoiceFromGenerated,
        bgmFile:
          (typeof (generated as Record<string, unknown>).bgmFile === "string"
            ? (generated as Record<string, unknown>).bgmFile
            : baseConfig.bgmFile) as string,
        bgmVolume:
          typeof (generated as Record<string, unknown>).bgmVolume === "number"
            ? ((generated as Record<string, unknown>).bgmVolume as number)
            : baseConfig.bgmVolume,
      };
    })()
  : baseConfig;

// ── generated-script.json이 있으면 우선 사용 ──
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const script = require("./generated-script.json") as Record<string, unknown>;
  if (script && Array.isArray(script.sections) && script.sections.length > 0) {
    Object.assign(DEFAULT_CONFIG, script);
    const recalc = (DEFAULT_CONFIG.sections as { subScenes?: { durationFrames?: number }[] }[]).reduce(
      (sum: number, sec: { subScenes?: { durationFrames?: number }[] }) =>
        sum +
        (sec.subScenes || []).reduce(
          (s: number, ss: { durationFrames?: number }) =>
            s + (ss.durationFrames || 150),
          0
        ),
      0
    );
    DEFAULT_CONFIG.totalDurationFrames = Math.max(
      recalc,
      Number(script.totalDurationFrames) || 0
    );
    console.log(
      `[config] generated-script.json 로드: ${DEFAULT_CONFIG.totalDurationFrames} frames = ${(DEFAULT_CONFIG.totalDurationFrames / 30 / 60).toFixed(1)}분`
    );
  }
} catch {
  // generated-script.json이 없으면 기본값 사용
}
