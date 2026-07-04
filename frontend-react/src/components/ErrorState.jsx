export default function ErrorState({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
      <span>{message || "Ocurrió un error inesperado."}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
}
