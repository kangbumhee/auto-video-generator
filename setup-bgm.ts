// setup-bgm.ts
// ============================================================
// 카테고리별 무료 BGM 플레이스홀더 생성 + 다운로드 안내
// 실행: npx tsx setup-bgm.ts
// ============================================================

import fs from "fs";
import path from "path";

const __dirname = process.cwd();
const bgmDir = path.join(__dirname, "public", "bgm");
if (!fs.existsSync(bgmDir)) fs.mkdirSync(bgmDir, { recursive: true });

// 카테고리별 BGM 설정
const BGM_CATALOG = [
  {
    file: "economy-serious.mp3",
    desc: "경제/재테크 — 진지하고 긴장감 있는 배경음",
    searchTerm: "cinematic tension corporate",
  },
  {
    file: "economy-hopeful.mp3",
    desc: "경제/재테크 — 희망적이고 상승하는 느낌",
    searchTerm: "hopeful inspiring corporate",
  },
  {
    file: "tech-futuristic.mp3",
    desc: "기술/IT — 미래지향적 전자음",
    searchTerm: "futuristic technology electronic",
  },
  {
    file: "tech-innovation.mp3",
    desc: "기술/IT — 혁신적이고 깔끔한 느낌",
    searchTerm: "innovation modern minimal",
  },
  {
    file: "society-documentary.mp3",
    desc: "사회/이슈 — 다큐멘터리풍 웅장한 음악",
    searchTerm: "documentary cinematic dramatic",
  },
  {
    file: "society-emotional.mp3",
    desc: "사회/이슈 — 감성적이고 울림 있는 음악",
    searchTerm: "emotional piano ambient",
  },
  {
    file: "science-wonder.mp3",
    desc: "과학/우주 — 신비롭고 경이로운 느낌",
    searchTerm: "space wonder ambient cinematic",
  },
  {
    file: "science-discovery.mp3",
    desc: "과학/우주 — 발견과 탐구의 느낌",
    searchTerm: "discovery exploration orchestral",
  },
  {
    file: "health-calm.mp3",
    desc: "건강/의학 — 차분하고 신뢰감 있는 음악",
    searchTerm: "calm medical corporate soft",
  },
  {
    file: "history-epic.mp3",
    desc: "역사/문화 — 장엄하고 서사적인 음악",
    searchTerm: "epic historical orchestral",
  },
  {
    file: "lifestyle-bright.mp3",
    desc: "라이프스타일 — 밝고 경쾌한 음악",
    searchTerm: "bright upbeat lifestyle vlog",
  },
  {
    file: "education-focus.mp3",
    desc: "교육/학습 — 집중할 수 있는 차분한 음악",
    searchTerm: "focus study ambient lo-fi",
  },
  {
    file: "entertainment-fun.mp3",
    desc: "엔터테인먼트 — 재미있고 활기찬 음악",
    searchTerm: "fun energetic upbeat pop",
  },
  {
    file: "politics-tension.mp3",
    desc: "정치/국제 — 긴장감 있는 뉴스 배경음",
    searchTerm: "news tension dramatic breaking",
  },
  {
    file: "default-ambient.mp3",
    desc: "기본 — 범용 뉴스/해설 배경음",
    searchTerm: "ambient news background soft",
  },
];

console.log("\n╔══════════════════════════════════════════╗");
console.log("║     BGM 세트 설정                          ║");
console.log("╚══════════════════════════════════════════╝\n");

// 최소한의 플레이스홀더 파일 생성 (실제 재생용 아님, 파이프라인 통과용)
function createPlaceholderMp3(filePath: string) {
  const buf = Buffer.alloc(15000);
  buf[0] = 0xff;
  buf[1] = 0xfb;
  buf[2] = 0x90;
  fs.writeFileSync(filePath, buf);
}

let created = 0;
let existing = 0;

for (const bgm of BGM_CATALOG) {
  const filePath = path.join(bgmDir, bgm.file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
    existing++;
    console.log(`  ✅ ${bgm.file} (이미 존재)`);
  } else {
    createPlaceholderMp3(filePath);
    created++;
    console.log(`  📝 ${bgm.file} (플레이스홀더 생성)`);
  }
}

// news-ambient.mp3도 생성 (기본 BGM)
const defaultBgm = path.join(bgmDir, "news-ambient.mp3");
if (!fs.existsSync(defaultBgm) || fs.statSync(defaultBgm).size < 1000) {
  createPlaceholderMp3(defaultBgm);
  created++;
  console.log(`  📝 news-ambient.mp3 (기본 BGM 플레이스홀더)`);
}

console.log(`\n✅ 완료: ${created}개 생성, ${existing}개 기존 유지`);
console.log("\n📥 실제 BGM 파일로 교체하려면 아래 사이트에서 다운로드하세요:");
console.log("   • https://pixabay.com/music/");
console.log("   • https://mixkit.co/free-stock-music/");
console.log("   • https://www.bensound.com/");
console.log("\n각 파일의 추천 검색어:");
BGM_CATALOG.forEach((bgm) => {
  console.log(`   ${bgm.file}: "${bgm.searchTerm}"`);
});
console.log("");
