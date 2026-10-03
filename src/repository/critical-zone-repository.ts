import type { CriticalZone } from "@/domain/critical-zone";
import { SeedCriticalZoneRepository } from "./seed-critical-zone-repository";

export interface CriticalZoneRepository {
  listCriticalZones(): Promise<CriticalZone[]>;
}

export function getCriticalZoneRepository(): CriticalZoneRepository {
  return new SeedCriticalZoneRepository();
}
