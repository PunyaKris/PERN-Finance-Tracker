import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import "./TransactionRow.css";

const TRANSACTION_ICON_PALETTE = {
  blue: { background: "#5B82F7", icon: "#DCE8FF" },
  green: { background: "#76C86B", icon: "#E5FFE0" },
  purple: { background: "#8F73E6", icon: "#EFE6FF" },
  orange: { background: "#D39A45", icon: "#FFF0D6" },
  teal: { background: "#3DB8B0", icon: "#DFFBF9" },
  pink: { background: "#D96AA2", icon: "#FFE3F1" },
  red: { background: "#D96868", icon: "#FFE3E3" },
  amber: { background: "#D8A93F", icon: "#FFF3D6" },
  indigo: { background: "#6F79E8", icon: "#E6E9FF" },
  cyan: { background: "#43B8D6", icon: "#E0F8FF" },
  lime: { background: "#8ED63D", icon: "#F0FFD9" },
  violet: { background: "#8A63D9", icon: "#EFE4FF" },
  rose: { background: "#D56D83", icon: "#FFE4EA" },
  sky: { background: "#56A8E6", icon: "#E2F4FF" },
  emerald: { background: "#49C37E", icon: "#E2FFEE" },
  gray: { background: "#5D6575", icon: "#E6EAF2" },
  grey: { background: "#5D6575", icon: "#E6EAF2" },
  other: { background: "#5D6575", icon: "#E6EAF2" },
};

const getTransactionIconStyle = (accentName) => {
  const normalized = String(accentName ?? "")
    .trim()
    .toLowerCase();
  const palette =
    TRANSACTION_ICON_PALETTE[normalized] ?? TRANSACTION_ICON_PALETTE.blue;

  return {
    "--transaction-icon-bg": palette.background,
    "--transaction-icon-fg": palette.icon,
  };
};

const TransactionRow = ({
  transaction,
  showBudget,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getTransactionIconStyle(transaction?.accentColor);
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
          style={accentStyle}
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
