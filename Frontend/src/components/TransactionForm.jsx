import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import IconPicker from "./IconPicker";
import {
  createTransaction,
  editTransaction,
} from "../services/transactionService.js";
import "./TransactionForm.css";

const TransactionForm = ({
  budgets = [],
  budgetId,
  onTransactionSave,
  prevTransaction,
  fixedTransactionType, // if provided, forces the transaction type and hides selector
  hideTransactionTypeSelector = false,
}) => {
  const normalizeType = (t) => (t ? String(t).trim().toUpperCase() : t);
  const resolvedBudgetId = budgetId ?? prevTransaction?.budgetId ?? null;

  const getInitialBudget = (transaction) => {
    if (transaction?.budgetId) {
      return budgets.find(
        (budget) => String(budget.id) === String(transaction.budgetId),
      );
    }

    if (resolvedBudgetId) {
      return budgets.find(
        (budget) => String(budget.id) === String(resolvedBudgetId),
      );
    }

    return null;
  };

  const getInitialDateValue = (transaction) => {
    if (transaction?.transactionDate) {
      const parsedDate = new Date(transaction.transactionDate);

      if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split("T")[0];
      }
    }

    return new Date().toISOString().split("T")[0];
  };

  const getInitialFormState = (transaction) => {
    const initialBudget = getInitialBudget(transaction);
    const initialType = fixedTransactionType
      ? normalizeType(fixedTransactionType)
      : transaction?.type
        ? normalizeType(transaction.type)
        : initialBudget?.budgetType
          ? normalizeType(initialBudget.budgetType)
          : "EXPENSE";

    return {
      title: transaction?.title ?? "",
      icon: transaction?.icon ?? "",
      transactionType: initialType,
      amount: transaction?.amount ?? "",
      transactionDate: getInitialDateValue(transaction),
      note: transaction?.note ?? "",
      ofBudget: initialBudget ?? null,
    };
  };

  const initialFormState = getInitialFormState(prevTransaction);

  const [title, setTitle] = useState(initialFormState.title);
  const [icon, setIcon] = useState(initialFormState.icon);
  const [transactionType, setTransactionType] = useState(
    initialFormState.transactionType,
  );
  const [amount, setAmount] = useState(initialFormState.amount);
  const [transactionDate, setTransactionDate] = useState(
    initialFormState.transactionDate,
  );
  const [note, setNote] = useState(initialFormState.note);
  const [ofBudget, setOfBudget] = useState(initialFormState.ofBudget);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateTransaction() {
    const nextErrors = {};
    const trimmedTitle = title.trim();
    const parsedAmount = Number(amount);
    const normalizedTransactionType = normalizeType(transactionType);

    if (!trimmedTitle) {
      nextErrors.title = "Title is required.";
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Amount must be a number greater than zero.";
    }

    if (!ofBudget) {
      nextErrors.budget = "Please select a budget.";
    } else {
      const normalizedBudgetType = normalizeType(ofBudget?.budgetType);

      if (
        normalizedTransactionType &&
        normalizedBudgetType &&
        normalizedTransactionType !== normalizedBudgetType
      ) {
        nextErrors.budget =
          normalizedTransactionType === "EXPENSE"
            ? "Expense transactions can only be added to Expense budgets."
            : "Income transactions can only be added to Income budgets.";
      }
    }

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      values: {
        title: trimmedTitle,
        amount: parsedAmount,
      },
    };
  }

  async function addTransactionHandler() {
    const validation = validateTransaction();

    if (!validation.isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const transaction = {
      title: validation.values.title,
      icon,
      amount: validation.values.amount,
      note,
      type: transactionType,
      budgetId: ofBudget ? ofBudget.id : null,
    };
    try {
      await createTransaction(transaction);
      onTransactionSave();
    } catch (error) {
      setSubmitError(
        "We couldn't save this transaction right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function editTransactionHandler() {
    const validation = validateTransaction();

    if (!validation.isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const newTransaction = {
      title: validation.values.title,
      amount: validation.values.amount,
      icon,
      note,
      type: transactionType,
      budgetId: ofBudget ? ofBudget.id : null,
    };
    try {
      const editedTransaction = await editTransaction(
        newTransaction,
        prevTransaction,
      );
      console.log(editedTransaction);
      onTransactionSave();
    } catch (error) {
      setSubmitError(
        "We couldn't save this transaction right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const nextFormState = getInitialFormState(prevTransaction);

    setTitle(nextFormState.title);
    setIcon(nextFormState.icon);
    setTransactionType(nextFormState.transactionType);
    setAmount(nextFormState.amount);
    setTransactionDate(nextFormState.transactionDate);
    setNote(nextFormState.note);
    setOfBudget(nextFormState.ofBudget);
    setErrors({});
    setSubmitError("");
  }, [prevTransaction, budgets, budgetId]);

  useEffect(() => {
    if (fixedTransactionType) {
      setTransactionType(normalizeType(fixedTransactionType));
      return;
    }

    if (resolvedBudgetId && ofBudget?.budgetType) {
      setTransactionType(normalizeType(ofBudget.budgetType));
    }
  }, [resolvedBudgetId, ofBudget?.budgetType]);

  const isBudgetLocked = Boolean(resolvedBudgetId);
  const shouldHideTransactionType =
    Boolean(fixedTransactionType) || hideTransactionTypeSelector;

  let BudgetSelector;

  if (!budgetId) {
    BudgetSelector = (
      <select
        className="transaction-form__select"
        value={ofBudget ? ofBudget.id : ""}
        onChange={(event) => {
          setOfBudget(
            budgets.find((budget) => budget.id === event.target.value),
          );
          setErrors((currentErrors) => ({ ...currentErrors, budget: "" }));
        }}
      >
        <option value="">Select a budget</option>
        {budgets.map((budget) => (
          <option key={budget.id} value={budget.id}>
            {budget.name}
          </option>
        ))}
      </select>
    );
  } else {
    BudgetSelector = (
      <select
        className="transaction-form__select transaction-form__select--disabled"
        value={ofBudget ? ofBudget.id : ""}
        disabled
      >
        {ofBudget ? (
          <option value={ofBudget.id}>{ofBudget.name}</option>
        ) : (
          <option value="">Selected budget</option>
        )}
      </select>
    );
  }

  return (
    <div className="transaction-form">
      <div className="transaction-form__header">
        <div>
          <p className="transaction-form__eyebrow">
            {prevTransaction ? "Edit transaction" : "New transaction"}
          </p>
          <h3 className="transaction-form__title">
            {prevTransaction ? "Update your entry" : "Add a transaction"}
          </h3>
        </div>
      </div>

      {!shouldHideTransactionType && (
        <div
          className="transaction-form__segmented-control"
          role="tablist"
          aria-label="Transaction type"
        >
          <button
            type="button"
            className={`transaction-form__segmented-option ${transactionType === "EXPENSE" ? "transaction-form__segmented-option--active" : ""}`}
            onClick={() => {
              setTransactionType("EXPENSE");
              setErrors((currentErrors) => ({ ...currentErrors, budget: "" }));
            }}
          >
            Expense
          </button>
          <button
            type="button"
            className={`transaction-form__segmented-option ${transactionType === "INCOME" ? "transaction-form__segmented-option--active" : ""}`}
            onClick={() => {
              setTransactionType("INCOME");
              setErrors((currentErrors) => ({ ...currentErrors, budget: "" }));
            }}
          >
            Income
          </button>
        </div>
      )}

      <div className="transaction-form__grid">
        <div className="transaction-form__field transaction-form__field--full">
          <label className="transaction-form__label">Title</label>
          <input
            className="transaction-form__input"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setErrors((currentErrors) => ({
                ...currentErrors,
                title: "",
              }));
            }}
            placeholder="Transaction title..."
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <p className="transaction-form__error">{errors.title}</p>
          ) : null}
        </div>

        <div className="transaction-form__row">
          <div className="transaction-form__field">
            <label className="transaction-form__label">Amount</label>
            <div className="transaction-form__amount-wrap">
              <span className="transaction-form__amount-prefix">₹</span>
              <input
                className="transaction-form__input transaction-form__input--amount"
                value={amount}
                type="number"
                onChange={(event) => {
                  setAmount(event.target.value);
                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    amount: "",
                  }));
                }}
                placeholder="0.00"
                aria-invalid={Boolean(errors.amount)}
              />
            </div>
            {errors.amount ? (
              <p className="transaction-form__error">{errors.amount}</p>
            ) : null}
          </div>

          <div className="transaction-form__field">
            <label className="transaction-form__label">Date</label>
            <div className="transaction-form__date-wrap">
              <Calendar
                size={16}
                className="transaction-form__date-icon"
                aria-hidden="true"
              />
              <input
                className="transaction-form__input transaction-form__input--date"
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="transaction-form__field transaction-form__field--full">
          <label className="transaction-form__label">Budget</label>
          <div className="transaction-form__select-wrap">{BudgetSelector}</div>
          {errors.budget ? (
            <p className="transaction-form__error">{errors.budget}</p>
          ) : null}
        </div>

        <div className="transaction-form__field transaction-form__field--full">
          <label className="transaction-form__label">Icon</label>
          <div className="transaction-form__icon-section">
            <IconPicker selectedIcon={icon} onSelect={setIcon} />
          </div>
        </div>

        <div className="transaction-form__field transaction-form__field--full">
          <label className="transaction-form__label">Note</label>
          <textarea
            className="transaction-form__textarea"
            value={note}
            placeholder="Optional note..."
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </div>

      <div className="transaction-form__actions">
        {submitError ? (
          <p className="transaction-form__submit-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button
          className="transaction-form__save-button"
          onClick={
            !prevTransaction ? addTransactionHandler : editTransactionHandler
          }
          disabled={isSubmitting}
          type="button"
        >
          Save Transaction
        </button>
      </div>
    </div>
  );
};

export default TransactionForm;
