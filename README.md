# 🎬 슈퍼 유튜브 롱폼 제작 프로그램

Remotion 기반 유튜브 10분 뉴스/시사 영상 자동 제작 도구입니다.

## 설치

```bash
npm install
```

## .env 설정

```env
ELEVENLABS_API_KEY=your_elevenlabs_key
GEMINI_API_KEY=your_gemini_key
```

## 사용법

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Remotion 스튜디오 (프리뷰) |
| `npm run build` | MP4 영상 렌더링 |
| `npm run generate:script` | AI 대본 생성 |
| `npm run generate:voice` | ElevenLabs TTS 생성 |
| `npm run generate:bgm` | BGM 프롬프트 생성 |
| `npm run generate:thumbnail` | 썸네일 가이드 생성 |
| `npm run analyze:news` | 뉴스 리서치 |
| `npm run pipeline` | 전체 파이프라인 (리서치→대본→TTS→BGM→썸네일→빌드) |
| `npm run server` | 웹 대시보드 (http://localhost:3002) |

## 필수 에셋

- **이미지**: `public/images/` 에 hook-bg.jpg, problem-bg.jpg 등 배경 이미지 추가
- **BGM**: `generate:bgm` 후 Suno AI에서 생성 → `public/bgm/news-ambient.mp3` 저장
- **TTS**: `generate:voice` 실행 시 `public/voiceover/` 에 MP3 생성

## 프로젝트 구조

```
src/
├── Root.tsx, VideoComposition.tsx
├── config.ts          # 대본/설정
├── types.ts
├── scenes/            # HOOK, PROBLEM, ANALYSIS 등
├── components/        # KenBurns, 자막, 차트 등
└── utils/
```
