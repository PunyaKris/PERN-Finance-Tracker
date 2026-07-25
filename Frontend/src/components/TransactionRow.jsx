import { useEffect, useRef, useState } from "react";
import {
  DotsThreeVertical,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
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

const getBadgeColorClass = (transaction) => {
  const stableValue = String(
    transaction?.id ?? transaction?.title ?? transaction?.transactionDate ?? "",
  );

  let hash = 0;
  for (let index = 0; index < stableValue.length; index += 1) {
    hash = (hash << 5) - hash + stableValue.charCodeAt(index);
    hash |= 0;
  }

  const colorIndex = Math.abs(hash) % 3;

  if (colorIndex === 1) {
    return "transaction-row__usage-badge--yellow";
  }

  if (colorIndex === 2) {
    return "transaction-row__usage-badge--blue";
  }

  return "transaction-row__usage-badge--green";
};

const TransactionRow = ({
  transaction,
  monthlyLimit,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const overflowButtonRef = useRef(null);
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getTransactionIconStyle(transaction?.accentColor);
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "transaction-row__amount transaction-row__amount--expense"
      : "transaction-row__amount transaction-row__amount--income";

  const limit = Number(transaction.budget?.monthlyLimit ?? monthlyLimit);
  const amount = Number(transaction.amount);
  const usagePercent =
    Number.isFinite(limit) && limit > 0 && Number.isFinite(amount)
      ? (amount / limit) * 100
      : null;

  const usagePercentText =
    usagePercent == null
      ? null
      : Number.isInteger(usagePercent)
        ? `${usagePercent}%`
        : `${usagePercent.toFixed(1)}%`;

  const usageLabel =
    usagePercentText != null && usagePercent >= 0
      ? `${usagePercentText} Monthly Used`
      : null;

  const badgeColorClass = getBadgeColorClass(transaction);
  const usageToneClass = usageLabel == null ? "" : badgeColorClass;

  const handleOverflowButtonClick = (event) => {
    event.stopPropagation();
    setIsMenuOpen((current) => !current);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    setIsMenuOpen(false);
    onEditTransactionPressed?.(transaction);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setIsMenuOpen(false);
    onDeleteTransactionPressed?.(transaction.id);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      const clickedInsideMenu = menuRef.current?.contains(event.target);
      const clickedInsideButton = overflowButtonRef.current?.contains(
        event.target,
      );

      if (!clickedInsideMenu && !clickedInsideButton) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <div className="transaction-row">
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

      <div className="transaction-row__title-block">
        <span className="transaction-row__title">{transaction.title}</span>
        {transaction.note && (
          <span className="transaction-row__note">{transaction.note}</span>
        )}
      </div>

      {usageLabel && (
        <span
          className={`transaction-row__usage-badge ${usageToneClass}`.trim()}
        >
          {usageLabel}
        </span>
      )}

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
          ref={overflowButtonRef}
          type="button"
          className="transaction-row__overflow-button"
          aria-label="More transaction actions"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={handleOverflowButtonClick}
        >
          <DotsThreeVertical size={18} />
        </button>

        {isMenuOpen && (
          <div className="transaction-row__menu" ref={menuRef} role="menu">
            <button
              type="button"
              className="transaction-row__menu-item"
              onClick={handleEditClick}
              role="menuitem"
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="transaction-row__menu-item transaction-row__menu-item--danger"
              onClick={handleDeleteClick}
              role="menuitem"
            >
              <TrashSimple size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
