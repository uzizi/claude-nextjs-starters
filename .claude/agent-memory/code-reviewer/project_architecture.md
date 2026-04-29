---
name: Web GIS 스타터킷 아키텍처
description: claude-nextjs-starters 프로젝트의 핵심 아키텍처 패턴, 컴포넌트 구조, 상태 관리 방식
type: project
---

## 프로젝트 구조

- Next.js 16.2.4 App Router + React 19.2.4 + TypeScript strict
- Tailwind CSS v4 (CSS Variables / `@theme inline {}` 방식, tailwind.config.js 없음)
- OpenLayers 10.9.0 (SSR 불가 → `next/dynamic` + `ssr: false` 필수)
- shadcn/ui (radix-nova 스타일, Tabler 아이콘)

## 상태 관리 패턴

- 외부 스토어(Zustand/Redux) 없음
- `useMapStore` 훅(hooks/use-map-store.ts)에서 상태 집중 관리
- `MapLayout`이 훅을 호출하고 자식에 props drilling으로 전달
- `INITIAL_LAYERS` 상수가 `use-map-store.ts`에 정의되어 `LayerPanel`에서 직접 import

## OpenLayers 핵심 패턴

- 초기화: `useEffect([], [])` 1회 실행, 클린업에서 `map.setTarget(undefined)`
- 좌표계: EPSG:4326 입력 → `lonLatToMercator()` → EPSG:3857 내부 사용
- 레이어 참조: `layersRef.current` (Record<string, TileLayer | VectorLayer>)
- 레이어 식별: `layer.set('layerId', id)` 패턴
- 이벤트: pointermove, change:resolution, mouseleave

## 알려진 이슈 (2026-04-29 전체 코드 리뷰 기준)

### Critical
1. `app/layout.tsx` 18번째 줄: `LayoutProps<'/'>` 사용 — Next.js 16에서 미정의 전역 타입, `{ children: React.ReactNode }` 인라인으로 교체 필요
2. `OpenLayersMap.tsx` 초기화 effect에서 `onCoordinateChange`, `onZoomChange`, `onMapReady` 콜백이 클로저에 캡처되어 stale closure 위험 — useRef로 래핑 권장
3. `mouseleave` 이벤트 리스너가 OL 이벤트 시스템과 달리 DOM addEventListener로 등록되어 클린업 함수에서 removeEventListener 누락 → 메모리 누수

### Important
4. `CoordinateDisplay.tsx`: 경도/위도 양수 값에만 E/N 표시 (음수 좌표에서 "−79.1234°E" 같은 부정확한 표시)
5. `MapToolbar.tsx`에 `TooltipProvider` 중복 (RootLayout에도 있음)
6. `lib/map-utils.ts` `lonLatToMercator`: `fromLonLat()`의 반환값이 이미 `[number, number]` 타입인데 구조 분해 후 재조합하는 불필요한 연산
7. `OpenLayersMap.tsx` 레이어 하드코딩 — GeoJSON 경로("/data/sample.geojson")와 색상("#3b82f6")이 props 없이 컴포넌트 내부에 고정됨
8. `use-map-store.ts`의 "use client" 지시어 — 훅 파일 자체는 클라이언트 경계 선언 불필요(사용 측인 MapLayout에서 결정)

### Suggestions
9. `LayerPanel.tsx`: `const layers: LayerConfig[] = INITIAL_LAYERS` 불필요한 재할당 (INITIAL_LAYERS 직접 사용 가능)
10. `lib/utils.ts` `cn()` 함수에 JSDoc 주석 누락
11. `MapLayout.tsx`: HOME_CENTER/HOME_ZOOM 상수를 MapLayout 외부로 추출하여 MapToolbar와 OpenLayersMap 간 일관성 보장 고려

**Why:** 2026-04-29 첫 전체 코드 리뷰에서 발견
**How to apply:** 향후 이 파일들 수정 시 위 이슈 참고. Critical > Important > Suggestions 순서로 수정 권장
