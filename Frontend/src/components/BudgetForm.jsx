import { useState } from "react";
import { Calendar } from "lucide-react";
import { createBudget, editBudget } from "../services/budgetService";
import IconPicker from "./IconPicker";
import "./BudgetForm.css";

const BudgetForm = ({ oldBudget, onBudgetSave }) => {
  const [name, setName] = useState(oldBudget ? oldBudget.name : "");
  const [budgetType, setBudgetType] = useState(
    oldBudget ? oldBudget.budgetType : "EXPENSE",
  );
  const [description, setDescription] = useState(
    oldBudget ? oldBudget.description : "",
  );

  const [icon, setIcon] = useState(oldBudget ? oldBudget.icon : "");
  const [dailyLimit, setDailyLimit] = useState(
    oldBudget ? oldBudget.dailyLimit : 0,
  );
  const [weeklyLimit, setWeeklyLimit] = useState(
    oldBudget ? oldBudget.weeklyLimit : 0,
  );
  const [monthlyLimit, setMonthlyLimit] = useState(
    oldBudget ? oldBudget.monthlyLimit : 0,
  );
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLimitTab, setActiveLimitTab] = useState("daily");

  function validateBudget() {
    const nextErrors = {};
    const trimmedName = name.trim();
    const parsedDailyLimit = Number(dailyLimit);
    const parsedWeeklyLimit = Number(weeklyLimit);
    const parsedMonthlyLimit = Number(monthlyLimit);

    if (!trimmedName) {
      nextErrors.name = "Budget name is required.";
    }

    if (!Number.isFinite(parsedDailyLimit) || parsedDailyLimit < 0) {
      nextErrors.dailyLimit = "Daily limit must be a non-negative number.";
    }

    if (!Number.isFinite(parsedWeeklyLimit) || parsedWeeklyLimit < 0) {
      nextErrors.weeklyLimit = "Weekly limit must be a non-negative number.";
    }

    if (!Number.isFinite(parsedMonthlyLimit) || parsedMonthlyLimit < 0) {
      nextErrors.monthlyLimit = "Monthly limit must be a non-negative number.";
    }

    if (
      !nextErrors.dailyLimit &&
      !nextErrors.weeklyLimit &&
      !nextErrors.monthlyLimit
    ) {
      if (parsedDailyLimit > 0 && parsedWeeklyLimit > 0) {
        if (parsedWeeklyLimit < parsedDailyLimit) {
          nextErrors.weeklyLimit =
            "Weekly limit must be greater than or equal to the daily limit.";
        }
      }

      if (parsedWeeklyLimit > 0 && parsedMonthlyLimit > 0) {
        if (parsedMonthlyLimit < parsedWeeklyLimit) {
          nextErrors.monthlyLimit =
            "Monthly limit must be greater than or equal to the weekly limit.";
        }
      }
    }

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      values: {
        name: trimmedName,
        dailyLimit: parsedDailyLimit,
        weeklyLimit: parsedWeeklyLimit,
        monthlyLimit: parsedMonthlyLimit,
      },
    };
  }

  async function createBudgetHandler() {
    const validation = validateBudget();

    if (!validation.isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const budget = {
      name: validation.values.name,
      budgetType: budgetType,
      description,
      icon,
      dailyLimit: validation.values.dailyLimit,
      weeklyLimit: validation.values.weeklyLimit,
      monthlyLimit: validation.values.monthlyLimit,
    };
    try {
      const createdBudget = await createBudget(budget);
      console.log(createdBudget);
      window.dispatchEvent(new Event("budgets:changed"));
      onBudgetSave();
    } catch (error) {
      setSubmitError(
        "We couldn't save this budget right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function editBudgetHandler() {
    const validation = validateBudget();

    if (!validation.isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    const newBudget = {
      name: validation.values.name,
      budgetType,
      description,
      icon,
      dailyLimit: validation.values.dailyLimit,
      weeklyLimit: validation.values.weeklyLimit,
      monthlyLimit: validation.values.monthlyLimit,
    };
    try {
      const editedBudget = await editBudget(oldBudget.id, newBudget);
      console.log(editedBudget);
      window.dispatchEvent(new Event("budgets:changed"));
      onBudgetSave();
    } catch (error) {
      setSubmitError(
        "We couldn't save this budget right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="budget-form">
      <div className="budget-form__header">
        <div>
          <p className="budget-form__eyebrow">
            {oldBudget ? "Edit budget" : "New budget"}
          </p>
          <h3 className="budget-form__title">
            {oldBudget ? "Update your budget" : "Create a budget"}
          </h3>
        </div>
        <div
          className="budget-form__segmented-control"
          role="tablist"
          aria-label="Budget type"
        >
          <button
            type="button"
            className={`budget-form__segmented-option ${budgetType === "EXPENSE" ? "budget-form__segmented-option--active" : ""}`}
            onClick={() => setBudgetType("EXPENSE")}
          >
            Expense
          </button>
          <button
            type="button"
            className={`budget-form__segmented-option ${budgetType === "INCOME" ? "budget-form__segmented-option--active" : ""}`}
            onClick={() => setBudgetType("INCOME")}
          >
            Income
          </button>
        </div>
      </div>

      <div className="budget-form__section">
        <label className="budget-form__label">Budget Name</label>
        <input
          className="budget-form__input"
          onChange={(event) => {
            setName(event.target.value);
            setErrors((currentErrors) => ({ ...currentErrors, name: "" }));
          }}
          placeholder="Budget Name..."
          type="text"
          value={name}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? (
          <p className="budget-form__error">{errors.name}</p>
        ) : null}
      </div>

      <div className="budget-form__section budget-form__section--limits">
        <div className="budget-form__section-heading">
          <h4>Set Limit</h4>
        </div>

        <div
          className="budget-form__segmented-control budget-form__segmented-control--inline"
          role="tablist"
          aria-label="Budget limits"
        >
          {[
            { key: "daily", label: "Daily" },
            { key: "weekly", label: "Weekly" },
            { key: "monthly", label: "Monthly" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`budget-form__segmented-option ${activeLimitTab === tab.key ? "budget-form__segmented-option--active" : ""}`}
              onClick={() => setActiveLimitTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="budget-form__limit-row">
          <div className="budget-form__field">
            <label className="budget-form__label">
              {activeLimitTab === "daily"
                ? "Daily Limit"
                : activeLimitTab === "weekly"
                  ? "Weekly Limit"
                  : "Monthly Limit"}
            </label>
            <div className="budget-form__amount-wrap">
              <span className="budget-form__amount-prefix">₹</span>
              <input
                className="budget-form__input budget-form__input--number budget-form__input--amount"
                onChange={(event) => {
                  if (activeLimitTab === "daily") {
                    setDailyLimit(event.target.value);
                  } else if (activeLimitTab === "weekly") {
                    setWeeklyLimit(event.target.value);
                  } else if (activeLimitTab === "monthly") {
                    setMonthlyLimit(event.target.value);
                  }

                  setErrors((currentErrors) => ({
                    ...currentErrors,
                    dailyLimit: "",
                    weeklyLimit: "",
                    monthlyLimit: "",
                    limits: "",
                  }));
                }}
                placeholder="0.00"
                type="number"
                value={
                  activeLimitTab === "daily"
                    ? dailyLimit
                    : activeLimitTab === "weekly"
                      ? weeklyLimit
                      : monthlyLimit
                }
                aria-invalid={Boolean(
                  errors.dailyLimit ||
                  errors.weeklyLimit ||
                  errors.monthlyLimit,
                )}
              />
            </div>
            {activeLimitTab === "daily" && errors.dailyLimit ? (
              <p className="budget-form__error">{errors.dailyLimit}</p>
            ) : null}
            {activeLimitTab === "weekly" && errors.weeklyLimit ? (
              <p className="budget-form__error">{errors.weeklyLimit}</p>
            ) : null}
            {activeLimitTab === "monthly" && errors.monthlyLimit ? (
              <p className="budget-form__error">{errors.monthlyLimit}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="budget-form__section">
        <label className="budget-form__label">Description</label>
        <textarea
          className="budget-form__textarea"
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description..."
          value={description}
        />
      </div>

      <div className="budget-form__section">
        <label className="budget-form__label">Icon</label>
        <div className="budget-form__icon-picker">
          <IconPicker selectedIcon={icon} onSelect={setIcon} />
        </div>
      </div>

      <div className="budget-form__actions">
        {submitError ? (
          <p className="budget-form__submit-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button
          className="budget-form__cancel-button"
          onClick={() => onBudgetSave?.()}
          type="button"
        >
          Cancel
        </button>
        <button
          className="budget-form__save-button"
          onClick={oldBudget ? editBudgetHandler : createBudgetHandler}
          disabled={isSubmitting}
          type="button"
        >
          Create Budget
        </button>
      </div>
    </div>
  );
};

export default BudgetForm;
