import { useDraggable } from "@dnd-kit/core";
import { formatCurrency, formatDateTime } from "../utils/formatters";
import { iconRegistry } from "../utils/iconRegistry";
import { getAccentStyleVars } from "../utils/accentRegistry";
import "./InboxTransactionCard.css";

const InboxTransactionCard = ({ transaction, isActiveDrag }) => {
  const Icon = iconRegistry[transaction.icon]?.icon;
  const accentStyle = getAccentStyleVars(transaction?.accentColor);
  const isExpense = transaction.type === "EXPENSE";
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: transaction.id,
      data: { transaction },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(2.5deg) scale(1.03)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className={`inbox-transaction-card ${isDragging ? "inbox-transaction-card--dragging" : ""}`}
      style={isDragging ? style : undefined}
      role="button"
      tabIndex={0}
      aria-label={`Draggable transaction ${transaction.title}`}
      {...listeners}
      {...attributes}
    >
      <div className="inbox-transaction-card__left">
        <div
          className="inbox-transaction-card__icon"
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
            <span className="inbox-transaction-card__icon-fallback">•</span>
          )}
        </div>
        <div className="inbox-transaction-card__meta">
          <div className="inbox-transaction-card__title">
            {transaction.title}
          </div>
          <div className="inbox-transaction-card__subtitle">
            <span className="inbox-transaction-card__date">
              {formatDateTime(transaction.transactionDate)}
            </span>
            {transaction.note ? (
              <div className="inbox-transaction-card__note-row">
                <span className="inbox-transaction-card__note">
                  {transaction.note}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        className={
          "inbox-transaction-card__amount " +
          (isExpense
            ? "inbox-transaction-card__amount--expense"
            : "inbox-transaction-card__amount--income")
        }
      >
        <span className="inbox-transaction-card__amount-sign">
          {isExpense ? "-" : "+"}
        </span>
        <span>{formatCurrency(transaction.amount)}</span>
      </div>
    </div>
  );
};

export default InboxTransactionCard;
