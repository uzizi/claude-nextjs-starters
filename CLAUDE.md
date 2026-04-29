# CLAUDE.md

이 파일은 이 저장소의 코드로 작업할 때 Claude Code(claude.ai/code)에 대한 지침을 제공합니다.

## 개요

이것은 다음과 같이 구축된 **Web GIS 스타터 킷**입니다:
- **Next.js 16.2.4** (App Router)
- **React 19.2.4**
- **TypeScript** (strict mode)
- **Tailwind CSS v4** (CSS Variables approach)
- **OpenLayers 10.9.0** (web mapping library)
- **shadcn/ui** (radix-nova style, Tabler icons)

이 프로젝트는 레이어 관리, 좌표 표시, 줌 컨트롤과 같은 기능을 갖춘 대화형 Web GIS 애플리케이션을 구축하기 위한 현대적인 기반을 제공합니다.

## 개발 명령어

```bash
npm run dev      # 개발 서버 시작 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버 시작
npm run lint     # ESLint 실행 (v9 flat config)
```

현재 테스트 스위트는 구성되지 않았습니다.

## 프로젝트 구조

```
app/                              # App Router routes
├── globals.css                   # Tailwind v4 + CSS imports
├── layout.tsx                    # RootLayout (fonts + TooltipProvider)
├── page.tsx                      # 홈페이지 (feature cards)
└── map/
    └── page.tsx                  # 지도 페이지 (/map route)

components/
├── map/                          # 지도 관련 컴포넌트
│   ├── OpenLayersMap.tsx        # Core OL map component (use client)
│   ├── MapLayout.tsx            # 지도 페이지 레이아웃 & 상태 구성
│   ├── MapToolbar.tsx           # Floating 줌/홈/전체 화면 버튼
│   ├── LayerPanel.tsx           # 사이드바 레이어 시각성 패널
│   └── CoordinateDisplay.tsx    # 하단 상태 바 (좌표 + 줌)
└── ui/                          # shadcn/ui components
    └── (button, card, label, separator, switch, tooltip, etc.)

hooks/
└── use-map-store.ts             # 지도 상태용 커스텀 훅 (외부 저장소 없음)

lib/
├── map-utils.ts                 # OpenLayers 유틸리티 (projections, GeoJSON)
└── utils.ts                     # cn() utility (clsx + tailwind-merge)

types/
└── map.ts                       # 중앙화된 도메인 타입 (LayerConfig, CoordinateState, 등)

public/
└── data/                        # 정적 GeoJSON 파일
```

**주의:** `src/` 디렉토리가 없습니다. 경로 별칭 `@/*`는 프로젝트 루트를 참조합니다.

## 핵심 패턴

### OpenLayers 통합

1. **SSR 비활성화 동적 임포트**
   - OpenLayers는 서버 렌더링할 수 없습니다. `next/dynamic`을 `ssr: false`와 함께 사용합니다:
   ```tsx
   const OpenLayersMap = dynamic(() => import('./OpenLayersMap'), { ssr: false });
   ```

2. **좌표계**
   - **Input:** EPSG:4326 (WGS84 longitude/latitude) — 지리적 표준
   - **Internal:** EPSG:3857 (Web Mercator) — OpenLayers와 타일 서비스에서 사용
   - **Conversion:** 지도 중심을 초기화하거나 업데이트할 때 `lib/map-utils.ts`의 `lonLatToMercator()`를 사용합니다
   
3. **레이어 아키텍처**
   - Base layer: OpenStreetMap 타일이 있는 `TileLayer`
   - Feature layer: GeoJSON 소스가 있는 `VectorLayer`
   - 각 레이어는 `set('layerId', id)`를 통해 `layerId`가 할당되며 시각성 전환에 사용됩니다

4. **이벤트 처리**
   - `pointermove` → 좌표 콜백
   - `change:resolution` → 줌 레벨 콜백
   - `mouseleave` → 좌표 초기화
   - 모든 리스너는 `useEffect` 정리에서 추가/제거됩니다

### 상태 관리

- **외부 저장소 없음** (Zustand, Redux, 등)
- **Pattern:** 커스텀 훅 + props drilling
- `use-map-store.ts`는 다음을 제공합니다: `layerVisibility`, `coordinate`, `currentZoom`
- 상태는 `MapLayout` (부모)에 존재하고 자식에게 props를 통해 전달됩니다

