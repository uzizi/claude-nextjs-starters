---
name: DOM addEventListener mouseleave 클린업 패턴
description: 익명 함수로 등록한 이벤트 리스너는 removeEventListener로 제거 불가 — named handler 필수
type: feedback
---

`mapRef.current.addEventListener("mouseleave", () => {...})` 처럼 익명 함수로 등록하면 useEffect cleanup에서 동일 참조를 제거할 수 없어 메모리 누수 발생.

**올바른 패턴:**
```tsx
const handleMouseLeave = () => {
  onCoordinateChangeRef.current?.({ lon: null, lat: null });
};
mapRef.current.addEventListener("mouseleave", handleMouseLeave);

return () => {
  mapRef.current?.removeEventListener("mouseleave", handleMouseLeave);
};
```

**Why:** useEffect 클린업은 컴포넌트 언마운트 또는 deps 변경 시 실행된다. 익명 함수는 클로저 내부에 다른 참조이므로 removeEventListener가 동작하지 않는다.

**How to apply:** useEffect 내부에서 DOM의 addEventListener를 사용할 때마다 핸들러를 const 변수로 선언한 뒤 cleanup에서 동일 변수로 제거.
