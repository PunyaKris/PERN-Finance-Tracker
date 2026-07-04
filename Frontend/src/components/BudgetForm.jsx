import { useState } from "react";
import { createBudget, editBudget } from "../services/budgetService";
import IconPicker from "./IconPicker";

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

  async function createBudgetHandler() {
    const budget = {
      name: name,
      budgetType: budgetType,
      description,
      icon,
      dailyLimit: dailyLimit,
      weeklyLimit: weeklyLimit,
      monthlyLimit: monthlyLimit,
    };
    const createdBudget = await createBudget(budget);
    console.log(createdBudget);
    onBudgetSave();
  }

  async function editBudgetHandler() {
    const newBudget = {
      name,
      budgetType,
      description,
      icon,
      dailyLimit,
      weeklyLimit,
      monthlyLimit,
    };
    const editedBudget = await editBudget(oldBudget.id, newBudget);
    console.log(editedBudget);
    onBudgetSave();
  }

  return (
    <div>
      <label>Budget Name</label>
      <input
        onChange={(event) => setName(event.target.value)}
        placeholder="Budget Name..."
        type="text"
        value={name}
      />

      <button
        onClick={
          budgetType === "EXPENSE"
            ? () => setBudgetType("INCOME")
            : () => setBudgetType("EXPENSE")
        }
      >
        {budgetType}
      </button>

      <label> Daily Limit</label>
      <input
        onChange={(event) => setDailyLimit(event.target.value)}
        placeholder="Daily Limit..."
        type="number"
        value={dailyLimit}
      />

      <label> Weekly Limit</label>
      <input
        onChange={(event) => setWeeklyLimit(event.target.value)}
        placeholder="Weekly Limit..."
        type="number"
        value={weeklyLimit}
      />

      <label> Monthly Limit</label>
      <input
        onChange={(event) => setMonthlyLimit(event.target.value)}
        placeholder="Monthly Limit..."
        type="number"
        value={monthlyLimit}
      />

      <label>Description</label>

      <input
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description..."
        type="text"
        value={description}
      />

      <label>Icon</label>
      <IconPicker selectedIcon={icon} onSelect={setIcon} />

      <button onClick={oldBudget ? editBudgetHandler : createBudgetHandler}>
        Save Budget
      </button>
    </div>
  );
};

export default BudgetForm;
