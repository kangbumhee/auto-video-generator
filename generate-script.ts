// ============================================================
// AI 대본 자동 생성 — Gemini API 활용
// ============================================================

import { writeFileSync } from "fs";
import "dotenv/config";

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.error("❌ GEMINI_API_KEY가 .env에 없습니다!");
  process.exit(1);
}

const TOPIC = process.argv[2] || "2026년 수도권 아파트 가격 전망";

const SYSTEM_PROMPT = `당신은 조회수 13.7억 이상을 기록한 바이럴 유튜브 뉴스 콘텐츠 전문가입니다.

## 대본 규칙
- 10분 분량 (약 1,500자 한국어)
- 존댓말 사용
- 이모지 금지
- 연출 지시문 금지 — 나레이션 대사만
- 문장당 15~25자 (자막 가독성)

## 필수 구조
각 섹션을 [SECTION:ID|시작-끝] 형태로 출력:

1. HOOK (0:00~0:15): 패턴 인터럽트 + 충격 수치/질문, 약속
2. PROBLEM (0:15~1:30): 공감 + 구체적 데이터
3. BACKGROUND (1:30~3:30): 맥락, 전문가 1명 인용, 비유 가능
4. ANALYSIS_1 (3:30~5:00): Setup→Tension→Payoff, 미니 후킹
5. ANALYSIS_2 (5:00~6:00): 두 번째 핵심, 댓글 참여 유도
6. ANALYSIS_3 (6:00~6:30): 세 번째 핵심, 50% 지점 구독 CTA
7. TWIST (6:30~8:00): "반전", 예상과 다른 데이터, 유머/팁 1개
8. SUMMARY (8:00~9:30): 핵심 3줄 요약, 전망, 실용 조언
9. OUTRO (9:30~10:00): 다음 영상 예고, 구독+알림 CTA

## 추가 출력
- TITLE: 클릭유도 제목 (숫자+감정+구체성)
- TAGS: 쉼표 구분 20개
- HASHTAGS: #으로 시작 5개
- IMAGE_SUGGESTIONS: 섹션별 배경 이미지 설명
- CHART_DATA: 섹션에 차트가 필요하면 JSON으로 {type, title, data:[{label,value}], unit}

주제: "${TOPIC}"`;

async function generateScript() {
  console.log("📝 AI 대본 생성 중...");
  console.log(`  주제: ${TOPIC}`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const first = data.candidates?.[0];
  const scriptText =
    (first?.content?.parts?.[0] as { text?: string } | undefined)?.text ||
    "생성 실패";

  writeFileSync("public/script-raw.txt", scriptText);
  console.log("✅ 대본 원본 저장: public/script-raw.txt");

  writeFileSync(
    "public/script-parsed.json",
    JSON.stringify({ topic: TOPIC, raw: scriptText }, null, 2)
  );
  console.log("✅ 파싱 데이터 저장: public/script-parsed.json");
  console.log("");
  console.log("⚠️  config.ts를 수동 업데이트하거나 서버 UI에서 수정하세요.");
}

generateScript().catch(console.error);
