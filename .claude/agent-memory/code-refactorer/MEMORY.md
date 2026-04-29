# Code Refactorer Memory Index

- [OpenLayers Stale Closure Pattern](feedback_ol_stale_closure.md) — OL 초기화 useEffect에서 콜백 props는 반드시 ref로 래핑해야 함
- [mouseleave 클린업 패턴](feedback_mouseleave_cleanup.md) — DOM addEventListener는 반드시 named handler로 등록하고 cleanup에서 제거
- [use client 중복 지시어](feedback_use_client_hooks.md) — 훅 파일에 "use client" 불필요 (호출 측 컴포넌트에 이미 존재)
- [TooltipProvider 전역 배치](feedback_tooltip_provider.md) — RootLayout에 전역 TooltipProvider 배치, 개별 컴포넌트에서 중복 선언 금지
- [좌표 방향 표기 규칙](project_coordinate_direction.md) — 음수 경도 W, 음수 위도 S로 표기하고 절댓값 사용
