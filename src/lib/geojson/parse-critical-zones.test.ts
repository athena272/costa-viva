import { describe, expect, it } from "vitest";
import { CriticalZonesDataError, parseCriticalZones } from "./parse-critical-zones";

type Properties = Record<string, unknown>;

function feature(overrides: Properties = {}, coordinates: unknown = [-37.456, -11.443]) {
  return {
    type: "Feature",
    properties: {
      id: "saco-piaui",
      nome: "Praia do Saco",
      municipio: "Estância",
      tipo: "erosao_fluvial_estuarina",
      severidade: "alta",
      taxa_resumo: "~130 m de avanço em 10 anos",
      taxa_m_ano_min: -14.8,
      taxa_m_ano_max: 13.6,
      observacao: "Trechos com erosão e acresção.",
      fonte: "UFS Ciência",
      fonte_url: "https://ciencia.ufs.br/conteudo/75224",
      ano_referencia: 2024,
      ...overrides,
    },
    geometry: { type: "Point", coordinates },
  };
}

function collection(...features: unknown[]) {
  return { type: "FeatureCollection", features };
}

function captureError(input: unknown): CriticalZonesDataError {
  try {
    parseCriticalZones(input);
  } catch (error) {
    if (error instanceof CriticalZonesDataError) return error;
    throw error;
  }
  throw new Error("parseCriticalZones deveria ter lançado CriticalZonesDataError");
}

describe("parseCriticalZones", () => {
  it("converte uma feature válida para o domínio", () => {
    const [zone] = parseCriticalZones(collection(feature()));

    expect(zone).toEqual({
      id: "saco-piaui",
      name: "Praia do Saco",
      municipality: "Estância",
      type: "erosao_fluvial_estuarina",
      severity: "alta",
      rateSummary: "~130 m de avanço em 10 anos",
      rate: { minMetersPerYear: -14.8, maxMetersPerYear: 13.6 },
      note: "Trechos com erosão e acresção.",
      source: {
        label: "UFS Ciência",
        url: "https://ciencia.ufs.br/conteudo/75224",
        referenceYear: 2024,
      },
      location: { latitude: -11.443, longitude: -37.456 },
    });
  });

  it("aceita zona sem taxa e sem observação", () => {
    const [zone] = parseCriticalZones(
      collection(
        feature({ taxa_m_ano_min: undefined, taxa_m_ano_max: undefined, observacao: undefined }),
      ),
    );

    expect(zone.rate).toBeUndefined();
    expect(zone.note).toBeUndefined();
  });

  it("aceita coleção vazia", () => {
    expect(parseCriticalZones(collection())).toEqual([]);
  });

  it("rejeita severidade desconhecida apontando a feature e o campo", () => {
    const error = captureError(collection(feature(), feature({ id: "x", severidade: "critica" })));
    expect(error.issues.some((issue) => issue.startsWith("features[1].properties.severidade"))).toBe(
      true,
    );
  });

  it("rejeita coordenada fora do intervalo", () => {
    const error = captureError(collection(feature({}, [-37.4, -120])));
    expect(error.issues.some((issue) => issue.startsWith("features[0].geometry.coordinates[1]"))).toBe(
      true,
    );
  });

  it("rejeita fonte_url ausente ou que não seja http(s)", () => {
    expect(captureError(collection(feature({ fonte_url: undefined }))).issues[0]).toContain(
      "fonte_url",
    );
    expect(captureError(collection(feature({ fonte_url: "ftp://ufs.br/x" }))).issues[0]).toContain(
      "fonte_url",
    );
  });

  it("rejeita quando features não existe", () => {
    const error = captureError({ type: "FeatureCollection" });
    expect(error.issues[0]).toMatch(/^features:/);
  });

  it("rejeita entrada que não é objeto", () => {
    expect(captureError(null).issues[0]).toMatch(/^\(raiz\):/);
  });

  it("rejeita taxa informada pela metade ou com mínimo maior que máximo", () => {
    expect(captureError(collection(feature({ taxa_m_ano_max: undefined }))).issues[0]).toContain(
      "devem ser informadas juntas",
    );
    expect(
      captureError(collection(feature({ taxa_m_ano_min: 5, taxa_m_ano_max: 1 }))).issues[0],
    ).toContain("não pode ser maior");
  });

  it("rejeita ids duplicados", () => {
    const error = captureError(collection(feature(), feature()));
    expect(error.issues).toEqual(["id duplicado: saco-piaui"]);
  });

  it("inclui os problemas na mensagem do erro", () => {
    const error = captureError(collection(feature({ nome: "" })));
    expect(error.message).toContain("GeoJSON de zonas críticas inválido");
    expect(error.message).toContain("features[0].properties.nome");
  });
});
