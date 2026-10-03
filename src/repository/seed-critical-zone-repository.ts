import { readFile } from "node:fs/promises";
import path from "node:path";
import type { CriticalZone } from "@/domain/critical-zone";
import { CriticalZonesDataError, parseCriticalZones } from "@/lib/geojson/parse-critical-zones";
import type { CriticalZoneRepository } from "./critical-zone-repository";

export const DEFAULT_SEED_PATH = path.join(process.cwd(), "data", "zonas-criticas.seed.geojson");

type ReadText = (filePath: string) => Promise<string>;

const readUtf8: ReadText = (filePath) => readFile(filePath, "utf8");

export class SeedCriticalZoneRepository implements CriticalZoneRepository {
  constructor(
    private readonly filePath: string = DEFAULT_SEED_PATH,
    private readonly readText: ReadText = readUtf8,
  ) {}

  async listCriticalZones(): Promise<CriticalZone[]> {
    const content = await this.readSeed();
    return parseCriticalZones(this.parseJson(content));
  }

  private async readSeed(): Promise<string> {
    try {
      return await this.readText(this.filePath);
    } catch (error) {
      throw new CriticalZonesDataError(
        `Não foi possível ler o seed de zonas críticas em ${this.filePath}`,
        [],
        { cause: error },
      );
    }
  }

  private parseJson(content: string): unknown {
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new CriticalZonesDataError(
        `O seed de zonas críticas em ${this.filePath} não é um JSON válido`,
        [],
        { cause: error },
      );
    }
  }
}
