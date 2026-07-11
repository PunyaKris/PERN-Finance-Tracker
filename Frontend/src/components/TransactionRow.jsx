import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./TransactionRow.css";

const TransactionRow = ({
  transaction,
  showBudget,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getAccentStyleVars(transaction?.accentColor);
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "transaction-row__amount transaction-row__amount--expense"
      : "transaction-row__amount transaction-row__amount--income";

  const handleEditClick = () => {
    onEditTransactionPressed?.(transaction);
  };

  const handleDeleteClick = () => {
    onDeleteTransactionPressed?.(transaction.id);
  };

  return (
    <div className="transaction-row">
      {/* Left Section: Icon + Content */}
      <div className="transaction-row__main">
        <div
          className="transaction-row__icon"
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
            <span className="transaction-row__icon-fallback">•</span>
          )}
        </div>

        <div className="transaction-row__content">
          {/* Header Row: Title, Badge, and Date on same line */}
          <div className="transaction-row__header">
            <span className="transaction-row__title">{transaction.title}</span>
            {showBudget && (
              <span className="transaction-row__badge">
                {transaction.budgetId
                  ? transaction.budget.name
                  : "Un-Considered Transaction"}
              </span>
            )}
          </div>

          {/* Optional Transaction Note */}
          {transaction.note && (
            <span className="transaction-row__note">{transaction.note}</span>
          )}
        </div>
      </div>
      <span className="transaction-row__date">
        {formatDateTime(transaction.transactionDate)}
      </span>

      {/* Amount */}
      <div className={amountClassName}>
        <span className="transaction-row__amount-sign">
          {transaction.type == "EXPENSE" ? "-" : "+"}
        </span>
        <span>{formatCurrency(transaction.amount)}</span>
      </div>

      <div className="transaction-row__actions">
        <button
          type="button"
          className="transaction-row__action-button transaction-row__action-button--edit"
          aria-label="Edit transaction"
          onClick={handleEditClick}
        >
          <Pencil size={17} />
        </button>
        <button
          type="button"
          className="transaction-row__action-button transaction-row__action-button--delete"
          aria-label="Delete transaction"
          onClick={handleDeleteClick}
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;
