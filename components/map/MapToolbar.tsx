"use client";

import { useCallback } from "react";
import Map from "ol/Map";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconZoomIn,
  IconZoomOut,
  IconHome,
  IconMaximize,
} from "@tabler/icons-react";
import { lonLatToMercator } from "@/lib/map-utils";
import type { LonLat } from "@/types/map";

interface MapToolbarProps {
  /** 지도 인스턴스 참조 */
  mapInstance: Map | null;
  /** 홈 버튼 클릭 시 이동할 좌표 */
  homeCenter: LonLat;
  homeZoom: number;
}

/**
 * 지도 우측 상단 플로팅 툴바
 * 줌인/줌아웃/홈/전체화면 제공
 */
export default function MapToolbar({
  mapInstance,
  homeCenter,
  homeZoom,
}: MapToolbarProps) {
  const handleZoomIn = useCallback(() => {
    const view = mapInstance?.getView();
    if (!view) return;
    const current = view.getZoom() ?? homeZoom;
    view.animate({ zoom: current + 1, duration: 250 });
  }, [mapInstance, homeZoom]);

  const handleZoomOut = useCallback(() => {
    const view = mapInstance?.getView();
    if (!view) return;
    const current = view.getZoom() ?? homeZoom;
    view.animate({ zoom: current - 1, duration: 250 });
  }, [mapInstance, homeZoom]);

  const handleHome = useCallback(() => {
    mapInstance?.getView().animate({
      center: lonLatToMercator(homeCenter),
      zoom: homeZoom,
      duration: 400,
    });
  }, [mapInstance, homeCenter, homeZoom]);

  const handleFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const tools = [
    { icon: IconZoomIn, label: "줌 인", onClick: handleZoomIn },
    { icon: IconZoomOut, label: "줌 아웃", onClick: handleZoomOut },
    { icon: IconHome, label: "초기 위치", onClick: handleHome },
    { icon: IconMaximize, label: "전체 화면", onClick: handleFullscreen },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-lg border border-border bg-background/90 p-1 shadow-md backdrop-blur-sm">
        {tools.map(({ icon: Icon, label, onClick }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClick}
                aria-label={label}
              >
                <Icon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
