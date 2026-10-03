import { z } from "zod";
import { SEVERITIES, ZONE_TYPES, type CriticalZone } from "@/domain/critical-zone";

export class CriticalZonesDataError extends Error {
  readonly issues: string[];

  constructor(message: string, issues: string[] = [], options?: ErrorOptions) {
    super(issues.length > 0 ? `${message}\n- ${issues.join("\n- ")}` : message, options);
    this.name = "CriticalZonesDataError";
    this.issues = issues;
  }
}

const longitudeSchema = z.number().min(-180).max(180);
const latitudeSchema = z.number().min(-90).max(90);
const nonEmptyText = z.string().trim().min(1);

const propertiesSchema = z
  .object({
    id: nonEmptyText,
    nome: nonEmptyText,
    municipio: nonEmptyText,
    tipo: z.enum(ZONE_TYPES),
    severidade: z.enum(SEVERITIES),
    taxa_resumo: nonEmptyText,
    taxa_m_ano_min: z.number().optional(),
    taxa_m_ano_max: z.number().optional(),
    observacao: nonEmptyText.optional(),
    fonte: nonEmptyText,
    fonte_url: z.url({ protocol: /^https?$/ }),
    ano_referencia: z.number().int().min(1900),
  })
  .superRefine((properties, ctx) => {
    const { taxa_m_ano_min: min, taxa_m_ano_max: max } = properties;
    if ((min === undefined) !== (max === undefined)) {
      ctx.addIssue({
        code: "custom",
        path: [min === undefined ? "taxa_m_ano_min" : "taxa_m_ano_max"],
        message: "taxa_m_ano_min e taxa_m_ano_max devem ser informadas juntas",
      });
    } else if (min !== undefined && max !== undefined && min > max) {
      ctx.addIssue({
        code: "custom",
        path: ["taxa_m_ano_min"],
        message: "taxa_m_ano_min não pode ser maior que taxa_m_ano_max",
      });
    }
  });

const featureSchema = z.object({
  type: z.literal("Feature"),
  properties: propertiesSchema,
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([longitudeSchema, latitudeSchema]),
  }),
});

const featureCollectionSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(featureSchema),
});

type CriticalZoneFeature = z.infer<typeof featureSchema>;

function formatIssuePath(path: readonly PropertyKey[]): string {
  return path.reduce<string>((acc, key) => {
    if (typeof key === "number") return `${acc}[${key}]`;
    return acc ? `${acc}.${String(key)}` : String(key);
  }, "");
}

function toCriticalZone({ properties, geometry }: CriticalZoneFeature): CriticalZone {
  const [longitude, latitude] = geometry.coordinates;
  const { taxa_m_ano_min: rateMin, taxa_m_ano_max: rateMax } = properties;

  return {
    id: properties.id,
    name: properties.nome,
    municipality: properties.municipio,
    type: properties.tipo,
    severity: properties.severidade,
    rateSummary: properties.taxa_resumo,
    rate:
      rateMin !== undefined && rateMax !== undefined
        ? { minMetersPerYear: rateMin, maxMetersPerYear: rateMax }
        : undefined,
    note: properties.observacao,
    source: {
      label: properties.fonte,
      url: properties.fonte_url,
      referenceYear: properties.ano_referencia,
    },
    location: { latitude, longitude },
  };
}

export function parseCriticalZones(input: unknown): CriticalZone[] {
  const result = featureCollectionSchema.safeParse(input);

  if (!result.success) {
    const issues = result.error.issues.map(
      (issue) => `${formatIssuePath(issue.path) || "(raiz)"}: ${issue.message}`,
    );
    throw new CriticalZonesDataError("GeoJSON de zonas críticas inválido", issues);
  }

  const zones = result.data.features.map(toCriticalZone);
  const duplicatedIds = findDuplicatedIds(zones);

  if (duplicatedIds.length > 0) {
    throw new CriticalZonesDataError(
      "GeoJSON de zonas críticas inválido",
      duplicatedIds.map((id) => `id duplicado: ${id}`),
    );
  }

  return zones;
}

function findDuplicatedIds(zones: readonly CriticalZone[]): string[] {
  const seen = new Set<string>();
  const duplicated = new Set<string>();

  for (const { id } of zones) {
    if (seen.has(id)) duplicated.add(id);
    seen.add(id);
  }

  return [...duplicated];
}
