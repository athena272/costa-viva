"use client";

import dynamic from "next/dynamic";
import type { CriticalZone } from "@/domain/critical-zone";
import { MapLoading } from "./MapLoading";

// Leaflet acessa window na importação, então o mapa só pode ser carregado no navegador.
const CriticalZonesMap = dynamic(() => import("./CriticalZonesMap"), {
  ssr: false,
  loading: () => <MapLoading />,
});

interface CriticalZonesMapLoaderProps {
  zones: readonly CriticalZone[];
}

export function CriticalZonesMapLoader({ zones }: CriticalZonesMapLoaderProps) {
  return <CriticalZonesMap zones={zones} />;
}
