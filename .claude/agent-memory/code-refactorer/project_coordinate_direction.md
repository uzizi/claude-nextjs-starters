---
name: 지리좌표 방향 표기 규칙 (E/W, N/S)
description: 경도 음수는 서경 W, 위도 음수는 남위 S로 표기하며 Math.abs()로 절댓값 사용
type: project
---

GIS 표준에 따라 좌표 표시 시 부호 대신 방향 문자를 사용해야 한다.

**올바른 구현:**
```tsx
const lonDir = lon >= 0 ? "E" : "W";
const latDir = lat >= 0 ? "N" : "S";
`${Math.abs(lon).toFixed(4)}°${lonDir}  ${Math.abs(lat).toFixed(4)}°${latDir}`
```

**Why:** 국제 지리 표준에서 경도 음수는 서경(West), 위도 음수는 남위(South)를 의미한다. 단순히 `-` 부호를 그대로 표시하면 사용자가 방향을 오해할 수 있다.

**How to apply:** `CoordinateDisplay.tsx`를 포함한 모든 좌표 표시 UI에서 방향 문자를 적용.
