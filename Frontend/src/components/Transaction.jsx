import { iconRegistry } from "../utils/iconRegistry";

const Transaction = ({
  transaction,
  showBudget,
  onEditTransactionPressed,
  onDeleteTransactionPressed,
}) => {
  const Icon = iconRegistry[transaction.icon]?.icon;

  return (
    <div>
      <div>
        {Icon && <Icon size={18} />} {transaction.title}
      </div>
      <button onClick={() => onEditTransactionPressed(transaction)}>
        ✏️ Edit
      </button>
      <button onClick={() => onDeleteTransactionPressed(transaction.id)}>
        🗑️ Delete
      </button>
      {showBudget ? (
        <div>
          Catagory:
          {transaction.budgetId
            ? transaction.budget.name
            : "Un-Considered Transaction"}
        </div>
      ) : (
        <></>
      )}
      <div>
        Aomunt: {transaction.type == "EXPENSE" ? "-" : "+"}
        {transaction.amount}
      </div>

      {transaction.note && <div>Note: {transaction.note}</div>}

      <div>Date: {transaction.transactionDate}</div>
      <br />
    </div>
  );
};

export default Transaction;
