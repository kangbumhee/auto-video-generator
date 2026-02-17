#!/bin/bash
echo "=========================================="
echo "🎬 슈퍼 유튜브 롱폼 제작 프로그램 설치"
echo "=========================================="

echo "📦 Remotion 추가 패키지 설치..."
npm install
npx remotion add @remotion/transitions 2>/dev/null || true
npx remotion add @remotion/paths 2>/dev/null || true
npx remotion add @remotion/google-fonts 2>/dev/null || true

echo "📂 디렉토리 확인..."
mkdir -p public/voiceover public/images public/bgm public/fonts public/thumbnails out

echo ""
echo "✅ 설치 완료!"
echo "=========================================="
echo "다음 단계:"
echo "  1. .env 파일에 API 키 입력"
echo "  2. npm run pipeline   ← 전체 파이프라인 실행"
echo "  3. npm run dev        ← Remotion 프리뷰"
echo "  4. npm run server     ← 웹 UI 대시보드"
echo "=========================================="
