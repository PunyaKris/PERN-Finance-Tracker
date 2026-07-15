import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./RecentTransaction.css";

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

const RecentTransaction = ({ transaction }) => {
  const navigate = useNavigate();
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getTransactionIconStyle(transaction?.accentColor);
  // const badgeStyle = getAccentStyleVars(transaction?.budget?.accentColor);
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "recent-transaction__amount recent-transaction__amount--expense"
      : "recent-transaction__amount recent-transaction__amount--income";

  // const categoryLabel = transaction.budget?.name || "Unassigned";

  // const handleBadgeClick = () => {
  //   if (transaction.budgetId) {
  //     navigate(`/budget/${transaction.budgetId}`);
  //   } else {
  //     navigate("/unconsideredTransaction");
  //   }
  // };

  return (
    <div className="recent-transaction" role="listitem">
      <div className="recent-transaction__left">
        <div
          className="recent-transaction__icon"
          aria-hidden="true"
          style={accentStyle}
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
              {transaction.title}{" "}
            </span>
            <span className="recent-transaction__bullet"> •</span>
            <span className="recent-transaction__budget">
              {transaction.budget?.name || "Unassigned"}
            </span>
            {/* <span
              className="recent-transaction__badge recent-transaction__badge--clickable"
              style={badgeStyle}
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
            </span> */}
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
