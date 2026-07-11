import { Children } from "react";
import { Calendar } from "lucide-react";
import { formatCurrency, formatPercentage } from "../utils/formatters";
import "./StatsCard.css";

const StatsCard = ({
  title,
  progress,
  headerIcon,
  children,
  variant = "dashboard",
}) => {
  const safeProgress = Number(progress);
  const progressTone =
    progress == null || !Number.isFinite(safeProgress)
      ? ""
      : safeProgress >= 90
        ? "stats-card__progress-fill--danger"
        : safeProgress >= 70
          ? "stats-card__progress-fill--warning"
          : "stats-card__progress-fill--good";

  const statChildren = Children.toArray(children).filter(Boolean);
  const limitChild = statChildren.find(
    (child) => child?.props?.title === "Limit",
  );
  const limitValue = limitChild?.props?.value;
  const hasActiveLimit =
    Number.isFinite(Number(limitValue)) && Number(limitValue) > 0;
  const showPercentageBadge = hasActiveLimit && progress != null;
  const renderMetricCell = (child, fallbackTitle, fallbackValue, keyId) => {
    const childProps = child?.props ?? {};
    const metricTitle = childProps.title ?? fallbackTitle;
    const metricValue = childProps.value ?? fallbackValue;
    const isLimitMetric = metricTitle === "Limit" || metricTitle === "Left";
    const isUnsetMetric = isLimitMetric && !hasActiveLimit;

    return (
      <div key={keyId} className="stats-card__metric">
        <span className="stats-card__metric-label">{metricTitle}</span>
        <span
          className={`stats-card__metric-value${isUnsetMetric ? " stats-card__metric-value--muted" : ""}`}
        >
          {isUnsetMetric
            ? metricTitle === "Limit"
              ? "Not set"
              : "Limit not set"
            : formatCurrency(metricValue)}
        </span>
      </div>
    );
  };

  const renderDashboardLayout = () => {
    const dashboardSlots = [0, 1, 2, 3].map((index) => {
      const child = statChildren[index];
      const fallbackTitle = ["Earned", "Spent", "Limit", "Left"][index];
      return renderMetricCell(
        child,
        fallbackTitle,
        null,
        `dashboard-metric-${index}`,
      );
    });

    return (
      <div className="stats-card__stats stats-card__stats--dashboard">
        {dashboardSlots}
      </div>
    );
  };

  const renderBudgetLayout = () => {
    const primaryChild = statChildren[0];
    const primaryProps = primaryChild?.props ?? {};
    const primaryTitle = primaryProps.title ?? "";
    const primaryValue = primaryProps.value ?? null;
    const secondaryChildren = statChildren.slice(1);

    return (
      <div className="stats-card__budget-body">
        <div className="stats-card__budget-primary">
          <span className="stats-card__budget-primary-label">
            {primaryTitle}
          </span>
          <strong className="stats-card__budget-primary-value">
            {primaryValue == null ? "—" : formatCurrency(primaryValue)}
          </strong>
        </div>

        <div className="stats-card__budget-secondary">
          {secondaryChildren.length > 0 ? (
            secondaryChildren.map((child, index) =>
              renderMetricCell(
                child,
                index === 0 ? "Limit" : "Left",
                null,
                `budget-metric-${index}`,
              ),
            )
          ) : (
            <>
              {renderMetricCell(null, "Limit", null, "budget-metric-limit")}
              {renderMetricCell(null, "Left", null, "budget-metric-left")}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <section
      className={`stats-card ${variant === "budget" ? "stats-card--budget" : "stats-card--dashboard"}`}
    >
      <header className="stats-card__header">
        {title && <h3 className="stats-card__title">{title}</h3>}

        {headerIcon ? (
          <span className="stats-card__header-icon" aria-hidden="true">
            {headerIcon}
          </span>
        ) : variant === "budget" ? (
          <span className="stats-card__header-icon" aria-hidden="true">
            <Calendar size={18} />
          </span>
        ) : null}
      </header>

      {variant === "budget" ? renderBudgetLayout() : renderDashboardLayout()}

      <div className="stats-card__progress-row" aria-hidden="true">
        <div
          className={`stats-card__progress${hasActiveLimit ? "" : " stats-card__progress--disabled"}`}
        >
          {hasActiveLimit && (
            <div
              className={`stats-card__progress-fill ${progressTone}`}
              style={{ width: `${Math.min(100, Math.max(0, safeProgress))}%` }}
            />
          )}
        </div>

        {showPercentageBadge && (
          <span className="stats-card__percent stats-card__percent--inline">
            {formatPercentage(safeProgress)}
          </span>
        )}
      </div>
    </section>
  );
};

export default StatsCard;
