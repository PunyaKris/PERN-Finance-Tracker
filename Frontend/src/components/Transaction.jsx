import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./Transaction.css";

const Transaction = ({
  transaction,
  showBudget,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getAccentStyleVars(transaction?.accentColor);
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "transaction__amount transaction__amount--expense"
      : "transaction__amount transaction__amount--income";

  return (
    <div className="transaction">
      <div className="transaction__main">
        <div
          className="transaction__icon"
          aria-hidden="true"
          style={{
            ...accentStyle,
            background: accentStyle["--accent-icon-bg"],
            color: accentStyle["--accent-icon-color"],
            borderColor: accentStyle["--accent-hover-border"],
          }}
        >
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
              {formatDateTime(transaction.transactionDate)}
            </span>
          </div>
        </div>
      </div>

      <div className={amountClassName}>
        <span className="transaction__amount-sign">
          {transaction.type == "EXPENSE" ? "-" : "+"}
        </span>
        <span>{formatCurrency(transaction.amount)}</span>
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
