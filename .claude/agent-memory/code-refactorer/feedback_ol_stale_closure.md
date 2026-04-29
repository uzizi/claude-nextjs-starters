---
name: OpenLayers 초기화 useEffect Stale Closure 패턴
description: OL 지도 초기화 시 콜백 props를 ref로 래핑해야 Stale Closure 방지
type: feedback
---

초기화 useEffect의 의존성 배열이 `[]`로 고정되면, 내부에서 직접 사용하는 콜백 props(`onCoordinateChange`, `onZoomChange`, `onMapReady`)는 마운트 시점의 값으로 고정된다.

**패턴:**
```tsx
const onCoordinateChangeRef = useRef(onCoordinateChange);
useEffect(() => { onCoordinateChangeRef.current = onCoordinateChange; }, [onCoordinateChange]);

// 이벤트 핸들러 내부에서
onCoordinateChangeRef.current?.({ lon, lat });
```

**Why:** 지도 초기화는 1회만 실행되어야 하므로 deps를 `[]`로 유지해야 한다. 그러나 부모로부터 내려오는 콜백은 리렌더 시 새 참조를 가질 수 있어, ref 패턴으로 항상 최신 콜백을 참조해야 한다.

**How to apply:** OpenLayers 또는 기타 한 번만 초기화하는 라이브러리의 이벤트 핸들러에서 외부 콜백을 사용할 때마다 적용.
