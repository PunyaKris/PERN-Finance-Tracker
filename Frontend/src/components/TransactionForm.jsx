import { useState } from "react";
import IconPicker from "./IconPicker";
import {
  createTransaction,
  editTransaction,
} from "../services/transactionService.js";
const TransactionForm = ({
  budgets,
  budgetId,
  onTransactionSave,
  prevTransaction,
}) => {
  const [title, setTitle] = useState(
    prevTransaction ? prevTransaction.title : "",
  );
  const [icon, setIcon] = useState(prevTransaction ? prevTransaction.icon : "");
  const [transactionType, setTransactionType] = useState(
    prevTransaction ? prevTransaction.type : "EXPENSE",
  );
  const [amount, setAmount] = useState(
    prevTransaction ? prevTransaction.amount : "",
  );
  const [note, setNote] = useState(prevTransaction ? prevTransaction.note : "");
  const [ofBudget, setOfBudget] = useState(
    prevTransaction && prevTransaction.budgetId
      ? budgets.find((budget) => budget.id === prevTransaction.budgetId)
      : budgetId
        ? budgets.find((budget) => budget.id === budgetId)
        : null,
  );

  async function addTransactionHandler() {
    const transaction = {
      title,
      icon,
      amount,
      note,
      type: transactionType,
      budgetId: ofBudget ? ofBudget.id : null,
    };
    await createTransaction(transaction);
    onTransactionSave();
  }

  async function editTransactionHandler() {
    const newTransaction = {
      title,
      amount,
      icon,
      note,
      type: transactionType,
      budgetId: ofBudget ? ofBudget.id : null,
    };
    const editedTransaction = await editTransaction(
      newTransaction,
      prevTransaction,
    );
    console.log(editedTransaction);
    onTransactionSave();
  }

  let BudgetSelector;

  if (!budgetId) {
    BudgetSelector = (
      <select
        value={ofBudget ? ofBudget.id : ""}
        onChange={(event) => {
          setOfBudget(
            budgets.find((budget) => budget.id === event.target.value),
          );
        }}
      >
        <option value=""> No Budget </option>
        {budgets.map((budget) => (
          <option key={budget.id} value={budget.id}>
            {budget.name}
          </option>
        ))}
      </select>
    );
  } else {
    BudgetSelector = (
      <select disabled value={ofBudget.id}>
        <option value={ofBudget.id}>{ofBudget.name}</option>
      </select>
    );
  }

  return (
    <div>
      <label>Title</label>
      <input
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      <button
        onClick={
          transactionType === "EXPENSE"
            ? () => setTransactionType("INCOME")
            : () => setTransactionType("EXPENSE")
        }
      >
        {transactionType}
      </button>

      <label> Amount </label>
      <input
        value={amount}
        type="number"
        onChange={(event) => {
          setAmount(event.target.value);
        }}
      />

      {BudgetSelector}

      <label>Icon</label>
      <IconPicker selectedIcon={icon} onSelect={setIcon} />

      <label>Note</label>
      <textarea
        value={note}
        placeholder="Optional note..."
        onChange={(event) => setNote(event.target.value)}
      />

      {/* <select value={tag} onClick={(event) => setTag(event.target.value)}>
        <option disabled> Tag </option>
        <option> Red </option>
        <option> Green </option>
        <option> Blue </option>
        <option> Yellow </option>
        <option> Gray </option>
      </select> */}

      <button
        onClick={
          !prevTransaction ? addTransactionHandler : editTransactionHandler
        }
      >
        Save Transaction
      </button>
    </div>
  );
};

export default TransactionForm;
