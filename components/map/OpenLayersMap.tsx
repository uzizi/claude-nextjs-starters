"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM";
import { defaults as defaultControls } from "ol/control";
import { toLonLat } from "ol/proj";
import { createGeoJsonLayer, lonLatToMercator } from "@/lib/map-utils";
import type { MapProps, CoordinateState } from "@/types/map";

/** 레이어 ID → z-index 매핑 */
const LAYER_ZINDEX: Record<string, number> = {
  osm: 0,
  "sample-geojson": 1,
};

/**
 * OpenLayers 지도 핵심 컴포넌트
 * - center는 EPSG:4326(위경도)으로 받아 내부에서 EPSG:3857으로 변환
 * - layerVisibility 변경 시 각 레이어 visible 속성 실시간 업데이트
 * - pointermove 이벤트로 마우스 좌표를 onCoordinateChange 콜백으로 전달
 * - 콜백 props는 ref로 래핑하여 Stale Closure 문제 방지
 */
export default function OpenLayersMap({
  center = [127.0, 37.5],
  zoom = 6,
  layerVisibility = {},
  onMapReady,
  onCoordinateChange,
  onZoomChange,
  className = "",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  // 레이어 참조를 ID로 관리
  const layersRef = useRef<Record<string, TileLayer | VectorLayer>>({});

  // [Stale Closure 방지] 콜백 props를 ref로 래핑하여 항상 최신 값 참조
  const onCoordinateChangeRef = useRef(onCoordinateChange);
  const onZoomChangeRef = useRef(onZoomChange);
  const onMapReadyRef = useRef(onMapReady);

  // 콜백 ref를 최신 props와 동기화
  useEffect(() => {
    onCoordinateChangeRef.current = onCoordinateChange;
    onZoomChangeRef.current = onZoomChange;
    onMapReadyRef.current = onMapReady;
  }, [onCoordinateChange, onZoomChange, onMapReady]);

  // [초기화] 마운트 시 1회만 실행
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const osmLayer = new TileLayer({
      source: new OSM(),
      zIndex: LAYER_ZINDEX["osm"],
    });
    osmLayer.set("layerId", "osm");

    const geojsonLayer = createGeoJsonLayer("/data/sample.geojson", "#3b82f6");
    geojsonLayer.set("layerId", "sample-geojson");
    geojsonLayer.setZIndex(LAYER_ZINDEX["sample-geojson"]);

    layersRef.current = {
      osm: osmLayer,
      "sample-geojson": geojsonLayer,
    };

    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, geojsonLayer],
      view: new View({
        center: lonLatToMercator(center),
        zoom,
        projection: "EPSG:3857",
      }),
      // OL 기본 컨트롤(줌버튼, 회전) 비활성화 — 커스텀 툴바로 대체
      controls: defaultControls({ zoom: false, rotate: false }),
    });

    mapInstanceRef.current = map;

    // 마우스 좌표 이벤트 — ref를 통해 최신 콜백 호출
    map.on("pointermove", (e) => {
      const [lon, lat] = toLonLat(e.coordinate);
      onCoordinateChangeRef.current?.({ lon, lat });
    });

    // [클린업 보장] 핸들러를 변수로 추출하여 removeEventListener에서 정확히 제거
    const handleMouseLeave = () => {
      onCoordinateChangeRef.current?.({ lon: null, lat: null } as CoordinateState);
    };
    mapRef.current.addEventListener("mouseleave", handleMouseLeave);

    // 줌 변경 감지 — ref를 통해 최신 콜백 호출
    map.getView().on("change:resolution", () => {
      const z = map.getView().getZoom();
      if (z !== undefined) onZoomChangeRef.current?.(Math.round(z * 10) / 10);
    });

    // 지도 초기화 완료 콜백 — ref를 통해 최신 콜백 호출
    onMapReadyRef.current?.(map);

    return () => {
      mapRef.current?.removeEventListener("mouseleave", handleMouseLeave);
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 초기화는 1회만

  // [반응성] center props 변경 시 View 업데이트
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.getView().setCenter(lonLatToMercator(center));
  }, [center]);

  // [반응성] zoom props 변경 시 View 업데이트
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.getView().setZoom(zoom);
  }, [zoom]);

  // 레이어 가시성 변경 시 실시간 반영
  useEffect(() => {
    Object.entries(layerVisibility).forEach(([id, visible]) => {
      layersRef.current[id]?.setVisible(visible);
    });
  }, [layerVisibility]);

  return <div ref={mapRef} className={`w-full h-full ${className}`} />;
}
