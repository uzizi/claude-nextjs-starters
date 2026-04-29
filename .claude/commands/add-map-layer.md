새 OpenLayers 레이어를 프로젝트에 추가합니다.

인자: $ARGUMENTS
(형식: `<레이어 이름> <타입>` — 타입은 "tile" 또는 "vector")

## 작업 순서

인자에서 레이어 이름(camelCase)과 타입을 파싱합니다.

다음 4개 파일을 순서대로 수정합니다:

### 1. `types/map.ts`
`LAYER_IDS` 상수 또는 레이어 ID 목록이 있으면 새 레이어 ID를 추가합니다.

### 2. `hooks/use-map-store.ts`
`layerVisibility` 초기값 객체에 새 레이어 ID를 `true`로 추가합니다.

### 3. `components/map/OpenLayersMap.tsx`
- **tile 타입**: `TileLayer`를 생성하고 `set('layerId', '<id>')` 를 호출한 뒤 map의 레이어 목록에 추가합니다.
- **vector 타입**: `createGeoJsonLayer()`(`lib/map-utils.ts`)를 사용해 `VectorLayer`를 생성하고 `set('layerId', '<id>')` 를 호출한 뒤 map의 레이어 목록에 추가합니다. GeoJSON URL은 `public/data/<layerName>.geojson` 경로를 기본값으로 사용합니다.
- `layerVisibility` 변경을 감지하는 `useEffect`에 새 레이어 ID의 가시성 처리 로직을 추가합니다.

### 4. `components/map/LayerPanel.tsx`
레이어 목록 배열에 새 레이어 항목(`{ id, label, type }`)을 추가합니다.

## 완료 후

수정된 4개 파일 경로와 각 변경 내용을 간단히 요약해 출력합니다.
