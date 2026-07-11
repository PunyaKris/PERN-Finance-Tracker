import { useDroppable } from "@dnd-kit/core";
import {
  formatCurrency,
  formatPercentage,
  getSafeProgress,
} from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./DropBudgetCard.css";

const DropBudgetCard = ({ budget, isActiveDrag, isAssigning, isSuccess }) => {
  const Icon = iconRegistry[budget.icon]?.icon;
  const accentStyle = getAccentStyleVars(budget?.accentColor);
  const monthlyAmount = budget?.monthly?.amount ?? 0;
  const monthlyLimit = budget?.monthly?.limit ?? null;

  const progress = getSafeProgress(monthlyAmount, monthlyLimit);
  const { setNodeRef, isOver } = useDroppable({
    id: budget.id,
    data: { budget },
  });

  const hasLimit =
    monthlyLimit !== null &&
    monthlyLimit !== undefined &&
    Number(monthlyLimit) > 0;
  const budgetTypeLabel =
    budget?.budgetType === "EXPENSE"
      ? "Expense"
      : budget?.budgetType === "INCOME"
        ? "Income "
        : null;

  return (
    <div
      ref={setNodeRef}
      className={`drop-budget-card ${isActiveDrag && isOver ? "drop-budget-card--active" : ""} ${isAssigning ? "drop-budget-card--loading" : ""} ${isSuccess ? "drop-budget-card--success" : ""}`}
      style={accentStyle}
      role="region"
      tabIndex={0}
      aria-label={`Drop target for budget ${budget.name}`}
    >
      <div className="drop-budget-card__main">
        <div
          className="drop-budget-card__icon"
          aria-hidden="true"
          style={{
            ...accentStyle,
            background: accentStyle["--accent-icon-bg"],
            color: accentStyle["--accent-icon-color"],
            borderColor: accentStyle["--accent-hover-border"],
          }}
        >
          {Icon && <Icon size={28} />}
        </div>

        <div className="drop-budget-card__meta">
          <div className="drop-budget-card__title-row">
            <div className="drop-budget-card__title">{budget.name}</div>
            {budgetTypeLabel && (
              <span className="drop-budget-card__badge">{budgetTypeLabel}</span>
            )}
          </div>

          <div className="drop-budget-card__sub">
            <span className="drop-budget-card__spent">
              {formatCurrency(monthlyAmount)}
            </span>
            <span className="drop-budget-card__sep">/</span>
            <span className="drop-budget-card__limit">
              {hasLimit ? formatCurrency(monthlyLimit) : "Not Set"}
            </span>
          </div>

          <div
            className={`drop-budget-card__progress ${!hasLimit ? "drop-budget-card__progress--inactive" : ""}`}
          >
            <div
              className="drop-budget-card__progress-fill"
              style={{
                width: `${Math.min(100, Math.max(0, progress ?? 0))}%`,
                background: accentStyle["--accent-progress-fill"],
              }}
            />
          </div>
        </div>
      </div>

      {hasLimit && (
        <div className="drop-budget-card__footer">
          <span className="drop-budget-card__percent-small">
            {formatPercentage(progress ?? 0)} used
          </span>
        </div>
      )}

      {(isAssigning || isSuccess) && (
        <span
          className={`drop-budget-card__state ${isAssigning ? "drop-budget-card__state--loading" : "drop-budget-card__state--success"}`}
        >
          {isAssigning ? "Assigning…" : "Done"}
        </span>
      )}

      <div className="drop-budget-card__drop-here">Drop here</div>
    </div>
  );
};

export default DropBudgetCard;
