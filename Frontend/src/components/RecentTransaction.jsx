import { useEffect, useRef } from "react";
import {
  DotsThreeVertical,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
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

const RecentTransaction = ({
  transaction,
  isMenuOpen,
  onMenuToggle,
  onCloseMenu,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const overflowButtonRef = useRef(null);
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getTransactionIconStyle(transaction?.accentColor);
  const amountClassName =
    transaction.type == "EXPENSE"
      ? "recent-transaction__amount recent-transaction__amount--expense"
      : "recent-transaction__amount recent-transaction__amount--income";

  const handleRowNavigate = () => {
    if (transaction.budgetId) {
      navigate(`/budget/${transaction.budgetId}`);
      return;
    }

    navigate("/unconsideredTransaction");
  };

  const handleRowClick = () => {
    handleRowNavigate();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRowNavigate();
    }
  };

  const handleOverflowButtonClick = (event) => {
    event.stopPropagation();
    onMenuToggle?.(isMenuOpen ? null : transaction.id);
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    onCloseMenu?.();
    onEditTransactionPressed?.(transaction);
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    onCloseMenu?.();
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
        onCloseMenu?.();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onCloseMenu?.();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, onCloseMenu]);

  return (
    <div
      className="recent-transaction"
      role="listitem"
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
    >
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
          </div>
          <span className="recent-transaction__date">
            {formatDateTime(transaction.transactionDate)}
          </span>
        </div>
      </div>

      <div className="recent-transaction__amount-control">
        <div className={amountClassName} aria-hidden="true">
          <span className="recent-transaction__amount-sign">
            {transaction.type == "EXPENSE" ? "-" : "+"}
          </span>
          <span className="recent-transaction__amount-value">
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        <button
          ref={overflowButtonRef}
          type="button"
          className="recent-transaction__overflow-button"
          aria-label="More transaction actions"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={handleOverflowButtonClick}
        >
          <DotsThreeVertical size={18} />
        </button>

        {isMenuOpen && (
          <div className="recent-transaction__menu" ref={menuRef} role="menu">
            <button
              type="button"
              className="recent-transaction__menu-item"
              onClick={handleEditClick}
            >
              <PencilSimple size={14} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="recent-transaction__menu-item recent-transaction__menu-item--danger"
              onClick={handleDeleteClick}
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

export default RecentTransaction;
