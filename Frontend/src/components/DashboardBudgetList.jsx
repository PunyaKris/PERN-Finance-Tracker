import { ChevronDown } from "lucide-react";
import Budget from "./Budget";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import Loading from "./Loading";
import "./DashboardBudgetList.css";

const DashboardBudgetList = ({
  budgets,
  loading,
  error,
  onRetry,
  onCreateBudget,
  onBudgetClick,
}) => {
  let Content;

  if (loading) {
    Content = <Loading />;
  } else if (error) {
    Content = (
      <ErrorState
        title="Couldn't load budgets."
        description="We couldn't fetch your budgets right now."
        actionLabel="Retry"
        onAction={onRetry}
        compact
      />
    );
  } else if (budgets.length === 0) {
    Content = (
      <EmptyState
        icon="🧾"
        title="No budgets yet"
        description="Create your first budget to start tracking your spending."
        actionLabel="Create Budget"
        onAction={onCreateBudget}
      />
    );
  } else {
    Content = (
      <div className="dashboard-budget-list__items">
        {budgets.map((budget) => (
          <Budget
            key={budget.id}
            budget={budget}
            showEditAndDelete={false}
            budgetClickHandler={() => onBudgetClick(budget)}
            editButtonHandler={null}
            deleteButtonHandler={null}
            isBudgetPage={false}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="dashboard-budget-list">
      <div className="dashboard-budget-list__panel">
        <div className="dashboard-budget-list__panel-header">
          <h2 className="dashboard-budget-list__title">Your Budgets</h2>
          <button className="dashboard-budget-list__filter" type="button">
            <span>Filter Budgets</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {Content}
      </div>
    </section>
  );
};

export default DashboardBudgetList;
