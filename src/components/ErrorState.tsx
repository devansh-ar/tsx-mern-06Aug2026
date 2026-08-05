interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠</div>
      <h2 className="error-title">Something went wrong</h2>
      <p className="error-message">{message}</p>
      <button className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
}
