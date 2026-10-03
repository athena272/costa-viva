import { describe, expect, it } from "vitest";
import {
  SEVERITIES,
  SEVERITY_PRESENTATION,
  ZONE_TYPES,
  ZONE_TYPE_LABELS,
  sortBySeverity,
  type CriticalZone,
  type Severity,
} from "./critical-zone";

function zone(id: string, severity: Severity): CriticalZone {
  return {
    id,
    name: id,
    municipality: "Aracaju",
    type: "contexto_estadual",
    severity,
    rateSummary: "resumo",
    source: { label: "fonte", url: "https://example.org", referenceYear: 2024 },
    location: { latitude: -10.9, longitude: -37.05 },
  };
}

describe("critical-zone", () => {
  it("define rótulo e cor para toda severidade", () => {
    for (const severity of SEVERITIES) {
      expect(SEVERITY_PRESENTATION[severity].label).toBeTruthy();
      expect(SEVERITY_PRESENTATION[severity].color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("usa ranks distintos para cada severidade", () => {
    const ranks = SEVERITIES.map((severity) => SEVERITY_PRESENTATION[severity].rank);
    expect(new Set(ranks).size).toBe(SEVERITIES.length);
  });

  it("define rótulo para todo tipo de zona", () => {
    for (const type of ZONE_TYPES) {
      expect(ZONE_TYPE_LABELS[type]).toBeTruthy();
    }
  });

  it("ordena da severidade mais alta para a mais baixa sem alterar a lista original", () => {
    const zones = [zone("b", "baixa"), zone("a", "alta"), zone("m", "media")];

    const sorted = sortBySeverity(zones);

    expect(sorted.map(({ id }) => id)).toEqual(["a", "m", "b"]);
    expect(zones.map(({ id }) => id)).toEqual(["b", "a", "m"]);
  });

  it("mantém a ordem original entre zonas de mesma severidade", () => {
    const sorted = sortBySeverity([zone("x", "alta"), zone("y", "alta")]);
    expect(sorted.map(({ id }) => id)).toEqual(["x", "y"]);
  });
});
