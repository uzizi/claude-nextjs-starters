"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IconStack2 } from "@tabler/icons-react";
import { INITIAL_LAYERS } from "@/hooks/use-map-store";
import type { LayerConfig } from "@/types/map";

interface LayerPanelProps {
  layerVisibility: Record<string, boolean>;
  onToggle: (id: string) => void;
}

/**
 * 사이드바 레이어 패널
 * 레이어 목록과 on/off Switch 제공
 */
export default function LayerPanel({
  layerVisibility,
  onToggle,
}: LayerPanelProps) {
  const layers: LayerConfig[] = INITIAL_LAYERS;

  return (
    <Card className="h-full rounded-none border-0 border-r">
      <CardHeader className="px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <IconStack2 className="size-4" />
          레이어
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="px-4 py-3">
        <ul className="space-y-3">
          {layers.map((layer) => (
            <li key={layer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {layer.color && (
                  <span
                    className="inline-block size-3 rounded-full border border-border"
                    style={{ backgroundColor: layer.color }}
                  />
                )}
                <Label
                  htmlFor={`layer-switch-${layer.id}`}
                  className="cursor-pointer text-sm"
                >
                  {layer.label}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={layerVisibility[layer.id] ? "default" : "secondary"}
                  className="text-[10px] py-0"
                >
                  {layer.type === "tile" ? "타일" : "벡터"}
                </Badge>
                <Switch
                  id={`layer-switch-${layer.id}`}
                  checked={layerVisibility[layer.id] ?? true}
                  onCheckedChange={() => onToggle(layer.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
