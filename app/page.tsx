import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconMap,
  IconStack2,
  IconPointer,
  IconLayoutSidebar,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconMap,
    title: "OpenLayers 10 통합",
    desc: "좌표 변환(EPSG:4326 → 3857), 반응형 props, VectorLayer 지원",
  },
  {
    icon: IconStack2,
    title: "레이어 관리",
    desc: "OSM 타일 + GeoJSON 샘플 레이어 on/off 제어",
  },
  {
    icon: IconPointer,
    title: "마우스 좌표 표시",
    desc: "실시간 위도/경도 표시, 줌 레벨 상태바",
  },
  {
    icon: IconLayoutSidebar,
    title: "사이드바 레이아웃",
    desc: "shadcn/ui(radix-nova) + Tailwind v4 기반 UI",
  },
];

// v16: params/searchParams 없는 홈 페이지 — props 불필요
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-3xl space-y-10">
        <div className="space-y-3 text-center">
          <Badge variant="secondary">Next.js 16 + React 19</Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Web GIS Starter Kit
          </h1>
          <p className="text-lg text-muted-foreground">
            OpenLayers 10 + Tailwind v4 + shadcn/ui로 구축한 웹 GIS 개발 기반
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/map">지도 열기</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://openlayers.org/doc/api/"
                target="_blank"
                rel="noopener noreferrer"
              >
                OL 문서
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="size-5 text-primary" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Tech Stack: Next.js 16 · React 19 · OpenLayers 10 · Tailwind CSS v4 ·
          shadcn/ui radix-nova
        </p>
      </div>
    </main>
  );
}
