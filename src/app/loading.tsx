const SKELETON_ITEMS = 3;

export default function Loading() {
  return (
    <main className="app-main" aria-busy="true">
      <section className="panel">
        <p role="status" aria-live="polite">
          Carregando zonas críticas...
        </p>
        {Array.from({ length: SKELETON_ITEMS }, (_, index) => (
          <div key={index} className="skeleton" style={{ height: 96, marginTop: 12 }} />
        ))}
      </section>
      <section className="panel map-panel">
        <div className="skeleton" />
      </section>
    </main>
  );
}
