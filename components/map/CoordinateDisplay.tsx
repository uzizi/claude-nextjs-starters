"use client";

import { IconMapPin } from "@tabler/icons-react";
import type { CoordinateState } from "@/types/map";

interface CoordinateDisplayProps {
  coordinate: CoordinateState;
  zoom: number;
}

/**
 * 지도 하단 상태바 — 마우스 좌표 + 줌 레벨 표시
 */
export default function CoordinateDisplay({
  coordinate,
  zoom,
}: CoordinateDisplayProps) {
  const { lon, lat } = coordinate;
  const coordText =
    lon !== null && lat !== null
      ? `${lon.toFixed(4)}°E  ${lat.toFixed(4)}°N`
      : "지도 위에 마우스를 올려보세요";

  return (
    <div className="flex items-center justify-between border-t border-border bg-background/95 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <IconMapPin className="size-3.5" />
        <span className="font-mono">{coordText}</span>
      </div>
      <span className="font-mono">줌: {zoom.toFixed(1)}</span>
    </div>
  );
}
