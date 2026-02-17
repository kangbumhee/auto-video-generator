// src/bgm-selector.ts
// ============================================================
// 주제/카테고리/톤에 따라 최적의 BGM을 자동 선택
// ============================================================

interface BgmOption {
  file: string;
  keywords: string[];
  mood: string[];
  categories: string[];
}

const BGM_OPTIONS: BgmOption[] = [
  // 경제
  {
    file: "bgm/economy-serious.mp3",
    keywords: [
      "금리",
      "주식",
      "하락",
      "위기",
      "폭락",
      "경기침체",
      "인플레이션",
      "불안",
      "경고",
    ],
    mood: ["dramatic", "documentary"],
    categories: ["economy", "finance", "realestate"],
  },
  {
    file: "bgm/economy-hopeful.mp3",
    keywords: [
      "투자",
      "재테크",
      "성장",
      "상승",
      "기회",
      "전망",
      "희망",
      "수익",
    ],
    mood: ["news", "casual", "lecture", "youtuber", "anchor"],
    categories: ["economy", "finance", "realestate"],
  },
  // 기술
  {
    file: "bgm/tech-futuristic.mp3",
    keywords: [
      "AI",
      "인공지능",
      "로봇",
      "미래",
      "자동화",
      "메타버스",
      "가상",
      "첨단",
    ],
    mood: ["documentary", "dramatic"],
    categories: ["tech"],
  },
  {
    file: "bgm/tech-innovation.mp3",
    keywords: [
      "스타트업",
      "앱",
      "플랫폼",
      "디지털",
      "혁신",
      "개발",
      "코딩",
      "IT",
    ],
    mood: ["news", "casual", "lecture", "youtuber"],
    categories: ["tech"],
  },
  // 사회
  {
    file: "bgm/society-documentary.mp3",
    keywords: [
      "사건",
      "논란",
      "갈등",
      "시위",
      "분쟁",
      "범죄",
      "위기",
      "문제",
    ],
    mood: ["documentary", "dramatic"],
    categories: ["society"],
  },
  {
    file: "bgm/society-emotional.mp3",
    keywords: [
      "복지",
      "환경",
      "교육",
      "인권",
      "변화",
      "사회",
      "세대",
      "문화",
    ],
    mood: ["news", "casual", "lecture"],
    categories: ["society"],
  },
  // 과학
  {
    file: "bgm/science-wonder.mp3",
    keywords: [
      "우주",
      "행성",
      "은하",
      "블랙홀",
      "양자",
      "DNA",
      "진화",
      "발견",
    ],
    mood: ["documentary", "dramatic"],
    categories: ["science"],
  },
  {
    file: "bgm/science-discovery.mp3",
    keywords: ["연구", "실험", "과학", "의학", "신약", "기술", "데이터"],
    mood: ["news", "lecture"],
    categories: ["science"],
  },
  // 건강
  {
    file: "bgm/health-calm.mp3",
    keywords: [
      "건강",
      "의학",
      "치료",
      "질병",
      "운동",
      "다이어트",
      "영양",
      "수면",
      "스트레스",
    ],
    mood: ["news", "casual", "lecture", "documentary"],
    categories: ["health"],
  },
  // 역사
  {
    file: "bgm/history-epic.mp3",
    keywords: [
      "역사",
      "전쟁",
      "왕조",
      "문명",
      "고대",
      "중세",
      "혁명",
      "독립",
      "제국",
    ],
    mood: ["documentary", "dramatic", "lecture"],
    categories: ["history"],
  },
  // 라이프스타일
  {
    file: "bgm/lifestyle-bright.mp3",
    keywords: [
      "여행",
      "맛집",
      "패션",
      "인테리어",
      "취미",
      "일상",
      "브이로그",
      "루틴",
    ],
    mood: ["casual", "news", "youtuber"],
    categories: ["lifestyle"],
  },
  // 교육
  {
    file: "bgm/education-focus.mp3",
    keywords: [
      "공부",
      "학습",
      "시험",
      "대학",
      "강의",
      "지식",
      "설명",
      "이해",
      "분석",
    ],
    mood: ["lecture", "news", "documentary"],
    categories: ["education"],
  },
  // 엔터테인먼트
  {
    file: "bgm/entertainment-fun.mp3",
    keywords: [
      "연예",
      "드라마",
      "영화",
      "게임",
      "음악",
      "아이돌",
      "예능",
      "유머",
    ],
    mood: ["casual", "dramatic", "youtuber"],
    categories: ["entertainment"],
  },
  // 정치
  {
    file: "bgm/politics-tension.mp3",
    keywords: [
      "정치",
      "선거",
      "국회",
      "대통령",
      "외교",
      "북한",
      "미국",
      "중국",
      "국제",
      "안보",
    ],
    mood: ["documentary", "dramatic", "news", "anchor"],
    categories: ["politics", "current", "policy"],
  },
  // 기본
  { file: "bgm/default-ambient.mp3", keywords: [], mood: [], categories: [] },
];

export function selectBgm(
  topic: string,
  category: string,
  tone: string
): string {
  const topicLower = topic.toLowerCase();
  let bestMatch = "bgm/default-ambient.mp3";
  let bestScore = 0;

  for (const option of BGM_OPTIONS) {
    let score = 0;

    // 카테고리 매칭 (가중치 높음)
    if (option.categories.includes(category)) {
      score += 10;
    }

    // 톤/무드 매칭
    if (option.mood.includes(tone)) {
      score += 5;
    }

    // 키워드 매칭
    for (const kw of option.keywords) {
      if (topicLower.includes(kw.toLowerCase())) {
        score += 3;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = option.file;
    }
  }

  return bestMatch;
}

export function getBgmDescription(bgmFile: string): string {
  const descriptions: Record<string, string> = {
    "bgm/economy-serious.mp3": "경제 — 진지하고 긴장감 있는 배경음",
    "bgm/economy-hopeful.mp3": "경제 — 희망적이고 상승하는 느낌",
    "bgm/tech-futuristic.mp3": "기술 — 미래지향적 전자음",
    "bgm/tech-innovation.mp3": "기술 — 혁신적이고 깔끔한 느낌",
    "bgm/society-documentary.mp3": "사회 — 다큐멘터리풍 웅장한 음악",
    "bgm/society-emotional.mp3": "사회 — 감성적이고 울림 있는 음악",
    "bgm/science-wonder.mp3": "과학 — 신비롭고 경이로운 느낌",
    "bgm/science-discovery.mp3": "과학 — 발견과 탐구의 느낌",
    "bgm/health-calm.mp3": "건강 — 차분하고 신뢰감 있는 음악",
    "bgm/history-epic.mp3": "역사 — 장엄하고 서사적인 음악",
    "bgm/lifestyle-bright.mp3": "라이프스타일 — 밝고 경쾌한 음악",
    "bgm/education-focus.mp3": "교육 — 집중할 수 있는 차분한 음악",
    "bgm/entertainment-fun.mp3": "엔터테인먼트 — 재미있고 활기찬 음악",
    "bgm/politics-tension.mp3": "정치 — 긴장감 있는 뉴스 배경음",
    "bgm/default-ambient.mp3": "기본 — 범용 배경음",
    "bgm/news-ambient.mp3": "기본 — 뉴스 배경음",
  };
  return descriptions[bgmFile] || "배경음악";
}
