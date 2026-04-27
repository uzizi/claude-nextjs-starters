import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Fill, Stroke, Circle as CircleStyle, Style } from "ol/style";
import type { LonLat } from "@/types/map";

/**
 * EPSG:4326 좌표를 EPSG:3857(Web Mercator)로 변환
 * OpenLayers View의 기본 투영은 EPSG:3857이므로 반드시 변환 필요
 */
export function lonLatToMercator(coord: LonLat): [number, number] {
  const projected = fromLonLat(coord);
  return [projected[0], projected[1]];
}

/**
 * EPSG:3857 좌표를 EPSG:4326(위경도)으로 변환
 */
export function mercatorToLonLat(coord: number[]): LonLat {
  const [lon, lat] = toLonLat(coord);
  return [lon, lat];
}

/**
 * GeoJSON URL로부터 VectorLayer 생성
 * dataProjection: EPSG:4326 (GeoJSON 표준)
 * featureProjection: EPSG:3857 (지도 내부 투영)
 */
export function createGeoJsonLayer(
  url: string,
  color: string = "#3b82f6"
): VectorLayer {
  return new VectorLayer({
    source: new VectorSource({
      url,
      format: new GeoJSON({
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    }),
    style: new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({ color }),
        stroke: new Stroke({ color: "#ffffff", width: 2 }),
      }),
      fill: new Fill({ color: `${color}33` }),
      stroke: new Stroke({ color, width: 2 }),
    }),
  });
}
