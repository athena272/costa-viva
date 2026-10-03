import styles from "./zones.module.css";

export function DataDisclaimer() {
  return (
    <p className={styles.disclaimer}>
      Pontos baseados em estudos da UFS e reportagens. Não são sensores em tempo real e as
      coordenadas são aproximadas.
    </p>
  );
}
