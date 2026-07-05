import { iconRegistry } from "../utils/iconRegistry";
import "./Transaction.css";

const Transaction = ({
  transaction,
  showBudget,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const Icon = iconRegistry[transaction.icon]?.icon;
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "transaction__amount transaction__amount--expense"
      : "transaction__amount transaction__amount--income";

  return (
    <div className="transaction">
      <div className="transaction__main">
        <div className="transaction__icon" aria-hidden="true">
          {Icon ? (
            <Icon size={18} />
          ) : (
            <span className="transaction__icon-fallback">•</span>
          )}
        </div>

        <div className="transaction__content">
          <div className="transaction__title-row">
            <div className="transaction__title-group">
              <span className="transaction__title">{transaction.title}</span>
              {showBudget && (
                <span className="transaction__badge">
                  {transaction.budgetId
                    ? transaction.budget.name
                    : "Un-Considered Transaction"}
                </span>
              )}
            </div>
          </div>

          <div className="transaction__meta">
            {transaction.note && (
              <span className="transaction__note">{transaction.note}</span>
            )}
            <span className="transaction__date">
              {transaction.transactionDate}
            </span>
          </div>
        </div>
      </div>
      <div className={amountClassName}>
        <span className="transaction__amount-sign">
          {transaction.type == "EXPENSE" ? "-" : "+"}
        </span>
        <span>{transaction.amount}</span>
      </div>

      <div className="transaction__actions">
        <button
          className="transaction__action-button"
          onClick={() => onEditTransactionPressed(transaction)}
        >
          Edit
        </button>
        <button
          className="transaction__action-button transaction__action-button--danger"
          onClick={() => onDeleteTransactionPressed(transaction.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Transaction;
