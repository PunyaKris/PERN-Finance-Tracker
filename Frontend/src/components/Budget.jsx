import Stat from "./Stat";
import { iconRegistry } from "../utils/iconRegistry";
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

      {isBudgetPage && <h5>Today</h5>}
      <Stat
        title={`${budget.budgetType === "EXPENSE" ? "Spent" : "Earned"}${!isBudgetPage ? " Today" : ""}`}
        value={budget.daily.amount}
      />

      {budget.dailyLimit && (
        <>
          <Stat title="Limit" value={budget.daily.limit} />
          <Stat title="Left" value={budget.daily.left} />
        </>
      )}

      <br />
      {isBudgetPage && (
        <>
          <h5> Week </h5>
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

          <br />
          <h5> Month </h5>
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
        </>
      )}
    </div>
  );
};

export default Budget;
