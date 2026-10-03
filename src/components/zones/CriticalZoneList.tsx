import { ZONE_TYPE_LABELS, type CriticalZone } from "@/domain/critical-zone";
import { SeverityBadge } from "./SeverityBadge";
import styles from "./zones.module.css";

interface CriticalZoneListProps {
  zones: readonly CriticalZone[];
}

export function CriticalZoneList({ zones }: CriticalZoneListProps) {
  if (zones.length === 0) {
    return <p className={styles.empty}>Nenhuma zona crítica cadastrada.</p>;
  }

  return (
    <ul className={styles.list}>
      {zones.map((zone) => (
        <li key={zone.id} className={styles.item}>
          <div className={styles.itemHeader}>
            <h3 className={styles.itemTitle}>{zone.name}</h3>
            <SeverityBadge severity={zone.severity} />
          </div>
          <p className={styles.meta}>
            {zone.municipality} · {ZONE_TYPE_LABELS[zone.type]}
          </p>
          <p className={styles.summary}>{zone.rateSummary}</p>
          <a
            className={styles.source}
            href={zone.source.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fonte: {zone.source.label} ({zone.source.referenceYear})
          </a>
        </li>
      ))}
    </ul>
  );
}