### 스타일링

- **Tailwind v4**: `tailwind.config.js` 없음 — 설계 토큰이 `globals.css`에 `@theme inline {}`으로 정의됨
- **CSS Variables**: light/dark theme 지원을 위해 oklch() 색상 공간 사용
- **CSS Modules 없음**: 모든 스타일이 인라인 Tailwind 유틸리티 클래스로 적용됨
- **shadcn/ui**: 컴포넌트는 변형 관리를 위해 CVA (class-variance-authority) 사용
- **OpenLayers CSS**: `globals.css`에 임포트되어 지도 요소를 스타일링합니다

### TypeScript

- `strict: true` 활성화
- 도메인 타입이 `types/map.ts`에 중앙화됨
- 컴포넌트 props는 인라인 `interface Props`로 타입화됨
- 외부 라이브러리 타입 (예: `ol/Map`)은 직접 임포트됨
- 전역 타입 정의가 필요 없음 (Next.js 16이 제공)

## 주요 파일

| 파일 | 용도 |
|------|------|
| `next.config.ts` | ESM 번들링을 위해 `transpilePackages: ["ol"]`을 포함해야 함 |
| `app/globals.css` | CSS 진입점; Tailwind, shadcn, OL, tw-animate-css를 임포트 |
| `components/map/OpenLayersMap.tsx` | 핵심 지도 렌더링; 모든 OL 설정 포함 |
| `hooks/use-map-store.ts` | 중앙화된 지도 상태 (시각성, 좌표, 줌) |
| `lib/map-utils.ts` | OL 유틸리티: `lonLatToMercator()`, `createGeoJsonLayer()` |
| `types/map.ts` | `LayerConfig`, `CoordinateState`, `MapProps` 인터페이스 |
| `AGENTS.md` | AI 에이전트 지침 — Next.js 기능 코딩 전 `node_modules/next/dist/docs/` 읽기 |

## 코드 작성 전 확인 사항

### Next.js 관련 변경 사항
Next.js 기능 (라우팅, 레이아웃, 미들웨어 등)을 구현하기 전에 다음을 참고하세요:
- `node_modules/next/dist/docs/` (node_modules에 포함된 공식 Next.js 16 문서)
- API, 관례, 파일 구조는 학습 데이터와 다를 수 있습니다
- 추가 지침은 `AGENTS.md`를 확인하세요

### 새 지도 기능 추가
1. OpenLayers 설정을 `components/map/` 아래의 전용 컴포넌트에 유지합니다
2. 공유 상태에 `use-map-store.ts`를 사용하거나, 필요하면 훅을 확장합니다
3. 좌표 변환: OpenLayers용으로 항상 EPSG:4326 → EPSG:3857으로 변환합니다
4. Tailwind로 스타일링 — 인라인 스타일 피합니다
5. 타입 안전을 위해 `types/map.ts`에서 타입을 내보냅니다

### 새 UI 컴포넌트 추가
- shadcn/ui CLI 사용: `npx shadcn-ui@latest add <component>`
- Radix-nova 스타일이 자동으로 적용됩니다
- 컴포넌트는 `components/ui/`에 저장됩니다
- `@tabler/icons-react`를 통해 Tabler 아이콘 사용합니다

## 설정 참고 사항

- **Tailwind v4**: 레거시 Webpack 플러그인이 아닌 PostCSS 통합 (`@tailwindcss/postcss`) 사용
- **ESLint v9**: `eslint.config.mjs`의 flat config 형식
- **TypeScript**: `noEmit: true`를 사용한 strict mode
- **Fonts**: `next/font/google`을 통한 Geist Sans 및 Geist Mono

## 의존성

**주요 런타임 패키지:**
- `ol` (10.9.0) — OpenLayers
- `@radix-ui/*` (1.4.3+) — Headless UI primitives
- `shadcn` (4.4.0) — Component library
- `tailwindcss` (v4) — CSS utility framework
- `@tabler/icons-react` (3.41.1) — Icon set

**주요 개발 도구:**
- `typescript` (v5)
- `eslint` (v9)
- `postcss` with Tailwind v4 plugin
