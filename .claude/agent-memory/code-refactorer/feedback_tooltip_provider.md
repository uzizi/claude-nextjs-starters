---
name: TooltipProvider 전역 단일 배치 원칙
description: RootLayout에 TooltipProvider를 전역으로 배치하고, 개별 컴포넌트 내 중복 선언 금지
type: feedback
---

`app/layout.tsx`의 `RootLayout`에 `<TooltipProvider delayDuration={300}>` 전역 설정을 두면, 하위 컴포넌트(`MapToolbar` 등)에서 다시 `TooltipProvider`를 wrapping할 필요가 없다.

**Why:** TooltipProvider는 context provider로 동작한다. 중첩 시 내부 Provider가 우선 적용되지만, 불필요한 중복 선언은 코드 복잡성을 높이고 Provider 중복 생성을 유발한다.

**How to apply:** 새 컴포넌트에서 Tooltip을 사용할 때 TooltipProvider 추가 여부를 확인하고, 이미 전역 Provider가 있다면 `<Tooltip>`, `<TooltipTrigger>`, `<TooltipContent>`만 사용.
