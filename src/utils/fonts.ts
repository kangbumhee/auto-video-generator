// ============================================================
// 폰트 로딩 — Remotion 공식 스킬: fonts.md
// ============================================================

// ── Noto Sans KR (한국어 본문) ──────────────────────
// Noto Sans KR은 CJK 폰트라 subset이 [0]~[119]+latin 식으로 잘게 나뉨
// → subset 지정 불가 (korean이라는 subset 없음)
// → 필요 weight만 지정 + 경고 무시
import { loadFont as loadNotoSansKR } from "@remotion/google-fonts/NotoSansKR";

const { fontFamily: notoSansKR } = loadNotoSansKR("normal", {
  weights: ["400", "700", "900"],
  ignoreTooManyRequestsWarning: true,
});

export { notoSansKR };

// ── Montserrat (영문 타이틀) ────────────────────────
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

export { montserrat };
