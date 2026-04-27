"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Map from "ol/Map";
import MapToolbar from "./MapToolbar";
import LayerPanel from "./LayerPanel";
import CoordinateDisplay from "./CoordinateDisplay";
import { useMapStore } from "@/hooks/use-map-store";
import type { LonLat } from "@/types/map";

// OL은 SSR 불가 → dynamic import (ssr: false)
const OpenLayersMap = dynamic(() => import("./OpenLayersMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
    </div>
  ),
});

/** 한국 중심 기본 좌표 */
const HOME_CENTER: LonLat = [127.5, 36.5];
const HOME_ZOOM = 7;

/**
 * 지도 페이지 전체 레이아웃
 * 사이드바(LayerPanel) + 지도 영역(OpenLayersMap + 오버레이) + 하단 상태바
 */
export default function MapLayout() {
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const {
    layerVisibility,
    toggleLayer,
    coordinate,
    setCoordinate,
    currentZoom,
    setCurrentZoom,
  } = useMapStore();

  return (
    <div className="flex h-screen w-full flex-col">
      {/* 헤더 */}
      <header className="flex h-10 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <span className="text-sm font-semibold tracking-tight">
          Web GIS Starter
        </span>
      </header>

      {/* 메인 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-60 shrink-0 overflow-y-auto">
          <LayerPanel
            layerVisibility={layerVisibility}
            onToggle={toggleLayer}
          />
        </aside>

        {/* 지도 + 오버레이 */}
        <div className="relative flex-1 overflow-hidden">
          <OpenLayersMap
            center={HOME_CENTER}
            zoom={HOME_ZOOM}
            layerVisibility={layerVisibility}
            onMapReady={setMapInstance}
            onCoordinateChange={setCoordinate}
            onZoomChange={setCurrentZoom}
          />
          <MapToolbar
            mapInstance={mapInstance}
            homeCenter={HOME_CENTER}
            homeZoom={HOME_ZOOM}
          />
        </div>
      </div>

      {/* 하단 상태바 */}
      <CoordinateDisplay coordinate={coordinate} zoom={currentZoom} />
    </div>
  );
}
