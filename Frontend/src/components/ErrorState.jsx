import "./ErrorState.css";

const ErrorState = ({
  title,
  description,
  actionLabel,
  onAction,
  centered = false,
  compact = false,
  className = "",
}) => {
  return (
    <div
      className={`error-state ${centered ? "error-state--centered" : ""} ${compact ? "error-state--compact" : ""} ${className}`.trim()}
    >
      <div className="error-state__icon" aria-hidden="true">
        ⚠️
      </div>

      <div className="error-state__content">
        {title && <h3 className="error-state__title">{title}</h3>}
        {description && (
          <p className="error-state__description">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="error-state__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
