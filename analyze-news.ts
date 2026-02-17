// ============================================================
// 뉴스 리서치 — Gemini API
// ============================================================

import { writeFileSync } from "fs";
import "dotenv/config";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const TOPIC = process.argv[2] || "부동산 경제 시사 뉴스";

async function analyzeNews() {
  console.log(`🔍 뉴스 리서치 시작: "${TOPIC}"`);

  const prompt = `당신은 한국 뉴스 리서치 전문가입니다.
"${TOPIC}" 주제로 유튜브 10분 영상을 만들려 합니다.

다음을 조사하여 구조화된 JSON으로 출력하세요:
1. 최근 1개월 내 주요 뉴스 5개 (제목, 핵심내용, 출처)
2. 관련 통계 데이터 3개 (수치, 출처, 날짜)
3. 전문가 의견 2개 (이름, 소속, 핵심 발언)
4. 시청자가 궁금해할 질문 5개
5. 영상 제목 후보 5개 (클릭 유도형)
6. 추천 차트/그래프 데이터 2개

JSON 형태로만 출력하세요.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
      }),
    }
  );

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const first = data.candidates?.[0];
  const result =
    (first?.content?.parts?.[0] as { text?: string } | undefined)?.text ||
    "분석 실패";

  writeFileSync("public/news-research.json", result);
  console.log("✅ 뉴스 리서치 완료: public/news-research.json");
}

analyzeNews().catch(console.error);
