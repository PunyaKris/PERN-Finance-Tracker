import { MoreHorizontal } from "lucide-react";
import Stat from "./Stat";
import {
  formatCurrency,
  formatPercentage,
  getSafeProgress,
} from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import StatsCard from "./StatsCard";
import "./StatsCard.css";

const Budget = ({
  budget,
  budgetClickHandler,
  editBudgetHandler,
  deleteBudgetHandler,
  showEditAndDelete,
  isBudgetPage,
}) => {
  const Icon = iconRegistry[budget.icon]?.icon;
  const accentStyle = getAccentStyleVars(budget?.accentColor);
  const progress = getSafeProgress(budget.daily.amount, budget.daily.limit);
  const spentLabel = budget.budgetType === "EXPENSE" ? "Spent" : "Earned";
  const budgetTypeLabel =
    budget.budgetType === "EXPENSE" ? "Expense" : "Income";
  const budgetStatValueToneClass = {
    Earned: "dashboard-budget-card__stat-value--earned",
    Spent: "dashboard-budget-card__stat-value--spent",
    Limit: "dashboard-budget-card__stat-value--limit",
    Left: "dashboard-budget-card__stat-value--left",
  };

  if (!isBudgetPage) {
    return (
      <div
        className="dashboard-budget-card"
        onClick={budgetClickHandler}
        style={accentStyle}
      >
        <div className="dashboard-budget-card__top-row">
          <div className="dashboard-budget-card__identity">
            <span
              className="dashboard-budget-card__icon"
              aria-hidden="true"
              style={accentStyle}
            >
              {Icon && <Icon size={18} />}
            </span>
            <div className="dashboard-budget-card__title-group">
              <h4>{budget.name}</h4>
              <p>{budget.description || budgetTypeLabel}</p>
            </div>
          </div>
          <MoreHorizontal
            className="dashboard-budget-card__menu-icon"
            size={18}
            aria-hidden="true"
          />
        </div>

        <div className="dashboard-budget-card__stats">
          <div className="dashboard-budget-card__stat">
            <span>{spentLabel}</span>
            <strong className={budgetStatValueToneClass[spentLabel]}>
              {formatCurrency(budget.daily.amount)}
            </strong>
          </div>
          <div className="dashboard-budget-card__stat">
            <span>Limit</span>
            <strong className={budgetStatValueToneClass.Limit}>
              {formatCurrency(budget.daily.limit)}
            </strong>
          </div>
          <div className="dashboard-budget-card__stat">
            <span>Left</span>
            <strong className={budgetStatValueToneClass.Left}>
              {formatCurrency(budget.daily.left)}
            </strong>
          </div>
        </div>

        <div className="dashboard-budget-card__progress-row">
          <div className="dashboard-budget-card__progress">
            <div
              className="dashboard-budget-card__progress-fill"
              style={{
                width: `${Math.min(100, Math.max(0, progress ?? 0))}%`,
                background: accentStyle["--accent-progress-fill"],
              }}
            />
          </div>
          <span className="dashboard-budget-card__progress-value">
            {formatPercentage(progress ?? 0)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div onClick={budgetClickHandler}>
      <h4>
        {Icon && <Icon size={20} />} {budget.name}
      </h4>

      {budget.description && <p>{budget.description}</p>}

      {showEditAndDelete && (
        <>
          <button onClick={() => editBudgetHandler(budget)}> ✏️ Edit</button>
          <button onClick={() => deleteBudgetHandler(budget.id)}>
            🗑️ Delete
          </button>
        </>
      )}

      <StatsCard
        variant="budget"
        title={isBudgetPage ? "Today" : null}
        progress={progress}
      >
        <Stat
          title={
            budget.budgetType === "EXPENSE" ? "Spent Today" : "Earned Today"
          }
          value={budget.daily.amount}
        />

        <Stat title="Limit" value={budget.daily.limit} />
        <Stat title="Left" value={budget.daily.left} />
      </StatsCard>

      {isBudgetPage && (
        <>
          <StatsCard
            variant="budget"
            title="Week"
            progress={getSafeProgress(
              budget.weekly.amount,
              budget.weekly.limit,
            )}
          >
            <Stat
              title={
                budget.budgetType === "EXPENSE" ? "Spent Week" : "Earned Week"
              }
              value={budget.weekly.amount}
            />

            <Stat title="Limit" value={budget.weekly.limit} />
            <Stat title="Left" value={budget.weekly.left} />
          </StatsCard>

          <StatsCard
            variant="budget"
            title="Month"
            progress={getSafeProgress(
              budget.monthly.amount,
              budget.monthly.limit,
            )}
          >
            <Stat
              title={
                budget.budgetType === "EXPENSE" ? "Spent Month" : "Earned Month"
              }
              value={budget.monthly.amount}
            />

            <Stat title="Limit" value={budget.monthly.limit} />
            <Stat title="Left" value={budget.monthly.left} />
          </StatsCard>
        </>
      )}
    </div>
  );
};

export default Budget;
