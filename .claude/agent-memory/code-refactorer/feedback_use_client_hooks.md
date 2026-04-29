---
name: 훅 파일의 "use client" 중복 지시어 제거
description: 훅을 호출하는 클라이언트 컴포넌트에 이미 "use client"가 있으면 훅 파일 자체에는 불필요
type: feedback
---

`hooks/use-map-store.ts` 같은 커스텀 훅 파일에 `"use client"`를 붙이면 중복이다. 이 훅은 `MapLayout.tsx` (이미 `"use client"` 보유)에서만 호출된다.

**Why:** `"use client"` 경계는 호출 측 컴포넌트에서 설정된다. 훅 자체는 모듈이며, 클라이언트 컴포넌트에서 import하면 자동으로 클라이언트 번들에 포함된다.

**How to apply:** 순수 로직(상태, 콜백)만 담고 JSX를 반환하지 않는 훅 파일에서 `"use client"` 지시어 제거를 검토. 단, 훅 파일이 서버/클라이언트 양쪽에서 호출될 가능성이 있다면 유지.
