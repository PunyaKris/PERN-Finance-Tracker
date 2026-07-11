import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./RecentTransaction.css";

const RecentTransaction = ({ transaction }) => {
  const navigate = useNavigate();
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getAccentStyleVars(transaction?.accentColor);
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "recent-transaction__amount recent-transaction__amount--expense"
      : "recent-transaction__amount recent-transaction__amount--income";

  const categoryLabel = transaction.budget?.name || "Unassigned";

  const handleBadgeClick = () => {
    if (transaction.budgetId) {
      navigate(`/budget/${transaction.budgetId}`);
    } else {
      navigate("/unconsideredTransaction");
    }
  };

  return (
    <div className="recent-transaction" role="listitem">
      <div className="recent-transaction__left">
        <div
          className="recent-transaction__icon"
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
            <span className="recent-transaction__icon-fallback">•</span>
          )}
        </div>

        <div className="recent-transaction__content">
          <div className="recent-transaction__meta">
            <span className="recent-transaction__title">
              {transaction.title}
            </span>
            <span
              className="recent-transaction__badge recent-transaction__badge--clickable"
              onClick={handleBadgeClick}
              role="link"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleBadgeClick();
                }
              }}
            >
              {categoryLabel}
            </span>
          </div>
          <span className="recent-transaction__date">
            {formatDateTime(transaction.transactionDate)}
          </span>
        </div>
      </div>

      <div className={amountClassName} aria-hidden="true">
        <span className="recent-transaction__amount-sign">
          {transaction.type == "EXPENSE" ? "-" : "+"}
        </span>
        <span className="recent-transaction__amount-value">
          {formatCurrency(transaction.amount)}
        </span>
      </div>
    </div>
  );
};

export default RecentTransaction;
