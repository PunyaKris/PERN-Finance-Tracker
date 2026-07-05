import Stat from "./Stat";
import { iconRegistry } from "../utils/iconRegistry";
import StatsCard from "./StatsCard";
const Budget = ({
  budget,
  budgetClickHandler,
  editBudgetHandler,
  deleteBudgetHandler,
  showEditAndDelete,
  isBudgetPage,
}) => {
  const Icon = iconRegistry[budget.icon]?.icon;

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
        title={isBudgetPage ? "Today" : null}
        progress={
          budget.dailyLimit
            ? (budget.daily.amount / budget.daily.limit) * 100
            : null
        }
      >
        <Stat
          title={`${budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}${!isBudgetPage ? " Today" : ""}`}
          value={budget.daily.amount}
        />

        {budget.dailyLimit && (
          <>
            <Stat
              title={` ${!isBudgetPage ? "Daily" : ""} Limit`}
              value={budget.daily.limit}
            />
            <Stat
              title={`${!isBudgetPage ? "Today" : ""} Left`}
              value={budget.daily.left}
            />
          </>
        )}
      </StatsCard>

      {isBudgetPage && (
        <>
          <StatsCard
            title="Week"
            progress={
              budget.weeklyLimit
                ? (budget.weekly.amount / budget.weekly.limit) * 100
                : null
            }
          >
            <Stat
              title={budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}
              value={budget.weekly.amount}
            />

            {budget.weeklyLimit && (
              <>
                <Stat title="Limit" value={budget.weekly.limit} />
                <Stat title="Left" value={budget.weekly.left} />
              </>
            )}
          </StatsCard>

          <StatsCard
            title="Month"
            progress={
              budget.monthlyLimit
                ? (budget.monthly.amount / budget.monthly.limit) * 100
                : null
            }
          >
            <Stat
              title={budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}
              value={budget.monthly.amount}
            />

            {budget.monthlyLimit && (
              <>
                <Stat title="Limit" value={budget.monthly.limit} />
                <Stat title="Left" value={budget.monthly.left} />
              </>
            )}
          </StatsCard>
        </>
      )}
    </div>
  );
};

export default Budget;
