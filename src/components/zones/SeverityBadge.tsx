import { SEVERITY_PRESENTATION, type Severity } from "@/domain/critical-zone";
import styles from "./zones.module.css";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const { label, color } = SEVERITY_PRESENTATION[severity];

  return (
    <span className={styles.badge}>
      <span className={styles.badgeDot} style={{ backgroundColor: color }} aria-hidden="true" />
      Severidade {label.toLowerCase()}
    </span>
  );
}
