import { describe, expect, it } from "vitest";
import { CriticalZonesDataError } from "@/lib/geojson/parse-critical-zones";
import { SeedCriticalZoneRepository } from "./seed-critical-zone-repository";

const SERGIPE_BOUNDS = {
  minLatitude: -11.6,
  maxLatitude: -9.5,
  minLongitude: -38.3,
  maxLongitude: -36.3,
};

describe("SeedCriticalZoneRepository com o seed real", () => {
  const repository = new SeedCriticalZoneRepository();

  it("carrega as 4 zonas do seed", async () => {
    const zones = await repository.listCriticalZones();
    expect(zones.map(({ id }) => id)).toEqual([
      "saco-piaui",
      "coroa-do-meio",
      "barra-atalaia-nova",
      "contexto-68km",
    ]);
  });

  it("mantém todas as coordenadas dentro de Sergipe", async () => {
    const zones = await repository.listCriticalZones();
    for (const { id, location } of zones) {
      expect(location.latitude, id).toBeGreaterThanOrEqual(SERGIPE_BOUNDS.minLatitude);
      expect(location.latitude, id).toBeLessThanOrEqual(SERGIPE_BOUNDS.maxLatitude);
      expect(location.longitude, id).toBeGreaterThanOrEqual(SERGIPE_BOUNDS.minLongitude);
      expect(location.longitude, id).toBeLessThanOrEqual(SERGIPE_BOUNDS.maxLongitude);
    }
  });

  it("usa fontes com https", async () => {
    const zones = await repository.listCriticalZones();
    for (const { id, source } of zones) {
      expect(new URL(source.url).protocol, id).toBe("https:");
    }
  });
});

describe("SeedCriticalZoneRepository com falhas", () => {
  it("lança CriticalZonesDataError quando o arquivo não existe", async () => {
    const repository = new SeedCriticalZoneRepository("data/nao-existe.geojson");

    await expect(repository.listCriticalZones()).rejects.toThrow(CriticalZonesDataError);
    await expect(repository.listCriticalZones()).rejects.toThrow(/Não foi possível ler/);
  });

  it("lança CriticalZonesDataError quando o conteúdo não é JSON", async () => {
    const repository = new SeedCriticalZoneRepository("seed.geojson", async () => "{ quebrado");

    await expect(repository.listCriticalZones()).rejects.toThrow(/não é um JSON válido/);
  });

  it("propaga a validação do GeoJSON", async () => {
    const repository = new SeedCriticalZoneRepository("seed.geojson", async () =>
      JSON.stringify({ type: "FeatureCollection", features: [{ type: "Feature" }] }),
    );

    await expect(repository.listCriticalZones()).rejects.toThrow(/GeoJSON de zonas críticas inválido/);
  });

  it("preserva o erro original como causa", async () => {
    const original = new Error("EACCES");
    const repository = new SeedCriticalZoneRepository("seed.geojson", async () => {
      throw original;
    });

    await expect(repository.listCriticalZones()).rejects.toMatchObject({ cause: original });
  });
});
