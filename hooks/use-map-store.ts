"use client";

import { useState, useCallback } from "react";
import type { CoordinateState, LayerConfig } from "@/types/map";

/** 레이어 초기 구성 */
export const INITIAL_LAYERS: LayerConfig[] = [
  { id: "osm", label: "OpenStreetMap", visible: true, type: "tile" },
  {
    id: "sample-geojson",
    label: "샘플 도시 포인트",
    visible: true,
    type: "vector",
    color: "#3b82f6",
  },
];

/**
 * 지도 페이지 공유 상태 훅
 * MapLayout에서 호출하고 자식 컴포넌트에 props로 전달
 */
export function useMapStore() {
  const [layerVisibility, setLayerVisibility] = useState<
    Record<string, boolean>
  >(Object.fromEntries(INITIAL_LAYERS.map((l) => [l.id, l.visible])));

  const [coordinate, setCoordinate] = useState<CoordinateState>({
    lon: null,
    lat: null,
  });

  const [currentZoom, setCurrentZoom] = useState(6);

  const toggleLayer = useCallback((id: string) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return {
    layerVisibility,
    toggleLayer,
    coordinate,
    setCoordinate,
    currentZoom,
    setCurrentZoom,
  };
}
