export function MapLoading() {
  return (
    <div className="status-message" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      Carregando mapa...
    </div>
  );
}
