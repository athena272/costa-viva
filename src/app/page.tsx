import { CriticalZonesMapLoader } from "@/components/map/CriticalZonesMapLoader";
import { CriticalZoneList } from "@/components/zones/CriticalZoneList";
import { DataDisclaimer } from "@/components/zones/DataDisclaimer";
import { sortBySeverity } from "@/domain/critical-zone";
import { getCriticalZoneRepository } from "@/repository/critical-zone-repository";

export default async function HomePage() {
  const zones = sortBySeverity(await getCriticalZoneRepository().listCriticalZones());

  return (
    <main className="app-main">
      <section className="panel" aria-labelledby="zones-title">
        <h2 id="zones-title">Zonas críticas</h2>
        <DataDisclaimer />
        <CriticalZoneList zones={zones} />
      </section>

      <section className="panel map-panel" aria-label="Mapa">
        {zones.length > 0 ? (
          <CriticalZonesMapLoader zones={zones} />
        ) : (
          <p className="status-message">Nenhuma zona crítica para exibir no mapa.</p>
        )}
      </section>
    </main>
  );
}
