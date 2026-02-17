// src/pricing.ts
// ============================================================
// 요금제 정의 — Free / Pro / Enterprise
// ============================================================

export interface PricingTier {
  id: "free" | "pro" | "enterprise";
  name: string;
  nameKo: string;
  price: number;
  priceDisplay: string;
  features: string[];
  limits: {
    videosPerDay: number;
    videosPerMonth: number;
    maxDurationMinutes: number;
    ttsCharactersPerMonth: number;
    maxResolution: "720p" | "1080p" | "4K";
    watermark: boolean;
    priorityRender: boolean;
    customBranding: boolean;
    apiAccess: boolean;
    bulkExport: boolean;
    teamMembers: number;
    storageGb: number;
    bgmLibrary: "basic" | "full";
    sfxLibrary: "basic" | "full";
    thumbnailAi: boolean;
    seoOptimizer: boolean;
    autoUpload: boolean;
    analyticsAdvanced: boolean;
  };
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    nameKo: "무료",
    price: 0,
    priceDisplay: "₩0",
    features: [
      "하루 2회 영상 생성",
      "월 10회 영상 생성",
      "최대 5분 영상",
      "720p 해상도",
      "워터마크 포함",
      "기본 효과음 5종",
      "기본 BGM 3곡",
      "음성 2종 선택",
    ],
    limits: {
      videosPerDay: 2,
      videosPerMonth: 10,
      maxDurationMinutes: 5,
      ttsCharactersPerMonth: 10000,
      maxResolution: "720p",
      watermark: true,
      priorityRender: false,
      customBranding: false,
      apiAccess: false,
      bulkExport: false,
      teamMembers: 1,
      storageGb: 1,
      bgmLibrary: "basic",
      sfxLibrary: "basic",
      thumbnailAi: false,
      seoOptimizer: false,
      autoUpload: false,
      analyticsAdvanced: false,
    },
  },
  {
    id: "pro",
    name: "Pro",
    nameKo: "프로",
    price: 29900,
    priceDisplay: "₩29,900/월",
    features: [
      "무제한 영상 생성",
      "최대 30분 영상",
      "1080p / 4K 해상도",
      "워터마크 없음",
      "전체 효과음 11종+",
      "전체 BGM 라이브러리",
      "음성 6종 전체",
      "AI 썸네일 생성",
      "SEO 최적화 도구",
      "유튜브 자동 업로드",
      "우선 렌더링",
      "팀 멤버 3명",
      "10GB 저장공간",
    ],
    limits: {
      videosPerDay: 9999,
      videosPerMonth: 9999,
      maxDurationMinutes: 30,
      ttsCharactersPerMonth: 500000,
      maxResolution: "4K",
      watermark: false,
      priorityRender: true,
      customBranding: true,
      apiAccess: true,
      bulkExport: true,
      teamMembers: 3,
      storageGb: 10,
      bgmLibrary: "full",
      sfxLibrary: "full",
      thumbnailAi: true,
      seoOptimizer: true,
      autoUpload: true,
      analyticsAdvanced: true,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameKo: "엔터프라이즈",
    price: 99900,
    priceDisplay: "₩99,900/월",
    features: [
      "Pro 전체 기능 포함",
      "무제한 영상 길이",
      "4K 렌더링",
      "커스텀 브랜딩",
      "API 접근",
      "대량 내보내기",
      "팀 멤버 무제한",
      "100GB 저장공간",
      "전담 지원",
      "커스텀 음성 학습",
      "멀티 채널 관리",
    ],
    limits: {
      videosPerDay: 9999,
      videosPerMonth: 9999,
      maxDurationMinutes: 120,
      ttsCharactersPerMonth: 9999999,
      maxResolution: "4K",
      watermark: false,
      priorityRender: true,
      customBranding: true,
      apiAccess: true,
      bulkExport: true,
      teamMembers: 999,
      storageGb: 100,
      bgmLibrary: "full",
      sfxLibrary: "full",
      thumbnailAi: true,
      seoOptimizer: true,
      autoUpload: true,
      analyticsAdvanced: true,
    },
  },
];

export function getTier(tierId: string): PricingTier {
  return PRICING_TIERS.find((t) => t.id === tierId) ?? PRICING_TIERS[0]!;
}
