import Map from "ol/Map";

/** 위경도 기반 좌표 (EPSG:4326) */
export type LonLat = [number, number];

/** 지도 레이어 설정 */
export interface LayerConfig {
  /** 레이어 고유 ID */
  id: string;
  /** 표시 이름 */
  label: string;
  /** 초기 가시성 */
  visible: boolean;
  /** 레이어 타입 */
  type: "tile" | "vector";
  /** 레이어 색상 (벡터 레이어 범례용) */
  color?: string;
}

/** 마우스 좌표 상태 */
export interface CoordinateState {
  lon: number | null;
  lat: number | null;
}

/** OpenLayersMap 컴포넌트 props */
export interface MapProps {
  /** 초기 중심 좌표 [lon, lat] EPSG:4326 */
  center?: LonLat;
  /** 초기 줌 레벨 */
  zoom?: number;
  /** 레이어 가시성 맵 */
  layerVisibility?: Record<string, boolean>;
  /** 지도 초기화 완료 콜백 */
  onMapReady?: (map: Map) => void;
  /** 마우스 좌표 변경 콜백 */
  onCoordinateChange?: (coord: CoordinateState) => void;
  /** 줌 변경 콜백 */
  onZoomChange?: (zoom: number) => void;
  className?: string;
}
