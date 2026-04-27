import MapLayout from "@/components/map/MapLayout";

export const metadata = {
  title: "지도 | Web GIS Starter",
};

// v16: params 없는 페이지 — PageProps 생략 가능
export default function MapPage() {
  return <MapLayout />;
}
