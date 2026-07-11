import "./EmptyState.css";

const EmptyState = ({
  icon,
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
      className={`empty-state ${centered ? "empty-state--centered" : ""} ${compact ? "empty-state--compact" : ""} ${className}`.trim()}
    >
      {icon && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}

      <div className="empty-state__content">
        {title && <h3 className="empty-state__title">{title}</h3>}
        {description && (
          <p className="empty-state__description">{description}</p>
        )}
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-state__action"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
