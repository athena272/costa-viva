export const SEVERITIES = ["alta", "media", "baixa"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const ZONE_TYPES = [
  "erosao_fluvial_estuarina",
  "erosao_costeira_estuarina",
  "variabilidade_linha_costa",
  "contexto_estadual",
] as const;
export type ZoneType = (typeof ZONE_TYPES)[number];

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface ZoneSource {
  label: string;
  url: string;
  referenceYear: number;
}

export interface RateRange {
  minMetersPerYear: number;
  maxMetersPerYear: number;
}

export interface CriticalZone {
  id: string;
  name: string;
  municipality: string;
  type: ZoneType;
  severity: Severity;
  rateSummary: string;
  rate?: RateRange;
  note?: string;
  source: ZoneSource;
  location: GeoPoint;
}

export interface SeverityPresentation {
  label: string;
  color: string;
  rank: number;
}

export const SEVERITY_PRESENTATION: Record<Severity, SeverityPresentation> = {
  alta: { label: "Alta", color: "#dc2626", rank: 0 },
  media: { label: "Média", color: "#d97706", rank: 1 },
  baixa: { label: "Baixa", color: "#16a34a", rank: 2 },
};

export const ZONE_TYPE_LABELS: Record<ZoneType, string> = {
  erosao_fluvial_estuarina: "Erosão fluvial e estuarina",
  erosao_costeira_estuarina: "Erosão costeira e estuarina",
  variabilidade_linha_costa: "Variabilidade da linha de costa",
  contexto_estadual: "Contexto estadual",
};

export function compareBySeverity(a: CriticalZone, b: CriticalZone): number {
  return SEVERITY_PRESENTATION[a.severity].rank - SEVERITY_PRESENTATION[b.severity].rank;
}

export function sortBySeverity(zones: readonly CriticalZone[]): CriticalZone[] {
  return [...zones].sort(compareBySeverity);
}
